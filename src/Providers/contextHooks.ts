import React from "react";
import { FiltersContext } from "./FilterProvider";
import { SnackbarContext } from "./SnackbarProvider";
import { AuthContext } from "./AuthProvider";

export const useFilterContext = () => React.useContext(FiltersContext)
export const useSnackbarContext = () => React.useContext(SnackbarContext)
export const useAuthContext = () => React.useContext(AuthContext)