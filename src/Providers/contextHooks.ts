import React from "react";
import { FiltersContext } from "./FilterProvider";
import { SnackbarContext } from "./SnackbarProvider";
import { AuthContext } from "./AuthProvider";
import { AppBarContext } from "./AppbarProvider";

export const useFilterContext = () => React.useContext(FiltersContext)
export const useSnackbarContext = () => React.useContext(SnackbarContext)
export const useAuthContext = () => React.useContext(AuthContext)
export const useAppBarContext = () => React.useContext(AppBarContext)