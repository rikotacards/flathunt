import {
  Box,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Typography,
} from "@mui/material";
import React from "react";
import { features, OtherFeatures } from "./OtherFeatures";

import Checkbox from "@mui/material/Checkbox";
import { useFilterContext } from "../Providers/contextHooks";
import { FilterField, IFilters } from "../firebase/types";

interface FiltersOutdoorsProps {
    filterOptions: FilterField[],
    onToggleFilter: (fieldName: keyof IFilters, value: boolean) => void
    localState: IFilters
}
export const FiltersOutdoors: React.FC<FiltersOutdoorsProps> = ({filterOptions, localState, onToggleFilter}) => {
  
  
  
  return (
    <Box>
      {filterOptions.map((f) => (
        <MenuItem onClick={() => onToggleFilter(f.name, !localState[f.name])} divider>
          <Typography sx={{ textTransform: "capitalize" }}>
            {f.label}
          </Typography>
          <Checkbox checked={!!localState[f.name]} sx={{ ml: "auto" }} />
        </MenuItem>
      ))}
    </Box>
  );
};
