import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router";
export const SignInPopup: React.FC = () => {
  const [isClosed, setClosed] = React.useState(false);
  const nav = useNavigate();
  const onSignIn = async() => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider)
     
    }catch(e){
      alert(e)
    }
    
  }
  return (
    <Box
    component={Paper}
    elevation={10}
      sx={{
        background: 'transparent',
        borderRadius: 10,
        position: "sticky",
        bottom: 20,
        overflow: "hidden",
        m: 2,
        zIndex: 3,
        p: 1,
        backdropFilter: 'blur(10px)',
      }}
    >
  
        <Button
          fullWidth
          startIcon={<GoogleIcon/>}
          size="small"
          variant='contained'
          onClick={onSignIn}
          sx={{p:1, 
            // border: "1px solid white", 
            borderRadius: 5,
             color: "white"
           }}
        >
          Sign in with Google
        </Button>
    </Box>
  );
};
