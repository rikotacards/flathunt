import {
  ArrowDropDownCircleOutlined,
  HolidayVillageRounded,
  KeyboardArrowDown,
} from "@mui/icons-material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { LocationFilterNew2 } from "./LocationFilterNew2";
import { PriceFilterNew2 } from "./PriceFilterNew2";
import { useLocation, useNavigate } from "react-router";
import { useFilterContext } from "../Providers/contextHooks";
import { MoreFilter } from "./MoreFilters";
import { getRangeLabel } from "../utils/getRangeLabel";

export const SearchbarNarrow2: React.FC = () => {
  const urlLocation = useLocation();
  const nav = useNavigate();
  const goHome = () => nav("/");
  const { filters, setFilters } = useFilterContext();

  const isProfilePage = urlLocation.pathname === "/profile";
  const isHomePage = urlLocation.pathname === "/";
  const isSearchResults = urlLocation.pathname === "/search-results";
  const isAgentListings = urlLocation.pathname === "/listings";
  const [isDrawerOpen, setDrawer] = React.useState(false);
  const [filterIndex, setFilterIndex] = React.useState(0);
  const onOpenDrawer = () => {
    setDrawer(true);
  };
  const onCloseDrawer = () => {
    setDrawer(false);
  };
  const onLocationClick = (location: string) => {
    setFilters((p) => ({ ...p, location }));
    onCloseDrawer();
    nav("/search-results");
  };
  const onFilterClick = (index: number) => {
    setFilterIndex(index);
    onOpenDrawer();
  };
  const [priceRange, setPriceRange] = React.useState([5000, 90000]);
  const onPriceDone = () => {
    setFilters((p) => ({
      ...p,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    }));
    onCloseDrawer();
    nav("/search-results");
  };
  const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice, "HKD");
  const location = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography fontWeight={500} color='textSecondary' sx={{ textTransform: "capitalize" }} variant="body2">
        {filters.location || "Location"}
      </Typography>
      {filters.location ? null : (
        <KeyboardArrowDown fontSize="small" color="action" />
      )}
    </Box>
  );
  const price = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography fontWeight={500} color='textSecondary'  variant="body2">{priceLabel}</Typography>
      {filters.maxPrice ? null :        <KeyboardArrowDown fontSize="small" color="action" />
      }
    </Box>
  );
  const profilePage = (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={goHome}>
          <HolidayVillageRounded />
        </IconButton>
        <Typography fontWeight={"bold"}>Profile</Typography>
      </Box>
    </>
  );
  const searchPage = (
    <>
      <IconButton onClick={() => onFilterClick(2)}>
        <TuneRoundedIcon />
      </IconButton>
      <MenuList
        sx={{
          display: "flex",
          overflowX: "scroll",
          pl: 1,
          pr: 1,
          borderRadius: 10,
        }}
      >
        <Chip
          onClick={() => onFilterClick(0)}
          sx={{
            boxShadow:
              "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
          }}
          variant="outlined"
          label={location}
        />
        <Chip
          onClick={() => onFilterClick(1)}
          sx={{
            ml: 1,
            boxShadow:
              "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
          }}
          variant="outlined"
          label={price}
        />
      </MenuList>
    </>
  );
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {(isHomePage || isSearchResults || isAgentListings) && searchPage}
        {isProfilePage && profilePage}
      </Box>
      <Drawer
        PaperProps={{
          style: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
        }}
        anchor={"bottom"}
        open={isDrawerOpen}
        onClose={onCloseDrawer}
      >
        <Box sx={{ m: 1 }}>
          {filterIndex === 0 && (
            <LocationFilterNew2
              onClick={onLocationClick}
              onClose={onCloseDrawer}
            />
          )}
          {filterIndex === 1 && (
            <PriceFilterNew2
              setPriceRange={setPriceRange}
              onCancel={onCloseDrawer}
              onClose={onPriceDone}
            />
          )}
          {filterIndex === 2 && <MoreFilter onClose={onPriceDone} />}
        </Box>
      </Drawer>
    </Box>
  );
};
