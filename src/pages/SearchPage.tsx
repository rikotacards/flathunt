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
import { SearchbarNarrow2 } from "../components/SearchbarNarrow2";
import { USER_ID } from "../firebase/firebaseConfig";
export const SearchPage: React.FC = () => {
  const { setFilters } = useFilterContext();
  const queryClient = useQueryClient();
  const { user, isUserLoading } = useAuthContext();
  const { setAppBarChildComponent } = useAppBarContext();
  const isNarrow = useIsNarrow();
  React.useEffect(() => {
    setAppBarChildComponent(<SearchbarNarrow2 />);
    setFilters({});
    queryClient.clear();
  }, []);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["getAllListingsNoFilters"],
    queryFn: () => getAllListingsNoFilters(),
  });
  const { data: savedListingsData } = useQuery({
    queryKey: ["getSavedListings"],
    queryFn: () => getSavedListings(user?.uid || ''),
  });
  const savedListingsTransformed: {[key: string]: string} = {}
  savedListingsData?.forEach((listing) => {
    savedListingsTransformed[listing.listingId] = listing.docId
  })

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
      <Grid
        sx={{ mt: 1 }}
        container
        spacing={{ xs: 2, md: 3, lg: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((l) => (
              <Grid size={{ lg: 3, md: 4, xs: 4 }} key={l}>
                <ListingTileSkeleton />
              </Grid>
            ))
          : data?.map((l) => {
              const savedDocId = savedListingsTransformed[l.listingId]

              return (
                <Grid key={l.listingId} size={{ lg: 3, md: 4, xs: 4 }}>
                  <ListingTile savedDocId={savedDocId} isSaved={!!savedDocId} {...l} />
                </Grid>
              );
            })}
      </Grid>

      {isNarrow && !isUserLoading && !user && <SignInPopup />}
    </Box>
  );
};
