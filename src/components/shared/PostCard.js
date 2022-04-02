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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard({ data }) {
  const [expanded, setExpanded] = React.useState(false);
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const validVideoeTypes = ["video/mp4"];
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
        title={data?.sender}
        subheader="September 14, 2016"
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
          {data?.text}
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
