import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { Avatar, ListItemAvatar } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import {
  _transction,
  _fetch,
  _account,
} from "../ABI-connect/MessangerABI/connect";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ openVendorModal, closeVendorModal }) {
  const [studentData, setStudentData] = React.useState([]);
  const [account, setAccount] = React.useState(null);
  let history = useNavigate();

  React.useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    const students = await _fetch("getAllUsers");
    const account = await _account();
    setAccount(account);
    console.log("--------->", students);
    setStudentData(students);
  }

  const startChat = (addressId) => {
    localStorage.setItem("userAddressforChat", addressId);
    history("/chat");
  };

  return (
    <div className="container">
      {studentData.length > 0
        ? studentData.map((data, index) => {
            if (account !== data?.addressId)
              return (
                <List key={index + "_User"}>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#e78d13" }}></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={data?.name} />
                    <ListItemText secondary={data?.addressId} />
                    <ListItemButton onClick={() => startChat(data?.addressId)}>
                      <input
                        className="btn btn-default btn-primary"
                        type="submit"
                        value={"Chat"}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              );
          })
        : "Please wait..."}
    </div>
  );
}
