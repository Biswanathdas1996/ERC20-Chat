import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Grid } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import ABI from "./ABI.json";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0)];

export default function SimpleAccordion() {
  return (
    <Grid container>
      <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      <Grid item lg={8} md={8} sm={12} xs={12}>
        <Card style={{ margin: 20 }}>
          {ABI.map((abi, i) => {
            console.log("----abi--->", abi);
            return (
              <Accordion key={i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <b>{abi?.name}</b>{" "}
                    <span style={{ fontSize: 12 }}>({abi?.type})</span>
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <TableContainer
                    component={Paper}
                    style={{ marginBottom: 20, fontSize: 12 }}
                  >
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="center">Type</TableCell>
                          <TableCell align="center">State Mutability</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography style={{ fontSize: 12 }}>
                              {abi?.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography style={{ fontSize: 12 }}>
                              {abi?.type}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography style={{ fontSize: 12 }}>
                              {abi?.stateMutability}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <h5 style={{ fontSize: 14, marginBottom: 20 }}>Inputs</h5>
                  {abi?.inputs?.map((input, x) => {
                    return (
                      <Card style={{ margin: 10 }} key={`inputs_${x}`}>
                        <CardContent
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="div"
                            style={{ fontSize: 12 }}
                          >
                            <b> {input?.name}</b>
                          </Typography>
                          <Typography
                            color="text.secondary"
                            style={{ fontSize: 12 }}
                          >
                            Datatype: <b>{input?.type}</b>
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                  <h5 style={{ fontSize: 14, marginBottom: 20 }}>Outputs</h5>
                  <Card style={{ margin: 10, padding: 20 }} key={`outputs`}>
                    <code>
                      <p>{`{`}</p>
                      {abi?.outputs?.map((input, x) => {
                        return <p>{`  ${input?.type}, `}</p>;
                      })}
                      <p>{`}`}</p>
                    </code>
                  </Card>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Card>
      </Grid>
      <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
    </Grid>
  );
}
