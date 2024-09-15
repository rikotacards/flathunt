import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  MenuList,
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
const popularLocations = ["Central", "Sheung wan", "Kennedy Town"];
interface LocationFilterNew2Props {
  onClick: (location: string) => void;
  onClose: () => void;
}
export const LocationFilterNew2: React.FC<LocationFilterNew2Props> = ({
  onClick,
  onClose,
}) => {
  const { setFilters, filters } = useFilterContext();
  const onClear = () => {
    setFilters((p) => ({ ...p, location: undefined }));
    onClose();
  };
  const [value, setValue] = React.useState<string|undefined>(filters.location);
  const onMenuItemClick = (l: string) => {
    setValue(l);
    onClick(l);
  };
  return (
    <Box
      textAlign={"left"}
      sx={{
        p: 2,
        pt: 0,
        pb: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{ pb: 1, display: "flex", alignSelf: "center" }}
        variant="h6"
        fontWeight={"bold"}
      >
        Location
      </Typography>

      <Autocomplete
        onClick={() => {
            if(!value){
                return
            }
          onClick(value);
          setValue(value);
        }}
        onChange={(event, newValue) => {
            if(!newValue){
                return;
            }
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
        {popularLocations.map((l) => (
          <Chip
            onClick={() => onClick(l.toLocaleLowerCase())}
            label={l}
            sx={{ textTransform: "capitalize", mr: 1 }}
          />
        ))}
      </Card>
      <Card variant="outlined">
        <MenuList
          sx={{
            maxHeight: 300,
            overflowY: "scroll",
            textTransform: "capitalize",
          }}
        >
          {locations.map((l) => (
            <MenuItem onClick={() => onMenuItemClick(l)} selected={value === l}>
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
