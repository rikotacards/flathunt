import {
  ChevronLeft,
  ChevronRightRounded,
  CloseOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { FiltersOutdoors } from "./FiltersOutdoors";
import { features } from "./OtherFeatures";
import { useFilterContext } from "../Providers/contextHooks";
import { AreaSlider } from "./AreaSlider";
import { FilterField, IFilters } from "../firebase/types";
import { getRangeLabel } from "../utils/getRangeLabel";
import { hasOtherFeatures } from "../utils/hasOtherFeatures";
import { useNavigate } from "react-router";
interface FiltersAllProps {
  onClose: () => void;
}

const getAndCombineFilterFields = (
  filters: IFilters,
  filterFields: FilterField[]
) => {
  return filterFields
    .map((f) => {
      if (filters[f.name]) {
        return `${f.label} `;
      }
    })
    .join("");
};

export const FiltersAll: React.FC<FiltersAllProps> = ({ onClose }) => {
  const [open, setPage] = React.useState('');
  const { filters, setFilters } = useFilterContext();
  const nav = useNavigate();
  const goResult = () => nav('/search-results')
  const hasFilters = hasOtherFeatures(filters);
  const [localFilterState, setLocalFilterState] = React.useState({});
  const onToggleFilter = (fieldName: keyof IFilters, value: boolean) => {
    setLocalFilterState((p) => ({
      ...p,
      [fieldName]: value,
    }));
  };
  const onCloseFilters = () => {
    if(hasFilters){
        goResult();
        onClose();
    }
    onClose()
  }
  const [areaRange, setAreaRange] = React.useState([
    filters.minNetArea || 200,
    filters.maxNetArea || 2000,
  ]);
  const additionalFilters = [
    {
        label: 'Agency / Direct',
        filteredValues: filters.isDirectListing  === undefined ? 'No preference' : filters.isDirectListing ? 'Direct listing' : 'Agency'
    },
    {
      label: "Net Area",
      filteredValues: getRangeLabel(
        filters.minNetArea,
        filters.maxNetArea,
        " sqft",
        "No preference"
      ),
    },

    {
      label: "Outdoors",
      filteredValues: getAndCombineFilterFields(filters, features.outdoors),
    },
    {
      label: "Building Features",
      filteredValues: getAndCombineFilterFields(filters, features.building),
    },
  ];

  const onFilterChange = (filterName: string) => {
    setPage(filterName);
  };
  const onSetFilter = () => {
    setFilters((p) => ({
      ...p,
      minNetArea: areaRange[0],
      maxNetArea: areaRange[1],
      ...localFilterState,
    }));
  };
  const onBack = () => {
    onFilterChange('');
    onSetFilter();
  };
  const onClear = () => {
    setFilters((p) => ({
      ...p,
      minNetArea: undefined,
      maxNetArea: undefined,
      hasBalcony: false,
      hasClubhouse: false,
      hasParking: false,
      hasPool: false,
      hasElevator: false,
      hasGarden: false,
      hasGym: false,
      hasPetfriendly: false,
      hasRooftop: false,
      hasWalkup: false,
    }));
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" fontWeight={"bold"}>
            Filters
          </Typography>

          <IconButton
            sx={{ position: "absolute", right: 0, p: 3 }}
            onClick={ onCloseFilters}
          >
            <CloseOutlined />
          </IconButton>
        </Toolbar>
        {additionalFilters.map((f, i) => {
          return (
            <MenuItem key={f.label} divider onClick={() => setPage(f.label)}>
              <ListItemText
                secondary={
                  f.filteredValues?.length ? f.filteredValues : "None selected"
                }
                primary={<Typography fontWeight={500}>{f.label}</Typography>}
              ></ListItemText>
              <ListItemIcon>
                <ChevronRightRounded />
              </ListItemIcon>
            </MenuItem>
          );
        })}
        {hasFilters && <Button onClick={onClear}>Clear filters</Button>}
      </Box>
      <Drawer
        anchor="right"
        PaperProps={{
          style: {
            display: "flex",
            width: "100%",
          },
        }}
        open={open !== ''}
      >
        <Box sx={{ p: 1, width: "100%", position: "relative" }}>
          <Box
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
              alignItems: "center",
            }}
          >
            <IconButton sx={{ position: "absolute", left: 0 }} onClick={onBack}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" fontWeight={"bold"} color="textPrimary">
              {open}
            </Typography>
          </Box>
          {open == "Net Area" && (
            <Box sx={{ p: 2 }}>
              <AreaSlider setAreaRange={setAreaRange} />
            </Box>
          )}

          {open == "Outdoors" && (
            <FiltersOutdoors
              localState={localFilterState}
              onToggleFilter={onToggleFilter}
              filterOptions={features.outdoors}
            />
          )}
          {open == "Building Features" && (
            <FiltersOutdoors
              localState={localFilterState}
              onToggleFilter={onToggleFilter}
              filterOptions={features.building}
            />
          )}
          {open == "Agency / Direct" && (
            <FiltersOutdoors
              localState={localFilterState}
              onToggleFilter={onToggleFilter}
              filterOptions={[{label: 'Direct Listing', name: 'isDirectListing'}, {label: 'Agency', name: 'isAgencyListing'}]}
            />
          )}
        </Box>
      </Drawer>
    </>
  );
};
