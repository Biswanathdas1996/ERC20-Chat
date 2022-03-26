import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { Avatar, ListItemAvatar } from "@mui/material";
import { _fetch, _account } from "../ABI-connect/MessangerABI/connect";

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
