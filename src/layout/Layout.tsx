import { AppBar, Box, Collapse, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useIsNarrow } from "../utils/useIsNarrow";
import { UserMenu } from "../components/UserMenu";
import { useAppBarContext, useFilterContext } from "../Providers/contextHooks";
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [filterToOpen, setFilterToOpen] = React.useState(1);
  const isInsta = window.navigator.userAgent.includes("Instagram");
  const nav = useNavigate();
  const isNarrow = useIsNarrow();
  const { filters } = useFilterContext();
  const hasFilters = !!filters.location || !!filters.maxPrice;
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
  const isHomePage = location.pathname === "/";
  const { getAppBar } = useAppBarContext();
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
          sx={{ flexDirection: "row", display: "flex" }}
        >
          {
            <Collapse sx={{}} in={!hasFilters && isHomePage} orientation="horizontal">
              <Typography
                sx={{ cursor: "pointer", mr:1, flexBasis:1, display: 'flex', flexGrow:1}}
                onClick={() => nav("/")}
                color="black"
                fontWeight={"bold"}

              >
                Flathunt.co
              </Typography>

            </Collapse>
          }
          
            <Box sx={{ flexGrow: 1, flexBasis: 1, overflow: "hidden" }}>
              {getAppBar()}
            </Box>
          
          <Box sx={{ flexBasis: 1, }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {!isListingPage && !isNarrow && <Toolbar />}
        {isNarrow && <Toolbar />}
        {children}
      </Box>
    </Box>
  );
};
