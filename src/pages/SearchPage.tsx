import {
  Box,
  Chip,
  CircularProgress,
  Drawer,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListingTile } from "../components/ListingTile";
import {
  getAllListings,
  getAllListingsNoFilters,
  getSavedListings,
} from "../firebase/listings";
import Grid from "@mui/material/Grid2";
import {
  useAppBarContext,
  useAuthContext,
  useFilterContext,
} from "../Providers/contextHooks";
import { useIsNarrow } from "../utils/useIsNarrow";
import { ListingTileSkeleton } from "../components/ListingTileSkeleton";

import { SignInPopup } from "../components/SignInPopup";
import { SearchBar } from "../components/SearchBar";
import { USER_ID } from "../firebase/firebaseConfig";
import { ListingGrid } from "../components/ListingGrid";
export const SearchPage: React.FC = () => {
  const { setFilters } = useFilterContext();
  const queryClient = useQueryClient();
  const { user, isUserLoading } = useAuthContext();
  const { setAppBarChildComponent } = useAppBarContext();
  const isNarrow = useIsNarrow();
  React.useEffect(() => {
    setAppBarChildComponent(<SearchBar />);
    setFilters({});
    queryClient.clear();
  }, []);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["getAllListingsNoFilters"],
    queryFn: () => getAllListingsNoFilters(),
  });
  const { data: savedListingsData } = useQuery({
    queryKey: ["getSavedListings"],
    queryFn: () => getSavedListings(user?.uid || ""),
  });
  const savedListingsTransformed: { [key: string]: string } = {};
  savedListingsData?.forEach((listing) => {
    savedListingsTransformed[listing.listingId] = listing.docId;
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        mt: 0,
        p: 2,
      }}
    >
      <ListingGrid
        isLoading={isLoading}
        data={data}
        savedListingsTransformed={savedListingsTransformed}
      />

      {isNarrow && !isUserLoading && !user && <SignInPopup />}
    </Box>
  );
};
