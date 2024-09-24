import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";

export const AddListingIntro: React.FC = () => {
  return (
    <Box elevation={0} component={Paper} sx={{ p: 2 }}>
      <Typography sx={{mb:1}} fontWeight={"bold"} variant="h3" color="textPrimary">
        It's Easy to create a listing.
      </Typography>
      <Typography>1. tell us bit about this listing</Typography>
      <Typography>2. Make it stand out</Typography>
      <Typography>3. Add Photos and publish</Typography>
    </Box>
  );
};

