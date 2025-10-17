import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
} from "@mui/material";
import HiBox from "../../../../components/HiBox";
import dayjs from "dayjs";
import ConfirmDataGelDialog from "./confirmDataGelError";

const TableError = ({ idata = [], onConfirmSuccess }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dataForDialog, setDataForDialog] = useState();

  const getValue = (dataRow) => {
    if (dataRow.CL > dataRow.UCL || dataRow.CL < dataRow.LCL) return "ERROR";
    else return "ALARM";
  };

  const handleOpenDialog = (dataRow) => {
    setDataForDialog(dataRow);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <HiBox
      lg={6}
      md={6}
      xs={12}
      alarn={false}
      header="Data Gel Issue"
      height="45vh"
      variant="filled"
    >
      <ConfirmDataGelDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={dataForDialog}
        onConfirmSucces={onConfirmSuccess}
      />
      <TableContainer
        sx={{
          overflow: "auto",
          height: "100%",
          "&::-webkit-scrollbar": { width: 0, opacity: 0 },
          "&:hover::-webkit-scrollbar": { width: 4, opacity: 1 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cdcdcd8c",
            borderRadius: "10px",
          },
        }}
      >
        <Table sx={{ borderSpacing: "0 8px" }} aria-label="customized table">
          <TableHead
            sx={{ position: "sticky", top: "0", backgroundColor: "#4099ff" }}
          >
            <TableRow>
              <TableCell
                style={{ padding: "6px 6px", fontWeight: "bold" }}
                align="center"
              >
                No.
              </TableCell>
              <TableCell
                style={{ padding: "6px 6px", fontWeight: "bold" }}
                align="center"
              >
                Machine
              </TableCell>
              <TableCell
                style={{ padding: "6px 6px", fontWeight: "bold" }}
                align="center"
              >
                Data Time
              </TableCell>
              <TableCell
                style={{ padding: "6px 6px", fontWeight: "bold" }}
                align="center"
              >
                SN
              </TableCell>
              <TableCell
                style={{ padding: "6px 6px", fontWeight: "bold" }}
                align="center"
              >
                Value
              </TableCell>
              <TableCell
                style={{ padding: "6px 6px", fontWeight: "bold" }}
                align="center"
              >
                Confirm
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idata.length > 0
              ? idata.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      align="center"
                      sx={{ padding: "12px", background: "#cbcbcb56" }}
                    >
                      {index}
                    </TableCell>
                    {/* <TableCell align="left" sx={{ padding: "6px 6px",color: '#000'}}>{index}</TableCell> */}
                    <TableCell align="center" sx={{ padding: "6px 6px" }}>
                      {row.Machine}
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "6px 6px" }}>
                      {dayjs(row.TIME_START).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "6px 6px" }}>
                      {row.Project}
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "6px 6px" }}>
                      {getValue(row)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ padding: "6px 6px", color: "#ff3110" }}
                    >
                      <Box
                        component={"a"}
                        onClick={() => handleOpenDialog(row)}
                      >
                        Confirm
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
    </HiBox>
  );
};
export default TableError;
