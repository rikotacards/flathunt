import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  TextField,
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
interface ContactFormProps {
  onClose: () => void;
  listingId: string;
}
export const ContactForm: React.FC<ContactFormProps> = ({
  onClose,
  listingId,
}) => {
  const [number, setNumber] = React.useState("");
  const { user } = useAuthContext();
  const [openSignIn, setOpenSignIn] = React.useState(false);
  const s = useSnackbarContext();

  const onOpenSignIn = () => {
    setOpenSignIn(true);
  };
  const onSendContact = async () => {
    if (number.length === 0) {
      return;
    }
    try {
      if (!user) {
        await signIn();
      }
      await addContactRequest({
        contactNumber: number,
        sendingUserId: USER_ID,
        receivingUserId: USER_ID,
        listingId,
        message: "",
      });
      s.setSnackbarChildComponent(<Alert variant="filled" sx={{width:'100%'}} severity="success">Message succesfully sent to agent.</Alert>)
      s.toggleSnackbar()
      onClose();
    } catch (e) {
      alert(e);
    }
  };
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography>Contact agent</Typography>
          <IconButton onClick={onClose} sx={{ ml: "auto" }}>
            <KeyboardArrowDownOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 1, display: "flex", flexDirection: "column" }}>
        <OutlinedInput
          onChange={(e) => setNumber(e.target.value)}
          type="tel"
          placeholder="Your Whatsapp number"
          sx={{ mb: 1 }}          
        />
        <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
          <Typography color='textSecondary' variant="caption">
          Your contact will be sent to the agent.
          The agent will reach out to you as soon as possible. In addition, your contact will be saved for future agent requests.
          </Typography>
        </Card>
        {openSignIn && (
          <Card variant="outlined" sx={{ p: 1, mb: 1 }}>
            <Typography variant="caption">Please sign in</Typography>
            <Button>Sign in with google</Button>
          </Card>
        )}
        <Button
          onClick={() => {
            onSendContact();
          }}
          size='large'
          variant="contained"
        >
          Send
        </Button>
      </Box>
    </>
  );
};
