import { Box, Chip, CircularProgress, Drawer, Skeleton, Typography } from "@mui/material";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListingTile } from "../components/ListingTile";
import { getAllListings, getAllListingsNoFilters } from "../firebase/listings";
import Grid from "@mui/material/Grid2";
import { useAuthContext, useFilterContext } from "../Providers/contextHooks";
import { SearchBarWide } from "../components/SearchBarWide";
import { useIsNarrow } from "../utils/useIsNarrow";
import { ListingTileSkeleton } from "../components/ListingTileSkeleton";
import { SignInWithGoogle } from "../components/SignInWithGoogle";
import { getAuth } from "firebase/auth";
import { SignInPopup } from "../components/SignInPopup";
export const SearchPage: React.FC = () => {
  const { setFilters } = useFilterContext();
  const queryClient = useQueryClient();
  const auth = getAuth()
  console.log('AUTH', auth)
  const {user, isUserLoading} = useAuthContext()
  console.log('user', user)
  const isNarrow = useIsNarrow();
  React.useEffect(() => {
    setFilters({});
    queryClient.clear();
  }, []);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["getAllListingsNoFilters"],
    queryFn: () => getAllListingsNoFilters(),
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
      {!isNarrow && <SearchBarWide />}
      <Grid
        sx={{ mt: 1 }}
        container
        spacing={{ xs: 2, md: 3, lg: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {isFetching || isLoading
          ? [1, 2, 3, 4, 5, 6].map((l) => (
              <Grid size={{ lg: 3, md: 4, xs: 4 }} key={l}>
                <ListingTileSkeleton />
              </Grid>
            ))
          : data?.map((l) => (
              <Grid key={l.listingId} size={{ lg: 3, md: 4, xs: 4 }}>
                <ListingTile {...l} />
              </Grid>
            ))}
      </Grid>
      
           {isNarrow && !isUserLoading && !user && <SignInPopup/>}
      
    </Box>
  );
};
