import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import {
  Box,
  Button,
  Card,
  Chip,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import { ListingImage } from "./ListingImage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";
import { IListing } from "../firebase/types";
import { Navigation } from "swiper/modules";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import { useIsNarrow } from "../utils/useIsNarrow";
import { saveListing } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { ContactForm } from "./ContactForm";
import { WhatsApp } from "@mui/icons-material";

export const ListingTile: React.FC<IListing> = (props) => {
  const isNarrow = useIsNarrow();
  const [openContactForm, setOpenContactForm] = React.useState(false);

  const toggleContactForm = () => {
    setOpenContactForm(!openContactForm);
  };
  const onCloseContactForm = () => {
    setOpenContactForm(false);
  };
  const {
    netArea,
    price,
    address,
    bedrooms,
    images,
    listingId,
    userId,
    location,
    dateAdded,
    listingSpecificContact,
    desc,
  } = props;
  const onLike = async () => {
    try {
      saveListing({ userId: USER_ID, listingId });
    } catch (e) {
      alert(e);
    }
  };
  const imgs = images?.map((image) => (
    <SwiperSlide
      style={{ height: "auto", width: "100%", maxHeight: "450px" }}
      key={image}
    >
      <ListingImage imageName={image} listingId={listingId} userId={userId} />
    </SwiperSlide>
  ));
  const message = `Hi, I'm interested this flat:\n flathunt.co/listing/${listingId}
  \n${bedrooms} bedroom, \naddress: ${address}, ${location}, \nasking: ${price} HKD`;

  return (
    <>
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
            <Swiper
              modules={[Navigation, Pagination]}
              // navigation
              pagination={true}
              style={{
                position: "relative",
                borderRadius: 16,
                zIndex: 0,
                overflow: "hidden",
                "--swiper-pagination-color": "white",
              }}
            >
              {imgs}
              {isNarrow && (
                <Card
                  elevation={0}
                  color=""
                  sx={{
                    position: "absolute",
                    top: 12,
                    zIndex: 1,
                    left: 1,
                    pl: 1,
                    pr: 1,
                    m: 1,
                    borderRadius: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItem: "flex-start",
                    background: "transparent",

                    pb: 1,
                  }}
                >
                  <Chip
                    size="medium"
                    variant="outlined"
                    label={
                      <Typography variant="caption" fontWeight={"bold"}>
                        {price} HKD
                      </Typography>
                    }
                    sx={{
                      display: "flex",
                      pl: 0,
                      alignItems: "center",
                      pr: 0,
                      mr: 0.5,
                      borderRadius: 5,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      color: "white",
                      backdropFilter: "blur(0px)",
                    }}
                  />

                  {location && (
                    <Chip
                      size="medium"
                      variant="outlined"
                      label={
                        <Typography variant="caption" fontWeight={"bold"}>
                          {location}
                        </Typography>
                      }
                      sx={{
                        display: "flex",
                        pl: 0,
                        alignItems: "center",
                        pr: 0,
                        mr: 0.5,
                        borderRadius: 5,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        color: "white",
                        backdropFilter: "blur(0px)",
                      }}
                    />
                  )}
                  <Chip
                    size="medium"
                    variant="outlined"
                    label={
                      <Typography variant="caption" fontWeight={"bold"}>
                        {netArea} sqft
                      </Typography>
                    }
                    sx={{
                      display: "flex",
                      pl: 0,
                      alignItems: "center",
                      pr: 0,
                      mr: 0.5,
                      borderRadius: 5,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      color: "white",
                      backdropFilter: "blur(0px)",
                    }}
                  />

                  <Chip
                    size="medium"
                    variant="outlined"
                    label={
                      <Typography variant="caption" fontWeight={"bold"}>
                        {bedrooms == 0 ? "Studio" : `${bedrooms} Br`}
                      </Typography>
                    }
                    sx={{
                      display: "flex",
                      pl: 0,
                      alignItems: "center",
                      pr: 0,
                      mr: 0.5,
                      borderRadius: 5,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      color: "white",
                      backdropFilter: "blur(0px)",
                    }}
                  />
                </Card>
              )}
            </Swiper>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {!isNarrow && (
                <Box
                  sx={{
                    ml: 0,
                    mt: 1,
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" fontWeight={"bold"}>
                      ${price} HKD
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      month
                    </Typography>
                  </div>
                  <Typography
                    sx={{ textTransform: "capitalize" }}
                    fontWeight={"bold"}
                    variant="body2"
                  >
                    {location}
                  </Typography>
                  <Typography variant="body2" fontWeight={"bold"}>
                    {netArea} sqft
                  </Typography>
                  <Typography variant="body2">{bedrooms} Bedroom</Typography>
                  <Typography variant="body2">{address}</Typography>
                  <Typography variant="body2">{dateAdded?.seconds}</Typography>
                </Box>
              )}
              {!isNarrow && (
                <Button
                  size="small"
                  sx={{
                    ml: "auto",
                    textTransform: "capitalize",
                    borderRadius: 5,
                    mt: 1,
                  }}
                  variant="outlined"
                >
                  contact
                </Button>
              )}
            </Box>
          </Box>
        </Link>

        <Box
          position={"absolute"}
          sx={{
            zIndex: 1,
            bottom: 8,
            right: 8,
          }}
        >
          <IconButton onClick={onLike}>
            <FavoriteBorderIcon sx={{ color: "white" }} />
          </IconButton>
          {isNarrow && (
            <Chip
              size="medium"
              label="Contact"
              variant="outlined"
              // icon={<WhatsApp/>}
              sx={{
                borderRadius: 10,
                color:'white',
                m:1,
                fontWeight:'bold',
                borderColor:'white',
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            />

            // <IconButton
            //   size="large"
            //   sx={{
            //     color: "white",
            //     backdropFilter:'blur(1px)',
                
            //   }}
            //   onClick={(e) => {
            //     toggleContactForm();
            //     e.stopPropagation();
            //   }}
            // >
            //   <WhatsApp />
            // </IconButton>
          )}
        </Box>
      </Box>
      {!!desc && (
        <Box
          sx={{
            mb: 0,
            textAlign: "left",
            mt: 1,
            display: "flex",
            ml: 1,
            mr: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              textAlign: "left",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            variant="body2"
          >
            {desc}
          </Typography>
        </Box>
      )}
      <Drawer
        open={openContactForm}
        anchor="bottom"
        onClose={onCloseContactForm}
      >
        <ContactForm
          message={message}
          listingSpecificContact={listingSpecificContact}
          listingOwnerUid={props.userId}
          onClose={onCloseContactForm}
          listingId={listingId}
        />
      </Drawer>
    </>
  );
};
