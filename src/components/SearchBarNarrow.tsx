import {
  Badge,
  Box,
  Chip,
  Drawer,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import React from "react";
import { useFilterContext } from "../Providers/contextHooks";
import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";

import { CloseOutlined, HolidayVillageRounded } from "@mui/icons-material";
import { getRangeLabel } from "../utils/getRangeLabel";

import { MoreFilter } from "./MoreFilters";
interface SearchBarWideProps {
  showMore?: boolean;
  disablePropertyType?: boolean;
  disableAPIcalls?: boolean;
  onFilterClick: (index?: number) => void;
  onClose: () => void;
  isFiltersOpen: boolean;
}
export const SearchBarNarrow: React.FC<SearchBarWideProps> = ({
  onFilterClick,
  isFiltersOpen,
  onClose,
}) => {
  const { filters, setFilters } = useFilterContext();
  const [isMoreOpen, setMoreOpen] = React.useState(false);
  const openMore = () => {
    setMoreOpen(true);
  };
  const onCloseMore = () => {
    setMoreOpen(false);
  };
  const onClear = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFilters({});
  };
  const nav = useNavigate();

  const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice, "HKD");
  const hasFilters = filters.location || filters.maxPrice || filters.minPrice;
  return (
    <Box sx={{ width: "100%", overflow: "visible" }}>
      <Box
        component={Paper}
        variant="outlined"
        sx={{
          width: "100%",
          // maxWidth:'400px',
          display: "flex",
          alignItems: "center",
          boxShadow: '0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)',
          overflow: "visible",
          pl: 0,

          borderRadius: 10,
        }}
      >
        <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
          <Box>
            {isFiltersOpen ? (
              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            ) : (
              <IconButton onClick={() => nav("/")}>
                <HolidayVillageRounded color="primary" />
              </IconButton>
            )}
          </Box>
          <Box sx={{ border: 0, flexGrow: 1 }} onClick={() => onFilterClick()}>
            {!filters.location && !filters.minPrice && !filters.maxPrice && (
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight={"bold"}
              >
                Where to live?
              </Typography>
            )}

            <Box
              sx={{
                maxWidth: "250px",
                display: "flex",
                borderRadius: 10,
                alignItems: "center",
                overflowX: "scroll",
              }}
            >
              {!!filters.location && (
                <Chip
                  sx={{ textTransform: "capitalize", mr: 0.5 }}
                  label={filters.location}
                  onDelete={() => {
                    setFilters((p) => ({ ...p, location: undefined }));
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterClick(1);
                  }}
                />
              )}
              {!!filters.maxPrice && !!filters.minPrice && (
                <Chip
                  sx={{ textTransform: "capitalize", mr: 0.5 }}
                  label={priceLabel || "Price"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterClick(2);
                  }}
                  onDelete={() => {
                    setFilters((p) => ({
                      ...p,
                      maxPrice: undefined,
                      minPrice: undefined,
                    }));
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
        {!hasFilters ? (
          <SearchIcon
            fontSize="small"
            sx={{ ml: "auto", mr: 1 }}
            color="inherit"
          />
        ) : (
          <Box>
            <IconButton
              sx={{ ml: "auto", overflow: "visible", background: "white" }}
              onClick={openMore}
            >
              <Badge
                invisible={!filters.maxNetArea}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{ zIndex: 10 }}
                color="primary"
                badgeContent={1}
              >
                <FilterListIcon sx={{ ml: "auto" }} />
              </Badge>
            </IconButton>
          </Box>
        )}
      </Box>
      <Drawer anchor="bottom" onClose={onCloseMore} open={isMoreOpen}>
        <MoreFilter onClose={onCloseMore} />
      </Drawer>
    </Box>
  );
};
