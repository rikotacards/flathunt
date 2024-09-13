import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getRequests } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { IRequests } from "../firebase/types";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";
const UserRow: React.FC<{ userId: string; messageCount: number }> = ({
  userId,
  messageCount,
}) => {
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText
          primary={<Typography>{userId}</Typography>}
          secondary={<Typography>{messageCount} new requests</Typography>}
        >
          {userId}
        </ListItemText>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export const RequestsPage: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["getRequests"],
    queryFn: () => getRequests(USER_ID),
  });
  console.log(data);
  const [selectedUserId, setUserId] = React.useState("");
  const onUserClick = (userId: string) => {
    setUserId(userId);
  };
  const closeDrawer = () => {
    setUserId("");
  };
  const userMessages = {} as IRequests;
  data?.forEach((d) => {
    if (!userMessages[d.sendingUserId]) {
      userMessages[d.sendingUserId] = [d];
    } else {
      userMessages[d.sendingUserId].push(d);
    }
  });
  const userIds = Object.keys(userMessages);
  console.log("messages", userMessages);
  return (
    <>
      <List>
        {userIds?.map((userId) => (
          <div onClick={() => onUserClick(userId)}>
            <UserRow
              userId={userId}
              messageCount={userMessages[userId].length}
            />
          </div>
        ))}
      </List>
      <Drawer
        onClose={closeDrawer}
        open={selectedUserId.length > 0}
        anchor="right"
      >
        <AppBar sx={{ background: "white" }} position="fixed">
          <Toolbar>
            <IconButton onClick={closeDrawer}>
              <ChevronLeftIcon />
            </IconButton>
            
          </Toolbar>
        </AppBar>
        <Toolbar></Toolbar>
        <Card sx={{ m: 1, p: 1 }}>
          <Avatar />
          <Box>{userMessages[selectedUserId]?.[0].contactNumber}</Box>
        </Card>
        {userMessages[selectedUserId]?.map((m) => (
          <Box
            sx={{
              m: 1,
              display: "flex",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ mr: 1 }} />
              {`Hi, I'm interested in listing`}
              <Link target="_blank" to={`/listing/${m.listingId}`}>
                {m.listingId}
              </Link>
            </Box>
          </Box>
        ))}
      </Drawer>
    </>
  );
};
