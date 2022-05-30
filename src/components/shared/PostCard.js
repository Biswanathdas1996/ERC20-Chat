import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetUser from "../../components/shared/GetUser";

export default function RecipeReviewCard({ data }) {
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const validVideoeTypes = ["video/mp4"];
  return (
    <Card style={{ marginTop: 20 }}>
      <CardHeader
        avatar={<GetUser uid={data?.sender} subtext={data?.time} />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      />
      {validImageTypes.includes(data?.fileType) && (
        <a href={data?.file} target="_blank" rel="noreferrer">
          <CardMedia
            component="img"
            image={data?.file}
            alt="Paella dish"
            height="360"
          />
        </a>
      )}
      {validVideoeTypes.includes(data?.fileType) && (
        <a href={data?.file} target="_blank" rel="noreferrer">
          <CardMedia component="iframe" src={data?.file} height="360" />
        </a>
      )}
      {!validVideoeTypes.includes(data?.fileType) &&
        !validImageTypes.includes(data?.fileType) && (
          <center>
            <a href={data?.file} target="_blank" rel="noreferrer">
              <DescriptionIcon fontSize="large" sx={{ fontSize: 60 }} />
              <p>{data?.fileType}</p>
            </a>
          </center>
        )}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          <div dangerouslySetInnerHTML={{ __html: data?.text }}></div>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
