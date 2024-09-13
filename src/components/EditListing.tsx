import { AppBar, Box, Button, CircularProgress, DialogTitle, IconButton, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { getListing } from '../firebase/listings';
import { EditListingForm } from './EditListingForm';
interface EditListingProps {
    userId: string;
    listingId: string;
    onClose: () => void;
}
export const EditListing: React.FC<EditListingProps> = ({ userId, listingId, onClose }) => {

    const { data, isLoading, isFetching } = useQuery({ queryKey: ['getListing'], queryFn: () => getListing(listingId), refetchOnMount: true })
    if(isLoading || isFetching){
        return <CircularProgress/>
    }
    return (
        <>
            <AppBar position="relative">
                <Toolbar>Edit

              <IconButton onClick={onClose} color='inherit' sx={{ml: 'auto'}}><ClearIcon/></IconButton>
                </Toolbar>
            </AppBar>
            <Box
            sx={{p:1,

                overflowY: 'scroll',
                height: '100%'
            }}
            
            >
                <EditListingForm {...data} />
            </Box>

        </>
    )
}