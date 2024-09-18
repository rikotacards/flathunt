import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  OutlinedInput,
  Paper,
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
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import { getUser, updateUser } from "../firebase/user";
import { useIsNarrow } from "../utils/useIsNarrow";
import { useAuthContext } from "../Providers/contextHooks";
import { OtherFeatures } from "./OtherFeatures";
const bedrooms = [0, 1, 2, 3, 4];
const bathrooms = [1, 2, 3];

interface AddListingFormProps {
  onClose: () => void;
  userId: string;
}
export const AddListingForm: React.FC<AddListingFormProps> = ({
  onClose,
  userId,
}) => {
  const queryClient = useQueryClient();
  const isNarrow = useIsNarrow();
  const { user } = useAuthContext();
  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(userId || ""),
  });
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
  const storage = getStorage();
  const [isAdding, setIsAdding] = React.useState(false);
  const [contactNumber, setContactNumber] = React.useState<
    string | undefined
  >();
  const onChangeContactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactNumber(e.target.value);
  };
  const imageUrlsForPreview = [];
  const [form, setForm] = React.useState({
    rentBuy: "rent",
    propertyType: "residential",
    realEstateCompany: data?.realEstateCompany,
    licenseNumber: data?.licenseNumber,
  } as IListing);
  React.useEffect(() => {
    setContactNumber(data?.contactNumber);
    setForm({
      rentBuy: "rent",
      propertyType: "residential",
      realEstateCompany: data?.realEstateCompany,
      licenseNumber: data?.licenseNumber,
    } as IListing);
  }, [isLoading]);
 
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
        desc: form.desc,
      });
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["getAgentListings"] });
      onClose();
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
    return condition ? "contained" : "outlined";
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
          <Button sx={{ textTransform: "capitalize" }} onClick={onClose}>
            Cancel
          </Button>
          <Typography sx={{ textTransform: "capitalize" }} fontWeight={"bold"}>
            Add Listing
          </Typography>
          <Button
            onClick={onAdd}
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
            startIcon={isAdding ? <Box sx={{  alignItems: 'center'}}><CircularProgress size='small'  sx={{height:20, width:20}}/></Box> :<AddIcon />}
          >
            Add
          </Button>
        </Toolbar>

        <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth">
          <Tab label="edit" />
          {/* <Tab label="Preview" /> */}
        </Tabs>
      </Box>
      {tabIndex == 0 && (
        <>
          <Box
            sx={{
              maxHeight: "600px",
              display: "flex",
              flexDirection: "column",
              p: 2,
              overflowY: "scroll",
            }}
          >
            <div>
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
            <FormControl sx={{ mb: 2, mt: 0 }} fullWidth>
              <Typography variant="h6" fontWeight={"bold"}>
                Property Information
              </Typography>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Button
                  onClick={() => onClick("rentBuy", "rent")}
                  name="rent"
                  fullWidth
                  sx={{
                    mr: 1,
                  }}
                  variant={outlinedOrContained(form.rentBuy === "rent")}
                >
                  For Rent
                </Button>
                <Button
                  onClick={() => onClick("rentBuy", "sale")}
                  name="sale"
                  fullWidth
                  variant={outlinedOrContained(form.rentBuy === "sale")}
                >
                  For Sale
                </Button>
              </Box>
              <Box sx={{ display: "flex", mb:2 }}>
                <Button
                  onClick={() => onClick("propertyType", "residential")}
                  name="residential"
                  fullWidth
                  sx={{
                    mr: 1,
                  }}
                  variant={outlinedOrContained(
                    form.propertyType === "residential"
                  )}
                >
                  Residential
                </Button>
                <Button
                  onClick={() => onClick("propertyType", "commercial")}
                  name="commercial"
                  fullWidth
                  variant={outlinedOrContained(
                    form.propertyType === "commercial"
                  )}
                >
                  Commercial
                </Button>
              </Box>

              <Box>
                <Typography fontWeight={"bold"} variant="h6">
                  Bedrooms
                </Typography>
                <Box sx={{ display: "flex", mb:1 }}>
                  {bedrooms.map((br, i) => (
                    <Button
                      value={form["bedrooms"]}
                      name="bedrooms"
                      onClick={() => onClick("bedrooms", br)}
                      sx={{
                        mb: 1,
                        ml: i == 0 ? 0 : 1,
                        textTransform: "capitalize",
                      }}
                      variant={
                        form["bedrooms"] === br ? "contained" : "outlined"
                      }
                      fullWidth
                    >
                      {br === 0 ? "Studio" : br}
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography fontWeight={"bold"} variant="h6">
                  Bathrooms
                </Typography>
                <Box sx={{ display: "flex" }}>
                  {bathrooms.map((br, i) => (
                    <Button
                      sx={{ mb: 1, ml: i == 0 ? 0 : 1 }}
                      onClick={() => setForm((p) => ({ ...p, bathrooms: br }))}
                      variant={form.bathrooms === br ? "contained" : "outlined"}
                      fullWidth
                    >
                      {br}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Autocomplete
                autoHighlight
                onChange={(e, newValue) => {
                  if (!newValue) {
                    return;
                  }
                  setForm((p) => ({ ...p, location: newValue }));
                }}
                sx={{ mb: 1 }}
                renderInput={(params) => (
                  <TextField placeholder="Select location" {...params} />
                )}
                options={["central", "wanchai"]}
              />

              <TextField
                sx={{ mb: 1 }}
                label="Price"
                required
                name="price"
                type="tel"
                placeholder="Monthly rent (HKD)"
                onChange={onChange}
              />
              <TextField
                label="Building name or address"
                sx={{ mb: 1 }}
                required
                name="address"
                type="text"
                placeholder="building name or address"
                onChange={onChange}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  sx={{ mb: 1 }}
                  required
                  name="netArea"
                  type="tel"
                  placeholder="Net Area (sqft)"
                  label="Net Area (sqft)"
                  onChange={onChange}
                />
                <TextField
                  sx={{ mb: 1 }}
                  name="grossArea"
                  type="tel"
                  placeholder="Gross Area"
                  label="Gross Area"
                  onChange={onChange}
                />
                <OutlinedInput
                  multiline
                  minRows={3}
                  name={"desc"}
                  onChange={onChange}
                  placeholder="Tell us more, eg. Located near many restaurants, 5 min walk to..."
                />
                <OtherFeatures
                  openMoreFeatures={openMoreFeatures}
                  onCloseMoreFeatures={onCloseMoreFeatures}
                  onOpenMoreFeatures={onOpenMoreFeatures}
                  onClick={onClick}
                />

                <Typography
                  variant="h5"
                  fontWeight={"bold"}
                  sx={{ mb: 2, mt: 2 }}
                >
                  Your Information
                </Typography>
                {!isPersonalInfoComplete && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mb: 2, alignItems: "center", display: "flex" }}
                  >
                    <ErrorIcon color="warning" sx={{ mr: 1 }} />
                    Your information is required before posting so users can
                    contact you directly.
                  </Typography>
                )}
                <Typography variant="body2">Whatsapp Number</Typography>

                <TextField
                  sx={{ mb: 1 }}
                  name="contactNumber"
                  type="tel"
                  placeholder="Whatsap Number"
                  disabled={!!data?.contactNumber}
                  onChange={onChangeContactNumber}
                  value={contactNumber}
                />
                <Typography variant="body2">
                  Real Estate Company Name
                </Typography>
                <TextField
                  sx={{ mb: 1 }}
                  name="realEstateCompany"
                  type="string"
                  placeholder="Company Name"
                  disabled={!!data?.realEstateCompany}
                  onChange={onChange}
                  value={form.realEstateCompany}
                  onBlur={onUpdateRealEstateCompany}
                />

                <Typography variant="body2">Company License Number</Typography>

                <TextField
                  sx={{ mb: 1 }}
                  name="licenseNumber"
                  type="string"
                  placeholder="License Number"
                  disabled={!!data?.licenseNumber}
                  onChange={onChange}
                  value={form.licenseNumber}
                  onBlur={onUpdateLicenseNumber}
                />
              </Box>

              <Divider sx={{ mb: 1 }} />
              {user?.uid === "uqox5IKaBVPE6YctRGXXKcYJQpR2" && (
                <Box component={Paper} sx={{p:2,}} color={'primary'} variant="outlined">
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
            </FormControl>
          </Box>
        </>
      )}
    </DndProvider>
  );
};
