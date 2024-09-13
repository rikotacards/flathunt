import { Box, Button, Card, MenuItem, MenuList, TextField, Typography } from '@mui/material';
import React from 'react';
import { FiltersPopoverInterface } from '../firebase/types';
const areaFilters = [{ label: 'Min area', name: 'minNetArea' }, { label: 'Max area', name: 'maxNetArea' }]
const area: number[] = [

]
for (let i = 0; i < 2000; i += 100) {
    area.push(i)
}

export const AreaFilter: React.FC<FiltersPopoverInterface> = ({onClose, setFilter, filters }) => {


    return (
        <Card sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', mb: 1 }}>
                {areaFilters.map((p, i) => {
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' , mb:1}}>
                            <Typography fontWeight={'bold'}>{p.label}</Typography>
                            <TextField
                                onChange={(e) => setFilter((p) => ({...p, [e.target.name]: e.target.value}))}
                                sx={{ textAlign: 'center', mb:1, mr: i === 0 ? 1 : 0 }}
                                autoFocus={i === 1}
                                name={p.name} type='number'
                                placeholder={i === 0 ? 'min' : 'max'}
                                size='small'
                                value={i === 0 ? filters?.minNetArea : filters.maxNetArea}
                            />
                            <MenuList sx={{ maxHeight: 200, overflowY: 'scroll' }}>
                                {area.map((a) => <MenuItem
                                    onClick={() => setFilter((p) => ({...p, [i === 0 ? 'minNetArea': 'maxNetArea']: a}))}
                                    sx={{ textAlign: 'right' }}>{a}</MenuItem>)}
                            </MenuList>

                        </Box>
                    )
                })}
            </Box>
            <Button variant='outlined' sx={{mb:1}} fullWidth onClick={() => {onClose(); setFilter((p) => ({...p, minNetArea: undefined, maxNetArea: undefined}))}}>Clear</Button>
            <Button onClick={onClose} variant='contained' fullWidth>done</Button>
        </Card>
    )
}