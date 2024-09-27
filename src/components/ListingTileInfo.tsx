
import { NumericFormat } from 'react-number-format';

import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { IListing } from "../firebase/types";
import { useAuthContext } from "../Providers/contextHooks";
import { ListingTileControlsAdmin } from "./ListingTileControlsAdmin";
import { useLocation } from "react-router";

export const ListingTileInfo: React.FC<Partial<IListing>> = ({
  netArea,
  location,
  address,
  price,
  desc,
  bedrooms,
  bathrooms,
  userId,
  isDirectListing,
  listingId,
  hasSecurity,
  hasBalcony,
  hasWalkup,
  hasRooftop,
}) => {
  const { user } = useAuthContext();
  const isOwner = user?.uid === userId;
  const path = useLocation();
  const isMyListingPage = path.pathname === '/listings'
  if (!listingId) {
    return null;
  }
  return (
    <>
      {isMyListingPage && isOwner && <ListingTileControlsAdmin 
      listingId={listingId} />}
      <Box sx={{ textAlign: "left", mt: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            mb: 0.5,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <Typography
            fontWeight={"bold"}
            sx={{ textTransform: "capitalize" }}
            variant="body2"
          >
            {location} {"\u2022"}
          </Typography>

          <Typography
            fontWeight={"bold"}
            variant="body2"
            sx={{ ml: 0.5, overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {address}
          </Typography>
        </Box>
      </Box>
      {!!desc && (
        <Box
          sx={{
            mb: 0.5,
            textAlign: "left",
            mt: 0,
            display: "flex",
            ml: 0,
            mr: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              textAlign: "left",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              // fontSize: '1rem'
            }}
            color="textSecondary"
            variant="body2"
          >
            {desc}
          </Typography>
        </Box>
      )}
      {!!desc && (
        <Box
          sx={{
            mb: 0.5,
            textAlign: "left",
            mt: 0,
            display: "flex",
            ml: 0,
            mr: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              textAlign: "left",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              // fontSize: '1rem'
            }}
            color="textSecondary"
            variant="body2"
          >
            {hasBalcony ? 'Balcony ': null}
            {hasSecurity ? 'Security ': null}
            {hasWalkup ? 'Walkup ': null}
            {hasRooftop ? 'Rooftop': null}


          </Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", whiteSpace: "nowrap" }}>
        <Typography
          color="textSecondary"
          sx={{ textTransform: "capitalize", mr: 0 }}
          variant="body2"
        >
          {netArea} sqft {"\u2022"}
        </Typography>

        <Typography color="textSecondary" sx={{ mr: 0 }} variant="body2">
          {bedrooms === 0 ? "Studio" : bedrooms + " bedrooms"} {"\u2022"}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {bathrooms} bathrooms
        </Typography>
      </Box>
      <Box sx={{ display: "flex", mt: 0.5 , alignItems: 'center'}}>
        <Typography fontWeight={800}><NumericFormat value={price} prefix='$' suffix=' HKD' thousandSeparator=',' displayType='text'/></Typography>
        <Typography fontWeight={500} sx={{ ml: 0.5 }}>
          month
        </Typography>
        {isDirectListing && <Typography fontWeight={'bold'} color='textSecondary' variant='caption' sx={{ml: 1}}>No agency fee</Typography>}
      </Box>
    </>
  );
};
