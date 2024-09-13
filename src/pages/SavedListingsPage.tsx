import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getSavedListings } from "../firebase/listings";
import { ListingTile } from "../components/ListingTile";
import { Box, Typography } from "@mui/material";
import { SavedListing } from "../components/SavedListing";
import { USER_ID } from "../firebase/firebaseConfig";

export const SavedListingsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getSavedListings"],
    queryFn: () => getSavedListings(USER_ID),
  });
  console.log("saved listing", data);
  return (
    <Box>
      <Typography sx={{ m: 2 }} fontWeight={"bold"}>
        {data?.length} saved listings
      </Typography>

      {!data?.length && <Typography>You have no saved listings</Typography>}
      {data?.map((listing) => (
        <SavedListing listingId={listing.listingId} docId={listing.docId} />
      ))}
    </Box>
  );
};
