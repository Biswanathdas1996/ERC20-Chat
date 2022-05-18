import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { Avatar, ListItemAvatar } from "@mui/material";
import { _fetch, _account } from "../ABI-connect/MessangerABI/connect";
import Card from "@mui/material/Card";
import { Grid } from "@mui/material";
import GetUser from "../components/shared/GetUser";

export default function BasicModal({ openVendorModal, nameonly, addressonly }) {
  const [studentData, setStudentData] = React.useState([]);
  const [account, setAccount] = React.useState(null);
  let history = useNavigate();

  React.useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    const students = await _fetch("getAllUser");
    console.log("---->", students);
    const account = await _account();
    setAccount(account);
    setStudentData(students);
  }

  const startChat = (name, addressId) => {
    localStorage.setItem("userAddressforChat", addressId);
    localStorage.setItem("userNameforChat", name);
    history("/chat");
  };

  return (
    <Card style={{ padding: 20 }}>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{
          marginBottom: 20,
        }}
      >
        {studentData.length > 0
          ? studentData.map((data, index) => {
              if (account !== data)
                return (
                  <>
                    <Grid
                      item
                      xs={8}
                      lg={8}
                      md={8}
                      sm={8}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <ListItemAvatar>
                        <GetUser uid={data} />
                      </ListItemAvatar>
                    </Grid>

                    <Grid item xs={4} lg={4} md={4} sm={4}>
                      <ListItemButton
                      // onClick={() => startChat(data?.name, data?.addressId)}
                      >
                        <input
                          className="btn btn-default btn-primary"
                          type="submit"
                          value={"Chat"}
                        />
                      </ListItemButton>
                    </Grid>
                  </>
                );
            })
          : "Please wait..."}
      </Grid>
    </Card>
  );
}
