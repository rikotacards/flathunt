import { Deck, KeyboardArrowDownOutlined } from "@mui/icons-material";
import { Box, Chip, Collapse, IconButton, Typography } from "@mui/material";
import React from "react";
import { IAdditionalFeatures, IListing } from "../firebase/types";
import RoofingIcon from '@mui/icons-material/Roofing';
import DeckIcon from '@mui/icons-material/Deck';
import YardIcon from '@mui/icons-material/Yard';
import StairsIcon from '@mui/icons-material/Stairs';
import ElevatorIcon from '@mui/icons-material/Elevator';
import PoolIcon from '@mui/icons-material/Pool';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Groups2Icon from '@mui/icons-material/Groups2';
import PetsIcon from '@mui/icons-material/Pets';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import BathtubIcon from '@mui/icons-material/Bathtub';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import SailingIcon from '@mui/icons-material/Sailing';
interface OtherFeaturesProps {
  openMoreFeatures: boolean;
  onCloseMoreFeatures: () => void;
  onOpenMoreFeatures: () => void;
  onClick: (fieldName: string, value: string | number | boolean) => void;
}
export const features: IAdditionalFeatures = {
  outdoors: [
    { name: "hasRooftop", label: "rooftop", icon: <RoofingIcon/>, value: 'has roof' },
    { name: "hasBalcony", label: "balcony", icon: <DeckIcon/>, value: 'Has balcony'},
    { name: "hasGarden", label: "garden", icon: <YardIcon/>, value: 'Has Garden'},
  ],
  indoors: [
    {name: 'hasOven', label: 'oven', value: 'has oven', icon:<FireplaceIcon/>},
    {name: 'hasBathtub', label: 'bathtub', value: 'has bathtub', icon:<BathtubIcon/>},
    {name: 'hasOceanView', label: 'ocean view', value: 'has ocean view', icon:<SailingIcon/>}

  ],
  building: [
    { name: "hasWalkup", label: "walkup", icon:<StairsIcon />, value: 'Is walkup' },
    { name: "hasElevator", label: "elevator", icon: <ElevatorIcon/>, value: 'Has elevator'},
    { name: "hasPool", label: "pool", icon: <PoolIcon/>, value: 'Has pool'},
    { name: "hasParking", label: "parking", icon: <LocalParkingIcon/>, value: 'Has parking'},
    { name: "hasGym", label: "gym" , icon: <FitnessCenterIcon/>, value: 'Has gym'},
    { name: "hasClubhouse", label: "clubhouse", icon: <Groups2Icon/>, value: 'has clubhouse'},
    { name: "hasPetFriendly", label: "pet friendly", icon: <PetsIcon/>, value: 'Pet friendly'},
    { name: 'hasSecurity', label: 'concierge / security', value: 'has concierge / security', icon:<RoomServiceIcon/> }
  ],
};
export const OtherFeatures: React.FC<OtherFeaturesProps & IListing> = ({
  openMoreFeatures,
  onCloseMoreFeatures,
  onOpenMoreFeatures,
  onClick,
  hasGarden,
  hasBalcony,
  hasElevator,
  hasGym,
  hasPetFriendly,
  hasRooftop,
  hasWalkup,
  hasSecurity,
  hasBathtub,
  hasClubhouse,
  hasOceanView,
  hasOven,
  hasParking,
  hasPool,
}) => {
  const [otherFeatures, setOtherFeatures] = React.useState({
    hasBalcony,
    hasGarden,
    hasElevator,
    hasPetFriendly,
    hasRooftop,
    hasGym,
    hasWalkup,
    hasSecurity,
    hasBathtub,
  hasClubhouse,
  hasOceanView,
  hasOven,
  hasParking,
  hasPool,
  } as { [key: string]: boolean });
  const onToggle = (fieldName: string) => {
    setOtherFeatures((p) => ({ ...p, [fieldName]: !p?.[fieldName] }));
  };
  const click = (fieldName: string) => {
    onToggle(fieldName);
    onClick(fieldName, !otherFeatures[fieldName]);
  };
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
        <Typography variant="body1" sx={{ mb: 1 }} fontWeight={"bold"}>
          Outdoor space
        </Typography>
        <Box sx={{ display: "flex", mb: 3 }}>
          {features.outdoors.map((f) => (
            <Chip
              onClick={() => click(f.name)}
              variant={otherFeatures[f.name] ? "filled" : "outlined"}
              color={otherFeatures[f.name] ? "primary" : undefined}
              sx={{ mr: 1 }}
              label={f.label}
            />
          ))}
        </Box>
        <Typography sx={{ mb: 1 }} fontWeight={"bold"}>
          Building
        </Typography>
        {features.building.map((f) => (
          <Chip
            onClick={() => click(f.name)}
            variant={otherFeatures[f.name] ? "filled" : "outlined"}
            color={otherFeatures[f.name] ? "primary" : undefined}
            sx={{ mr: 1, mb: 1 }}
            label={f.label}
          />
        ))}
      </Collapse>
    </Box>
  );
};
