import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Card, Button, Typography } from "@mui/material";
import React from "react";
interface NoResultsProps {
  onClear: () => void;
}
export const NoResults: React.FC<NoResultsProps> = ({ onClear }) => {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <SentimentVeryDissatisfiedIcon />
      <Typography>Try to broaden your search</Typography>
      <Button onClick={onClear}>clear filters</Button>
    </Card>
  );
};
