import React from "react";
import { Box, Snackbar } from "@mui/material";

export const AppBarContext = React.createContext(
  {} as {
    open: boolean;
    toggleSnackbar: () => void;
    setAppBarChildComponent: (component: React.ReactNode) => void;
    getAppBar: () => React.ReactNode
  }
);
interface FiltersProviderProps {
  children: React.ReactNode;
}
export const AppBarProvider: React.FC<FiltersProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [snackbarChild, setSnackbarChild] = React.useState<React.ReactNode>(
    <></>
  );
  const setAppBarChildComponent = (component: React.ReactNode) => {
    setSnackbarChild(component);
  };
  const toggleSnackbar = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const value = {
    open,
    toggleSnackbar,
    setAppBarChildComponent,
    getAppBar: () => snackbarChild
  };
  return (
    <AppBarContext.Provider value={value}>
      {children}
    </AppBarContext.Provider>
  );
};
