import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import React from "react";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import { IListing } from "../firebase/types";
import { ListingImage } from "./ListingImage";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShowerIcon from "@mui/icons-material/Shower";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { auth, USER_ID } from "../firebase/firebaseConfig";
import { addContactRequest, saveListing } from "../firebase/listings";
import {
  ChevronLeft,
  DirectionsSubwayFilledOutlined,
  InsertLink,
  KeyboardArrowDownOutlined,
  PlaceOutlined,
  ShowerOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { serverTimestamp } from "firebase/firestore";
import ForumIcon from "@mui/icons-material/Forum";
import PlaceIcon from "@mui/icons-material/Place";
import IosShareIcon from "@mui/icons-material/IosShare";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import { ContactForm } from "./ContactForm";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { copy } from "../utils/copy";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
export const ListingVerticalLayout: React.FC<IListing> = (props) => {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuthContext();
  const nav = useNavigate();
  const [number, setNumber] = React.useState("");
  const [openContactForm, setOpenContactForm] = React.useState(false);
  const toggleContactForm = () => {
    setOpenContactForm(!openContactForm);
  };
  const {
    netArea,
    address,
    price,
    images,
    listingId,
    userId,
    bathrooms,
    bedrooms,
    location,
    listingSpecificContact,
    realEstateCompany,
    listingSpecificRealEstateCompany,
  } = props;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const s = useSnackbarContext();

  const photos = images?.map((image) => (
    <ListingImage
      key={image}
      imageName={image}
      listingId={listingId}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: 16,
        marginBottom: 8,
      }}
      userId={userId}
    />
  ));

  const handleClose = () => {
    setOpen(false);
  };
  const provider = new GoogleAuthProvider();

  const onLogin = async () => {
    await signInWithPopup(auth, provider);
  };
  const onShare = (listingId: string) => {
    copy(`flathunt.co/listing/${listingId}`);
    s.setSnackbarChildComponent(
      <Alert icon={<InsertLink />}>Link copied!</Alert>
    );
    s.toggleSnackbar();
  };
  const onSaveListing = async () => {
    try {
      if (!user) {
        s.setSnackbarChildComponent(
          <Alert
            action={<Button onClick={onLogin}>Login</Button>}
            icon={<FavoriteBorderIcon />}
            severity="info"
          >
            Login to save.
          </Alert>
        );
        s.toggleSnackbar();
        return;
      }
      await saveListing({ userId: user?.uid || "", listingId });
      s.setSnackbarChildComponent(
        <Alert icon={<FavoriteBorderIcon />} severity="success">
          Saved
        </Alert>
      );
      s.toggleSnackbar();
    } catch (e) {
      alert(e);
    }
  };

  const imgWithoutGrid = images?.map((image, i) => (
    <Box sx={{ mb: 0.5 }}>
      <ListingImage
        key={image}
        imageName={image}
        listingId={listingId}
        style={{ width: "100%", height: "auto" }}
        userId={userId}
      />
    </Box>
  ));

  return (
    <Box sx={{ maxWidth: "400px", position: "relative", mt: 1 }}>
      <meta content={`${price}`} property="og:price" />
      <IconButton
        size="small"
        onClick={() => nav(-1)}
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          position: "fixed",
          color: "white",
          top: 16,
          left: 16,
          zIndex: 999,

          backdropFilter: "blur(10px)",
          border: "1px solid white",
        }}
      >
        <ChevronLeft />
      </IconButton>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 5,
            overflow: "hidden",
            // maxHeight:'500px',
          }}
        >
          {photos}
        </Box>

        {photos?.length > 1 && (
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={handleClickOpen}
            sx={{
              backdropFilter: "blur(10px)",
              position: "absolute",
              right: 16,
              bottom: 32,
              color: "white",
            }}
          >
            Show all photos
          </Button>
        )}
      </Box>

      <Box
        component={Paper}
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 5,
          textAlign: "left",
          m: 0,

          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
          <DirectionsSubwayFilledOutlined />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {location}
          </Typography>
        </Box>
        <Divider />
        {!!address && (
          <>
            <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
              <PlaceOutlined />
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                {address}
              </Typography>
            </Box>
            <Divider />
          </>
        )}
        <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
          <HotelOutlinedIcon />
          <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
            {bedrooms} bedrooms
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
          <ShowerOutlined />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {bathrooms} bathroom(s)
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
          <SquareFootOutlinedIcon />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {netArea} sqft (net)
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
          <StoreOutlinedIcon />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography variant="caption">Real Estate Company</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {listingSpecificRealEstateCompany || realEstateCompany}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Toolbar />
      <AppBar
        position="fixed"
        elevation={10}
        sx={{ top: "auto", bottom: 0, background: "white" }}
      >
        <Toolbar>
          <Box sx={{ textAlign: "left" }}>
            <Typography fontWeight={"600"} color="textPrimary">
              {price}HKD / month{" "}
            </Typography>
          </Box>

          <IconButton
            onClick={() => onShare(listingId)}
            sx={{ ml: "auto", mb: 0.5 }}
          >
            <IosShareIcon />
          </IconButton>

          <IconButton sx={{ ml: 1 }} onClick={onSaveListing}>
            <FavoriteBorderIcon />
          </IconButton>
          <Button
            onClick={toggleContactForm}
            variant="contained"
            sx={{ ml: 1 }}
          >
            Message
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <Box sx={{ overflowY: "scroll", position: "relative" }}>
          <Box sx={{ position: "sticky", top: 16, right: 16 }}>
            <Button sx={{ color: "white" }} onClick={handleClose}>
              close
            </Button>
          </Box>

          {imgWithoutGrid}
        </Box>
      </Dialog>

      <Drawer
        open={openContactForm}
        anchor="bottom"
        onClose={() => setOpenContactForm(false)}
      >
        <ContactForm
          onClose={() => setOpenContactForm(false)}
          listingId={listingId}
          listingOwnerUid={userId}
          listingSpecificContact={listingSpecificContact}
        />
      </Drawer>
    </Box>
  );
};
