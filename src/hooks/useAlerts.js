import { useState, useEffect, useCallback } from 'react';
import { getAuthorizedAxiosIntance } from '../utils/axiosConfig';

let _axiosInstance = null;

/**
 * Custom hook that aggregates alerts from multiple API sources.
 * Normalizes all to schema:
 * { id, priority, title, detail, source, timestamp, acknowledged, assignedTo }
 */
const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadAxios = useCallback(async () => {
    if (!_axiosInstance) {
      _axiosInstance = await getAuthorizedAxiosIntance();
    }
    return _axiosInstance;
  }, []);

  // Load persisted state from localStorage
  const loadLocalState = () => {
    try {
      const saved = localStorage.getItem('alertCenterState');
      return saved ? JSON.parse(saved) : { acknowledged: {}, assignedTo: {} };
    } catch {
      return { acknowledged: {}, assignedTo: {} };
    }
  };

  const saveLocalState = (state) => {
    try {
      localStorage.setItem('alertCenterState', JSON.stringify(state));
    } catch {}
  };

  const fetchAlerts = useCallback(async () => {
    const ax = await loadAxios();
    const localState = loadLocalState();
    const rawAlerts = [];

    // --- Source 1: Maintenance overdue ---
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await ax.post('api/maintenance/getFATPMaintenanceMultiMonth', {
        dateFrom: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        dateTo: today,
        factory: 'A02',
      });
      const data = res.data || [];
      const overdueItems = data.filter((item) => {
        return (
          item.DATE_CHECK &&
          item.DATE_CHECK < today &&
          (!item.STATUS || item.STATUS.trim().toUpperCase() !== 'OK')
        );
      });
      overdueItems.slice(0, 20).forEach((item, idx) => {
        const id = `maintenance-${item.ID}-${idx}`;
        rawAlerts.push({
          id,
          priority: 'warning',
          title: `Maintenance overdue: ${item.MACHINE_NAME || item.ID}`,
          detail: `Scheduled: ${item.DATE_CHECK}. Status: ${item.STATUS || 'Not done'}. Line: ${item.LINE_NAME || ''}`,
          source: 'Maintenance',
          timestamp: item.DATE_CHECK ? new Date(item.DATE_CHECK).toISOString() : new Date().toISOString(),
          acknowledged: !!localState.acknowledged[id],
          assignedTo: localState.assignedTo[id] || '',
        });
      });
    } catch (e) {
      // silence — axios interceptor handles toast
    }

    // --- Source 2: Machine Errors (FATP) ---
    try {
      const res = await ax.post('api/Fatp/FATPMachineStatus', { factory: 'A02' });
      const data = res.data || [];
      data.forEach((row) => {
        Object.entries(row).forEach(([key, val]) => {
          if (key === 'LINE' || !val) return;
          const parts = val.split('-/-');
          const status = parts[0];
          if (status === 'ERROR') {
            const id = `machine-${row.LINE}-${key}`;
            rawAlerts.push({
              id,
              priority: 'critical',
              title: `Machine Error: ${parts[1] || key} on ${row.LINE}`,
              detail: `Error Code: ${parts[3] || '—'} | ${parts[4] || '—'} | Since: ${parts[2] || '—'}`,
              source: 'Machine',
              timestamp: parts[2] ? new Date(parts[2]).toISOString() : new Date().toISOString(),
              acknowledged: !!localState.acknowledged[id],
              assignedTo: localState.assignedTo[id] || '',
            });
          }
        });
      });
    } catch (e) {}

    // --- Source 3: MO Overtime ---
    try {
      const res = await ax.post('api/Production/MoOverTime', {});
      const data = res.data || [];
      data.slice(0, 15).forEach((item, idx) => {
        const id = `mo-overtime-${item.MO_NUMBER}-${idx}`;
        rawAlerts.push({
          id,
          priority: item.DAYDIFF > 3 ? 'critical' : 'warning',
          title: `MO Overtime: ${item.MO_NUMBER} (${item.MODEL_NAME})`,
          detail: `Open date: ${item.TIMEOL?.split('T')[0] || '—'} | Days overdue: ${item.DAYDIFF || 0}`,
          source: 'Production',
          timestamp: item.TIMEOL ? new Date(item.TIMEOL).toISOString() : new Date().toISOString(),
          acknowledged: !!localState.acknowledged[id],
          assignedTo: localState.assignedTo[id] || '',
        });
      });
    } catch (e) {}

    // Sort: unacknowledged first, then by priority (critical > warning > info), then by time
    const priorityOrder = { critical: 0, warning: 1, info: 2 };
    rawAlerts.sort((a, b) => {
      if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
      const pd = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      if (pd !== 0) return pd;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setAlerts(rawAlerts);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [loadAxios]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60 * 1000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const acknowledge = useCallback((alertId) => {
    const localState = loadLocalState();
    localState.acknowledged[alertId] = true;
    saveLocalState(localState);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const assign = useCallback((alertId, assignee) => {
    const localState = loadLocalState();
    localState.assignedTo[alertId] = assignee;
    saveLocalState(localState);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, assignedTo: assignee } : a))
    );
  }, []);

  return { alerts, isLoading, lastUpdated, acknowledge, assign, refresh: fetchAlerts };
};

export default useAlerts;
