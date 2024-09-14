import { CarCrash, Menu } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  MenuList,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFilterContext } from "../Providers/contextHooks";
const locations = [
  "central",
  "wanchai",
  "kennedy town",
  "causeway bay",
  "Sheung Wan",
  "Happy Valley",
  "Quarry Bay",
  "Admirality",
  "Lohas Park",
];

interface LocationFilterNew2Props {
  onClick: (location: string) => void;
  onClose: () => void;
}
export const LocationFilterNew2: React.FC<LocationFilterNew2Props> = ({
  onClick,
  onClose,
}) => {
const {setFilters} = useFilterContext();
const onClear = () => {
    setFilters((p) => ({...p, location: undefined}))
    onClose();
}
  const [value, setValue] = React.useState();
  const onMenuItemClick = (l: string) => {
    setValue(l);
    onClick(l);
  };
  return (
    <Box
      textAlign={"left"}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ mb: 1 }} variant="body1" fontWeight={"bold"}>
        Location
      </Typography>

      <Autocomplete
        onClick={() => {onClick(value); setValue(value)}}
        onChange={(event, newValue) => {
          setValue(newValue);
          onClick(newValue);
        }}
        size="small"
        value={value}
        options={locations}
        renderInput={(params) => (
          <TextField placeholder="Choose a location" {...params} />
        )}
      />
      <Card
        sx={{
          p: 1,
          mb: 1,
          mt: 1,
        }}
        variant="outlined"
      >
        <Typography sx={{ mb: 1 }}>Popular locations</Typography>
        <Chip label={"central"} sx={{ mr: 1 }} />
        <Chip label={"Causeway Bay"} />
      </Card>
      <Card variant="outlined">
          <MenuList sx={{maxHeight:300, overflowY:'scroll', textTransform: "capitalize" }}>
            {locations.map((l) => (
              <MenuItem
                onClick={() => onMenuItemClick(l)}
                selected={value === l}
              >
                {l}
              </MenuItem>
            ))}
          </MenuList>
      </Card>
      <Button onClick={onClear} variant="outlined" sx={{ mt: 1 }}>
        Clear filter
      </Button>
      <Button onClick={onClose} variant="outlined" sx={{ mt: 1 }}>
        Cancel
      </Button>
    </Box>
  );
};
