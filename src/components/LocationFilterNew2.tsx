import {
  Autocomplete,
  Box,
  Button,
  Card,
  MenuItem,
  MenuList,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFilterContext } from "../Providers/contextHooks";
import { allHkLocations } from "../hongKongLocations";

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
      sx={{mb:1}}
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
        options={allHkLocations}
        renderInput={(params) => (
          <TextField sx={{textTransform: 'capitalize'}} placeholder="Search" {...params} />
        )}
      />
      
      <Card variant="outlined">
        <MenuList
          sx={{
            maxHeight: 300,
            overflowY: "scroll",
            textTransform: "capitalize",
          }}
        >
          {allHkLocations.map((l) => (
            <MenuItem key={l} onClick={() => onMenuItemClick(l)} selected={value === l}>
              {l}
            </MenuItem>
          ))}
        </MenuList>
      </Card>
      <Button size='large' onClick={onClear} variant="outlined" sx={{ mt: 1 , borderRadius:5}}>
        Clear filter
      </Button>
    </Box>
  );
};
