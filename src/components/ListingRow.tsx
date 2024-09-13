import React from 'react';

import './ListingRow.css'
import { IListing } from '../firebase/types';
import { Alert, Box, Button, Collapse, Dialog, DialogActions, DialogContent, IconButton, Paper, Typography } from '@mui/material';
import { InsertLink, KeyboardArrowDownSharp, OpenInNew } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbarContext } from '../Providers/contextHooks';
import { copy } from '../utils/copy';
import { USER_ID } from '../firebase/firebaseConfig';
import { deleteListings } from '../firebase/listings';
import EditIcon from '@mui/icons-material/Edit';

import DeleteIcon from '@mui/icons-material/Delete';

export const ListingRow: React.FC<IListing> = (props) => {
    const { price, location, address, netArea, bedrooms, listingId } = props
    const [open, setOpen] = React.useState(false);
    const toggleOpen = () => {
        setOpen(!open)
    }
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
    return (
        <Paper className='grid-container'>
            <Typography
                variant='caption'
                className='item1'>Price
            </Typography>
            <Typography
                variant='body1'
                className='item1'>${price}
            </Typography>
            <Typography
                variant='caption'
                className='item2'>location
            </Typography>
            <Typography
                variant='body1'
                className='item2'>{location}
            </Typography>

            <Typography variant='body1'
                className='item3'>{netArea}
            </Typography>

            <Typography variant='body1'
                className='item4'>{bedrooms}
            </Typography>
            <Box className='action'>
                <IconButton onClick={toggleOpen} size='small'>
                    <KeyboardArrowDownSharp />
                </IconButton>
            </Box>
            <Typography sx={{ mt: 0 }} variant='caption'
                className='item5'>{address}</Typography>
            <Box className='item6'>
                <Collapse in={open}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Box>

                            <IconButton onClick={() => handleOpen(listingId)}><EditIcon /></IconButton>
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

            </Box>

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
        </Paper>
    )
}