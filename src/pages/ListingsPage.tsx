import React from "react";
import { AgentListingsTable } from "../components/AgentListingsTable";
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  Dialog,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import { AddListingForm } from "../components/AddListingForm";

import AddIcon from "@mui/icons-material/Add";

import { useAppBarContext, useAuthContext, useFilterContext } from "../Providers/contextHooks";

import { SearchBarWide } from "../components/SearchBarWide";
import { useIsNarrow } from "../utils/useIsNarrow";
import { getAgentListings } from "../firebase/listings";
import { USER_ID } from "../firebase/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { copy } from "../utils/copy";
import { CloseOutlined } from "@mui/icons-material";
import { SearchbarNarrow2 } from "../components/SearchbarNarrow2";

export const ListingsPage: React.FC = () => {
  const { filters, setFilters } = useFilterContext();
  const {user} = useAuthContext();
  const {setAppBarChildComponent} = useAppBarContext()

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setFilters({});
    setAppBarChildComponent(<SearchbarNarrow2 disableRedirect/>)
  }, []);
  const isNarrow = useIsNarrow();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const onOpenDrawer = () => {
    setOpenDrawer(true);
  };
  const closeDrawer = () => {
    setOpenDrawer(false);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["getAgentListings", user?.uid],
    queryFn: () => getAgentListings(user?.uid || USER_ID),
  });

  const shareText = data?.map(
    (listing) =>
      `Asking ${listing?.price} HKD,
    address: ${listing?.address},
    net area: ${listing?.netArea},
    Link: flathunt.co/listing/${listing?.listingId}\n`
  );
  const copyText = shareText?.join("\n");
  const onCopy = () => copy(copyText || "");
  return (
    <>

     <AgentListingsTable {...filters} />
     
      {!isNarrow && (
        <Dialog
          sx={{ p: 1 }}
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <AddListingForm userId={user?.uid || ""} onClose={handleClose} />
          </Box>
        </Dialog>
      )}
     
      
  
      <Drawer anchor="bottom" open={openDrawer} onClose={closeDrawer}>
        <AppBar position="relative">
          <Toolbar>
            Share {data?.length} listings
            <IconButton sx={{ ml: "auto" }} onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box>
          <Card sx={{ p: 1, m: 1 }} variant="outlined">
            Tap the below to copy text and share on Whatsapp.
          </Card>
          <Card  variant='outlined' sx={{ p: 0, m: 1 }}>
            <CardActionArea sx={{p:1}} onClick={() => {closeDrawer() ; onCopy()}}>
              {shareText?.map((text) => <Typography>{text}</Typography>)}
            </CardActionArea>
          </Card>
        </Box>
      </Drawer>
    </>
  );
};
