import React from "react";
import { Box, Snackbar } from "@mui/material";

export const SnackbarContext = React.createContext(
  {} as {
    open: boolean;
    toggleSnackbar: () => void;
    setSnackbarChildComponent: (component: React.ReactNode) => void;
  }
);
interface FiltersProviderProps {
  children: React.ReactNode;
}
export const SnackbarProvider: React.FC<FiltersProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [snackbarChild, setSnackbarChild] = React.useState<React.ReactNode>(
    <></>
  );
  const setSnackbarChildComponent = (component: React.ReactNode) => {
    console.log("c", component);
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
    setSnackbarChildComponent,
  };
  return (
    <SnackbarContext.Provider value={value}>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <div style={{ width: "100%" }}>{snackbarChild}</div>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};
