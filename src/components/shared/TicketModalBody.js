import React from "react";

import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "auto",
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,

// };
export default function TicketModalBody({ data, price }) {
  console.log("------>", data);
  return (
    <>
      <Box>
        <CardMedia
          component="img"
          image={data?.image}
          alt={data?.name}
          height="200"
          weidth="300"
        />
        <br />
        <Typography variant="body2" color="text.secondary">
          <b style={{ fontSize: 20 }}>{price / 1000000000000000000} ETH</b>
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {data?.description}
        </Typography>
        <br />
        <Typography variant="body2" color="text.secondary">
          <b style={{ fontSize: 20 }}>Package includes</b>
        </Typography>
        <br />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              {data.attributes.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <b>{row?.trait_type}</b>
                  </TableCell>
                  <TableCell align="right">{row?.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
