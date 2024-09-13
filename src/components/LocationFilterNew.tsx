import { Box, Card, Chip, Collapse, IconButton, Input, MenuItem, OutlinedInput, TextField, Toolbar, Typography } from '@mui/material';
import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useFilterContext } from '../Providers/contextHooks';
import {  CloseRounded } from '@mui/icons-material';
import { IFilters } from '../firebase/types';
interface LocationFilterNewProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<IFilters>>,
    onClick?: (location: string) => void;
    open?: boolean;
}
export const LocationFilterNew: React.FC<LocationFilterNewProps> = ({ setValue, onClick, open, value }) => {
    const options = ['central', 'wanchai', 'causeway bay', 'kennedy town', 'sayinpun']

    const filtered = options.filter((option) => option.indexOf(value) > -1)

    const [show, setShow] = React.useState(open)
    const onClear = () => {
        setValue((p) => ({ ...p, location: '' }))

    }
    console.log('value:', value)
    return (
        <Box sx={{ p: 1 }}>
            <Card
                variant={show ? 'elevation' : 'outlined'}
                elevation={show ? 10 : undefined}
                sx={{ p: 0 }}
            >
                {<Box onClick={() => setShow(!show)} sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={'bold'}>Where</Typography>
                    {!show && <Typography>{value || 'Add location'}</Typography>}
                    {show && <IconButton onClick={() => setShow(false)}><KeyboardArrowUpIcon /></IconButton>}
                </Box>}
                <Collapse in={show}>
                    <Box sx={{ p: 1 }}>
                        <OutlinedInput
                            endAdornment={<IconButton onClick={onClear}><CloseRounded /></IconButton>}
                            fullWidth
                            onChange={(e) => setValue((p) =>({...p, location: e.target.value}))}
                            value={value}
                        />

                        <Box sx={{ p: 1, m: 1, overflowX: 'scroll', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                            <Chip color='primary' label='Hong Kong Island' sx={{ mr: 1 }} />
                            <Chip label='Kowloon' sx={{ mr: 1 }} />
                            <Chip label='New Territories' sx={{ mr: 1 }} />
                        </Box>
                        {filtered.map((o) => <MenuItem 
                        key={o} sx={{textTransform: 'capitalize'}} 
                        selected={o === value} 
                        onClick={ onClick ? () => {onClick(o)
                            setShow(false)
                         }: () => { setValue((p) =>({...p, location:o})); }} >{o}</MenuItem>)}


                    </Box>
                </Collapse>
            </Card>


        </Box>
    )
}