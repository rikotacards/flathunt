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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import React from "react";
import { addContactRequest } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { signIn } from "../utils/signInWithGoogle";
import { addUser, getUser, updateUser } from "../firebase/user";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
interface ContactFormProps {
  onClose: () => void;
  listingId: string;
  listingOwnerUid: string;
  message?: string;
  listingSpecificContact?: string;
}
const auth = getAuth();

export const ContactForm: React.FC<ContactFormProps> = ({
  onClose,
  listingId,
  listingOwnerUid,
  message,
  listingSpecificContact,
}) => {
  const provider = new GoogleAuthProvider();
  const { user } = useAuthContext();
    const queryClient = useQueryClient();
  const { data: listingOwnerData, isLoading } = useQuery({
    queryKey: ['listingId'],
    queryFn: () => getUser(listingOwnerUid || ""),
  });
  const { data: myData, isLoading: isMyDataLoading } = useQuery({
    queryKey: ["getMyUserInfo"],
    queryFn: () => getUser(user?.uid || ""),
  });
  const [number, setNumber] = React.useState<string | undefined>();
  
  console.log('listingownerdata', listingOwnerData)
  React.useEffect(() => {
    queryClient.invalidateQueries({
        queryKey: ["getListingOwner"],
        exact: true,
      });
    if(!myData?.contactNumber){
        return;
    }
    setNumber(myData?.contactNumber);
    
  }, [isMyDataLoading, myData?.contactNumber]);
  const [openSignIn, setOpenSignIn] = React.useState(false);

  const onSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = await getUser(res.user.uid);
      if(!user?.contactNumber){
        await addUser({ userId: res.user.uid, contactNumber: number });
      }
      //   await addContactRequest({
      //     contactNumber: number,
      //     sendingUserId: USER_ID,
      //     receivingUserId: USER_ID,
      //     listingId,
      //     message: "",
      //   });
      //   if (res) {
      //     window.open(whatsappLink, "_blank");
      //   }
      document.getElementById(listingId)?.scrollIntoView({block:'center', behavior: 'instant'})
      window.open(whatsappLink, "_top")
      s.setSnackbarChildComponent(
        <Alert icon={<WhatsAppIcon/>} variant="filled" sx={{ width: "100%" }} severity="success">
          Opening Whatsapp
        </Alert>
      );
      s.toggleSnackbar();
    //   onClose();
    } catch (e) {
      alert(e);
    }
  };
  const onOpenSignIn = () => {
    setOpenSignIn(true);
  };
  console.log('data', listingOwnerData?.contactNumber)
  const s = useSnackbarContext();
  const fallback = `Hi, I'm interested this flat \n flathunt.co/listing/${listingId}`
  const whatsappLink = `whatsapp://send?phone=${listingSpecificContact || listingOwnerData?.contactNumber}&text=${message || fallback}`;
  const openWhatsappChat = async () => {
    if (!number?.length) {
      s.setSnackbarChildComponent(<Alert severity="error">Whatsapp number required</Alert>)
      s.toggleSnackbar()
      return;
    }
    try {
      if (!user) {
        onOpenSignIn();
        return;
      }
      await addContactRequest({
        contactNumber: number || "",
        sendingUserId: USER_ID,
        receivingUserId: USER_ID,
        listingId,
        message: "",
      });
      

      s.setSnackbarChildComponent(
        <Alert icon={<WhatsAppIcon/>} variant="filled" sx={{ width: "100%" }} severity="success">
          Opening whatsapp
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
        <Toolbar sx={{textAlign: 'center'}}>
          <Typography fontWeight={'bold'}>Contact Agent</Typography>
          <IconButton color='inherit' onClick={onClose} sx={{ ml: "auto" }}>
            <KeyboardArrowDownOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 1, display: "flex", flexDirection: "column" }}>
        <OutlinedInput
          onChange={(e) => setNumber(e.target.value)}
          type="tel"
          value={number}
          placeholder="Your whatsapp number: +85212345678"
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
          <Card variant="elevation" elevation={10} sx={{ p: 1, mb: 1 }}>
            <Typography
              color="warning"
              fontWeight="bold"
              variant="caption"
              sx={{ ml: 1 }}
            >
              You must sign in to send a message to the agent.
            </Typography>
          </Card>
        )}
        {openSignIn ? (
          <Button
            onClick={async () => await onSignIn()}
            variant="contained"
            size="large"
            sx={{ textTransform: "capitalize", fontWeight: 'bold' }}
          >
            Sign in
          </Button>
        ) : (
          <Button
            onClick={() => {
              openWhatsappChat();
            }}
            size="large"
            variant="contained"
            startIcon={<WhatsAppIcon/>}
            href={user ? whatsappLink : undefined}
          >
             
          </Button>
        )}
      </Box>
    </>
  );
};
