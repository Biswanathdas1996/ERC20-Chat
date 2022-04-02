import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid } from "@mui/material";
import { _fetch } from "../../ABI-connect/NFT-ABI/connect";
import CurrentNFTCard from "../shared/CurrentNFTCard";
import { useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Timeline = () => {
  const [nftData, setNftData] = useState(null);
  const [owner, setOwner] = useState(null);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    const getAllTokenUri = await _fetch("tokenURI", id);
    const getOwner = await _fetch("ownerOf", id);
    setOwner(getOwner);
    await fetch(getAllTokenUri)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNftData(data);
      });
  }

  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      style={{ padding: 20, background: "#f3f3f4" }}
    >
      <Grid item xs={6}>
        <Card>
          <CardActionArea>
            <center>
              <CardMedia
                component="img"
                height="500"
                image={nftData?.image}
                alt="green iguana"
                style={{ width: 500 }}
              />
            </center>

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {nftData?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b style={{ color: "#7c007c" }}>Owner: {owner}</b>
              </Typography>
              <br />
              <Typography variant="body2" color="text.secondary">
                {nftData?.description}
              </Typography>

              <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Properties</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nftData?.attributes?.map((row) => (
                      <TableRow
                        key={row.trait_type}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.trait_type}
                        </TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Owner: {owner}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Timeline;
