import React from 'react';
import { IListing } from '../firebase/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { USER_ID } from '../firebase/firebaseConfig';
import { Alert, Box, Button, Card,  Collapse, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { InsertLink, OpenInNew } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbarContext } from '../Providers/contextHooks';
import { copy } from '../utils/copy';
import { deleteListings } from '../firebase/listings';
import { useQueryClient } from '@tanstack/react-query';

export const ListingCard: React.FC<IListing & {handleOpen: (listingId: string) => void}> = (props) => {
    const s = useSnackbarContext();
    const queryClient = useQueryClient();

    const [onDeleteClick, setDeleteClick] = React.useState(false);
    const toggleDeleteDialog = () => {
        setDeleteClick(!onDeleteClick)
    }
    const deleteListing = async (listingId: string) => {
        try {
            await deleteListings([listingId], USER_ID)
            queryClient.invalidateQueries({ queryKey: ['getAgentListings'], exact: true })

        } catch (e) {
            alert(e)
        }
    }
    const onCopyLinkClick = (link: string) => {
        copy(link)
        s.setSnackbarChildComponent(<Alert
            severity='success'
        >
            Link copied
        </Alert>
        )
        s.toggleSnackbar()
    }
    const { handleOpen, netArea, price, address, bedrooms, images, listingId, userId, location } = props;
    const [open, setOpen] = React.useState(false);
    return <Card raised={open} variant={open ? 'elevation' : 'outlined'}
        sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>


        <Box sx={{ p: 1, display: 'flex', textAlign: 'left', flexDirection: 'column' }}>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>
                <Card variant='outlined' sx={{p:0.5,  mr: 1, textAlign: 'left', flexDirection: 'column' }}>
                    <Typography variant='body2'>${price}</Typography>
                </Card>
                <Card variant='outlined' sx={{p:0.5,  mr: 1, textAlign: 'left', flexDirection: 'column' }}>
                    <Typography sx={{ textTransform: 'capitalize' }} variant='body2'>{location}</Typography>
                </Card>
                <Card variant='outlined' sx={{p:0.5,  width: '70px', mr: 1, textAlign: 'left', flexDirection: 'column' }}>
                    <Typography variant='body2'>{bedrooms} Br</Typography>
                </Card>
                <Card variant='outlined' sx={{p:0.5,  mr: 1, textAlign: 'left', flexDirection: 'column' }}>
                    <Typography variant='body2'>{netArea} sqft (net)</Typography>
                </Card>
                <Box sx={{ ml: 'auto' }}>
                    <IconButton onClick={() => { setOpen(!open) }}><KeyboardArrowDownIcon /></IconButton>
                </Box>
            </Box>

            <Typography sx={{ mt: 1 }} variant='caption'>{address}</Typography>
        </Box>
        <Collapse in={open}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box>

                    <IconButton onClick={ () => handleOpen(listingId)}><EditIcon /></IconButton>
                </Box>
                <Box>

                    <IconButton onClick={() => onCopyLinkClick(`flathunt.co/listing/${listingId}`)}><InsertLink /></IconButton>
                </Box>
                <Box>

                    <IconButton><OpenInNew /></IconButton>
                </Box>
                <Box>

                    <IconButton onClick={toggleDeleteDialog}><DeleteIcon /></IconButton>
                </Box>
            </Box>
        </Collapse>

        <Dialog

            open={onDeleteClick}
            onClose={toggleDeleteDialog}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <DialogContent>
                Are you sure you want to delete this listing?
                <DialogActions>
                    <Button onClick={toggleDeleteDialog} variant='outlined'>cancel</Button>

                    <Button onClick={() => deleteListing(listingId)} color='error' variant='contained'>Delete</Button>
                </DialogActions>
            </DialogContent>

        </Dialog>


    </Card>
}