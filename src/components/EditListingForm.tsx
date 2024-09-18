import { Autocomplete, Box, Button, Checkbox, FormControlLabel, IconButton, Input, TextField, Typography } from '@mui/material';
import { IListing, updateListing } from '../firebase/listings';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';
const storage = getStorage();
import update from 'immutability-helper'
import { Card } from './draggableImage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CancelIcon from '@mui/icons-material/Cancel';
import { bathrooms, bedrooms, fields, additionalFeatures } from '../listingConfig';



export const EditListingForm: React.FC<IListing& {onClose: () => void}> = (props) => {
    const queryClient = useQueryClient();
    const [files, setFiles] = React.useState([] as File[]);

    const [form, setForm] = React.useState(props as IListing);
    const [uploadProgress, setUploadProgress] = useState({} as { [key: string]: string | number | readonly string[] | undefined });
    const inputRef = React.useRef<HTMLInputElement>(null);
    const downloadUrls: string[] = []
    const moveCard = React.useCallback((dragIndex: number, hoverIndex: number) => {
        setFiles((prevCards: File[]) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex] as File],
                ],
            }),
        )
    }, [])

    const removeImage = (fileName: string, index: number) => {

        const input = document.getElementById('files');
        // as an array, u have more freedom to transform the file list using array functions.
        const fileListArr = Array.from(input.files);
        fileListArr.splice(index, 1); // here u remove the file
        setFiles((prev) => {
            const newList = [...prev.filter((file) => file.name !== fileName)];

            return newList
        })
    }


    const renderCard = React.useCallback(
        (image: { id: string; src: string, fileName: string }, index: number) => {
            return (
                <div>
                    <IconButton onClick={() => removeImage(image.fileName, index)}>

                        <CancelIcon />
                    </IconButton>
                    <Card
                        key={image.id}
                        index={index}
                        id={image.id}
                        src={image.src}
                        moveCard={moveCard}
                    />
                </div>
            )
        },
        [],
    )
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
            console.log(inputRef.current.value)
        }
    }

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
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [file.name]: progress,
                    }));
                },
                (error) => {
                    console.error('Upload failed:', error);
                    alert(error)
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref)
                    downloadUrls.push(url)
                }
            );

        }

        return downloadUrls
    };





    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const onClick = (br: number) => {
        setForm((prev) => ({ ...prev, bedrooms: br }))
    }

    const onUpdate = async () => {
        // get download URLS, 
        // add them to the listing
        // const docRef = doc(collection(db, "listings"));

        // const fileNames = files.map((file) => file.name)
        // await handleUpload(USER_ID, docRef.id)

        await updateListing(props.listingId, { ...form, price: parseInt(form.price), fileNames: props.images })
        // await addListing()
        queryClient.invalidateQueries({queryKey:['getAgentListings'],exact: true})
        props.onclose()

    }

    return (
        <DndProvider backend={HTML5Backend}>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div
                        onDrop={handleDrop}
                        onClick={onUploadIconClick}
                        onDragOver={(e) => e.preventDefault()}
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            textAlign: 'center',
                            marginBottom: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        Drag & Drop files here or click to select files
                    </div>

                    <input
                        type="file"
                        id='files'
                        multiple
                        accept='image/*'
                        ref={inputRef}
                        onChange={(e) => handleFiles(e.target.files)}
                        style={{ display: 'none', marginBottom: '20px' }}
                    />


                    <div>
                        {files.map((file, i) => {
                            const url = URL?.createObjectURL(file)
                            return (
                                <div key={file.name}>
                                    {renderCard({ src: url, id: file.name, fileName: file.name }, i)}
                                    {uploadProgress[file.name] && (
                                        <progress value={uploadProgress[file.name]} max="100">
                                            {uploadProgress[file.name]}%
                                        </progress>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Autocomplete
                    disablePortal
                    fullWidth
                    onChange={(event, newValue) => {
                        setForm((p) => ({...p, ['location']: newValue}))
                    }}
                    options={['central', 'wanchai', 'causeway bay', 'kennedy town', 'sheung wan']}
                    sx={{ mb:1 }}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                />
                {fields.map((f) => <TextField
                    value={form[f.name]} sx={{ mb: 1 }} onChange={onChange} {...f} />)}
                <Box>
                    <Typography>Bedrooms</Typography>
                    {bedrooms.map((br) => <Button
                        value={form['bedrooms']}
                        name='bedrooms'
                        onClick={() => onClick(br)}
                        sx={{ mb: 1 }}
                        variant={form['bedrooms'] === br ? 'contained' : 'outlined'}
                        fullWidth>{br === 0 ? 'Studio' : br}
                    </Button>)}
                </Box>
                <Box>
                    <Typography>bathrooms</Typography>
                    {bathrooms.map((br) => <Button
                        sx={{ mb: 1 }}
                        onClick={() => setForm((p) => ({ ...p, bathrooms: br }))}
                        variant={form.bathrooms === br ? 'contained' : 'outlined'} fullWidth>{br}Br</Button>)}
                </Box>


                

                <Button sx={{ m: 1 }} variant='contained' onClick={onUpdate}>Update</Button>

            </Box>
        </DndProvider>

    )
}