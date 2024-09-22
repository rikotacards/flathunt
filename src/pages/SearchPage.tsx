import {
  Box,

} from "@mui/material";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllListingsNoFilters,
  getSavedListings,
} from "../firebase/listings";
import {
  useAppBarContext,
  useAuthContext,
  useFilterContext,
} from "../Providers/contextHooks";
import { useIsNarrow } from "../utils/useIsNarrow";

import { SignInPopup } from "../components/SignInPopup";
import { SearchBar } from "../components/SearchBar";
import { ListingGrid } from "../components/ListingGrid";
import { Categories } from "../components/Categories";
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
        pt:1,
      }}
    >
      
      <Categories/>
      <ListingGrid
        isLoading={isLoading}
        data={data}
        savedListingsTransformed={savedListingsTransformed}
      />

      {isNarrow && !isUserLoading && !user && <SignInPopup />}
    </Box>
  );
};
