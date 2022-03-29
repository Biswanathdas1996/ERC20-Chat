import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function RecipeReviewCard({ data }) {
  return (
    <Card style={{ marginTop: 20 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data?.name}
        subheader={"#" + data?.token_id}
      />

      <CardMedia
        component="img"
        image={data?.image_original_url}
        alt="Paella dish"
        height="300"
        weidth="300"
      />

      <CardContent style={{ height: 180 }}>
        <Typography variant="body2" color="text.secondary">
          {data?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>

        <a
          href={`https://testnets.opensea.io/assets/${data?.asset_contract?.address}/${data?.token_id}`}
          target="_blank"
          rel="noreferrer"
        >
          View on OpenSea
        </a>
      </CardActions>
    </Card>
  );
}
