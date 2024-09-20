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
import { useIsNarrow } from "../utils/useIsNarrow";
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
      style={{
        height: "100%",
        width: "100%",
        // minHeight: "450px"
      }}
      key={image}
    >
      <ListingImage imageName={image} listingId={listingId} userId={userId} />
    </SwiperSlide>
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
  const isNarrow = useIsNarrow();
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
    <Box
      sx={{
        p: 2,
        position: "relative",
        mt: 1,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: isNarrow ? "column" : "row" }}>
        <Box
          sx={{
            display: "flex",
            flexGrow: 2,
            flexShrink: 0,
            flexBasis: 1,
          }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            // navigation
            pagination={true}
            style={{
              position: "relative",
              zIndex: 0,
              maxWidth: "500px",
              borderRadius: 16,
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
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            flexBasis: 1,
            flexShrink: 0,
            display: "flex",
            flexDirection: isNarrow ? "column" : "column",
          }}
        >
          {!!desc && (
            <Box
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 3,
                boxShadow:
                  "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
                textAlign: "left",
                p: 2,
                mt: 1,
                flexDirection: "column",
                display: "flex",
              }}
            >
              <Typography fontWeight={500} variant="body2">
                {desc}
              </Typography>
            </Box>
          )}
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
                <Box
                  sx={{ display: "flex", alignItems: "center", pt: 2, pb: 2 }}
                >
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
          <Card
            sx={{
              display: "flex",
              p: 1,
              justifyContent: "space-around",
              borderRadius: 3,
              mt:1,
              boxShadow:
              "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
            }}
          >
            <IconButton
              onClick={() => onShare(listingId)}
              sx={{ mb: 0.5, transform: "rotate(-45deg)" }}
            >
              <InsertLink />
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={onSaveListing}>
              {isBookmarked ? <Bookmark /> : <BookmarkAddOutlined />}
            </IconButton>
            <Button
              onClick={toggleContactForm}
              variant="contained"
              fullWidth
              sx={{ ml: 1, textTransform: "capitalize" }}
            >
              Message
            </Button>
          </Card>
        </Box>
      </Box>
      <Toolbar />
      <AppBar
        position="fixed"
        elevation={10}
        sx={{
          top: "auto",
          bottom: 0,
          background: "white",
          height: isNarrow ? undefined : 0,
        }}
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
