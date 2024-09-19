import {
  Box,
  Button,
  Paper,

} from "@mui/material";
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import GoogleIcon from "@mui/icons-material/Google";
export const SignInPopup: React.FC = () => {
  const userAgent = window.navigator.userAgent;
  const url = window.location.href;

  const onSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    if (userAgent.includes('Instagram')) {
      window.location.href = 'x-safari-' + url;
      return;
  }
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Box
      component={Paper}
      elevation={10}
      sx={{
        background: "transparent",
        borderRadius: 10,
        position: "sticky",
        bottom: 20,
        overflow: "hidden",
        m: 2,
        zIndex: 3,
        p: 1,
        backdropFilter: "blur(10px)",
      }}
    >
      <Button
        fullWidth
        startIcon={<GoogleIcon />}
        size="small"
        variant="contained"
        onClick={onSignIn}
        sx={{
          p: 1,
          // border: "1px solid white",
          borderRadius: 5,
          color: "white",
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};
