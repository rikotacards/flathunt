import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ListingImage } from "./ListingImage";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
interface ImageSliderProps {
  images: string[];
  listingId: string;
  userId: string;
  enablePagination?: boolean;
}
export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  listingId,
  userId,
  enablePagination,
}) => {
  const imgs = images?.map((image) => (
    <SwiperSlide
      style={{
        // height: "auto",
        height: 450,
        width: "100%",
        // maxHeight: "450px",
      }}
      key={image + listingId}
    >
      <ListingImage imageName={image} listingId={listingId} userId={userId} />
    </SwiperSlide>
  ));
  if (!listingId) {
    return;
  }
  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={
          enablePagination
            ? {
                nextEl: `.H${listingId}swiper-button-next`,
                prevEl: `.H${listingId}swiper-button-prev`,
              }
            : undefined
        }
        pagination={enablePagination}
        style={{
          position: "relative",
          borderRadius: 12,

          zIndex: 0,
          overflow: "hidden",
          "--swiper-pagination-color": "white",
          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
        }}
      >
        {imgs}
      </Swiper>
      <IconButton
        onClick={(e) => e.stopPropagation()}
        size="small"
        color="inherit"
        sx={{
          position: "absolute",
          top: "50%",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.5)",
          m: 1,
        }}
        className={`H${listingId}swiper-button-prev`}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={(e) => e.stopPropagation()}
        size="small"
        color="inherit"
        sx={{
          right: 0,
          position: "absolute",
          top: "50%",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.5)",
          m: 1,
        }}
        className={`H${listingId}swiper-button-next`}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
