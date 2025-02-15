import { Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import React from "react";

interface ListingImages {
  userId: string;
  listingId: string;
  imageName: string;
  style?: React.CSSProperties;
  previewUrl?: string;
}
export const ImageWithLoading: React.FC<ListingImages> = ({
  userId,
  style,
  listingId,
  imageName,
  previewUrl,
}) => {
  const storage = getStorage();
  const imageRef = ref(storage, `${userId}/${listingId}/${imageName}`);
  const [isLoaded, setIsLoaded] = React.useState(!!previewUrl ? true : false);

  const { data } = useQuery({
    queryKey: [imageName],
    queryFn: () => !!previewUrl ? ({}) :getDownloadURL(imageRef),
  });
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
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
          display: isLoaded ? "block" : "none",
          height:'100%',
          width: '100%',
          // height: 'auto'
        }}
        onLoad={handleImageLoad}
        src={previewUrl || data}
      />
    </>
  );
};
