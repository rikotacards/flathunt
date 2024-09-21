import { Check } from "@mui/icons-material";
import { Box, ListItemIcon, MenuItem, MenuList, Typography } from "@mui/material";
import React from "react";

interface SortPanelProps {
  onLowestSortPrice: () => void;
  onHighestSortPrice: () => void;
  onLowestSortArea: () => void;
  onHighestSortArea: () => void;
}
export const SortPanel: React.FC<SortPanelProps> = ({
    onHighestSortArea, 
    onLowestSortArea,
    onHighestSortPrice, onLowestSortPrice }) => {
  const [selected, setSelected] = React.useState<null | number>(null);
  const setSelectedMenu = (index: number) => {
    setSelected(index)
  }
  const onSortClick = (i:number, sortFn: () => void) => {
    setSelectedMenu(i)
    sortFn()
  }
    const sortOptions = [
    { label: "lowest price", sortFn: onLowestSortPrice },
    { label: "highest price", sortFn: onHighestSortPrice },
    { label: "largest area" , sortFn: onHighestSortArea},
    { label: "smallest area" , sortFn: onLowestSortArea},
  ];
  const options = sortOptions.map((o, i ) => <MenuItem 
  sx={{textTransform: 'capitalize'}} 
  key={o.label} onClick={() => onSortClick(i, o.sortFn)}>
    <ListItemIcon>
       {selected === i && <Check/>}
    </ListItemIcon>
    {o.label}
  
  </MenuItem>);
  return (
    <Box>
      <MenuList>{options}</MenuList>
    </Box>
  );
};
