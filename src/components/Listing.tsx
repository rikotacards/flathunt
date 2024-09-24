import { Box, Button, Card, Chip, IconButton, Typography } from '@mui/material';
import React from 'react';
import { IListing } from '../firebase/listings';
import { ImageWithLoading } from './ImageWithLoading';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
export const Listing: React.FC<IListing> = ({ netArea, address, price, images, listingId, userId, bathrooms, bedrooms, location }) => {

    const imgs = images?.map((image) => <SwiperSlide

        key={image}>
        <ImageWithLoading key={image} imageName={image}
            listingId={listingId}
            userId={userId} />
    </SwiperSlide>)
    return (
        <Card variant='outlined' sx={{ mb: 1 }}>

            <Box sx={{ maxWidth: '600px', pb: 1 }}>
                <Swiper

                    pagination={true}
                    modules={[Navigation, Pagination]}
                >


                    {imgs}

                </Swiper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <IconButton>
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                    <IconButton>
                        <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton>
                        <SendIcon/>
                    </IconButton>

                </Box>
                <Box
                    sx={{ p: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}
                >
                    <Box>
                        <Typography fontWeight={700}>
                            💲  {price} HKD
                        </Typography>
                    </Box>
                    <Box>
                        <Typography>
                            📍 {address}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography>
                            📍 {location}
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
                <Box sx={{pl:1, display: 'flex', justifyContent: 'flex-start' }}>

                    <Chip label='Balcony' />
                    <Chip label='Rooftop' />
                    <Chip label='Walk up' />
                </Box>


            </Box>
            <Button>More</Button>
        </Card>
    )
}