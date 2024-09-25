import React from "react";
import { AgentListingsTable } from "../components/AgentListingsTable";
import {
  Box,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  useAppBarContext,
  useAuthContext,
  useFilterContext,
} from "../Providers/contextHooks";

import { useIsNarrow } from "../utils/useIsNarrow";

import { SearchBar } from "../components/SearchBar";
import { AddListingSteps } from "../components/AddListingSteps";
import { ChevronLeft, Home, KeyboardArrowDown } from "@mui/icons-material";

const ListingsPageAppBar: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ }}>
        <Typography fontWeight={'bold'} color='textPrimary'>My Listing</Typography>
      </Box>
    </Box>
  );
};
export const ListingsPage: React.FC = () => {
  const { filters, setFilters } = useFilterContext();
  const { setAppBarChildComponent } = useAppBarContext();

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setFilters({});
    setAppBarChildComponent(<ListingsPageAppBar />);
  }, []);

  return (
    <Box sx={{ mt: 1 }}>

      <SearchBar disableRedirect />
  
      <Divider sx={{ mt: 1 }} />
      <AgentListingsTable {...filters} />
    </Box>
  );
};
