import { Box, Chip, TextField, Typography } from "@mui/material";
import React from "react";
import { features, OtherFeatures } from "./OtherFeatures";
import { IListing } from "../firebase/types";
interface AddListingOtherFeaturesProps {
  onClick: (fieldName: string, value: string | number | boolean) => void;
  hasGarden?: boolean;
  hasElevator?: boolean;
  hasGym?: boolean;
  hasPetFriendly?: boolean;
  hasWalkup?: boolean;
  hasBalcony?: boolean;
  hasRooftop?: boolean;
  desc?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const AddListingOtherFeatures: React.FC<
  AddListingOtherFeaturesProps
> = ({
  onClick,
  hasGarden,
  hasBalcony,
  hasElevator,
  hasGym,
  hasPetFriendly,
  hasRooftop,
  hasWalkup,
  desc,
  onChange,
}) => {
  const [otherFeatures, setOtherFeatures] = React.useState({
    hasBalcony,
    hasGarden,
    hasElevator,
    hasPetFriendly,
    hasRooftop,
    hasGym,
    hasWalkup,
  } as { [key: string]: boolean });
  const onToggle = (fieldName: string) => {
    setOtherFeatures((p) => ({ ...p, [fieldName]: !p?.[fieldName] }));
  };
  const click = (fieldName: string) => {
    onToggle(fieldName);
    onClick(fieldName, !otherFeatures[fieldName]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        What makes your place special?
      </Typography>
      <Box>
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
        <Typography variant="body1" sx={{ mb: 1 }} fontWeight={"bold"}>
          Indoor space
        </Typography>
        <Box sx={{ display: "flex", mb: 3 }}>
          {features.indoors.map((f) => (
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
          Building Features
        </Typography>
        <Box sx={{ mb: 2 }}>
          {features.building.map((f) => (
            <Chip
              onClick={() => click(f.name)}
              variant={otherFeatures[f.name] ? "filled" : "outlined"}
              color={otherFeatures[f.name] ? "primary" : undefined}
              sx={{ mr: 1, mb: 1 }}
              label={f.label}
            />
          ))}
        </Box>
      </Box>
      <Typography sx={{ mb: 1 }} fontWeight={"bold"}>
        Description
      </Typography>
      <Typography variant='caption' sx={{ mb: 1 }}>
        optional
      </Typography>
      <TextField
        multiline
        fullWidth
        placeholder="Only 3 minutes from subway. Near gym."
        minRows={3}
        name={"desc"}
        value={desc}
        onChange={onChange}
      />
    </Box>
  );
};
