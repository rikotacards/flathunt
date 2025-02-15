import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getSavedListings } from "../firebase/listings";
import { ListingTile } from "../components/ListingTile";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { SavedListing } from "../components/SavedListing";
import { USER_ID } from "../firebase/firebaseConfig";
import { useAppBarContext, useAuthContext } from "../Providers/contextHooks";
import { ChevronLeft } from "@mui/icons-material";
import { useNavigate } from "react-router";
const SavedListingAppBar: React.FC = () => {
  const nav = useNavigate();
  const goBack = () => nav(-1);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* <IconButton onClick={goBack}>
        <ChevronLeft />
      </IconButton> */}
      <Typography fontWeight={"bold"} color="textPrimary">
        Saved listings
      </Typography>
    </Box>
  );
};
export const SavedListingsPage: React.FC = () => {
  const { user, isUserLoading } = useAuthContext();
  const { setAppBarChildComponent } = useAppBarContext();

  const { data, isLoading } = useQuery({
    queryKey: ["getSavedListings", isUserLoading],
    queryFn: () => (!user ? [] : getSavedListings(user?.uid)),
  });

  React.useEffect(() => {
    setAppBarChildComponent(<SavedListingAppBar />);
  }, []);
  if (isLoading || isUserLoading) {
    return <LinearProgress />;
  }
  return (
    <Box>
      {data?.map((savedListing) => {
        return (
          <SavedListing
            docId={savedListing.docId}
            listingId={savedListing.listingId}
          />
        );
      })}
    </Box>
  );
};
