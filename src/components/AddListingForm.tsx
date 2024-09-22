import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  OutlinedInput,
  Paper,
  Switch,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import Tab from "@mui/material/Tab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import update from "immutability-helper";
import { Card } from "./draggableImage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { db, USER_ID } from "../firebase/firebaseConfig";
import CancelIcon from "@mui/icons-material/Cancel";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import ClearIcon from "@mui/icons-material/Clear";
import { additionalFeatures, hkLocations } from "../listingConfig";
import { IListing } from "../firebase/types";
import {
  AddPhotoAlternate,
  CheckCircleOutlineOutlined,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import { getUser, updateUser } from "../firebase/user";
import { useIsNarrow } from "../utils/useIsNarrow";
import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { OtherFeatures } from "./OtherFeatures";
import { updateListing } from "../firebase/listings";
const bedrooms = [0, 1, 2, 3, 4, 5];
const bathrooms = [1, 2, 3];

interface AddListingFormProps {
  onClose: () => void;
  userId: string;
  listing?: IListing;
}
interface HeaderWithCheckProps {
  isChecked: boolean;
  text: string;
}
const HeaderWithCheck: React.FC<HeaderWithCheckProps> = ({
  isChecked,
  text,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Box sx={{ alignItems: "center", display: "flex", mr: 0.5 }}>
        {isChecked ? (
          <CheckCircleIcon fontSize="small" color="success" />
        ) : (
          <CheckCircleOutlineOutlined fontSize="small" color="error" />
        )}
      </Box>
      <Typography
        sx={{ mb: 0, textTransform: "capitalize" }}
        fontWeight={"bold"}
        variant="body1"
      >
        {text}
      </Typography>
    </Box>
  );
};
interface FieldLayoutProps {
  children: React.ReactNode;
}
const FieldLayout: React.FC<FieldLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        aligntItems: "center",
        flexDirection: "column",
        width: "100%",
        mb: 2,
      }}
    >
      {children}
    </Box>
  );
};
interface WithCheckWrapperProps {
  children: React.ReactNode;
  isChecked: boolean;
}
const WithCheckWrapper: React.FC<WithCheckWrapperProps> = ({
  children,
  isChecked,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      {isChecked ? (
        <CheckCircleIcon color="success" />
      ) : (
        <CheckCircleOutlineOutlined sx={{ mr: 0.5 }} color="action" />
      )}
      {children}
    </Box>
  );
};
export const AddListingForm: React.FC<AddListingFormProps> = ({
  onClose,
  userId,
  listing,
}) => {
  const queryClient = useQueryClient();
  const isNarrow = useIsNarrow();
  const s = useSnackbarContext();
  const { user } = useAuthContext();
  const isEdit = !!listing;
  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(userId || ""),
  });
  const [form, setForm] = React.useState({
    ...listing,
    rentBuy: listing?.rentBuy || "rent",
    propertyType: listing?.propertyType || "residential",
    realEstateCompany: data?.realEstateCompany,
    licenseNumber: data?.licenseNumber,
    personalLicenseNumber: data?.personalLicenseNumber,
  } as IListing);
  console.log("form", form);
  const canAdd =
    data?.personalLicenseNumber &&
    form.licenseNumber &&
    form.realEstateCompany &&
    data?.contactNumber;

  const [tabIndex, setTabIndex] = React.useState(0);
  const [files, setFiles] = React.useState([] as File[]);
  const onUpdateRealEstateCompany = async () => {
    if (!form.realEstateCompany) {
      return;
    }
    await updateUser(userId, { realEstateCompany: form.realEstateCompany });
  };
  const onUpdateLicenseNumber = async () => {
    try {
      if (!form.licenseNumber) {
        return;
      }
      await updateUser(userId, { licenseNumber: form.licenseNumber });
    } catch (e) {
      alert(e);
    }
  };
  const onUpdatePersonalLicenseNumber = async () => {
    try {
      if (!form.personalLicenseNumber) {
        return;
      }
      await updateUser(userId, { licenseNumber: form.personalLicenseNumber });
    } catch (e) {
      alert(e);
    }
  };
  const onUpdate = async () => {
    try {
      // get download URLS,
      // add them to the listing
      // const docRef = doc(collection(db, "listings"));
      setIsAdding(true);
      // const fileNames = files.map((file) => file.name)
      // await handleUpload(USER_ID, docRef.id)
      if (!listing) {
        alert("Please supply listing ID to edit");
        return;
      }
      await updateListing(listing.listingId, {
        ...form,
        price: parseInt(form.price),
      });
      // await addListing()
      queryClient.invalidateQueries({
        queryKey: ["getAgentListings"],
        exact: true,
      });
      s.setSnackbarChildComponent(
        <Alert severity="success" variant="filled">
          Updated
        </Alert>
      );
      s.toggleSnackbar();
      onClose();
    } catch (e) {
      setIsAdding(false);
      onClose();
      s.setSnackbarChildComponent(
        <Alert severity="error">Error updating</Alert>
      );
    }
  };
  const storage = getStorage();
  const [isAdding, setIsAdding] = React.useState(false);
  const [contactNumber, setContactNumber] = React.useState<
    string | undefined
  >();
  const onChangeContactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactNumber(e.target.value);
  };
  const imageUrlsForPreview = [];
  console.log("ffff", form);
  React.useEffect(() => {
    setContactNumber(data?.contactNumber);
    setForm({
      rentBuy: listing?.rentBuy || "rent",
      propertyType: listing?.propertyType || "residential",
      realEstateCompany: data?.realEstateCompany,
      licenseNumber: data?.licenseNumber,
      ...listing,
    } as IListing);
  }, [isLoading, listing]);

  const [uploadProgress, setUploadProgress] = useState(
    {} as { [key: string]: string | number | readonly string[] | undefined }
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const downloadUrls: string[] = [];
  const moveCard = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setFiles((prevCards: File[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as File],
          ],
        })
      );
    },
    []
  );
  const isPersonalInfoComplete = Boolean(
    contactNumber && form.licenseNumber && form.realEstateCompany
  );
  const removeImage = (fileName: string, index: number) => {
    const input = document.getElementById("files");
    // as an array, u have more freedom to transform the file list using array functions.
    const fileListArr = Array.from(input.files);
    fileListArr.splice(index, 1); // here u remove the file
    console.log("fileList", fileListArr);
    setFiles((prev) => {
      const newList = [...prev.filter((file) => file.name !== fileName)];

      return newList;
    });
  };

  const renderCard = React.useCallback(
    (image: { id: string; src: string; fileName: string }, index: number) => {
      return (
        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", right: 0 }}>
            <IconButton onClick={() => removeImage(image.fileName, index)}>
              <CancelIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <Card
            key={image.id}
            index={index}
            id={image.id}
            src={image.src}
            moveCard={moveCard}
          />
        </Box>
      );
    },
    []
  );
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) {
      return;
    }
    const fileArray = Array.from(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...fileArray]);
  };
  const onUploadIconClick = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };
  const disableTabs = true;
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer) {
      return;
    }
    handleFiles(e.dataTransfer.files);
  };
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

  const onClick = (fieldName: string, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onAdd = async () => {
    // get download URLS,
    // add them to the listing
    try {
      setIsAdding(true);
      const docRef = doc(collection(db, "listings"));

      const fileNames = files.map((file) => file.name);
      await handleUpload(userId || USER_ID, docRef.id);
      await setDoc(docRef, {
        ...form,
        rentBuy: form.rentBuy || "rent",
        location: form.location,
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
  const [openMoreFeatures, setMoreFeatures] = React.useState(true);
  const onOpenMoreFeatures = () => {
    setMoreFeatures(true);
  };
  const onCloseMoreFeatures = () => {
    setMoreFeatures(false);
  };
  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const outlinedOrContained = (condition: boolean) => {
    return condition ? "filled" : "outlined";
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{
              flexBasis: 1,
              flexGrow: 1,
              textTransform: "capitalize",
              textAlign: "left",
              justifyContent: "flex-start",
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Typography
            sx={{ flexGrow: 1, flexBasis: 1, textTransform: "capitalize" }}
            fontWeight={"bold"}
          >
            {isEdit ? "Edit Listing" : "Add Listing"}
          </Typography>
          <Box sx={{ flexGrow: 1, flexBasis: 1 }} />
        </Toolbar>

        {!disableTabs && (
          <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth">
            <Tab label="edit" />
            <Tab label="Preview" />
          </Tabs>
        )}
      </Box>
      {tabIndex == 0 && (
        <>
          <Box
            sx={{
              // maxHeight: "600px",
              display: "flex",
              flexDirection: "column",
              p: 2,
              overflowY: "scroll",
            }}
          >
            <HeaderWithCheck isChecked={files.length > 0} text={"Add Photos"} />

            <div style={{ marginBottom: "20px" }}>
              <div
                onDrop={handleDrop}
                onClick={onUploadIconClick}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: "2px dashed #ccc",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  cursor: "pointer",
                  display: isEdit ? "none" : "visible",
                }}
              >
                {isNarrow ? (
                  <AddPhotoAlternate color="action" />
                ) : (
                  <Typography variant="body2">
                    Drag & Drop photos here or click to select photos
                  </Typography>
                )}
              </div>

              <input
                type="file"
                id="files"
                multiple
                accept="image/*"
                ref={inputRef}
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: "none", marginBottom: "20px" }}
              />

              <div
                id={"photo-grid"}
                style={{
                  borderRadius: 5,
                  display: "flex",
                  flexWrap: "nowrap",
                  overflowX: "auto",
                }}
              >
                {files.map((file, i) => {
                  const url = URL?.createObjectURL(file);
                  imageUrlsForPreview.push(url);
                  return (
                    <div key={file.name}>
                      {renderCard(
                        { src: url, id: file.name, fileName: file.name },
                        i
                      )}
                      {uploadProgress[file.name] && (
                        <progress value={uploadProgress[file.name]} max="100">
                          {uploadProgress[file.name]}%
                        </progress>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <FieldLayout>
              <HeaderWithCheck
                isChecked={!!form.rentBuy && !!form.propertyType}
                text={"Property Info"}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  onClick={() => onClick("rentBuy", "rent")}
                  sx={{
                    mr: 1,
                  }}
                  label="For Rent"
                  variant={outlinedOrContained(form.rentBuy === "rent")}
                />

                <Chip
                  label="Sale"
                  onClick={() => onClick("rentBuy", "sale")}
                  variant={outlinedOrContained(form.rentBuy === "sale")}
                />
              </Box>
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck
                isChecked={form.isDirectListing !== undefined}
                text={"Agency fee / no fee"}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  onClick={() => onClick("isDirectListing", false)}
                  sx={{
                    mr: 1,
                  }}
                  label="Agent Listing (agency fee)"
                  variant={outlinedOrContained(form.isDirectListing === false)}
                />

                <Chip
                  label="Direct Listing (no fee)"
                  onClick={() => onClick("isDirectListing", true)}
                  variant={outlinedOrContained(form.isDirectListing === true)}
                />
              </Box>
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck
                isChecked={!!form.propertyType}
                text="Property Type"
              />
              <Box sx={{}}>
                <Chip
                  onClick={() => onClick("propertyType", "residential")}
                  label="residential"
                  sx={{
                    mr: 1,
                  }}
                  variant={outlinedOrContained(
                    form.propertyType === "residential"
                  )}
                />

                <Chip
                  onClick={() => onClick("propertyType", "commercial")}
                  label="commercial"
                  variant={outlinedOrContained(
                    form.propertyType === "commercial"
                  )}
                />
              </Box>
            </FieldLayout>

            <Box
              sx={{
                display: "flex",
                aligntItems: "center",
                flexDirection: "column",
                width: "100%",
                mb: 3,
              }}
            >
              <HeaderWithCheck
                isChecked={form.bedrooms !== undefined}
                text={"Bedrooms"}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {bedrooms.map((br, i) => (
                  <Chip
                    onClick={() => onClick("bedrooms", br)}
                    label={br === 0 ? "Studio" : br}
                    sx={{
                      mb: 0,
                      ml: i == 0 ? 0 : 0,
                      mr: 1,
                      width: "100%",
                      textTransform: "capitalize",
                      fontWeight: form["bedrooms"] === br ? "bold" : undefined,
                    }}
                    variant={form["bedrooms"] === br ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Box>
            <FieldLayout>
              <HeaderWithCheck
                isChecked={form.bathrooms !== undefined}
                text={"Bathrooms"}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {bathrooms.map((br, i) => (
                  <Chip
                    sx={{ mb: 0, ml: i == 0 ? 0 : 1, width: "100%" }}
                    onClick={() => setForm((p) => ({ ...p, bathrooms: br }))}
                    variant={form.bathrooms === br ? "filled" : "outlined"}
                    label={br}
                  />
                ))}
              </Box>
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck text="location" isChecked={!!form.location} />
              <Autocomplete
                autoHighlight
                fullWidth
                size="small"
                value={form.location}
                onChange={(e, newValue) => {
                  if (!newValue) {
                    return;
                  }
                  setForm((p) => ({ ...p, location: newValue }));
                }}
                sx={{}}
                renderInput={(params) => (
                  <TextField placeholder="Select location" {...params} />
                )}
                options={["central", "wanchai"]}
              />
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck
                text="Monthly rent (HKD)"
                isChecked={!!form.price}
              />
              <TextField
                required
                size="small"
                fullWidth
                name="price"
                type="tel"
                placeholder="80000"
                onChange={onChange}
                value={form.price}
              />
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck
                text="Building name or address"
                isChecked={!!form.address}
              />
              <TextField
                required
                name="address"
                type="text"
                size="small"
                fullWidth
                placeholder="Million City, 28 Elgin street"
                onChange={onChange}
                value={form.address}
              />
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck
                text="Net Area (sqft)"
                isChecked={!!form.netArea}
              />
              <TextField
                required
                size="small"
                fullWidth
                name="netArea"
                value={form.netArea}
                type="tel"
                placeholder="Net Area (sqft)"
                label="Net Area (sqft)"
                onChange={onChange}
              />
            </FieldLayout>
            <FieldLayout>
              <HeaderWithCheck
                text="Gross Area (sqft)"
                isChecked={!!form.grossArea}
              />
              <TextField
                value={form.grossArea}
                name="grossArea"
                size="small"
                fullWidth
                type="tel"
                placeholder="Gross Area"
                label="Gross Area"
                onChange={onChange}
              />
            </FieldLayout>
            <FieldLayout>
              <Typography fontWeight={"bold"} variant="body1" sx={{ mb: 1 }}>
                Description
              </Typography>
              <OutlinedInput
                multiline
                minRows={3}
                name={"desc"}
                value={form.desc}
                onChange={onChange}
                placeholder="Tell us more, eg. Located near many restaurants, 5 min walk to..."
              />
            </FieldLayout>
            <OtherFeatures
              openMoreFeatures={openMoreFeatures}
              onCloseMoreFeatures={onCloseMoreFeatures}
              onOpenMoreFeatures={onOpenMoreFeatures}
              onClick={onClick}
              {...form}
            />

            <Typography variant="h5" fontWeight={"bold"} sx={{ mb: 2, mt: 2 }}>
              Your Information
            </Typography>
            {!isPersonalInfoComplete && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mb: 2, alignItems: "center", display: "flex" }}
              >
                <ErrorIcon color="warning" sx={{ mr: 1 }} />
                Your information is required before posting so users can contact
                you directly.
              </Typography>
            )}

            <TextField
              sx={{ mb: 1 }}
              name="contactNumber"
              type="tel"
              label={"Whatsapp Number"}
              placeholder="12345678"
              disabled={!!data?.contactNumber}
              onChange={onChangeContactNumber}
              value={contactNumber}
            />
            {!form.isDirectListing && <>
            <TextField
              sx={{ mb: 1 }}
              name="realEstateCompany"
              type="string"
              label={"Real Estate Company Name"}
              placeholder="Best Property Agency"
              disabled={!!data?.realEstateCompany}
              onChange={onChange}
              value={form.realEstateCompany}
              onBlur={onUpdateRealEstateCompany}
            />

            <TextField
              sx={{ mb: 1 }}
              name="licenseNumber"
              type="string"
              label={"Company License Number"}
              placeholder="C054899"
              disabled={!!data?.licenseNumber}
              onChange={onChange}
              value={form.licenseNumber}
              onBlur={onUpdateLicenseNumber}
            />

            <TextField
              sx={{ mb: 1 }}
              name="personalLicenseNumber"
              type="string"
              label="Personal License Number"
              placeholder="E-123456"
              disabled={!!data?.personalLicenseNumber}
              onChange={onChange}
              value={form.personalLicenseNumber}
              onBlur={onUpdatePersonalLicenseNumber}
            />
            </>}

            <Divider sx={{ mb: 1 }} />
            {user?.uid === "uqox5IKaBVPE6YctRGXXKcYJQpR2" && (
              <Box
                component={Paper}
                sx={{ p: 2 }}
                color={"primary"}
                variant="outlined"
              >
                <Typography variant="h5" fontWeight={"bold"}>
                  Admin Options
                </Typography>
                <Typography variant="caption">
                  Used for adding on behalf of agents.
                </Typography>
                <OutlinedInput
                  name="listingSpecificContact"
                  onChange={onChange}
                  type="tel"
                  sx={{ mb: 1 }}
                  fullWidth
                  placeholder="Listing-specific Whatsapp contact"
                />
                <TextField
                  name="listingSpecificRealEstateCompany"
                  onChange={onChange}
                  type="text"
                  fullWidth
                  sx={{ mb: 1 }}
                  placeholder="Listing-specific real estate company name"
                />
                <TextField
                  name="listingSpecificLicenseNumber"
                  onChange={onChange}
                  type="text"
                  fullWidth
                  sx={{ mb: 1 }}
                  placeholder="Listing-specific License Number"
                />
              </Box>
            )}
            <Button
              onClick={isEdit ? onUpdate : onAdd}
              disabled={!canAdd}
              size="large"
              sx={{ position: "relative", bottom: 0, zIndex: 3, opacity: 1 }}
              variant="contained"
            >
              {isEdit
                ? isAdding
                  ? "Saving"
                  : "Save Changes"
                : isAdding
                  ? "Adding"
                  : "Add Listing"}
            </Button>
          </Box>
        </>
      )}
    </DndProvider>
  );
};
