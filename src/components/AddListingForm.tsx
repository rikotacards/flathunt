import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { addListing } from "../firebase/listings";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
const storage = getStorage();
import update from "immutability-helper";
import { Card } from "./draggableImage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { db, USER_ID } from "../firebase/firebaseConfig";
import CancelIcon from "@mui/icons-material/Cancel";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import ClearIcon from "@mui/icons-material/Clear";
import { hkLocations } from "../listingConfig";
import { IListing } from "../firebase/types";

const bedrooms = [0, 1, 2, 3, 4];
const bathrooms = [1, 2, 3];
const otherProperties = [
  "elevator",
  "balcony",
  "bathtub",
  "Rooftop",
  "Open kitchen",
  "Closed Kitchen",
];
interface AddListingFormProps {
  onClose: () => void;
}
export const AddListingForm: React.FC<AddListingFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [files, setFiles] = React.useState([] as File[]);

  const [form, setForm] = React.useState({
    rentBuy: "rent",
    propertyType: "residential",
  } as IListing);
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
          <Box sx={{ position: "absolute", right: 8 }}>
            <IconButton onClick={() => removeImage(image.fileName, index)}>
              <CancelIcon />
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

  const onClick = (fieldName: string, value: number | string) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onAdd = async () => {
    // get download URLS,
    // add them to the listing
    const docRef = doc(collection(db, "listings"));

    const fileNames = files.map((file) => file.name);
    await handleUpload(USER_ID, docRef.id);
    await setDoc(docRef, {
      ...form,
      rentBuy: form.rentBuy || "rent",
      location: form.location,
      propertyType: form.propertyType,
      price: parseInt(form.price),
      netArea: parseInt(form.netArea),
      grossArea: parseInt(form.grossArea),
      agentId: USER_ID,
      userId: USER_ID,
      images: fileNames,
      dateAdded: serverTimestamp(),
    });
    queryClient.invalidateQueries({ queryKey: ["getAgentListings"] });
    onClose();
  };
  const outlinedOrContained = (condition: boolean) => {
    return condition ? "contained" : "outlined";
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <AppBar position="relative">
        <Toolbar>
          Add Listing
          <IconButton onClick={onClose} color="inherit" sx={{ ml: "auto" }}>
            <ClearIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
            <Typography variant="body2">
              Drag & Drop photos here or click to select photos
            </Typography>
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

          <div>
            {files.map((file, i) => {
              const url = URL?.createObjectURL(file);
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
        <FormControl sx={{ mb: 1, mt: 2 }} fullWidth>
          <Typography variant="h6" fontWeight={'bold'}>Property Type</Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={() => onClick("propertyType", "residential")}
              name="residential"
              fullWidth
              sx={{
                mr: 1,
              }}
              variant={outlinedOrContained(form.propertyType === "residential")}
            >
              Residential
            </Button>
            <Button
              onClick={() => onClick("propertyType", "commercial")}
              name="commercial"
              fullWidth
              variant={outlinedOrContained(form.propertyType === "commercial")}
            >
              Commercial
            </Button>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={'bold'}>To</Typography>

            <Box display={"flex"}>
              <Button
                onClick={() => onClick("rentBuy", "rent")}
                fullWidth
                sx={{
                  mr: 1,
                }}
                variant={outlinedOrContained(form.rentBuy == "rent")}
              >
                Rent
              </Button>
              <Button
                onClick={() => onClick("rentBuy", "buy")}
                fullWidth
                variant={outlinedOrContained(form.rentBuy === "buy")}
              >
                Buy
              </Button>
            </Box>
          </Box>
          <Box>
            <Typography fontWeight={"bold"} variant="h6">
              Bedrooms
            </Typography>
            <Box sx={{ display: "flex" }}>
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
                  variant={form["bedrooms"] === br ? "contained" : "outlined"}
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
          <Typography variant="caption">Location</Typography>

          <Autocomplete
            autoHighlight
            onChange={(e, newValue) => {
              console.log(newValue);
              setForm((p) => ({ ...p, location: newValue }));
            }}
            sx={{ mb: 1 }}
            renderInput={(params) => <TextField placeholder="Select location" {...params} />}
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
              placeholder="Net Area"
              label="Net area"
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
          </Box>

          <Button size='large' sx={{ m: 0 }} variant="contained" onClick={onAdd}>
            Add
          </Button>
        </FormControl>
      </Box>
    </DndProvider>
  );
};
