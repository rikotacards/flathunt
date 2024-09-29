import { Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import React from "react";

interface ListingImages {
  userId: string;
  listingId: string;
  imageUrl: string;
  style?: React.CSSProperties;
  previewUrl?: string;
}
export const ImageWithCloudinary: React.FC<ListingImages> = ({
  style,
  imageUrl,
  previewUrl,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(!!previewUrl ? true : false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  const optimizedImageUrl = imageUrl.split('/upload')
  const newone = [optimizedImageUrl[0], '/upload', '/q_auto,f_auto', optimizedImageUrl[1]].join('')
  return (
    <>
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: 3 }}
          height="450px"
          width="100%"
        />
      )}
      <img
        style={{
          ...style,
          objectFit: "cover",
          // display: isLoaded ? "block" : "none",
          height:'100%',
          width: '100%',
          
          // height: 'auto'
        }}
        onLoad={handleImageLoad}
        src={previewUrl || newone}
      />
    </>
  );
};
