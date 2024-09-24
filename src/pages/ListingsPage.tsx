import React from "react";
import { AgentListingsTable } from "../components/AgentListingsTable";
import {
  Box,

  Dialog,

} from "@mui/material";


import { useAppBarContext, useAuthContext, useFilterContext } from "../Providers/contextHooks";

import { useIsNarrow } from "../utils/useIsNarrow";

import { SearchBar } from "../components/SearchBar";
import { AddListingSteps } from "../components/AddListingSteps";

export const ListingsPage: React.FC = () => {
  const { filters, setFilters } = useFilterContext();
  const {setAppBarChildComponent} = useAppBarContext()

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setFilters({});
    setAppBarChildComponent(<SearchBar disableRedirect/>)
  }, []);


  return (
    <>
   
     <AgentListingsTable {...filters} />
     
     
  
    </>
  );
};
