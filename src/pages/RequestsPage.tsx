import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getRequests } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { IRequests } from "../firebase/types";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuList,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";
import { ListingTile } from "../components/ListingTile";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <AppBar sx={{ background: "white" }} position="fixed">
          <Toolbar component={Paper}>
            <IconButton onClick={closeDrawer}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography>
              {userMessages[selectedUserId]?.[0].sendingUserId}
            </Typography>
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                <Typography> {userMessages[selectedUserId]?.[0].contactNumber}</Typography>
                <Button endIcon={<WhatsAppIcon/>} sx={{textTransform: 'capitalize'}}>
                    Message in whatsapp
                </Button>
         
              <Typography>
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {userMessages[selectedUserId]?.map((m) => (
         
            <Box  sx={{m:1, flexWrap: 'nowrap', display: "flex"}}>
              <Avatar sx={{ m: 1 }} />
              <Typography>
                {`Hi, I'm interested in listing `}
                <Box sx={{ display: "flex", flexWrap: 'wrap' }}>
                  <Link target="_blank" to={`/listing/${m.listingId}`}>
                  <Typography variant='body2'>

                    {`flathunt.co/listing/${m.listingId}`}
                  </Typography>
                  </Link>
                  <IconButton size="small">
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Typography>
            </Box>
        ))}
      </Drawer>
    </>
  );
};
