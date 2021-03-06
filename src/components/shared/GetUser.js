import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { _fetch } from "../../ABI-connect/MessangerABI/connect";
import Skeleton from "@mui/material/Skeleton";

const GetUser = ({ uid, subtext = "", hideName = false, imgStyle = {} }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    frtchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frtchData = async () => {
    setLoading(true);

    const repoterData = await _fetch("users", uid);
    setUser(repoterData);
    setLoading(false);
  };

  return (
    <>
      {!loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Avatar
            alt={user?.name}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
            }}
            style={imgStyle}
            src={user?.profileImg}
            title={user?.name}
          ></Avatar>

          {!hideName && (
            <p style={{ color: "black", margin: 5, fontWeight: "bold" }}>
              {user?.name}
              <p
                style={{
                  color: "rgb(118, 118, 118)",
                  fontSize: 12,
                  fontWeight: "400",
                }}
              >
                {subtext}
              </p>
            </p>
          )}
        </div>
      ) : (
        <Skeleton animation="wave" />
      )}
    </>
  );
};

export default GetUser;
