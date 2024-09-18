import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { getListing } from "../firebase/listings";
import { EditListingForm } from "./EditListingForm";
import { AddListingForm } from "./AddListingForm";
interface EditListingProps {
  userId: string;
  listingId: string;
  onClose: () => void;
}
export const EditListing: React.FC<EditListingProps> = ({
  userId,
  listingId,
  onClose,
}) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["getListing"],
    queryFn: () => getListing(listingId),
    refetchOnMount: true,
  });
  if (isLoading || isFetching) {
    return <CircularProgress />;
  }
  return (

      <AddListingForm onClose={onClose} listing={data} userId={userId} />
  
  );
};
