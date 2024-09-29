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
import App from "../App";
import { useNavigate } from "react-router";
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
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
  const nav = useNavigate();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const s = useSnackbarContext();
  const [form, setForm] = React.useState({
    ...listing,
    rentBuy: listing?.rentBuy,
    propertyType: listing?.propertyType,
    realEstateCompany:  data?.realEstateCompany || "",
    licenseNumber: data?.licenseNumber || "",
    personalLicenseNumber: data?.personalLicenseNumber || "",
  } as IListing);
  const onClick = (fieldName: string, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };
  const [isAdding, setIsAdding] = React.useState(false);
  const isNarrow = useIsNarrow();
  
  const uploadFile = async(file: File, listingId: string)=>{
    const url = `https://api.cloudinary.com/v1_1/rikotacards/upload`;
    const fd = new FormData();
    fd.append('upload_preset', 'public');
    fd.append('tags', 'browser_upload'); // Optional - add tags for image admin in Cloudinary
    fd.append('file', file);
    fd.append('folder', `listings/${listingId}`);

  
   const res = await fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data scuces', data.secure_url)
        // File uploaded successfully
        const url = data.secure_url;
        
        // Create a thumbnail of the uploaded image, with 150px width
        const tokens = url.split('/');
        tokens.splice(-3, 0, 'w_150,c_scale');
        const img = new Image();
        img.src = tokens.join('/');
        img.alt = data.public_id;
       return url
        // document.getElementById('gallery').appendChild(img);
      })
      .catch((error) => {
        console.error('Error uploading the file:', error);
      });
    return res
  }
  const handleUpload = async (userId: string, listingId: string) => {
    const uploadPromise = files.map((f) => uploadFile(f, listingId))
    const res = await Promise.all(uploadPromise)
    console.log('handle wait', res)
    return res
    // for (const file of files) {
      //  uploadFile(file)
      
      // const storageRef = ref(storage, `${userId}/${listingId}/${file.name}`);
      // const uploadTask = uploadBytesResumable(storageRef, file);

      // uploadTask.on(
      //   "state_changed",
      //   (snapshot) => {
      //     const progress =
      //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //     setUploadProgress((prevProgress) => ({
      //       ...prevProgress,
      //       [file.name]: progress,
      //     }));
      //   },
      //   (error) => {
      //     console.error("Upload failed:", error);
      //     alert(error);
      //   },
      //   async () => {
      //     const url = await getDownloadURL(uploadTask.snapshot.ref);
      //     downloadUrls.push(url);
      //   }
      // );
    // }

  };
  
  const docRef = doc(collection(db, "listings"));
  const onAdd = async () => {
    
    
    // get download URLS,
    // add them to the listing
    try {
      setIsAdding(true);

      const fileNames = files.map((file) => file.name);
      const res = await handleUpload(userId || USER_ID, docRef.id);
      console.log('AFRER UPLOD', res)
      await setDoc(docRef, {
        ...form,
        rentBuy: form.rentBuy || "rent",
        location: form.location.toLowerCase(),
        propertyType: form.propertyType,
        price: parseInt(form.price),
        netArea: parseInt(form.netArea),
        grossArea: parseInt(form.grossArea),
        userId: userId || USER_ID,
        // images: fileNames,
        dateAdded: serverTimestamp(),
        desc: form.desc || "",
        imageUrls: res
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
      nav('/listings')
      
    } catch (e) {
      alert(e);
      onClose();
    }
  };
  const isMissingUserInfo = form.isDirectListing
    ? !data?.contactNumber
    : !data?.personalLicenseNumber ||
      !data?.contactNumber
  
     
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
      contactNumber={data?.contactNumber || ''}
      realEstateCompany={data?.realEstateCompany || ''}
      licenseNumber={data?.licenseNumber || ''}
      personalLicenseNumber={data?.personalLicenseNumber || ''}
      listingSpecificContact={form.listingSpecificContact || ''}
      listingSpecificPersonalLicenseNumber={form.listingSpecificPersonalLicenseNumber}
      listingSpecificLicenseNumber={form.listingSpecificLicenseNumber}
      listingSpecificRealEstateCompany={form.listingSpecificRealEstateCompany}
      isDirectListing={form.isDirectListing}
      onFormChange={onChange}
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
      personalLicenseNumber={form.personalLicenseNumber || data?.personalLicenseNumber}
    />,
  ];
  const isListingInfoComplete =
    form.rentBuy && form.isDirectListing !== undefined && !!form.propertyType;
  const isListingSpecificsComplete =
    form.bedrooms !== undefined &&
    form.bathrooms !== undefined &&
    form.netArea !== undefined 

  const isLocationComplete = !!form.address && !!form.location;
  const isPriceComplete = form.price !== undefined && form.price > 0;
  const isNextDisabled: { [key: number]: boolean } = {
    0: false,
    1: !isListingInfoComplete,
    2: !isListingSpecificsComplete,
    3: !isLocationComplete,
    4: !isPriceComplete,
    5: !files.length,
    7: isMissingUserInfo,
    6: false,
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
      <AppBar  elevation={0} position="fixed" sx={{ background: "white" }}>
        <Toolbar>
          <Typography color='textPrimary' variant="h6" fontWeight={"bold"}>
            Flathunt.co
          </Typography>
          <IconButton sx={{ ml: "auto" }} onClick={onClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar/>
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
        <AddListingValidation
          requiredSteps={[
            step >= 1,
            step >= 2,
            step >= 3,
            step >= 4,
            step >= 5,
            step >= 6,
            step >= 7,
            step >= 8,
          ]}
        />
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
            
              disabled={isNextDisabled[step]}
              variant="contained"
              sx={{ ml: "auto", textTransform: "capitalize" }}
              onClick={onNext}
              size="large"
            >
              {step === 0 ? "Get Started" : "Next"}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
