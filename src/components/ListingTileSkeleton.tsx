import { Box, Skeleton } from "@mui/material";
import React from "react";

export const ListingTileSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        borderRadius:5,
        flexDirection: "column",
        alignItem: "center",
      }}
    >
      {/* <Skeleton
        sx={{ borderRadius: 10, position: 'absolute' }}
        height={"25px"}
        width={"100px"}
        variant="rectangular"
      /> */}

      <Skeleton
        sx={{ borderRadius: 5, 
            bgcolor: "grey.400",

         }}
        height={"450px"}
        width={"100%"}
        variant="rectangular"
      />
    </Box>
  );
};
