import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Box, Button, Card, Chip, Collapse, IconButton, Input, OutlinedInput, Slider, TextField, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useFilterContext } from '../Providers/contextHooks';
import { getRangeLabel } from '../utils/getRangeLabel';
import { useIsNarrow } from '../utils/useIsNarrow';
const MIN = 6000;
const MAX = 90000
interface PriceFilterNarrowProps {
    open?: boolean;
    onClose?: () => void;
    setPriceRange?: React.Dispatch<React.SetStateAction<number[]>>
    showDone?: boolean;
}
export const PriceFilterNarrow: React.FC<PriceFilterNarrowProps> = ({ onClose, open, showDone, setPriceRange }) => {
    const { filters, setFilters } = useFilterContext();
    const [show, setShow] = React.useState(open)
    const isNarrow = useIsNarrow();
    const [range, setRange] = React.useState([filters.minPrice || 5000, filters.maxPrice || 40000])
    const onChange = (event, newValue) => {
        // setFilters((p) => ({ ...p, minPrice: newValue[0], maxPrice: newValue[1] }))
        setRange(newValue)
        if(setPriceRange){
            setPriceRange(newValue)
        }
    }
    const handleMaxInputChange = (event) => {
        setRange((p) => [p[0], event.target.value]);
        // setFilters((p) => ({ ...p, maxPrice: event.target.value }))
    };
    const handleMinInputChange = (event) => {
        setRange((p) => [event.target.value, p[1]]);
        // setFilters((p) => ({ ...p, minPrice: event.target.value }))

    };
    const handleBlur = () => {
        if (range[0] < 0) {
            setRange((p) => [0, p[1]]);
        }
    };
    const onDone = () => {
        if(filters.maxPrice == range[1] && filters.minPrice == range[0]){
            onClose?.();
            return;
        }
        setFilters((p) => ({ ...p, maxPrice: range[1], minPrice: range[0] }))
        onClose?.();
    }
    const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice, 'HKD')
    return (
        <>
            <Card
                variant={show ? 'elevation' : 'outlined'}
                elevation={show ? 10 : undefined}
                sx={{

                    p: 1,
                    m: 1,
                    width: isNarrow ? undefined: '500px'
                }}>
                {<Box onClick={() => setShow(!show)}
                    sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={'bold'}>Budget</Typography>
                    {!show && <Typography>{priceLabel || 'Set Budget'}</Typography>}
                    {show && <IconButton onClick={() => setShow(false)}><KeyboardArrowUpIcon /></IconButton>}
                </Box>}
                <Collapse in={show}>
                    <Box sx={{ mr: 2, ml: 2 }}>

                        <Slider
                            min={MIN}
                            max={MAX}
                            valueLabelDisplay='auto'
                            step={1000}
                            onChange={onChange}
                            value={range} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant='caption'>Min</Typography>
                            <OutlinedInput
                                value={range[0]}
                                size='small'
                                onFocus={(e) => e?.target.select()}
                                startAdornment={'$'}
                                sx={{
                                    maxWidth: 90,
                                    borderRadius: 5,
                                    p: 1,
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                                onChange={handleMinInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1000,
                                    min: range[0],

                                    style: {
                                        display: 'flex',
                                        textAlign: 'center',
                                        padding: 0,
                                        border: '0px'
                                    },
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                            <Typography variant='caption'>Max</Typography>



                            <OutlinedInput
                                onFocus={(e) => e?.target.select()}
                                startAdornment={'$'}

                                value={range[1]}
                                size='small'
                                sx={{
                                    maxWidth: 90,
                                    borderRadius: 5,
                                    p: 1,
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                                onChange={handleMaxInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1000,
                                    min: range[0],

                                    style: {
                                        display: 'flex',
                                        textAlign: 'center',
                                        padding: 0,
                                    },
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />


                        </Box>

                    </Box>
                    {showDone && <Button onClick={onDone} sx={{ mt: 1 }} fullWidth variant='contained'>
                        done
                    </Button>}
                </Collapse>
            </Card>
        </>
    )
}