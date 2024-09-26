import {
  KeyboardArrowDown,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";
import {
  Toolbar,
  Typography,
  IconButton,
  Box,
  Card,
  Button,
  Alert,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import React from "react";
import { auth, USER_ID } from "../firebase/firebaseConfig";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { addUser, getUser } from "../firebase/user";
import {  GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {  useNavigate } from "react-router-dom";
interface ContactFormNewProps {
  listingId: string;
  listingOwnerUid: string;
  message?: string;
  listingSpecificContact?: string;
  toggleForm: () => void;
  onClose: () => void;
}
export const ContactFormNew: React.FC<ContactFormNewProps> = ({
  listingId,
  listingOwnerUid,
  message,
  listingSpecificContact,
  toggleForm,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const s = useSnackbarContext();
  const nav = useNavigate();
  const { data: listingOwnerData, isLoading , isFetching} = useQuery({
    queryKey: ["listingId"],
    queryFn: () => getUser(listingOwnerUid || ""),
  });
  const { data: myData, isLoading: isMyDataLoading } = useQuery({
    queryKey: ["getMyUserInfo"],
    queryFn: () => getUser(user?.uid || ""),
  });
  const { user, isUserLoading } = useAuthContext();
  const [number, setNumber] = React.useState<string | undefined>();

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["getListingOwner"],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: ["getMyUserInfo"],
      exact: true,
    });

    setNumber(myData?.contactNumber);
  }, [isMyDataLoading, myData?.contactNumber]);
  const provider = new GoogleAuthProvider();

  const fallback = `I'm interested this flat \n flathunt.co/listing/${listingId}}?utm_source=whatsapp&utm_medium=whatsapp&id=${listingOwnerUid}&listing=${listingId} hihi`;
  const whatsappLink = `whatsapp://send?phone=${listingSpecificContact || listingOwnerData?.contactNumber}&text=${message || fallback}`;
  const userAgent = window.navigator.userAgent;
  const url = window.location.href;
  const onSignIn = async () => {
    if (userAgent.includes("Instagram")) {
      window.location.href = "x-safari-" + url;
      return;
    }
    try {
      const res = await signInWithPopup(auth, provider);
      const user = await getUser(res.user.uid);
      if (!user) {
        await addUser({ userId: res.user.uid });
      }
      document
        .getElementById(listingId)
        ?.scrollIntoView({ block: "center", behavior: "instant" });
      // toggleForm();
      // document.getElementById(listingId + "contact")?.click();
    } catch (e) {}
  };
  const onMessage = () => {
    if (!number) {
      s.setSnackbarChildComponent(
        <Alert severity="error">Whatsapp number required</Alert>
      );
      s.toggleSnackbar();
      return;
    }
    if (!myData?.contactNumber) {
      user?.uid && addUser({ userId: user?.uid, contactNumber: number });
    }
    document
      .getElementById(listingId)
      ?.scrollIntoView({ block: "center", behavior: "instant" });
    window.open(whatsappLink, "_top");
    s.setSnackbarChildComponent(
      <Alert
        icon={<WhatsAppIcon />}
        variant="filled"
        sx={{ width: "100%" }}
        severity="success"
      >
        Opening Whatsapp
      </Alert>
    );
    s.toggleSnackbar();
  };
  return (
    <Box>
      <Toolbar sx={{ textAlign: "center", display: "flex" }}>
        <Box sx={{ display: "flex", flexBasis: 1, flexGrow: 1 }} />
        <Typography
          fontWeight={"bold"}
          sx={{ flexBasis: 1, display: "flex", flexGrow: 1 }}
        >
          Contact Agent
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            flexBasis: 1,
            display: "flex",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
          color="inherit"
        >
          <KeyboardArrowDown />
        </IconButton>
      </Toolbar>
      <Box sx={{ p: 1 }}>
        {user && (
          <OutlinedInput
            value={number}
            fullWidth
            type='tel'
            disabled={!!myData?.contactNumber}
            sx={{ mt: 1, mb: 1 }}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Your whatsapp number"
            startAdornment={(isLoading || isFetching || isUserLoading) ? <Box sx={{display: 'flex'}}><CircularProgress size={20} /></Box> : null }
            endAdornment={<Button disabled={!myData?.contactNumber} onClick={() => nav("/profile")}>Edit</Button>}
          />
        )}
        {user && (
          <Card variant="outlined" sx={{ p: 1, mt: 0, mb: 1 }}>
            <Typography color="textSecondary">
              Your contact will be sent to the agent. The agent will reach out
              to you as soon as possible. In addition, your contact will be
              saved for future agent requests.
            </Typography>
          </Card>
        )}
        {!user ? (
          <Button
            sx={{ textTransform: "capitalize" }}
            size="large"
            fullWidth
            variant="contained"
            onClick={onSignIn}
          >
            Sign In with Google to message
          </Button>
        ) : (
          <Button
            startIcon={<WhatsAppIcon />}
            fullWidth
            variant="contained"
            onClick={onMessage}
          >
            Message
          </Button>
        )}
      </Box>
    </Box>
  );
};
