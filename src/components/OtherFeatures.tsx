import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { Box, Chip, Collapse, IconButton, Typography } from "@mui/material";
import React from "react";
interface OtherFeaturesProps {
  openMoreFeatures: boolean;
  onCloseMoreFeatures: () => void;
  onOpenMoreFeatures: () => void;
  onClick: (fieldName: string, value: string | number | boolean) => void;
}
const features = {
    outdoors: [{name: 'hasRooftop', label: 'Rooftop'}, 
        {name: 'hasBalcony', label: 'balcony'},
        {name: 'hasGarden', label: 'garden'}
    ],
    building: [
        {name: 'isWalkup', label: 'walkup'}, 
        {name: 'hasElevator', label: 'elevator'},
        {name: 'hasPool', label: 'pool'},
        {name: 'hasParking', label: 'parking'},
        {name: 'hasGym', label: 'gym'},
        {name: 'hasClubhouse', label: 'clubhouse'},
        {name: 'isPetFriendly', label: 'pet friendly'},]
}
export const OtherFeatures: React.FC<OtherFeaturesProps> = ({
  openMoreFeatures,
  onCloseMoreFeatures,
  onOpenMoreFeatures,
  onClick
}) => {
   const [otherFeatures, setOtherFeatures] = React.useState({} as {[key: string]: boolean})
   const onToggle = (fieldName: string) => {
    setOtherFeatures((p) => ({...p, [fieldName]: !p?.[fieldName]}))
   }
   const click = (fieldName: string) => {
    onToggle(fieldName)
    onClick(fieldName, !otherFeatures[fieldName])
   }
  return (
    <Box>
      <Box
        onClick={openMoreFeatures ? onCloseMoreFeatures : onOpenMoreFeatures}
        sx={{ display: "flex", pt: 1, pb: 1 }}
      >
        <Typography sx={{ pt: 1, pb: 1 }} variant="h5" fontWeight={"bold"}>
          Additional Features
        </Typography>
        <IconButton sx={{ ml: "auto" }}>
          <KeyboardArrowDownOutlined />
        </IconButton>
      </Box>
      <Collapse in={openMoreFeatures}>
        <Typography variant='body1' sx={{mb:1}} fontWeight={'bold'}>Outdoor space</Typography>
        <Box sx={{display: 'flex', mb:3}}>

        {features.outdoors.map((f) => <Chip onClick={() => click(f.name)} variant={otherFeatures[f.name] ? 'filled' : 'outlined'} color={otherFeatures[f.name] ? 'primary' : undefined}  sx={{mr:1}} label={f.label}/>)}
        </Box>
        <Typography sx={{mb:1}} fontWeight={'bold'}>Building</Typography>
        {features.building.map((f) => <Chip onClick={() => click(f.name)} variant={otherFeatures[f.name] ? 'filled' : 'outlined'} color={otherFeatures[f.name] ? 'primary' : undefined} sx={{mr:1, mb:1}} label={f.label}/>)}

      </Collapse>
    </Box>
  );
};
