import { Box, Button, Card, IconButton, Menu, Paper, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllListings, getSavedListings } from "../firebase/listings";
import {
  useAppBarContext,
  useAuthContext,
  useFilterContext,
} from "../Providers/contextHooks";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useNavigate } from "react-router";
import { SearchBar } from "../components/SearchBar";
import { ListingGrid } from "../components/ListingGrid";
import { Sort } from "@mui/icons-material";
import { SortPanel } from "../components/SortPanel";
import { NoResults } from "../components/NoResults";

export const SearchResultPage: React.FC = () => {
  const { setFilters, filters } = useFilterContext();
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { setAppBarChildComponent } = useAppBarContext();

  React.useEffect(() => {
    setAppBarChildComponent(<SearchBar />);
  }, []);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "getAllListingsWithResult",
      filters.location,
      filters.maxPrice,
      filters.minPrice,
      filters.bedrooms,
      filters.minNetArea,
      filters.maxNetArea,
      filters.minBedrooms,
      filters.maxBedrooms,
      filters.isDirectListing
    ],
    queryFn: () => getAllListings(filters),
  });
  const [sortedData, setSortedData] = React.useState()
 
console.log('sorting')
  const onClear = () => {
    setFilters({});
    nav("/");
  };
  const onHighestSortPrice = () => {
    if(!data){
      return;
    }
    setSortedData(data?.sort((a,b) => b.price - a.price))
    handleCloseUserMenu()
  }
  const onHighestSortArea = () => {
    if(!data){
      return;
    }
    setSortedData(data?.sort((a,b) => b.netArea - a.netArea))
    handleCloseUserMenu()
  }
  const onLowestSortArea = () => {
    if(!data){
      return;
    }
    setSortedData(data?.sort((a,b) => a.netArea - b.netArea))
    handleCloseUserMenu()
  }
  const onLowestSortPrice = () => {
    if(!data){
      return;
    }
    setSortedData(data?.sort((a,b) => a.price - b.price))
    handleCloseUserMenu()
  }
  const { data: savedListingsData } = useQuery({
    queryKey: ["getSavedListings"],
    queryFn: () => getSavedListings(user?.uid || ""),
  });
  const savedListingsTransformed: { [key: string]: string } = {};
  savedListingsData?.forEach((listing) => {
    savedListingsTransformed[listing.listingId] = listing.docId;
  });
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
      {!!data?.length && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            component={Paper}
            variant="outlined"
            sx={{
              pl: 1,
              pr: 1,
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              flexDirection: "row",
              borderRadius: 10,
            }}
          >
            <Menu
             sx={{ mt: "45px" }}
             id="menu-appbar"
             anchorEl={anchorElUser}
             slotProps={{ paper: { style: { borderRadius: 10 } } }}
             anchorOrigin={{
               vertical: "top",
               horizontal: "right",
             }}
             keepMounted
             transformOrigin={{
               vertical: "top",
               horizontal: "right",
             }}
             open={Boolean(anchorElUser)}
             onClose={handleCloseUserMenu}
            >
              <SortPanel 
              onLowestSortArea={onLowestSortArea}
              onHighestSortArea={onHighestSortArea}
              onHighestSortPrice={onHighestSortPrice}
              onLowestSortPrice={onLowestSortPrice}/>

            </Menu>
            <IconButton onClick={handleOpenUserMenu}>

            <SwapVertIcon/>
            </IconButton>
            <Typography
              color="textSecondary"
              variant="body2"
              fontWeight={"bold"}
            >
              {data?.length} places
            </Typography>
            <Button onClick={onClear} sx={{ textTransform: "capitalize" }}>
              Clear filters
            </Button>
          </Box>
        </Box>
      )}

      {data?.length === 0 && !isFetching && !isLoading && (
        <NoResults onClear={onClear}/>
      )}
      <ListingGrid
        isLoading={isLoading}
        data={sortedData || data}
        savedListingsTransformed={savedListingsTransformed}
      />

    </Box>
  );
};
