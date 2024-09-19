import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import React from "react";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import { IListing } from "../firebase/types";
import { ListingImage } from "./ListingImage";
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
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { auth, USER_ID } from "../firebase/firebaseConfig";
import {
  getSavedListings,
  removeSavedListings,
  saveListing,
} from "../firebase/listings";
import {
  Bookmark,
  BookmarkAddOutlined,
  BookmarkRemoveOutlined,
  ChevronLeft,
  DirectionsSubwayFilledOutlined,
  InsertLink,
  PlaceOutlined,
  ShowerOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { copy } from "../utils/copy";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ContactFormNew } from "./ContactFormNew";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useQuery, useQueryClient } from "@tanstack/react-query";
export const ListingVerticalLayout: React.FC<IListing> = (props) => {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuthContext();
  const nav = useNavigate();
  const enableSwipe = true;
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
    listingSpecificLicenseNumber,
    licenseNumber,
    desc,
  } = props;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const s = useSnackbarContext();
  const { data: savedListingsData, isLoading: isLoadingSavedListings } =
    useQuery({
      queryKey: ["getSavedListings"],
      queryFn: () => (!user ? [] : getSavedListings(user?.uid)),
    });
  const isBookmarked = savedListingsData?.some(
    (e) => e.listingId === listingId
  );
  const imgs = images?.map((image) => (
    <SwiperSlide
      style={{ height: "auto", width: "100%", maxHeight: "450px" }}
      key={image}
    >
      <ListingImage imageName={image} listingId={listingId} userId={userId} />
    </SwiperSlide>
  ));
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
  const queryClient = useQueryClient();

  const onSaveListing = async () => {
    try {
      if (!user) {
        s.setSnackbarChildComponent(
          <Alert
            action={<Button onClick={onLogin}>Login</Button>}
            icon={<BookmarkAddOutlined />}
            severity="info"
          >
            Login to save.
          </Alert>
        );
        s.toggleSnackbar();
        return;
      }

      isBookmarked
        ? await removeSavedListings({ userId, docId: listingId })
        : await saveListing({ userId: user?.uid || "", listingId });
      s.setSnackbarChildComponent(
        <Alert
          icon={
            isBookmarked ? <BookmarkRemoveOutlined /> : <BookmarkAddOutlined />
          }
          severity="success"
        >
          {isBookmarked ? "Removed" : "Saved"}
        </Alert>
      );
      s.toggleSnackbar();
      queryClient.invalidateQueries({
        queryKey: ["getSavedListings"],
        exact: true,
      });
    } catch (e) {
      alert(e);
    }
  };

  const imgWithoutGrid = images?.map((image, i) => (
    <Box
      key={image}
      sx={{
        mb: 0.5,
        maxWidth: "600px",
        justifyContent: "center",
        display: "flex",
      }}
    >
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
      {!enableSwipe && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 5,
              overflow: "hidden",
              maxHeight:'500px',
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
      )}
      {enableSwipe && (
        <Swiper
          modules={[Navigation, Pagination]}
          // navigation
          pagination={true}
          style={{
            position: "relative",
            borderRadius: 16,
            zIndex: 0,
            height:'auto',
            overflow: "hidden",
            boxShadow:
              "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
            "--swiper-pagination-color": "white",
          }}
        >
          {imgs}
          <Button
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              zIndex: 3,
              color: "white",
              p: 2,
              textTransform: "capitalize",
            }}
            onClick={handleClickOpen}
            size="small"
          >
            View all
          </Button>
        </Swiper>
      )}
      {!!desc && <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
          textAlign: "left",
          p: 2,
          mt: 1,
        }}
      >
      {  <Typography fontWeight={500} variant="body2">
          {desc}
        </Typography>}
      </Card>}
      <Box
        component={Paper}
        elevation={0}
        sx={{
          p: 2,
          pt: 1,
          borderRadius: 3,
          textAlign: "left",
          m: 0,
          mt: 1,

          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          <DirectionsSubwayFilledOutlined />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {location}
          </Typography>
        </Box>
        <Divider />
        {!!address && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
              <PlaceOutlined />
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                {address}
              </Typography>
            </Box>
            <Divider />
          </>
        )}
        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          <HotelOutlinedIcon />
          <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
            {bedrooms} bedrooms
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          <ShowerOutlined />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {bathrooms} bathroom(s)
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          <SquareFootOutlinedIcon />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            {netArea} sqft (net)
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}>
          <Box sx={{ display: "flex", alignSelf: "flex-start" }}>
            <StoreOutlinedIcon />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography variant="caption">Real Estate Company</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {listingSpecificRealEstateCompany || realEstateCompany}
            </Typography>
            <Typography sx={{ mt: 1 }} variant="caption">
              License Number
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {listingSpecificLicenseNumber || licenseNumber}
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
            <Typography fontWeight={"600"} variant="body2" color="textPrimary">
              {price}HKD / month
            </Typography>
          </Box>

          <IconButton
            onClick={() => onShare(listingId)}
            sx={{ ml: "auto", mb: 0.5, transform: "rotate(-45deg)" }}
          >
            <InsertLink />
          </IconButton>

          <IconButton sx={{ ml: 1 }} onClick={onSaveListing}>
            {isBookmarked ? <Bookmark /> : <BookmarkAddOutlined />}
          </IconButton>
          <Button
            onClick={toggleContactForm}
            variant="contained"
            sx={{ ml: 1, textTransform: "capitalize" }}
          >
            Message
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <Toolbar>
          <Button sx={{ ml: "auto" }} onClick={handleClose}>
            Close
          </Button>
        </Toolbar>
        <Box
          sx={{
            overflowY: "auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {imgWithoutGrid}
        </Box>
      </Dialog>

      <Drawer
        open={openContactForm}
        anchor="bottom"
        onClose={() => setOpenContactForm(false)}
        PaperProps={{
          style: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        }}
      >
        <ContactFormNew
          onClose={() => setOpenContactForm(false)}
          listingId={listingId}
          listingOwnerUid={userId}
          listingSpecificContact={listingSpecificContact}
        />
      </Drawer>
    </Box>
  );
};
