import React from "react";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { copy } from "../utils/copy";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, Drawer, IconButton } from "@mui/material";
import { deleteListings } from "../firebase/listings";
import { useQueryClient } from "@tanstack/react-query";
import { InsertLink, OpenInNew } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { EditListing } from "./EditListing";

interface ListingTileControlsAdminProps {
  listingId: string;
}
export const ListingTileControlsAdmin: React.FC<
  ListingTileControlsAdminProps
> = ({ listingId }) => {
  const s = useSnackbarContext();
  const queryClient = useQueryClient();
  const [editingListingId, setEditingListingId] = React.useState("");
  const handleClose = () => setOpen(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = (listingId: string) => {
    setEditingListingId(listingId);
    setOpen(true);
  };
  const [onDeleteClick, setDeleteClick] = React.useState(false);
  const { user } = useAuthContext();
  const onCopyLinkClick = (link: string) => {
    const fullUrl = `https://flathunt.co/listing/${link}`
    copy(fullUrl);
    s.setSnackbarChildComponent(<Alert variant="filled" icon={<InsertLink sx={{transform: 'rotate(-45deg)'}}/>} severity="success">Link copied</Alert>);
    s.toggleSnackbar();
  };
  const toggleDeleteDialog = () => {
    setDeleteClick(!onDeleteClick);
  };
  const deleteListing = async (listingId: string) => {
    try {
      if (!user?.uid) {
        alert("no user");
      }
      await deleteListings([listingId], user?.uid || "");
      queryClient.invalidateQueries({
        queryKey: ["getAgentListings"],
      });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', mt:1}}>
      <IconButton  size="small" onClick={toggleDeleteDialog}>
        <DeleteIcon />
      </IconButton>
      <IconButton  onClick={() => handleOpen(listingId)}>
        <EditIcon />
      </IconButton>
      <IconButton  onClick={() => onCopyLinkClick(listingId)}>
        <InsertLink sx={{transform: 'rotate(-45deg)'}} />
      </IconButton>
      <Link to={`/listing/${listingId}`} target="_blank">
        <IconButton >
          <OpenInNew />
        </IconButton>
      </Link>
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
      <Drawer
          open={open}
          anchor="bottom"
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <EditListing
            userId={user?.uid || ''}
            onClose={handleClose}
            listingId={editingListingId}
          />
        </Drawer>
    </Box>
  );
};
