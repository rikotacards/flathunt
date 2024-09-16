import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  Fab,
  IconButton,
  DialogContent,
  Drawer,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  AppBar,
  Card,
  CardActionArea,
  Toolbar,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { deleteListings, getAgentListings } from "../firebase/listings";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth, USER_ID } from "../firebase/firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import { EditListing } from "./EditListing";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IFilters, IListing } from "../firebase/types";
import {
  CheckBox,
  CloseOutlined,
  InsertLink,
  MoreVertOutlined,
  OpenInNew,
} from "@mui/icons-material";
import { useIsNarrow } from "../utils/useIsNarrow";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";
import {
  useAuthContext,
  useFilterContext,
  useSnackbarContext,
} from "../Providers/contextHooks";
import { copy } from "../utils/copy";
import IosShareIcon from "@mui/icons-material/IosShare";

import { ListingTile } from "./ListingTile";
import { AddListingForm } from "./AddListingForm";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
  const {user} = useAuthContext();
  const queryClient = useQueryClient();
  const isNarrow = useIsNarrow();
  const { handleOpen, listingId } = row;
  const onClick = () => {
    setOpen(!open);
  };
  const onCopyLinkClick = (link: string) => {
    copy(link);
    s.setSnackbarChildComponent(<Alert severity="success">Link copied</Alert>);
    s.toggleSnackbar();
  };
  const toggleDeleteDialog = () => {
    setDeleteClick(!onDeleteClick);
  };
  const deleteListing = async (listingId: string) => {
    try {
      await deleteListings([listingId], USER_ID);
      queryClient.invalidateQueries({
        queryKey: ["getAgentListings"],
        exact: true,
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
          <Typography sx={{ mr: 1 }} fontWeight={"bold"} variant="body2">
            {row.location}
          </Typography>
          <Typography variant="caption">{row.address}</Typography>
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
        {isNarrow && (
          <TableCell sx={{ border: "none" }}>
            <IconButton size="small" onClick={onClick}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {!isNarrow && (
          <>
            <TableCell sx={{ border: "none" }}>
              <IconButton size="small" onClick={toggleDeleteDialog}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleOpen(listingId)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onCopyLinkClick(listingId)}>
                <InsertLink />
              </IconButton>
              <Link to={`/listing/${listingId}`} target="_blank">
                <IconButton>
                  <OpenInNew />
                </IconButton>
              </Link>
            </TableCell>
          </>
        )}
      </TableRow>

      <TableRow sx={{ border: "unset" }}>
        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={6}>
          <Collapse sx={{ display: "flex" }} unmountOnExit in={open}>
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
              <Box sx={{ display: "flex", maxWidth: "350px", mt: 2 }}>
                <ListingTile {...row} />
              </Box>
            </Box>
            {isNarrow && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  p: 1,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <IconButton disabled={!user} size="small" onClick={toggleDeleteDialog}>
                    <DeleteIcon />
                  </IconButton>
                  <Typography variant="caption">Delete</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <IconButton disabled={!user} onClick={() => handleOpen(listingId)}>
                    <EditIcon />
                  </IconButton>
                  <Typography variant="caption">Edit</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <IconButton onClick={() => onCopyLinkClick(listingId)}>
                    <InsertLink />
                  </IconButton>
                  <Typography variant="caption">Copy link</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Link to={`/listing/${listingId}`} target="_blank">
                    <IconButton>
                      <OpenInNew />
                    </IconButton>
                  </Link>
                  <Typography variant="caption">Open</Typography>
                </Box>
              </Box>
            )}
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
  const { setFilters } = useFilterContext();
  const { user } = useAuthContext();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const onOpenDrawer = () => {
    setOpenDrawer(true);
  };
  const closeDrawer = () => {
    setOpenDrawer(false);
  };
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
    queryKey: ["getAgentListings"],
    queryFn: () => getAgentListings(USER_ID),
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
    setFilters({});
  };
  const onCopy = () => copy(copyText || "");
  const provider = new GoogleAuthProvider();

  const rows = filteredData?.map((row) => (
    <Row key={row.listingId} {...row} handleOpen={handleOpen} />
  ));
  const onSignIn = async() => {
    const res = await signInWithPopup(auth, provider)
    if(res){
      onCloseSignInDrawer()
    }
  }
  return (
    <Box sx={{ display: "relative" }} mb={1} mt={2}>
      {isLoading ? <CircularProgress /> : null}
      <Button onClick={onClear}>Clear filters</Button>
      <TableContainer elevation={0} component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead sx={{ position: "sticy" }}>
            <TableRow>
              <TableCell component={"th"} sx={{ fontWeight: "bold" }}>
                {isNarrow ? "📍" : "Location"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} component={"th"}>
                Price
              </TableCell>
              <TableCell component={"th"} sx={{ fontWeight: "bold" }}>
                {isNarrow ? "Area" : "Net Area"}
              </TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>
                {isNarrow ? "Br" : "Bedrooms"}
              </TableCell>
              {!isNarrow && <TableCell></TableCell>}

              {isNarrow && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <EditListing
          userId={USER_ID}
          onClose={handleClose}
          listingId={editingListingId}
        />
      </Dialog>
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
        }}
      >
        <Fab
          variant="extended"
          sx={{ m: 0, p: 2, alignItems: "center" }}
          onClick={onOpenDrawer}
          color={"secondary"}
        >
          <Typography sx={{ mr: 1 }} variant="body2">
            {filteredData?.length} listings
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IosShareIcon sx={{ mb: 0.5 }} />
          </Box>
        </Fab>

        <Fab
          size="medium"
          color="primary"
          sx={{ m: 1 }}
          onClick={onOpenAddNewDrawer}
        >
          <AddIcon />
        </Fab>
      </Box>
      {isNarrow && (
        <Drawer open={openAddNewDrawer} anchor="bottom" onClose={handleClose}>
          <AddListingForm userId={user?.uid || ''} onClose={onCloseAddNewDrawer} />
        </Drawer>
      )}
      <Drawer anchor="bottom" open={openDrawer} onClose={closeDrawer}>
        <AppBar position="relative">
          <Toolbar>
            Share {filteredData?.length} listings
            <IconButton sx={{ ml: "auto" }} onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box>
          <Card sx={{ p: 1, m: 1 }} variant="outlined">
            Tap the below to copy text and share on Whatsapp.
          </Card>
          <Card variant="outlined" sx={{ p: 0, m: 1 }}>
            <CardActionArea
              sx={{ p: 1, display: "flex", flexDirection: "column" }}
              onClick={() => {
                closeDrawer();
                onCopy();
              }}
            >
              <Box sx={{ position: "relative", ml: "auto" }}>
                <ContentCopyIcon />
              </Box>
              {shareText?.map((text) => <Typography>{text}</Typography>)}
            </CardActionArea>
          </Card>
        </Box>
      </Drawer>
      <Drawer
        anchor="bottom"
        sx={{ display: "flex", flexDirection: "column" }}
        onClose={onCloseSignInDrawer}
        open={isSignInDrawerOpen}
      >
        <Toolbar>
          <Typography fontWeight={"bold"}>Sign In</Typography>
          <IconButton onClick={onCloseSignInDrawer} sx={{ml: 'auto'}}><CloseOutlined/></IconButton>

        </Toolbar>
        <Box sx={{ p: 2 }}>
          <Typography sx={{mb:1}}>Sign in to add listings</Typography>
          <Button onClick={onSignIn} fullWidth sx={{}} variant="contained">
            Sign in with Google
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
});
