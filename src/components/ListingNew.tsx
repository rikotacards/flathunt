import React from 'react';
import { IListing } from '../firebase/types';
import { ListingImage } from './ListingImage';
import Grid from '@mui/material/Grid2';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Slide from '@mui/material/Slide';

import { Box, Button, Dialog, Divider, Fab, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import { USER_ID } from '../firebase/firebaseConfig';
import { saveListing } from '../firebase/listings';
import { ChevronLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css';
export const ListingNew: React.FC<IListing> = (props) => {
    const [open, setOpen] = React.useState(false);
    const nav = useNavigate();
    const { netArea, address, price, images, listingId, userId, bathrooms, bedrooms } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const imgs = images?.map((image) => <SwiperSlide
        style={{ objectFit: 'cover', height: 'auto' }}
        key={image}>
        <ListingImage key={image} imageName={image}
            listingId={listingId}
            userId={userId} />
    </SwiperSlide>)

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


    const imgWithoutGrid = images?.map((image, i) =>
        <div>

            <ListingImage key={image} imageName={image}
                listingId={listingId}
                style={{ width: '100%', height: '100%' }}
                userId={userId} />
        </div>
    )
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    return (
        <>
            <Box sx={{ position: 'relative' }}>
                <Fab size='small'
                    onClick={() => nav(-1)}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        position: 'absolute',
                        left: 16,
                        color: 'white',
                        top: 16,
                        // color: 'white',

                        backdropFilter: 'blur(10px)', border: '1px solid white'
                    }}><ChevronLeft /></Fab>

                <Swiper

                    style={{
                        borderRadius: 20, display: 'relative',
                        "--swiper-pagination-color": "white"

                    }}
                    pagination={true}
                    modules={[Navigation, Pagination]}
                >


                    {imgs}

                </Swiper>
                <Button size='small' variant='outlined' color='inherit' onClick={handleClickOpen} sx={{ backdropFilter: 'blur(10px)', position: 'absolute', right: 16, bottom: 32 }}>Show all photos</Button>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
               
                <Typography variant='h5' fontWeight={700}>
                    {price} HKD
                </Typography>
                <Typography sx={{ml:0.5}}>month</Typography>
                <IconButton size='small' sx={{ml:'auto'}}>
                    <SendIcon />
                </IconButton>
                <IconButton  >
                    <FavoriteBorderIcon/>
                </IconButton>
                <Button variant='contained' sx={{ ml: '', borderRadius: 10, textTransform: 'capitalize', fontWeight: 'bold' }}>
                    Contact
                </Button>
            </Box>
            <Box
                sx={{ p: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}
            >
                <Divider />
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
                TransitionComponent={Transition}
            >
                <Box sx={{ overflowY: 'scroll', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>

                        <Button onClick={handleClose}>close</Button>
                    </Box>

                    {imgWithoutGrid}
                </Box>
            </Dialog>
        </>
    )
}