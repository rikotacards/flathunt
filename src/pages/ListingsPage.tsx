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


  const handleClose = () => setOpen(false);

 
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
     
      
  
    </>
  );
};
