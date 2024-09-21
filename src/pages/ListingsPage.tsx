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
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import TableRowsIcon from '@mui/icons-material/TableRows';
import IosShareIcon from "@mui/icons-material/IosShare";
import { AddListingForm } from "../components/AddListingForm";

import AddIcon from "@mui/icons-material/Add";

import { useAppBarContext, useAuthContext, useFilterContext } from "../Providers/contextHooks";

import { SearchBarWide } from "../components/SearchBarWide";
import { useIsNarrow } from "../utils/useIsNarrow";

import { SearchbarNarrow2 } from "../components/SearchbarNarrow2";
import { WindowOutlined } from "@mui/icons-material";

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

  const [index, setIndex] = React.useState(0);
  const onChange = (event, index: number) => {
    setIndex(index)
  }
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
