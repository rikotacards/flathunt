import React from "react";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";

import "./styles.css";
import { IListing } from "../firebase/types";

import { Link } from "react-router-dom";

import { useIsNarrow } from "../utils/useIsNarrow";
import { removeSavedListings, saveListing } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {
  BookmarkAddOutlined,
  BookmarkRemoveOutlined,
} from "@mui/icons-material";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { ContactFormNew } from "./ContactFormNew";
import { useQueryClient } from "@tanstack/react-query";
import { ImageSlider } from "./ImageSlider";
import { ListingTileInfo } from "./ListingTileInfo";

export const ListingTile: React.FC<IListing> = (props) => {
  const isNarrow = useIsNarrow();
  const [openContactForm, setOpenContactForm] = React.useState(false);
  const { user } = useAuthContext();
  const toggleContactForm = () => {
    setOpenContactForm(!openContactForm);
  };

  const onCloseContactForm = () => {
    setOpenContactForm(false);
  };
  const {
    netArea,
    price,
    savedDocId,
    address,
    bedrooms,
    images,
    listingId,
    userId,
    location,
    dateAdded,
    listingSpecificContact,
    desc,
    bathrooms,
    isSaved,
  } = props;
  const queryClient = useQueryClient();

  const s = useSnackbarContext();
  const userAgent = window.navigator.userAgent;
  const url = window.location.href;
  const onLogin = () => {
    if (userAgent.includes("Instagram")) {
      window.location.href = "x-safari-" + url;
      return;
    }
  };
  const onBookmark = async () => {
    try {
      if (!user) {
        s.setSnackbarChildComponent(
          <Alert
            variant="filled"
            sx={{ bgcolor: "grey.900" }}
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
      if (isSaved && savedDocId) {
        await removeSavedListings({
          userId: user?.uid || USER_ID,
          docId: savedDocId,
        });
        s.setSnackbarChildComponent(
          <Alert
            icon={<BookmarkRemoveOutlined />}
            sx={{ bgcolor: "grey.900" }}
            variant="filled"
          >
            Removed
          </Alert>
        );
        s.toggleSnackbar();
        queryClient.invalidateQueries({
          queryKey: ["getSavedListings"],
        });
      } else {
        await saveListing({ userId: user?.uid || USER_ID, listingId });
        s.setSnackbarChildComponent(
          <Alert
            icon={<BookmarkAddedIcon />}
            severity="success"
            variant="filled"
          >
            Listing saved
          </Alert>
        );
        s.toggleSnackbar();
        queryClient.invalidateQueries({
          queryKey: ["getSavedListings"],
          exact: true,
        });
      }
    } catch (e) {
      alert(e);
    }
  };
 
  const message = `Hi, I'm interested this flat:\n flathunt.co/listing/${listingId}
  \n${bedrooms} bedroom, \naddress: ${address}, ${location}, \nasking: ${price} HKD`;

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        id={listingId}
        sx={{
          background: "transparent",
          borderRadius: 4,
          position: "relative",
        }}
      >
        <Link
          style={{
            color: "inherit",
            textDecoration: "none",
            textDecorationColor: "transparent",
            zIndex: 1,
          }}
          to={`/listing/${listingId}`}
          target={isNarrow ? undefined : undefined}
          state={props}
        >
          <Box
            sx={{
              m: 0,
              position: "relative",
            }}
          >
          <ImageSlider images={images} listingId={listingId} userId={userId}/>
            
          </Box>
        </Link>
        <Box
        sx={{
          position: 'absolute', 
          top: 0, 
          right: 0,
          p:2
        }}
        >
        <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
          >
            {isSaved ? (
              <BookmarkIcon sx={{ color: "white" }} />
            ) : (
              <BookmarkAddOutlined sx={{ color: "white" }} />
            )}
          </IconButton>
        </Box>
        <Box
          position={"absolute"}
          sx={{
            zIndex: 1,
            bottom: 8,
            right: 8,
          }}
        >
        
          
            <Chip
              size={isNarrow ? "medium" : "small"}
              onClick={toggleContactForm}
              label="Contact"
              id={listingId + "contact"}
              variant="outlined"
              sx={{
                borderRadius: 10,
                color: "white",
                m: 1,
                fontWeight: "bold",
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            />

    
          
        </Box>
      </Box>
      
      <ListingTileInfo
        desc={desc}
        bathrooms={bathrooms}
        bedrooms={bedrooms}
        price={price}
        location={location}
        address={address}
        netArea={netArea}
        userId={userId}
        listingId={listingId}
      />
      <Drawer
        open={openContactForm}
        anchor="bottom"
        onClose={onCloseContactForm}
        PaperProps={{
          style: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        }}
      >
        <ContactFormNew
          message={message}
          listingSpecificContact={listingSpecificContact}
          listingOwnerUid={props.userId}
          onClose={onCloseContactForm}
          listingId={listingId}
          toggleForm={toggleContactForm}
        />
      </Drawer>
    </Box>
  );
};
