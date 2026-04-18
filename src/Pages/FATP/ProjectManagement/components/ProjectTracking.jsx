import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Snackbar, Grid } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import HiBox from "../../../../components/HiBox";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";

const axiosInstance = await getAuthorizedAxiosIntance();
//http://localhost:5000
const API = "/api/files";
const API_Project = "/api/projectManagement";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProjectTracking = () => {
  const paramState = useSelector((state) => state.param);
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [listProjects, setListProjects] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [newFolderPassword, setNewFolderPassword] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [accessPassword, setAccessPassword] = useState("");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderDialogOpen6, setNewFolderDialogOpen6] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const updateSize = () => {
      if (parentRef.current) {
        const { width, height } = parentRef.current.getBoundingClientRect();
        setParentSize({ width, height });
      }
    };
    const resizeObserver = new ResizeObserver(updateSize);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }
    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const newMo = {
      dateFrom: paramState.params.starttime,
      dateTo: paramState.params.endtime,
    };
    fetchListProject(newMo);
  }, [paramState.params.starttime, paramState.params.endtime]);

  const fetchListProject = async (newMo) => {
    try {
      const res = await axiosInstance.post(
        `${API_Project}/getListProjectManagementByStatus`,
        newMo,
      );
      setListProjects(res.data || []);
    } catch (err) {
      showToast("Không thể tải danh sách file", err);
    }
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  // Cấu hình biểu đồ đường
  const options = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["RFQ", "NPI Projects", "MP Projects", "EOL"],
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
      },
      yAxis: {
        title: {
          text: "Quanlity",

          style: {
            color: "#999",
            fontSize: "11px",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
      },
      series: {
        name: "Qty",
        data: [
          {
            y: listProjects.filter((e) => e.STATUS === "RFQ").length,
            color: "#4CAF50",
          },
          {
            y: listProjects.filter((e) => e.STATUS === "NPI Projects").length,
            color: "#2196F3",
          },
          {
            y: listProjects.filter((e) => e.STATUS === "MP Projects").length,
            color: "#FF9800",
          },
          {
            y: listProjects.filter((e) => e.STATUS === "EOL").length,
            color: "#F44336",
          },
        ],
        type: "column",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        align: "left",
        verticalAlign: "top",
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        itemStyle: {
          color: theme.palette.chart.color,
        },
      },
    }),
    [listProjects],
  );

  const options2 = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["On Going", "Over Time", "Success"],
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
      },
      yAxis: {
        title: {
          text: "Qty",
          style: {
            color: "#999",
            fontSize: "11px",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
      },
      series: {
        name: "RFQ Projects",
        data: [
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "RFQ" &&
                e.END_TIME === null &&
                !checkOverTime(e.CREATED_AT),
            ).length,
            color: "#FF9800",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "RFQ" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#f33a21ff",
          },
          {
            y: listProjects.filter(
              (e) => e.STATUS === "RFQ" && e.END_TIME !== null,
            ).length,
            color: "#4CAF50",
          },
        ],
        type: "column",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        align: "left",
        verticalAlign: "top",
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        itemStyle: {
          color: theme.palette.chart.color,
        },
      },
    }),
    [listProjects],
  );

  const options3 = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["On Going", "Over Time", "Success"],
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
      },
      yAxis: {
        title: {
          text: "Qty",
          style: {
            color: "#999",
            fontSize: "11px",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
      },
      series: {
        name: "NPI Projects",
        data: [
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "NPI Projects" &&
                e.END_TIME === null &&
                !checkOverTime(e.CREATED_AT),
            ).length,
            color: "#FF9800",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "NPI Projects" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#f33a21ff",
          },
          {
            y: listProjects.filter(
              (e) => e.STATUS === "NPI Projects" && e.END_TIME !== null,
            ).length,
            color: "#4CAF50",
          },
        ],
        type: "column",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        align: "left",
        verticalAlign: "top",
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        itemStyle: {
          color: theme.palette.chart.color,
        },
      },
    }),
    [listProjects],
  );

  const options4 = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["On Going", "Over Time", "Success"],
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
      },
      yAxis: {
        title: {
          text: "Qty",
          style: {
            color: "#999",
            fontSize: "11px",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
      },
      series: {
        name: "MP Projects",
        data: [
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "MP Projects" &&
                e.END_TIME === null &&
                !checkOverTime(e.CREATED_AT),
            ).length,
            color: "#FF9800",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "MP Projects" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#f33a21ff",
          },
          {
            y: listProjects.filter(
              (e) => e.STATUS === "MP Projects" && e.END_TIME !== null,
            ).length,
            color: "#4CAF50",
          },
        ],
        type: "column",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        align: "left",
        verticalAlign: "top",
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        itemStyle: {
          color: theme.palette.chart.color,
        },
      },
    }),
    [listProjects],
  );

  const options5 = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["On Going", "Over Time", "Success"],
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
      },
      yAxis: {
        title: {
          text: "Qty",
          style: {
            color: "#999",
            fontSize: "11px",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
      },
      series: {
        name: "EOL Projects",
        data: [
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "EOL" &&
                e.END_TIME === null &&
                !checkOverTime(e.CREATED_AT),
            ).length,
            color: "#FF9800",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "EOL" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#f33a21ff",
          },
          {
            y: listProjects.filter(
              (e) => e.STATUS === "EOL" && e.END_TIME !== null,
            ).length,
            color: "#4CAF50",
          },
        ],
        type: "column",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        align: "left",
        verticalAlign: "top",
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        itemStyle: {
          color: theme.palette.chart.color,
        },
      },
    }),
    [listProjects],
  );

  const options6 = React.useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
        borderWidth: 0,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["RFQ", "NPI Projects", "MP Projects", "EOL"],
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color, // Màu chữ trên trục Y
          },
        },
      },
      yAxis: {
        title: {
          text: "Over Time",

          style: {
            color: "#999",
            fontSize: "11px",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: theme.palette.chart.color,
          },
        },
        tickAmount: 3,
      },
      series: {
        name: "Qty",
        data: [
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "RFQ" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#F44336",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "NPI Projects" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#F44336",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "MP Projects" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#F44336",
          },
          {
            y: listProjects.filter(
              (e) =>
                e.STATUS === "EOL" &&
                e.END_TIME === null &&
                checkOverTime(e.CREATED_AT),
            ).length,
            color: "#F44336",
          },
        ],
        type: "column",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            color: theme.palette.chart.color,
            style: {
              textOutline: "none",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        align: "left",
        verticalAlign: "top",
        style: {
          fontSize: "12px",
          color: theme.palette.chart.color,
        },
        itemStyle: {
          color: theme.palette.chart.color,
        },
      },
    }),
    [listProjects],
  );

  return (
    <>
      {/* File section */}
      <Box
        flex={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Grid container columns={12}>
          <HiBox
            lg={4}
            md={4}
            xs={6}
            alarn={false}
            header="Projects Status"
            height="40vh"
            variant="filled"
          >
            <div ref={parentRef} style={{ height: "100%", display: "block" }}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          </HiBox>
          <HiBox
            lg={4}
            md={4}
            xs={6}
            alarn={false}
            header="RFQ Projects Status"
            height="40vh"
            variant="filled"
          >
            <div ref={parentRef} style={{ height: "100%", display: "block" }}>
              <HighchartsReact highcharts={Highcharts} options={options2} />
            </div>
          </HiBox>
          <HiBox
            lg={4}
            md={4}
            xs={6}
            alarn={false}
            header="NPI Projects Status"
            height="40vh"
            variant="filled"
          >
            <div ref={parentRef} style={{ height: "100%", display: "block" }}>
              <HighchartsReact highcharts={Highcharts} options={options3} />
            </div>
          </HiBox>
          <HiBox
            lg={4}
            md={4}
            xs={6}
            alarn={false}
            header="MP Projects Status"
            height="40vh"
            variant="filled"
          >
            <div ref={parentRef} style={{ height: "100%", display: "block" }}>
              <HighchartsReact highcharts={Highcharts} options={options4} />
            </div>
          </HiBox>
          <HiBox
            lg={4}
            md={4}
            xs={6}
            alarn={false}
            header="EOL Projects Status"
            height="40vh"
            variant="filled"
          >
            <div ref={parentRef} style={{ height: "100%", display: "block" }}>
              <HighchartsReact highcharts={Highcharts} options={options5} />
            </div>
          </HiBox>
          <HiBox
            lg={4}
            md={4}
            xs={6}
            alarn={false}
            header="Over Time Projects"
            height="40vh"
            variant="filled"
          >
            <div ref={parentRef} style={{ height: "100%", display: "block" }}>
              <HighchartsReact highcharts={Highcharts} options={options6} />
            </div>
          </HiBox>
        </Grid>
      </Box>
      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProjectTracking;

function checkOverTime(CREATED_AT) {
  const createdDate = new Date(CREATED_AT);
  const now = new Date();

  const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);

  if (diffDays > 15) {
    return true;
  }
  return false;
}
