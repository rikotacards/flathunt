import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Drawer,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
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
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useIsNarrow } from "../utils/useIsNarrow";
import { addContactRequest, saveListing } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { ContactForm } from "./ContactForm";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../firebase/user";
export const ListingTile: React.FC<IListing> = (props) => {
  const isNarrow = useIsNarrow();
  const [number, setNumber] = React.useState("");
  const [openContactForm, setOpenContactForm] = React.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(props.userId || ""),
  });
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
  } = props;
  const onLike = async () => {
    try {
      saveListing({ userId: USER_ID, listingId });
    } catch (e) {
      alert(e);
    }
  };
  const ref = React.useRef<HTMLElement | null>(null);
  const imgs = images?.map((image) => (
    <SwiperSlide style={{ height: "auto", width: "100%" }} key={image}>
      <ListingImage imageName={image} listingId={listingId} userId={userId} />
    </SwiperSlide>
  ));
  const scroll = React.useCallback(() => {
    alert(ref?.current.id);
    ref.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, []);
  return (
    <div id={listingId} ref={ref}>
      <Card
        elevation={isNarrow ? 5 : 0}
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
            {/* <IconButton
              sx={{
                zIndex: 1,
                position: "absolute",
                top: 16,
                right: 8,
              }}
              onClick={onLike}
            >
              <FavoriteBorderIcon sx={{ color: "white" }} />
            </IconButton> */}

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
                  {!!bedrooms && (
                    <Chip
                      size="medium"
                      variant="outlined"
                      label={
                        <Typography variant="caption" fontWeight={"bold"}>
                          {bedrooms} br
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
          {isNarrow && (
            <IconButton
              size="large"
              sx={{
                borderRadius: 10,
                color: "white",
              }}
              onClick={(e) => {
                toggleContactForm();
                e.stopPropagation();
              }}
            >
              <ForumIcon />
            </IconButton>
          )}
        </Box>
      </Card>
      <Drawer
        keepMounted
        open={openContactForm}
        anchor="bottom"
        onClose={onCloseContactForm}
      >
        <ContactForm
          listingOwnerUid={props.userId}
          toggle={toggleContactForm}
          onClose={onCloseContactForm}
          listingId={listingId}
        />
      </Drawer>
    </div>
  );
};
