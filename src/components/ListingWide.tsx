import React from 'react';
import { IListing } from '../firebase/types';
import { ListingImage } from './ListingImage';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Box, Button, Card, Dialog, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { USER_ID } from '../firebase/firebaseConfig';
import { saveListing } from '../firebase/listings';
import { ChevronLeft, KeyboardArrowDownOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css';
export const ListingWide: React.FC<IListing> = (props) => {
    const [open, setOpen] = React.useState(false);
    const nav = useNavigate();
    const [openContactForm, setOpenContactForm] = React.useState(false);
    const toggleContactForm = () => {
        setOpenContactForm(!openContactForm);
    }
    const { netArea, address, price, images, listingId, userId, bathrooms, bedrooms, location } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const photos = images?.map((image) =>
        <Box sx={{ m: 1 }}>

            <ListingImage key={image} imageName={image}
                listingId={listingId}
                style={{ height: '100%', width: '100%', borderRadius: 16, margin: 8 }}
                userId={userId} />
        </Box>
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


    const imgWithoutGrid = images?.map((image) =>

        <Box sx={{ maxWidth: '700px' }}>

            <ListingImage key={image} imageName={image}
                listingId={listingId}
                style={{ width: '100%', height: 'auto' }}
                userId={userId} />
        </Box>

    )

    return (
        <Box sx={{ position: 'relative' }}>
            <Toolbar />
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
            <Box sx={{ height: '400px', 
                position: 'relative', 
                display: 'flex', 
                justifyContent: 'center' }}>

                {photos?.length > 3 ? [photos[0], [photos[1], photos[2]]] : photos}


                {photos?.length > 1 && <Button size='small' variant='outlined' color='inherit' onClick={handleClickOpen} sx={{ backdropFilter: 'blur(10px)', position: 'absolute', right: 16, bottom: 32, color: 'white' }}>Show all photos</Button>}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <Box sx={{ textAlign: 'left', ml: 1, flexGrow: 4, display: 'flex', flexDirection: 'column' }}>

                    <Typography variant='h4' fontWeight={'bold'}>{' 📍' + address}</Typography>
                    <Box sx={{ml:1, mt:1}}>

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

                </Box>

                <Card raised
                    sx={{
                        flexGrow: 1,
                        mt: 1, backdropFilter: 'blur(20px)', m: 1, display: 'flex', alignItems: 'center', p: 1,
                        borderRadius: 10
                    }}>
                    <Box sx={{ pl: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', justifyContent: 'center' }}>

                        <Typography sx={{ lineHeight: 1, mt: 1 }} variant='h6' fontWeight={700}>
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
                        size='large'
                        sx={{ ml: 1, borderRadius: 10, textTransform: 'capitalize', fontWeight: 'bold' }}>
                        Contact
                    </Button>
                </Card>
            </Box>




            <Dialog
                open={open}

                onClose={handleClose}
            >
                <Box sx={{ p: 1, position: 'relative', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>

                        <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                    </Box>
                    <Box sx={{ overflowY: 'scroll', maxHeight: 500 }}>

                        {imgWithoutGrid}
                    </Box>

                </Box>
            </Dialog>

            <Dialog
                open={openContactForm}
                onClose={() => setOpenContactForm(false)}

            ><AppBar position='relative' >
                    <Toolbar>
                        <Typography>Contact agent</Typography>
                        <IconButton onClick={() => setOpenContactForm(false)} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>

                    <TextField placeholder='Your contact number' sx={{ mb: 1 }} />
                    <Card variant='outlined' sx={{ p: 1, mb: 1 }}>
                        <Typography variant='caption'>
                        Your contact will be sent to the agent.
                        The agent will reach out to you as soon as possible. In addition, your contact will be saved for future agent requests.
                        </Typography>
                    </Card>
                    <Button onClick={() => setOpenContactForm(false)} variant='contained'>Send</Button>
                </Box>

            </Dialog>
        </Box>
    )
}