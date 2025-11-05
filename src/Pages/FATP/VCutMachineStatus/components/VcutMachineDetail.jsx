import React, { useState, useMemo, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Switch, Grid } from "@mui/material";
import HiBox from "../../../../components/HiBox";
import { getAuthorizedAxiosIntance } from "../../../../utils/axiosConfig";
import imgMachine from "./images/img1.png";
import { useTheme } from "@mui/material/styles";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const axiosInstance = await getAuthorizedAxiosIntance();
const CRITICAL_THRESHOLD = 500000;
const WARNING_THRESHOLD = 450000;

const VcutMachineDetail = ({ idata = [] }) => {
  const theme = useTheme();
  const parentRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [dataOverTime, setDataOverTime] = useState([]);

  const columns = [
    {
      field: "FACTORY",
      headerName: "Factory",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "LINE",
      headerName: "Line",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "NAME_MACHINE",
      headerName: "Machine",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
    },
    {
      field: "START_TIME",
      headerName: "Start time",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {(params.value || "").replace("T", " ").replace(".000Z", "")}
        </div>
      ),
    },
    {
      field: "TOTAL_AT_CHANGE",
      headerName: "Total",
      flex: 1, // tự chia chiều rộng
      minWidth: 100,
      editable: true,
    },
  ];

  const rowsWithId = useMemo(
    () =>
      dataOverTime.map((row, index) => ({
        id: index, // hoặc row.LINE nếu unique
        ...row,
      })),
    [dataOverTime]
  );

  const fetchDataOverTime = async () => {
    try {
      const response = await axiosInstance.post(
        "api/vcut/getKnifeVcutMachineHistory",
        {
          factory: idata.FACTORY,
          line: idata.LINE,
          location: idata.LOCATION,
        }
      );
      setDataOverTime(response.data || []); // Cập nhật state
    } catch (error) {
      console.log(error.message);
    }
  };

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
    fetchDataOverTime();
  }, [idata]);

  const options = React.useMemo(() => {
    const used = (idata.TOTAL / 500000) * 100; // number
    const remain = 100 - used; // number

    return {
      chart: {
        type: "pie",
        custom: {},
        events: {
          render() {
            const chart = this,
              series = chart.series[0];
            const total = series.data.reduce((sum, { y = 0 }) => sum + y, 0);
            let customLabel = chart.options.chart.custom.label;

            if (!customLabel) {
              customLabel = chart.options.chart.custom.label = chart.renderer
                .label(
                  `Used:<br/> <strong>${idata.TOTAL.toLocaleString(
                    "en-US"
                  )}/${CRITICAL_THRESHOLD.toLocaleString("en-US")}</strong>`
                )

                .add();
            }

            customLabel.css({
              color: theme.palette.primary.conponent,
              textAnchor: "middle",
            });

            const x = series.center[0] + chart.plotLeft,
              y =
                series.center[1] +
                chart.plotTop -
                customLabel.attr("height") / 2;

            customLabel.attr({
              x,
              y,
            });
            // Set font size based on chart diameter
            customLabel.css({
              fontSize: `${series.center[2] / 12}px`,
            });
          },
        },
        backgroundColor: "transparent",
        reflow: true,
        height: parentSize.height,
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      title: {
        text: "",
      },
      tooltip: {
        // pointFormat: "{series.name}: <b>{point.y}</b>",
        pointFormatter: function () {
          return `${this.series.name}: <b>${this.y.toLocaleString(
            "en-US"
          )}</b>`;
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: "pointer",
          borderRadius: 0,
          dataLabels: [
            {
              enabled: true,
              distance: 20,
              format: "{point.name}",
            },
            {
              enabled: true,
              distance: -13,
              formatter: function () {
                return this.y.toLocaleString("en-US");
              },
              style: {
                fontSize: "0.8em",
              },
            },
          ],
          showInLegend: true,
          point: {
            events: {
              click: function () {},
            },
          },
        },
      },
      series: [
        {
          name: "Quanlity",
          colorByPoint: true,
          innerSize: "75%",
          data: [
            {
              name: "Used",
              y: idata.TOTAL,
              // color: "#4caf50",
              color: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops:
                  idata.TOTAL < CRITICAL_THRESHOLD
                    ? [
                        [0, "#e5d286"], // vàng nhạt
                        [1, "#e1bc27"], // vàng đậm
                      ]
                    : [
                        [0, "#e77e92"], // đỏ nhạt
                        [1, "#ff2d55"], // đỏ đậm
                      ],
              },
            },
            {
              name: "Remaid",
              y: Math.max(0, CRITICAL_THRESHOLD - idata.TOTAL),
              color: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "#3498db"], // xanh lá nhạt
                  [1, "#2273a9"], // xanh lá đậm
                ],
              },
            },
          ],
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [parentSize, theme, idata]);

  return (
    <Grid sx={{ height: "100%" }} container columns={12}>
      <HiBox lg={5} md={5} xs={5} alarn={false} height="36vh" variant="filled">
        <Box
          component={"div"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            component="img"
            align="center"
            src={imgMachine}
            sx={{ height: "100%" }}
          />
        </Box>
      </HiBox>
      <HiBox header={`V-cut machine status`} lg={7} md={7} xs={7} alarn={false} height="36vh" variant="filled">
        <div ref={parentRef} style={{ height: "100%", display: "block" }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </HiBox>
      <HiBox
        lg={12}
        md={12}
        xs={12}
        alarn={false}
        height="36vh"
        variant="filled"
      >
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          sx={{
            height: "90%",
            backgroundColor: "transparent",
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "transparent !important",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.3",
              py: 1, // padding top/bottom
              alignItems: "flex-start", // ensure top alignment when multi-line
            },
          }}
        />
      </HiBox>
    </Grid>
  );
};
export default VcutMachineDetail;
