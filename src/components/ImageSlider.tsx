import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImageWithLoading } from "./ImageWithLoading";
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
  previewUrls?: string[];
}
export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  listingId,
  userId,
  enablePagination,
  previewUrls,
}) => {
  const imgs = images?.map((image) => (
    <SwiperSlide
      style={{
        display: "flex",
        alignItems: "center",
      }}
      key={image + listingId}
    >
      <ImageWithLoading
        style={{ objectFit: "cover", objectPosition: "center" }}
        imageName={image}
        listingId={listingId}
        userId={userId}
      />
    </SwiperSlide>
  ));
  const previews = previewUrls?.map((image) => (
    <SwiperSlide
      style={{
        display: "flex",
        alignItems: "center",
      }}
      key={image + listingId}
    >
      <ImageWithLoading
        previewUrl={image}
        style={{ objectFit: "cover", objectPosition: "center" }}
        imageName={image}
        listingId={listingId}
        userId={userId}
      />
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
        pagination={true}
        style={{
          position: "relative",
          borderRadius: 12,
          zIndex: 0,
          height: "400px",
          width: "100%",
          overflow: "hidden",
          "--swiper-pagination-color": "white",
          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
        }}
      >
        <div>{previewUrls && previewUrls?.length > 0 ? previews : imgs}</div>
      </Swiper>
      {enablePagination && (
        <>
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
        </>
      )}
    </Box>
  );
};
