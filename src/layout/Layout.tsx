import {
  AppBar,
  Box,
  Collapse,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useIsNarrow } from "../utils/useIsNarrow";
import { SearchFilters } from "../components/searchFilters";
import { UserMenu } from "../components/UserMenu";
import { SearchbarNarrow2 } from "../components/SearchbarNarrow2";
import { useAppBarContext } from "../Providers/contextHooks";
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [filterToOpen, setFilterToOpen] = React.useState(1);

  const nav = useNavigate();
  const isNarrow = useIsNarrow();
  const [isFiltersOpen, setFiltersOpen] = React.useState(false);
  const onSearchbarClick = (filterIndex?: number) => {
    console.log("filer", filterIndex);
    setFilterToOpen(filterIndex || 0);
    setFiltersOpen(true);
  };

  const onSearchbarClose = () => {
    setFiltersOpen(false);
  };
  const location = useLocation();
  const isListingPage = location.pathname.indexOf("/listing/") >= 0;
  const {getAppBar} = useAppBarContext();
  return (
    <Box sx={{ position: "relative" }}>
      <AppBar
        sx={{
          boxShadow:
            "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
          background: "white",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
        position="fixed"
      >
        <Toolbar
          sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}
        >
          {!isNarrow && (
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => nav("/")}
              color="black"
              fontWeight={"bold"}
            >
              Flathunt.co
            </Typography>
          )}
          { (
            <Box sx={{ flexGrow: 1, flexBasis: 1, overflow: "hidden" }}>
             {getAppBar()}
            </Box>
          )}
          <Box sx={{ flexBasis: 1 }}>
            <UserMenu />
          </Box>
        
        </Toolbar>
      

        <Collapse unmountOnExit in={isFiltersOpen}>
          <Box sx={{ p: 2, pt: 1 }}>
            <SearchFilters
              disableAPICalls
              filterToOpen={filterToOpen}
              onClose={onSearchbarClose}
            />
          </Box>
        </Collapse>
      </AppBar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {!isListingPage && !isNarrow && <Toolbar />}
        {  isNarrow && <Toolbar />}
        {children}
      </Box>
    </Box>
  );
};
