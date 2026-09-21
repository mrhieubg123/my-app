// Mock data cho OEE Dashboard
// Structure phản ánh đúng API thật để dễ swap sau

export const OEE_TARGET = 85; // World-class target %

export const mockOEEOverall = {
  oee: 72.4,
  availability: 88.2,
  performance: 85.1,
  quality: 96.5,
  trend: [65, 68, 71, 70, 74, 72, 75, 72.4], // last 8 periods
};

export const mockOEEByLine = [
  { line: 'LINE A1', oee: 91.2, availability: 95.0, performance: 96.5, quality: 99.2 },
  { line: 'LINE A2', oee: 85.4, availability: 91.2, performance: 94.1, quality: 99.4 },
  { line: 'LINE B1', oee: 78.3, availability: 85.0, performance: 92.6, quality: 99.5 },
  { line: 'LINE B2', oee: 74.1, availability: 82.0, performance: 90.3, quality: 99.8 },
  { line: 'LINE C1', oee: 70.5, availability: 80.2, performance: 88.5, quality: 99.0 },
  { line: 'LINE C2', oee: 65.8, availability: 76.4, performance: 86.0, quality: 99.6 },
  { line: 'FATP-1',  oee: 62.1, availability: 73.0, performance: 85.0, quality: 99.9 },
  { line: 'FATP-2',  oee: 57.3, availability: 68.5, performance: 83.6, quality: 99.8 },
];

export const mockParetoLosses = [
  { category: 'Breakdown',    durationH: 18.5, frequency: 12, cumulative: 38.2 },
  { category: 'Speed Loss',   durationH: 12.3, frequency: 28, cumulative: 63.6 },
  { category: 'Setup/Adjust', durationH: 8.2,  frequency: 9,  cumulative: 80.5 },
  { category: 'Minor Stops',  durationH: 5.1,  frequency: 64, cumulative: 91.0 },
  { category: 'Quality Defects', durationH: 3.2, frequency: 7, cumulative: 97.7 },
  { category: 'Other',        durationH: 1.1,  frequency: 4,  cumulative: 100  },
];

export const mockOEETrend = {
  // Weekly data for last 8 weeks
  categories: ['W19', 'W20', 'W21', 'W22', 'W23', 'W24', 'W25', 'W26'],
  oee:          [65.0, 68.3, 71.2, 70.0, 74.1, 72.8, 75.0, 72.4],
  availability: [80.2, 83.5, 86.0, 85.1, 89.0, 87.5, 90.2, 88.2],
  performance:  [82.5, 82.8, 83.5, 83.0, 84.5, 84.0, 84.8, 85.1],
  quality:      [97.8, 98.0, 97.9, 98.1, 98.2, 98.5, 98.3, 96.5],
};

export const mockShiftOEE = [
  { shift: 'Morning (6-14h)', oee: 78.2, availability: 91.0, performance: 86.5, quality: 99.2 },
  { shift: 'Afternoon (14-22h)', oee: 73.5, availability: 87.0, performance: 85.1, quality: 99.6 },
  { shift: 'Night (22-6h)', oee: 65.6, availability: 83.0, performance: 79.3, quality: 99.8 },
];
