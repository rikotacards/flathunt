import { Info } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { addUser } from "../firebase/user";
import { useSnackbarContext } from "../Providers/contextHooks";
import { AddListingAdmin } from "./AddListingAdmin";
interface AddListingUserInfoProps {
  contactNumber?: string;
  realEstateCompany?: string;
  userId: string;
  licenseNumber?: string;
  personalLicenseNumber?: string;
  isDirectListing?: boolean;
  listingSpecificContact?: string;
  listingSpecificLicenseNumber?: string;
  listingSpecificPersonalLicenseNumber?: string;
  listingSpecificRealEstateCompany?: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const AddListingUserInfo: React.FC<AddListingUserInfoProps> = (
  props
) => {
  const {
    userId,
    contactNumber = "",
    realEstateCompany,
    licenseNumber,
    personalLicenseNumber,
    isDirectListing,
    listingSpecificContact,
    listingSpecificLicenseNumber,
    listingSpecificPersonalLicenseNumber,
    listingSpecificRealEstateCompany,
    onFormChange,
  } = props;

  const queryClient = useQueryClient();
  const [isEdit, setEdit] = React.useState(false);
  const [info, setInfo] = React.useState({
    contactNumber,
    realEstateCompany,
    licenseNumber,
    personalLicenseNumber,
  });
  const [isUpdate, setUpdate] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [isModify, setModify] = React.useState(false);
  console.log("INFO", info);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const s = useSnackbarContext();

  const onUpdate = async () => {
    try {
      setModify(false);
      setUpdate(true);
      await addUser({ userId, ...info });
      queryClient.invalidateQueries({
        queryKey: ["getUser"],
      });
      s.setSnackbarChildComponent(
        <Alert severity="success">Updated personal info</Alert>
      );
      setSuccess(true);
      s.toggleSnackbar();
    } catch (e) {
      alert(e);
      setSuccess(false);
    }
    setUpdate(false);
  };
  return (
    <Box elevation={0} component={Paper} sx={{ p: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Review Your Information
      </Typography>
      {
        <>
          {!info.contactNumber?.length && (
            <Box>
              <Typography color="error" sx={{ display: "flex", mb: 1 }}>
                <Info color="error" sx={{ mr: 1 }} />
                Whatsapp number required.
              </Typography>
            </Box>
          )}
          <TextField
            sx={{ mb: 1 }}
            fullWidth
            value={info.contactNumber}
            label="Whatsapp Number"
            name={"contactNumber"}
            onChange={onChange}
            placeholder="Whatsapp number"
            error={!contactNumber}
            slotProps={{
              input: {endAdornment:(contactNumber !== info.contactNumber) ? <InputAdornment position="end"><Button onClick={onUpdate}>Update</Button></InputAdornment>: null}
            }}
          />
          <Typography variant="caption" sx={{ mt: 1 }}>
            We want to make sure customers can reach you. If the information is
            incorrect you can update it here.
          </Typography>
        </>
      }

      {!isDirectListing && (
        <>
          <Divider sx={{ width: "100%", p: 1 }} />
          <Typography sx={{ mt: 1, mb: 2 }} variant="h6">
            Agent Information
          </Typography>
          {!info.personalLicenseNumber && (
            <Box sx={{ display: "flex", mt: 2, mb: 2 }}>
              <Typography
                variant="body2"
                color="error"
                sx={{ display: "flex" }}
              >
                <Info sx={{ mr: 1 }} />
                Agent information missing. It is required for agent listings.
                Next time it will be automatically included.
              </Typography>
            </Box>
          )}
          <FormControl sx={{mb:2}} error fullWidth variant="filled">
            <TextField
              onChange={onChange}
              name="personalLicenseNumber"
              fullWidth
              label={"Salesperson / Agent License Number"}
              value={info.personalLicenseNumber}
              slotProps={{
                input: {
                  endAdornment: info.personalLicenseNumber !==
                    personalLicenseNumber &&
                    !!info?.personalLicenseNumber?.length && (
                      <InputAdornment onClick={onUpdate} position="end">
                        <Button>Update</Button>
                      </InputAdornment>
                    ),
                },
              }}
              placeholder="Salesperson / Agent licenense number"
              sx={{ mb: 0 }}
              // disabled={!isModify}

              error={!info.personalLicenseNumber}
            />
          </FormControl>

          <TextField
            fullWidth
            value={info.realEstateCompany}
            sx={{ mb: 2 }}
            color="primary"
            onChange={onChange}
            name="realEstateCompany"
            label={"Real Estate Company Name"}
 
            placeholder="Real estate company Name"
          />
          <TextField
            fullWidth
            value={info.licenseNumber}
            sx={{ mb: 2 }}
            name="licenseNumber"
            onChange={onChange}
            label="Company License Number"
 
            placeholder="Company license number"
          />
         
          <AddListingAdmin
            onChange={onFormChange}
            listingSpecificContact={listingSpecificContact}
            listingSpecificLicenseNumber={listingSpecificLicenseNumber}
            listingSpecificRealEstateCompany={listingSpecificRealEstateCompany}
            listingSpecificPersonalLicenseNumber={
            listingSpecificPersonalLicenseNumber
            }
          />
        </>
      )}
    </Box>
  );
};
