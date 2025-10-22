import React, { useState, useEffect, useMemo } from "react";
import {
  LinearProgress,
  Box,
  Typography,
  styled,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HiModal from "../../../../components/HiModal";
import ErrorDetail from "./ErrorDetail";

const MOCK_DATA = [
  { LINE: "L06", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T04", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T06", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T07", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T08", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T09", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T10", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T11A", DATE: "2025-10-02", STATUS: "Approved" },
  { LINE: "T12-A", DATE: "2025-10-02", STATUS: "On going" },
  { LINE: "T12-B", DATE: "2025-10-02", STATUS: "On going" },
];

const TableMaintenancePlan = ({ idata = [], DataSeries = [], keyFilter }) => {
  idata = MOCK_DATA;
  const theme = useTheme();
  const [current, setCurrent] = useState(0);
  const [showModal1, setShowModal1] = useState(false);
  const [dataFATPErrorDetail, setDataFATPErrorDetail] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Number of visible items

  useEffect(() => {
    if (DataSeries.length < visibleCount) return;
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev >= DataSeries.length - visibleCount ? 0 : prev + 1
      );
    }, 3600);
    return () => clearInterval(interval);
  }, [DataSeries.length, visibleCount]);

  const displayItems = useMemo(() => {
    if (DataSeries.length <= visibleCount) return DataSeries;
    return DataSeries;
    return DataSeries.slice(current, current + visibleCount).concat(
      DataSeries.slice(
        0,
        Math.max(0, current + visibleCount - DataSeries.length)
      )
    );
  }, [DataSeries, current, visibleCount]);

  const maxFrequency =
    DataSeries.length > 0
      ? Math.max(...displayItems.map((e) => e.Frequency), 0)
      : 1;
  const maxDowntime =
    DataSeries.length > 0
      ? Math.max(...displayItems.map((e) => e.Downtime), 0)
      : 1;

  const handleChangeErrorDetail = (nol) => {
    setShowModal1((prev) => !prev);
    setDataFATPErrorDetail(idata.filter((item) => item[keyFilter] === nol));
    console.log("setDataFATPErrorDetail", dataFATPErrorDetail, nol, keyFilter);
  };

  return (
    <>
      <HiModal
        header={`Error details`}
        open={showModal1}
        onClose={() => setShowModal1(false)}
        widthModal={80}
        heightModal={80}
      >
        <ErrorDetail idata={dataFATPErrorDetail}></ErrorDetail>
      </HiModal>
      <Box sx={{ height: "100%" }}>
        <TableContainer
          sx={{
            overflow: "auto",
            height: "100%",
            "&::-webkit-scrollbar": { width: 0, opacity: 0, height: 6 },
            "&:hover::-webkit-scrollbar": { width: 4, opacity: 1 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cdcdcd8c",
              borderRadius: "10px",
            },
          }}
        >
          <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
            <TableHead
              sx={{
                position: "sticky",
                top: "0",
                backgroundColor: theme.palette.background.conponent,
              }}
            >
              <TableRow sx={{ background: "#518fb9" }}>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  No.
                </TableCell>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  Line
                </TableCell>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  KHBD
                </TableCell>
                <TableCell
                  style={{ padding: "3px 6px", fontWeight: "bold" }}
                  align="center"
                >
                  Note
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {idata.length > 0
                ? idata.map(
                    (
                      row,
                      index //,ERROR,ERROR_CODE,root_,EMP_confirm, act
                    ) => (
                      <TableRow
                        key={index}
                        sx={{
                          "& > .MuiTableCell-root": {
                            paddingTop: "8px !important",
                            paddingBottom: "8px !important",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          align="center"
                          scope="row"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                            color: row.CARD_CODE !== null ? "" : "#ff3110",
                          }}
                        >
                          {index + 1 || ""}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                            color: row.CARD_CODE !== null ? "" : "#ff3110",
                          }}
                        >
                          {row.LINE || ""}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                            color: row.CARD_CODE !== null ? "" : "#ff3110",
                          }}
                        >
                          {row.DATE || ""}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            padding: "3px",
                            fontSize: "12px",
                            color: row.CARD_CODE !== null ? "" : "#ff3110",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-block", // không full width
                              px: 1, // padding ngang nhỏ
                              py: 0.3,
                              background:
                                row.STATUS === "Approved"
                                  ? "linear-gradient(180deg, #66bb6a 0%, #2e7d32 100%)" // xanh lá gradient
                                  : "linear-gradient(180deg, #fff176 0%, #fbc02d 100%)",
                              borderRadius: 2,
                              color:
                                row.STATUS === "Approved" ? "#fff" : "#000", // màu chữ
                              fontWeight: 700,
                              minWidth: "fit-content",
                            }}
                          >
                            {row.STATUS || ""}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )
                : ""}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default React.memo(TableMaintenancePlan);
