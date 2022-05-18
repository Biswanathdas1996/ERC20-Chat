import React, { useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import BallotIcon from "@mui/icons-material/Ballot";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Avatar } from "@mui/material";
import { AccountContext } from "../App";
import { Button } from "@mui/material";
import VoiceFile from "./VoiceFile/Create";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const menuItemsData = [
  {
    title: "Home",
    link: "/",
    icon: () => <HomeIcon />,
  },
  {
    title: "Users",
    link: "/users",
    icon: () => <GroupIcon />,
  },
  {
    title: "Register",
    link: "/register",
    icon: () => <ExitToAppIcon />,
  },
];

const menuNFT = [
  {
    title: "Create NFT",
    link: "/nft-mint",
    icon: () => <CreateNewFolderIcon />,
  },
  {
    title: "My NFT",
    link: "/my-nft",
    icon: () => <BallotIcon />,
  },
  {
    title: "NFT Marketplace",
    link: "/nft-market",
    icon: () => <LocalGroceryStoreIcon />,
  },
];

const menuTickets = [
  {
    title: "Create Ticket",
    link: "/event/create",
    icon: () => <NoteAddIcon />,
  },
  {
    title: "Buy Ticket",
    link: "/event/all",
    icon: () => <AddBusinessIcon />,
  },
  {
    title: "My Ticket",
    link: "/event/my-tickets",
    icon: () => <FactCheckIcon />,
  },
];

export default function Layout({ body }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  let history = useNavigate();
  const { account, fetchUserData } = useContext(AccountContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = (link) => {
    handleDrawerClose();
    history(link);
  };

  const logout = () => {
    localStorage.clear();
    fetchUserData();
    history("/login");
    return;
  };
  return (
    <Box style={{ backgroundColor: "#f3f3f4" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "white", color: "#5a5a5a" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <div className="project-name">SOSAL</div>
          <Typography
            className="project-name"
            sx={{ flexGrow: 1, marginLeft: 1, fontSize: 7 }}
          >
            WeB 3.0
          </Typography>

          <VoiceFile />

          {account?.name && (
            <>
              <Avatar
                alt="Remy Sharp"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                }}
                src={account?.profileImg}
              ></Avatar>
              <p style={{ color: "black", margin: 10, fontWeight: "bold" }}>
                {account?.name}
              </p>
              <Button
                aria-controls={`ewrwr`}
                variant="outlined"
                sx={{ textTransform: "none" }}
                style={{ marginLeft: 10 }}
                onClick={() => logout()}
              >
                <LogoutIcon />
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => handleDrawerClose()}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItemsData.map((item, index) => (
            <ListItem button key={index} onClick={() => navigate(item?.link)}>
              <ListItemIcon>{item?.icon()}</ListItemIcon>
              <ListItemText primary={item?.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {menuNFT.map((item, index) => (
            <ListItem button key={index} onClick={() => navigate(item?.link)}>
              <ListItemIcon>{item?.icon()}</ListItemIcon>
              <ListItemText primary={item?.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {menuTickets.map((item, index) => (
            <ListItem button key={index} onClick={() => navigate(item?.link)}>
              <ListItemIcon>{item?.icon()}</ListItemIcon>
              <ListItemText primary={item?.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div>
        <DrawerHeader />
        {body()}
      </div>
    </Box>
  );
}
