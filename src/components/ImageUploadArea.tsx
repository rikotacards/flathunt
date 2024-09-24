import { AddPhotoAlternate } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { Card } from "./draggableImage";
import update from "immutability-helper";
import { DndContext, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ImageUploadAreaProps {
  isEdit: boolean;
  isNarrow: boolean;
  files: File[];
  imageUrlsForPreview: string[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploadProgress: {
    [key: string]: string | number | readonly string[] | undefined;
  };
}
export const ImageUploadArea: React.FC<ImageUploadAreaProps> = (props) => {
  const {
    isEdit,
    isNarrow,
    files,
    imageUrlsForPreview,
    setFiles,
    uploadProgress,
  } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onUploadIconClick = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };
  const removeImage = (fileName: string, index: number) => {
    const input = document.getElementById("files");
    // as an array, u have more freedom to transform the file list using array functions.
    const fileListArr = Array.from(input?.files);
    fileListArr.splice(index, 1); // here u remove the file
    console.log("fileList", fileListArr);
    setFiles((prev) => {
      const newList = [...prev.filter((file) => file.name !== fileName)];

      return newList;
    });
  };
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) {
      return;
    }
    const fileArray = Array.from(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...fileArray]);
  };
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
  const renderCard = React.useCallback(
    (image: { id: string; src: string; fileName: string }, index: number) => {
      return (
        <Box sx={{ position: "relative", m:1 }}>
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
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer) {
      return;
    }
    handleFiles(e.dataTransfer.files);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <DndProvider backend={HTML5Backend}>
        <Box style={{ marginBottom: 1 }}>
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
              flexWrap: "wrap",
              justifyContent: 'center'
            }}
          >
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
        </Box>
      </DndProvider>
    </Box>
  );
};
