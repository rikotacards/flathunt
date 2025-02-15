import TableRowsIcon from "@mui/icons-material/TableRows";

import {

  Box,
  Button,

  Collapse,
  Dialog,
  DialogActions,
  Fab,
  IconButton,
  DialogContent,
  Drawer,

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Toolbar,
  LinearProgress,
  Card,
  CardContent,

} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  deleteListings,
  getAgentListings,
  getSavedListings,
} from "../firebase/listings";
import Paper from "@mui/material/Paper";
import { auth, USER_ID } from "../firebase/firebaseConfig";
import { EditListing } from "./EditListing";

import { IFilters, IListing } from "../firebase/types";
import {
  
  WindowOutlined,
} from "@mui/icons-material";
import { useIsNarrow } from "../utils/useIsNarrow";
import AddIcon from "@mui/icons-material/Add";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  useAuthContext,
  useFilterContext,
  useSnackbarContext,
} from "../Providers/contextHooks";
import { copy } from "../utils/copy";
import IosShareIcon from "@mui/icons-material/IosShare";

import { ListingTile } from "./ListingTile";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ListingGrid } from "./ListingGrid";
import { AddListingSteps } from "./AddListingSteps";
const getBedroomCondition = (bedrooms: number, bedroomsFilter?: string) => {
  if (bedroomsFilter === undefined) {
    return bedrooms >= 0;
  }
  if (bedroomsFilter === "studio") {
    return bedrooms === 0;
  }
  if (bedroomsFilter === "1") {
    return bedrooms === 1;
  }
  if (bedroomsFilter === "1+") {
    return bedrooms >= 1;
  }
  if (bedroomsFilter === "2") {
    return bedrooms === 2;
  }
  if (bedroomsFilter === "2+") {
    return bedrooms >= 2;
  }
  if (bedroomsFilter === "3") {
    return bedrooms === 3;
  }
  if (bedroomsFilter === "3+") {
    return bedrooms >= 3;
  }
  return bedrooms >= 0;
};

const getRangeCondition = (
  price: number,
  maxPrice?: number,
  minPrice?: number
) => {
  return price <= (maxPrice || Infinity) && price >= (minPrice || -Infinity);
};

const Row: React.FC<IListing & { handleOpen: (listingId: string) => void }> = (
  row
) => {
  const [open, setOpen] = React.useState(false);
  const s = useSnackbarContext();
  const [onDeleteClick, setDeleteClick] = React.useState(false);
  const queryClient = useQueryClient();
  const isNarrow = useIsNarrow();
  const { handleOpen, listingId } = row;
  const onClick = () => {
    setOpen(!open);
  };
  
  const toggleDeleteDialog = () => {
    setDeleteClick(!onDeleteClick);
  };
  const deleteListing = async (listingId: string) => {
    try {
      await deleteListings([listingId], USER_ID);
      queryClient.invalidateQueries({
        queryKey: ["getAgentListings"],
      });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <>
      <TableRow hover onClick={isNarrow ? onClick : undefined}>
        <TableCell
          sx={{ display: "flex", flexDirection: "column", border: "none" }}
        >
          <Typography fontWeight={"bold"} variant="body2">
            {row.address}
          </Typography>
          <Typography
            sx={{ mr: 1, textTransform: "capitalize" }}
            variant="caption"
          >
            {row.location}
          </Typography>
        </TableCell>
        <TableCell sx={{ border: "none" }} scope="">
          <Typography fontWeight={"bold"} variant="body2">
            {row.price}
          </Typography>
          <Typography fontWeight={""} variant="caption">
            HKD
          </Typography>
        </TableCell>

        <TableCell sx={{ border: "none" }}>
          <Typography fontWeight={"bold"} variant="body2">
            {row.netArea}
          </Typography>
          <Typography variant="caption">sqft</Typography>
        </TableCell>
        <TableCell sx={{ border: "none" }}>
          <Typography fontWeight={"bold"} variant="body2">
            {row.bedrooms}
          </Typography>
          <Typography variant="caption">br</Typography>
        </TableCell>
        {
          <TableCell sx={{ border: "none" }}>
            <IconButton size="small" onClick={onClick}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        }
      </TableRow>

      <TableRow sx={{ border: "unset" }}>
        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={5}>
          <Collapse
            sx={{ display: "flex", justifyContent: "center" }}
            unmountOnExit
            in={open}
          >
            <Box
              sx={{
                pb: 2,
                maxWidth: "350px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  maxWidth: "350px",
                  mt: 2,
                  justifyContent: "center",
                  display: "block",
                  objectFit: "cover",
                }}
              >
                <ListingTile {...row} />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog
        open={onDeleteClick}
        onClose={toggleDeleteDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent>
          Are you sure you want to delete this listing?
          <DialogActions>
            <Button onClick={toggleDeleteDialog} variant="outlined">
              cancel
            </Button>

            <Button
              onClick={() => deleteListing(listingId)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const AgentListingsTable: React.FC<IFilters> = React.memo((props) => {
  const { maxPrice, minPrice, maxNetArea, minNetArea, bedrooms, location } =
    props;
  const isNarrow = useIsNarrow();
  const { setFilters, filters } = useFilterContext();
  const { user, isUserLoading } = useAuthContext();
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [openAddNewDrawer, setAddNewDrawer] = React.useState(false);
  const [isSignInDrawerOpen, setSignInDrawer] = React.useState(false);
  const onOpenSignInDrawer = () => {
    setSignInDrawer(true);
  };
  const onCloseSignInDrawer = () => {
    setSignInDrawer(false);
  };
  const onOpenAddNewDrawer = () => {
    if (!user) {
      onOpenSignInDrawer();
      return;
    }
    setAddNewDrawer(true);
  };
  const onCloseAddNewDrawer = () => {
    setAddNewDrawer(false);
  };
  const [editingListingId, setEditingListingId] = React.useState("");
  const handleOpen = (listingId: string) => {
    setEditingListingId(listingId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const { data, isLoading } = useQuery({
    queryKey: ["getAgentListings", user?.uid],
    queryFn: () => getAgentListings(user?.uid || USER_ID),
  });

  const filteredData = data?.filter(
    (d) =>
      (!location ||
        d.location?.toLocaleLowerCase() === location?.toLowerCase()) &&
      ((!maxPrice && !minPrice) ||
        getRangeCondition(Number(d.price), maxPrice, minPrice)) &&
      ((!maxNetArea && !minNetArea) ||
        getRangeCondition(Number(d.netArea), maxNetArea, minNetArea)) &&
      getBedroomCondition(d.bedrooms, bedrooms)
  );
  const shareText = filteredData?.map(
    (listing) =>
      `Asking ${listing?.price} HKD,
    address: ${listing?.address},
    net area: ${listing?.netArea},
    Link: flathunt.co/listing/${listing?.listingId}\n`
  );
  const copyText = shareText?.join("\n");
  const onClear = () => {
    setFilters({} as IFilters);
  };
  const { data: savedListingsData } = useQuery({
    queryKey: ["getSavedListings"],
    queryFn: () => getSavedListings(user?.uid || ""),
  });
  const savedListingsTransformed: { [key: string]: string } = {};
  savedListingsData?.forEach((listing) => {
    savedListingsTransformed[listing.listingId] = listing.docId;
  });
  const onCopy = () => copy(copyText || "");
  const provider = new GoogleAuthProvider();
  const onOpenDrawer = () => {
    setOpenDrawer(true);
    onCopy();
    setTimeout(closeDrawer, 2000);
  };
  const closeDrawer = () => {
    setOpenDrawer(false);
  };
  const rows = filteredData?.map((row) => (
    <Row key={row.listingId} {...row} handleOpen={handleOpen} />
  ));
  const onSignIn = async () => {
    const res = await signInWithPopup(auth, provider);
    if (res) {
      onCloseSignInDrawer();
    }
  };
  const hasFilters =
    filters.location ||
    filters.maxPrice ||
    filters.minPrice ||
    filters.maxNetArea;
  const [index, setIndex] = React.useState(0);
  const onChange = (index: number) => {
    setIndex(index);
  };
  return (
    <>
      {isLoading ? <LinearProgress /> : null}
     
      <Box sx={{ display: "relative" }} mb={1} mt={0}>
        {hasFilters && <Button onClick={onClear}>Clear filters</Button>}
        {index === 0 && (
          <Box sx={{ p: 2 }}>
            {data?.length === 0 && <Box >
              <Button onClick={onOpenAddNewDrawer} sx={{borderRadius: 6}} variant='contained'>Create a listing<AddIcon/></Button>
              </Box>}
            <ListingGrid
              data={filteredData}
              isLoading={isLoading}
              savedListingsTransformed={savedListingsData || []}
            />
          </Box>
        )}
        {index === 1 && (
          <TableContainer elevation={0} component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead sx={{ position: "sticy" }}>
                <TableRow>
                  <TableCell
                    component={"th"}
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {isNarrow ? "📍" : "Location"}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                    component={"th"}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    component={"th"}
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {isNarrow ? "Area" : "Net Area"}
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {isNarrow ? "Br" : "Bedrooms"}
                  </TableCell>
                  {!isNarrow && <TableCell></TableCell>}

                  {isNarrow && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
        )}

        <Drawer
          open={open}
          anchor="bottom"
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <EditListing
            userId={USER_ID}
            onClose={handleClose}
            listingId={editingListingId}
          />
        </Drawer>
        <Box
          sx={{
            display: "flex",
            position: "sticky",
            bottom: 1,
            width: "100%",
            justifyContent: "flex-end",
            p: 2,
            alignItems: "center",
            zIndex: 99,
            visibility: !data?.length ? 'hidden': 'visible'
          }}
        >
          <Fab color='secondary' onClick={() => onChange(index ===1 ? 0 : 1)} sx={{ mr: 1 }} size="small">
           {index === 1 ? <WindowOutlined/> : <TableRowsIcon />}
          </Fab>
          <Fab
            variant="extended"
            sx={{ m: 0, p: 2, alignItems: "center" }}
            onClick={onOpenDrawer}
            color={"secondary"}
          >
            <Typography
              sx={{ mr: 1, textTransform: "capitalize" }}
              variant="body2"
            >
              {filteredData?.length} listings{" "}
              {openDrawer ? <b>copied</b> : null}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <IosShareIcon sx={{ mb: 0.5 }} />
            </Box>
          </Fab>

          <Fab
            color="primary"
            sx={{ m: 1, textTransform: "capitalize" }}
            variant="extended"
            onClick={onOpenAddNewDrawer}
            disabled={isUserLoading}
          >
            Add Listing
            <AddIcon fontSize="medium" />
          </Fab>
        </Box>
        {
          <Dialog
            PaperProps={{
              sx: {
                // height: "calc(100% )",
              },
            }}
            sx={{ overflowY: "auto" }}
            fullScreen
            open={openAddNewDrawer}
            onClose={onCloseAddNewDrawer}
          >
            <AddListingSteps
              onClose={onCloseAddNewDrawer}
              userId={user?.uid || USER_ID}
            />
            {/* <AddListingForm
              userId={user?.uid || ""}
              onClose={onCloseAddNewDrawer}
            /> */}
          </Dialog>
        }

        <Drawer
          anchor="bottom"
          sx={{ display: "flex", flexDirection: "column" }}
          onClose={onCloseSignInDrawer}
          PaperProps={{
            style: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
          }}
          open={isSignInDrawerOpen}
        >
          <Toolbar
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight={"bold"}>
              Sign In
            </Typography>
            {/* <IconButton onClick={onCloseSignInDrawer} sx={{ ml: "auto" }}>
              <CloseOutlined />
            </IconButton> */}
          </Toolbar>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography sx={{ mb: 1 }}>Sign in to add listings</Typography>
            <Button
              onClick={onSignIn}
              size="large"
              fullWidth
              sx={{
                textTransform: "capitalize",
              }}
              variant="contained"
            >
              Sign in with Google
            </Button>
          </Box>
        </Drawer>
      </Box>
    </>
  );
});
