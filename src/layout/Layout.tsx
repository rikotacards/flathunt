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
    setFilterToOpen(filterIndex || 0);
    setFiltersOpen(true);
  };
  const [titleOpen, setTitleOpen] = React.useState(true);
  
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { getAppBar } = useAppBarContext();
  React.useEffect(() => {
    setTimeout(() => {
      setTitleOpen(false);
    }, 1000);
  }, []);
  const openTitle = titleOpen && !hasFilters && isHomePage;
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
          sx={{
            justifyContent: "center",
            flexDirection: "column",
            display: "flex",
            width: "100%",
          }}
        >
          <Collapse
            sx={{}}
            in={
              // true
              openTitle
            }
            orientation="vertical"
          >
            <Typography
              sx={{
                cursor: "pointer",
                mr: 1,
                flexBasis: 1,
                display: "flex",
                flexGrow: 1,
              }}
              onClick={() => nav("/")}
              color="black"
              fontWeight={"bold"}
            >
              Flathunt.co
            </Typography>
          </Collapse>

          <Collapse sx={{ width: "100%" }} in={!openTitle}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box>{getAppBar()}</Box>

              <Box sx={{ ml: "auto" }}>
                <UserMenu />
              </Box>
            </Box>
          </Collapse>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
