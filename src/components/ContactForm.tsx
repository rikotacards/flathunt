import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Card,
  Button,
  Alert,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { addContactRequest } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { signIn } from "../utils/signInWithGoogle";
import { addUser, getUser, updateUser } from "../firebase/user";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";

interface ContactFormProps {
  onClose: () => void;
  listingId: string;
}
const auth = getAuth();

export const ContactForm: React.FC<ContactFormProps> = ({
  onClose,
  listingId,
}) => {
    const provider = new GoogleAuthProvider();
    const { user } = useAuthContext();
    const { data, isLoading } = useQuery({
        queryKey: ["getUser"],
        queryFn: () => getUser(user?.uid || ""),
      });
  const [number, setNumber] = React.useState(data?.contactNumber);

  React.useEffect(() => {
    setNumber(data?.contactNumber)
  }, [isLoading])
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const s = useSnackbarContext();
  
  const onSignIn = async() => {
    try {
        const res = await signInWithPopup(auth, provider)
        await addUser({userId: res.user.uid, contactNumber: number})
        await addContactRequest({
            contactNumber: number,
            sendingUserId: USER_ID,
            receivingUserId: USER_ID,
            listingId,
            message: "",
          });
          s.setSnackbarChildComponent(
            <Alert variant="filled" sx={{ width: "100%" }} severity="success">
              Message succesfully sent to agent.
            </Alert>
          );
          s.toggleSnackbar();
          onClose();
    } catch (e) {
        alert(e)
    }
    
  };
  const onOpenSignIn = () => {
    setOpenSignIn(true);
  };
  const onSendContact = async () => {
    if (number?.length === 0) {
      return;
    }
    try {
      if (!user) {
        onOpenSignIn();
        return;
      }
      await addContactRequest({
        contactNumber: number,
        sendingUserId: USER_ID,
        receivingUserId: USER_ID,
        listingId,
        message: "",
      });
      s.setSnackbarChildComponent(
        <Alert variant="filled" sx={{ width: "100%" }} severity="success">
          Message succesfully sent to agent
        </Alert>
      );
      s.toggleSnackbar();
      onClose();
    } catch (e) {
      alert(e);
    }
  };
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography>Contact Agent</Typography>
          <IconButton onClick={onClose} sx={{ ml: "auto" }}>
            <KeyboardArrowDownOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 1, display: "flex", flexDirection: "column" }}>
        <OutlinedInput
          onChange={(e) => setNumber(e.target.value)}
          type="tel"
          value={number}
          placeholder="Whatsapp number: +85212345678"
          sx={{ mb: 1 }}
        />
        <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
          <Typography color="textSecondary" variant="caption">
            Your contact will be sent to the agent. The agent will reach out to
            you as soon as possible. In addition, your contact will be saved for
            future agent requests.
          </Typography>
        </Card>
        {openSignIn && (
          <Card  variant="elevation" elevation={10} sx={{ p: 1, mb: 1 }}>
            <Typography color='warning' variant="caption" sx={{ ml: 1 }}>
              Sign in to send your request to the agent.
            </Typography>
          </Card>
        )}
        {openSignIn? <Button
        onClick={onSignIn}
         variant='contained' size="large"
        >Sign in with Google</Button>:<Button
          onClick={() => {
            onSendContact();
          }}
          size="large"
          variant="contained"
        >
          Send
        </Button>}
      </Box>
    </>
  );
};
