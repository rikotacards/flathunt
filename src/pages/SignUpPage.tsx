import {
  Box,
  Button,
  Card,
  CardContent,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
export const SignUpPage: React.FC = () => {
  const nav = useNavigate();
  const goHome = () => {
    nav("/");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h2" fontWeight={"900"}>
          Welcome to Flathunt.co
        </Typography>
      </Box>
      <Card sx={{mb:1}}>
        <CardContent sx={{ display: "flex" }}>
          1. Are you..
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Button>An Agent</Button>
            <Button>Landlord</Button>
            <Button>Neither (just browsing)</Button>
            <Button>Its a secret</Button>
          </Box>
        </CardContent>
      </Card>
      <Box>
        <Card>
          <CardContent>
            <Typography>Add your whatsapp</Typography>
            <OutlinedInput />
          </CardContent>
        </Card>
      </Box>
      <Button onClick={goHome}>Done</Button>
    </Box>
  );
};
