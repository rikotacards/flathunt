import {
  Box,
  CircularProgress,
  Dialog,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSavedListings,
} from "../firebase/listings";
import {
  useAppBarContext,
  useAuthContext,
  useFilterContext,
} from "../Providers/contextHooks";
import { useIsNarrow } from "../utils/useIsNarrow";
import debounce from "lodash.debounce";

import { SignInPopup } from "../components/SignInPopup";
import { SearchBar } from "../components/SearchBar";
import { ListingGrid } from "../components/ListingGrid";
import { Categories } from "../components/Categories";
import { AddListingSteps } from "../components/AddListingSteps";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { IListing } from "../firebase/types";
export const SearchPage: React.FC = () => {
  const { setFilters } = useFilterContext();
  const queryClient = useQueryClient();
  const { user, isUserLoading } = useAuthContext();
  const { setAppBarChildComponent } = useAppBarContext();
  const isNarrow = useIsNarrow();
  const [lastVisible, setLastVisible] = React.useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>(null);

  React.useEffect(() => {
    setAppBarChildComponent(<SearchBar />);
    setFilters({});
    queryClient.clear();
  }, []);
  const [open, setOpenDrawer] = React.useState(false);
  const onOpen = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const { data: savedListingsData } = useQuery({
    queryKey: ["getSavedListings"],
    queryFn: () => getSavedListings(user?.uid || ""),
  });
  const [items, setItems] = React.useState([] as IListing[]);
  const savedListingsTransformed: { [key: string]: string } = {};
  savedListingsData?.forEach((listing) => {
    savedListingsTransformed[listing.listingId] = listing.docId;
  });
  const [hasMore, setHasMore] = React.useState(true); // To track if there's more data to load

  const [isLoading, setLoading] = React.useState(false);
 
  const fetchItems = async (
    startAfterDoc: QueryDocumentSnapshot<
      DocumentData,
      DocumentData
    > | null = null
  ) => {
    console.log(startAfterDoc);
    setLoading(true);

    const q = startAfterDoc
      ? query(
          collection(db, "listings"),
          orderBy("dateAdded", "desc"),
          limit(10),
          startAfter(startAfterDoc)
        )
      : query(
          collection(db, "listings"),
          orderBy("dateAdded", "desc"),
          limit(10)
        );

    const snapshot = await getDocs(q);
    if (snapshot.docs.length < 10) {
      setHasMore(false); // No more data to load
    }

    const itemsArray: IListing[] = snapshot.docs.map(
      (doc) =>
        ({
          listingId: doc.id,
          ...doc.data(),
        }) as IListing
    );

    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setItems((prevItems) => [...prevItems, ...itemsArray]);
    setLoading(false);
  };
  const loadMoreData = async () => {
    if(isLoading || !hasMore){
      return;
    }
    fetchItems(lastVisible);
  };
  const handleScroll = React.useCallback(
    debounce(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if the user is close to the bottom of the page
      if (scrollTop + windowHeight >= documentHeight - 100 && !isLoading) {
        loadMoreData();
      }
    }, 200),
    [isLoading]
  );
  React.useEffect(() => {
    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener when component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  React.useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        mt: 0,
        p: 2,
        pt: 1,
      }}
    >
      <Categories />
      <ListingGrid
        isLoading={items.length === 0}
        data={items}
        savedListingsTransformed={savedListingsTransformed}
      />

      {isNarrow && !isUserLoading && !user && <SignInPopup />}
      {user && (
        <Box sx={{ position: "sticky", right: 0, bottom: 0, p: 1 }}>
          <Fab
            sx={{
              boxShadow:
                "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
              color: "white",
            }}
            onClick={onOpen}
            variant="extended"
          >
            <AddIcon />
            Add Listing
          </Fab>
        </Box>
      )}
      {isLoading && (
        <div>
          <CircularProgress size={30} />
        </div>
      )}

      {user && (
        <Dialog
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
          <AddListingSteps onClose={onClose} userId={user?.uid} />
          {/* <AddListingForm
              userId={user?.uid || ""}
              onClose={onCloseAddNewDrawer}
            /> */}
        </Dialog>
      )}
    </Box>
  );
};
