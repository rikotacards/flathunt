import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ListingImage } from './ListingImage';
import { Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
interface ImageSliderProps {
    images: string[];
    listingId: string;
    userId: string;
}
export const ImageSlider: React.FC<ImageSliderProps> = ({images, listingId, userId}) => {
    const imgs = images?.map((image) => (
        <SwiperSlide
          style={{
            // height: "auto",
            height: 450,
            width: "100%",
            // maxHeight: "450px",
          }}
          key={image}
        >
          <ListingImage imageName={image} listingId={listingId} userId={userId} />
        </SwiperSlide>
      ));
    return (
        <Swiper
        modules={[Navigation, Pagination]}
        // navigation
        pagination={true}
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
    )
}