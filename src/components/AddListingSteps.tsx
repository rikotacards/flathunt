import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { AddListingIntro } from "./AddListingIntro";
import { AddListingPropertySpecifics } from "./AddListingPropertySpecifics";
import { AddListingLocation } from "./AddListingLocation";
import { AddListingPrice } from "./AddListingPrice";
import { AddListingPhotos } from "./AddListingPhotos";
import { AddListingReview } from "./AddListingReview";
import { Close } from "@mui/icons-material";
import { AddListingInfo } from "./AddListingInfo";
import { IListing } from "../firebase/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addUser, getUser, updateUser } from "../firebase/user";
import { AddListingUserInfo } from "./AddListingUserInfo";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImageUploadArea } from "./ImageUploadArea";
import { useIsNarrow } from "../utils/useIsNarrow";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, USER_ID } from "../firebase/firebaseConfig";
import { useSnackbarContext } from "../Providers/contextHooks";
import { AddListingOtherFeatures } from "./AddListingOtherFeatures";
import { AddListingValidation } from "./AddListingValidation";

interface AddListingStepsProps {
  onClose: () => void;
  listing?: IListing;
  userId: string;
}
export const AddListingSteps: React.FC<AddListingStepsProps> = ({
  onClose,
  listing,
  userId,
}) => {
  const [step, setStep] = React.useState(0);
  const [files, setFiles] = React.useState([] as File[]);
  const storage = getStorage();
  const imageUrlsForPreview: string[] = [];
  files.map((f) => {
    const url = URL?.createObjectURL(f);

    imageUrlsForPreview.push(url);
  });

  const [uploadProgress, setUploadProgress] = React.useState(
    {} as { [key: string]: string | number | readonly string[] | undefined }
  );
  const onNext = () => {
    setStep((p) => p + 1);
  };
  const onBack = () => {
    setStep((p) => p - 1);
  };
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(userId || ""),
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const downloadUrls: string[] = [];
  const s = useSnackbarContext();
  const [form, setForm] = React.useState({
    ...listing,
    rentBuy: listing?.rentBuy,
    propertyType: listing?.propertyType,
    realEstateCompany: data?.realEstateCompany || "",
    licenseNumber: data?.licenseNumber || "",
    personalLicenseNumber: data?.personalLicenseNumber || "",
  } as IListing);
  const onClick = (fieldName: string, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };
  const [isAdding, setIsAdding] = React.useState(false);
  const isNarrow = useIsNarrow();
  const handleUpload = async (userId: string, listingId: string) => {
    for (const file of files) {
      const storageRef = ref(storage, `${userId}/${listingId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress,
          }));
        },
        (error) => {
          console.error("Upload failed:", error);
          alert(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          downloadUrls.push(url);
        }
      );
    }

    return downloadUrls;
  };

  const docRef = doc(collection(db, "listings"));
  const onAdd = async () => {
    // get download URLS,
    // add them to the listing
    try {
      setIsAdding(true);

      const fileNames = files.map((file) => file.name);
      await handleUpload(userId || USER_ID, docRef.id);
      await setDoc(docRef, {
        ...form,
        rentBuy: form.rentBuy || "rent",
        location: form.location.toLowerCase(),
        propertyType: form.propertyType,
        price: parseInt(form.price),
        netArea: parseInt(form.netArea),
        grossArea: parseInt(form.grossArea),
        userId: userId || USER_ID,
        images: fileNames,
        dateAdded: serverTimestamp(),
        desc: form.desc || "",
      });
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["getAgentListings"] });
      onClose();
      s.setSnackbarChildComponent(
        <Alert severity="success" variant="filled">
          Listing for {form.address}, asking {form.price}, added.
        </Alert>
      );
      s.toggleSnackbar();
    } catch (e) {
      alert(e);
      onClose();
    }
  };
  const isMissingUserInfo = form.isDirectListing
    ? !data?.contactNumber
    : !data?.licenseNumber ||
      !data?.personalLicenseNumber ||
      !data?.contactNumber ||
      !data?.realEstateCompany;
  const info = [
    <AddListingUserInfo
      userId={userId}
      contactNumber={data?.contactNumber}
      realEstateCompany={data?.realEstateCompany}
      licenseNumber={data?.licenseNumber}
      personalLicenseNumber={data?.personalLicenseNumber}
      isDirectListing={form.isDirectListing}
    />,
  ];
  const steps = [
    <AddListingIntro />,
    <AddListingInfo
      onClick={onClick}
      rentBuy={form.rentBuy}
      isDirectListing={form.isDirectListing}
      propertyType={form.propertyType}
    />,
    <AddListingPropertySpecifics
      onClick={onClick}
      onChange={onChange}
      bedrooms={form.bedrooms}
      bathrooms={form.bathrooms}
    />,
    <AddListingLocation
      address={form.address}
      onChange={onChange}
      onClick={onClick}
      location={form.location}
    />,
    <AddListingPrice
      rentBuy={form.rentBuy}
      onChange={onChange}
      price={form.price}
    />,
    <AddListingPhotos>
      <ImageUploadArea
        isEdit={false}
        isNarrow={isNarrow}
        files={files}
        setFiles={setFiles}
        imageUrlsForPreview={imageUrlsForPreview}
        uploadProgress={uploadProgress}
      />
    </AddListingPhotos>,
    <AddListingOtherFeatures onClick={onClick} onChange={onChange} {...form} />,
    <AddListingUserInfo
      userId={userId}
      contactNumber={data?.contactNumber}
      realEstateCompany={data?.realEstateCompany}
      licenseNumber={data?.licenseNumber}
      personalLicenseNumber={data?.personalLicenseNumber}
      isDirectListing={form.isDirectListing}
    />,
    <AddListingReview
      previewUrls={imageUrlsForPreview}
      {...form}
      listingId={docRef.id}
      listingSpecificContact={form.listingSpecificContact}
      licenseNumber={form.listingSpecificLicenseNumber || data?.licenseNumber}
      realEstateCompany={
        form.listingSpecificRealEstateCompany || data?.realEstateCompany || ""
      }
      personalLicenseNumber={form.personalLicenseNumber}
    />,
  ];
  const isListingInfoComplete =
    form.rentBuy && form.isDirectListing !== undefined && !!form.propertyType;
  const isListingSpecificsComplete =
    form.bedrooms !== undefined &&
    form.bathrooms !== undefined &&
    form.netArea !== undefined &&
    form.grossArea !== undefined;

  const isLocationComplete = !!form.address && !!form.location;
  const isPriceComplete = form.price !== undefined && form.price > 0;
  const isNextDisabled: { [key: number]: boolean } = {
    0: false,
    1: !isListingInfoComplete,
    2: !isListingSpecificsComplete,
    3: !isLocationComplete,
    4: !isPriceComplete,
    5: !files.length,
    7: false,
    6: isMissingUserInfo,
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      elevation={0}
      component={Paper}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={"bold"}>
          Flathunt.co
        </Typography>
        <IconButton sx={{ ml: "auto" }} onClick={onClose}>
          <Close />
        </IconButton>
      </Toolbar>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {steps[step]}
      </Box>
      <Toolbar />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          borderTop: 1,
          borderColor: "divider",
          background: "white",
          // height: isNarrow ? undefined : 0,
        }}
      >
        <AddListingValidation requiredSteps={[
            true, 
            step >=1, 
            step>=2,
            step>=3,
            step>=4, 
            step>=5,
            step>=6,
            step>=7,
    


        ]} />
        <Toolbar>
          {step > 0 && (
            <Button sx={{}} onClick={onBack}>
              Back
            </Button>
          )}
          {step == 8 ? (
            <Button
              sx={{ ml: "auto" }}
              startIcon={
                isAdding && <CircularProgress color="inherit" size={20} />
              }
              variant="contained"
              onClick={onAdd}
            >
              List Property
            </Button>
          ) : (
            <Button
              disabled={!!isNextDisabled[step]}
              variant="contained"
              sx={{ ml: "auto" }}
              onClick={onNext}
            >
              Next
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
