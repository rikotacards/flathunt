import React from 'react';
import { IListing } from '../firebase/types';
import { ListingImage } from './ListingImage';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { AppBar, Box, Button, Card, Dialog, Divider, Drawer, Fab, IconButton, Paper, TextField, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { USER_ID } from '../firebase/firebaseConfig';
import { addContactRequest, saveListing } from '../firebase/listings';
import { ChevronLeft, KeyboardArrowDownOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { serverTimestamp } from 'firebase/firestore';


export const ListingVerticalLayout: React.FC<IListing> = (props) => {
    const [open, setOpen] = React.useState(false);
    const nav = useNavigate();
    const [number, setNumber] = React.useState('')
    const [openContactForm, setOpenContactForm] = React.useState(false);
    const toggleContactForm = () => {
        setOpenContactForm(!openContactForm);
    }
    const { netArea, address, price, images, listingId, userId, bathrooms, bedrooms, location } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const photos = images?.map((image) =>

        <ListingImage key={image} imageName={image}
            listingId={listingId}
            style={{ height: '100%', width: '100%', borderRadius: 16, marginBottom: 8 }}
            userId={userId} />
    )

    const handleClose = () => {
        setOpen(false);
    };
    const onSaveListing = async () => {
        try {
            await saveListing({ userId: USER_ID, listingId })
        } catch (e) {
            alert(e)
        }
    }
    const onSendContact = async()=> {
        try {
            await addContactRequest({
                contactNumber: number,
                sendingUserId: USER_ID, receivingUserId: USER_ID, listingId, message: '',
            
            })
        } catch(e){
            alert(e)
        }
    }


    const imgWithoutGrid = images?.map((image, i) =>

        <Box sx={{ mb: 0.5 }}>

            <ListingImage key={image} imageName={image}
                listingId={listingId}
                style={{ width: '100%', height: 'auto' }}
                userId={userId} />
        </Box>

    )

    return (
        <Box sx={{ position: 'relative' }}>
            <IconButton size='small'
                onClick={() => nav(-1)}
                sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    position: 'fixed',
                    color: 'white',
                    top: 16,
                    left: 16,
                    zIndex: 999,



                    backdropFilter: 'blur(10px)',
                    border: '1px solid white'
                }}><ChevronLeft />
            </IconButton>
            <Box sx={{ position: 'relative' }}>




                <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 5, overflow: 'hidden' }}>
                    {photos}
                </Box>

                {photos?.length > 1 && <Button size='small' variant='outlined' color='inherit' onClick={handleClickOpen} sx={{ backdropFilter: 'blur(10px)', position: 'absolute', right: 16, bottom: 32, color: 'white' }}>Show all photos</Button>}
            </Box>
            <Box sx={{ position: 'sticky', bottom: 0, mt: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Card raised sx={{ backdropFilter: 'blur(20px)', m: 1, display: 'flex', width: '100%', alignItems: 'center', p: 1, borderRadius: 10 }}>
                    <Box sx={{ pl: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', justifyContent: 'center' }}>

                        <Typography sx={{ lineHeight: 0.5, mt: 1 }} variant='h6' fontWeight={700}>
                            {price} HKD
                        </Typography>
                        <Box>
                            <Typography sx={{ textTransform: 'capitalize' }} variant='caption'>
                                {location} /
                            </Typography>
                            <Typography sx={{ ml: 0.5 }} variant='caption'>
                                {netArea} sqft
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton size='small' sx={{ ml: 'auto' }}>
                        <SendIcon />
                    </IconButton>
                    <IconButton onClick={onSaveListing}  >
                        <FavoriteBorderIcon />
                    </IconButton>
                    <Button onClick={toggleContactForm} variant='contained'
                        sx={{ ml: '', borderRadius: 10, textTransform: 'capitalize', fontWeight: 'bold' }}>
                        Contact
                    </Button>
                </Card>
            </Box>

            <Box sx={{ border: '1px solid white', textAlign: 'left' }}>

                <Box sx={{ mt: 1 }}>
                    <Typography>
                        📍 {address}
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        🛌  {bedrooms} bedrooms
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        🛁  {bathrooms} bathroom(s)
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        📐  {netArea} sqft (net)
                    </Typography>
                </Box>

            </Box>


            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ overflowY: 'scroll', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>

                        <Button onClick={handleClose}>close</Button>
                    </Box>

                    {imgWithoutGrid}
                </Box>
            </Dialog>

            <Drawer
                open={openContactForm}
                anchor='bottom'
                onClose={() => setOpenContactForm(false)}

            ><AppBar position='relative' >
                    <Toolbar>
                        <Typography>Contact agent</Typography>
                        <IconButton onClick={() => setOpenContactForm(false)} sx={{ml:'auto'}}><KeyboardArrowDownOutlined/></IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>

                    <TextField
                    onChange={(e) => setNumber(e.target.value)}
                    type='number' placeholder='Your contact number' sx={{ mb: 1 }} />
                    <Card variant='outlined' sx={{ p: 1, mb: 1 }}>
                        <Typography variant='caption'>
                            Your contact will be sent to the agent.
                            The agent will reach out to you as soon as possible. In addition, your contact will be saved for future agent requests.
                        </Typography>
                    </Card>
                    <Button onClick={() => {
                        onSendContact()
                        setOpenContactForm(false)}} variant='contained'>Submit</Button>
                </Box>

            </Drawer>
        </Box>
    )
}