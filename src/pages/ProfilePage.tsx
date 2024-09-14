import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { onSignOut } from "../utils/signOut";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import { signIn } from "../utils/signInWithGoogle";

import { useAuthContext, useFilterContext } from "../Providers/contextHooks";

export const ProfilePage: React.FC = () => {
  const nav = useNavigate();
  const { user } = useAuthContext();
  const { filters, setFilters } = useFilterContext();
  const [form, setForm] = React.useState({
    name: user?.displayName,
    email: user?.email,
  });
  React.useEffect(() => {
    setFilters({});
  }, []);
  if (!user) {
    return (
      <>
        <Button onClick={signIn} sx={{ p: 1, m: 1 }} variant="contained">
          Sign in with Google
        </Button>
      </>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        textAlign: "left",
      }}
    >
      {/* <Toolbar /> */}
      <Typography variant='body2' fontWeight={"bold"}>Name</Typography>
      <Typography variant='body1'>{user.displayName}</Typography>
      <Typography variant='body2' fontWeight={"bold"}>Email</Typography>
      <Typography variant='body1'>{user.email}</Typography>
      <Typography fontWeight={"bold"}>Whatsapp contact</Typography>
      <TextField size='small' type='tel' />
      <Card sx={{ p: 1, mt: 1, mb: 2 }} variant="outlined">
        <Typography variant='caption'>Your number will be forwarded to the agent.</Typography>
      </Card>
      <Divider sx={{ width: "100%", p: 2 }} />
      <Typography variant='body2'>For Agents</Typography>
      <Typography fontWeight={"bold"}>Company</Typography>
      <TextField size='small' sx={{ mb: 2 }} />
      <Typography fontWeight={"bold"}>License ID</Typography>
      <TextField size='small' sx={{ mb: 2 }} />
      <Button
        variant="contained"
        color="error"
        onClick={() => onSignOut(() => nav("/"))}
      >
        Log out
      </Button>
    </Box>
  );
};
