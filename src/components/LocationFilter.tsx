import { Box, Button, Card, Checkbox, Chip, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';
import { hkLocations } from '../listingConfig';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
interface LocationFilterProps {
    setFilter?: () => void;
    disableCheckbox?: boolean;
    onClick?: (value: string) => void;
}
export const LocationFilter: React.FC<LocationFilterProps> = ({ disableCheckbox, onClick }) => {
    const [l1Name, setL1Name] = React.useState(hkLocations[0].name)
    const [l2Name, setL2Name] = React.useState(hkLocations[0]?.children?.[0].name)
    const l1 = hkLocations.find((location) => location.name === l1Name)
    const l2 = l1?.children?.find((l) => l.name === l2Name)
    return (<Card sx={{ p: 1 }}>
        <TextField size='small' fullWidth variant='outlined' placeholder='sfearch' sx={{ mb: 1 }} />
        <Card variant='outlined' sx={{ mb: 1, p: 1 }}>
            <Typography fontWeight={'bold'} sx={{ mb: 1 }}>Popular Locations:</Typography>
            <Chip sx={{ mr: 1 }} label='central' />
            <Chip label='Sai Ying Pun' />

        </Card>
        <Card variant='outlined' sx={{mb:1, p:1}}>

            <Box sx={{ display: 'flex' }}>

                <Box >
                    {hkLocations.map((l) => <MenuItem
                        selected={l.name === l1Name}
                        sx={{ mr: 1 }}
                        onClick={() => setL1Name(l.name)}>{l.name}
                        <KeyboardArrowRightIcon sx={{ ml: 'auto' }} />
                    </MenuItem>)}
                </Box>
                <Box>
                    {l1?.children?.map((c) => <MenuItem selected={c.name === l2Name} onClick={() => setL2Name(c.name)} >{c.name}</MenuItem>)}
                </Box>
                <Box sx={{ maxHeight: '300px', overflowY: 'scroll' }}>
                    {l2?.children.map((c) => {
                        return disableCheckbox ? <MenuItem onClick={() => onClick && onClick(c.name?.toLocaleLowerCase())}>
                            {c.name}</MenuItem> : <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox /><Typography>{c.name}</Typography></Box>
                    })}
                </Box>

            </Box>
        </Card>
        {/* <Button variant='contained' fullWidth>Done</Button> */}


    </Card>)
}