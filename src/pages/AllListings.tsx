import {
    Box,
    Dialog,
    Drawer,
    Fab,
  
  } from "@mui/material";
  import AddIcon from '@mui/icons-material/Add';
  
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
  import { AddListingSteps } from "../components/AddListingSteps";
  import { useLocation } from "react-router";
  export const AllListings: React.FC = () => {
    const { setFilters } = useFilterContext();
    const queryClient = useQueryClient();
    const { user, isUserLoading } = useAuthContext();
    const { setAppBarChildComponent } = useAppBarContext();
    const location = useLocation()
    const isHome = location.pathname === '/'
    const isNarrow = useIsNarrow();
    React.useEffect(() => {
      setAppBarChildComponent(<SearchBar />);
      setFilters({});
      queryClient.clear();
    }, []);
    const [open, setOpenDrawer] = React.useState(false);
    const onOpen = () => {
      setOpenDrawer(true)
    }
    const onClose = ()=> {
      setOpenDrawer(false)
    }
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
        {user && <Box sx={{position: 'sticky', right:0, bottom: 0, p:1}}>
          <Fab 
          sx={{
            boxShadow: "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',       
            color: 'white'
           }}
          onClick={onOpen} variant='extended'>
            <AddIcon/>
          Add Listing
          </Fab></Box>}
        {user && <Dialog
              PaperProps={{
                sx: {
                  // height: "calc(100% )",
                },
              }}
              sx={{ overflowY: "auto" }}
              fullScreen
              open={open}
              onClose={onClose}
            >
              <AddListingSteps
                onClose={onClose}
                userId={user?.uid}
              />
              {/* <AddListingForm
                userId={user?.uid || ""}
                onClose={onCloseAddNewDrawer}
              /> */}
            </Dialog>}
      </Box>
    );
  };
  