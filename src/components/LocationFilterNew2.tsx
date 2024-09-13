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
const locations = ["central", "wanchai", "kennedy town", "causeway bay"];

interface LocationFilterNew2Props {
  onClick: (location: string) => void;
  onClose: () => void;
}
export const LocationFilterNew2: React.FC<LocationFilterNew2Props> = ({
  onClick,
  onClose,
}) => {
  const [value, setValue] = React.useState();
  const onMenuItemClick = (l: string) => {
    setValue(l);
    onClick(l);
  };
  return (
    <Box
      elevation={0}
      component={Paper}
      textAlign={"left"}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontWeight={"bold"}>Where</Typography>

      <Autocomplete
        onClick={() => onClick(value)}
        onChange={(event, newValue) => {
          setValue(newValue);
          onClick(newValue);
        }}
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
        <MenuList sx={{ textTransform: "capitalize" }}>
          {locations.map((l) => (
            <MenuItem onClick={() => onMenuItemClick(l)} selected={value === l}>
              {l}
            </MenuItem>
          ))}
        </MenuList>
      </Card>
      <Button onClick={onClose} variant='outlined' sx={{mt:1}}>Cancel</Button>
    </Box>
  );
};
