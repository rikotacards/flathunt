import { Box, Button, Card, Fab, IconButton, Popover, Typography } from '@mui/material';
import React from 'react';
import { useFilterContext } from '../Providers/contextHooks';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ClearRounded, SearchOutlined } from '@mui/icons-material';
import { getRangeLabel } from '../utils/getRangeLabel';
import { BedroomsFilter } from './BedroomsFilter';
import { getBedroomsLabel } from '../utils/getBedroomsLabel';
import { PriceFilterNarrow } from './PriceFilterNarrow';
import { LocationFilterNew } from './LocationFilterNew';
import { IFilters } from '../firebase/types';

interface SearchBarWideProps {
    showMore?: boolean;
    disablePropertyType?: boolean;
    disableRedirect?: boolean;
    disableApiCall?: boolean;
}
export const SearchBarWide: React.FC<SearchBarWideProps> = ({ disableApiCall, disableRedirect, showMore, disablePropertyType }) => {
    const [searchForm, setSearchForm] = React.useState({} as IFilters);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { filters, setFilters } = useFilterContext();

    const queryClient = useQueryClient();
    const [priceRange, setPriceRange] = React.useState([0, 0])
    const hasFilters = filters.location || filters.maxPrice || filters.minPrice || filters.bedrooms
    const [filterName, setFilterName] = React.useState('')
    const [rentBuy, setRentBuy] = React.useState('rent')
    const onRentBuyClick = (e) => {
        setRentBuy(e.target.name)
    }
    const onClear = () => {
        setFilters({})
        if (disableApiCall) {
            return
        }
        queryClient.invalidateQueries({ queryKey: ['getAllListingsWithResult'] })

    }
    const onPriceRangeClose = () => {
        setFilters((p) => ({ ...p, minPrice: priceRange[0], maxPrice: priceRange[1] }))
        queryClient.invalidateQueries({ queryKey: ['getAllListingsWithResult'] })
        setAnchorEl(null)
    }

    const nav = useNavigate();

    const onFilterClick = (event) => {
        setFilterName(event.currentTarget.name)
        setAnchorEl(event.currentTarget);

    };

    const handleClose = () => {
        if (!disableApiCall) {
            queryClient.invalidateQueries({ queryKey: ['getAllListingsWithResult'] })
        }

        setAnchorEl(null);
    };
    const onLocationClick = (location: string) => {
        setFilters((p) => ({ ...p, location: location || undefined }))
        if (!disableApiCall) {
            queryClient.invalidateQueries({ exact: true, queryKey: ['getAllListingsWithResult'] })
        }
        if (!disableRedirect) {
            nav('/search-results')
        }
        setAnchorEl(null)
    }
    const priceLabel = getRangeLabel(filters.minPrice, filters.maxPrice, ' HKD')
    const bedroomsLabel = getBedroomsLabel(filters.bedrooms)
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>

            <Card
                variant={'elevation'}
                elevation={10}
                sx={{ width: '100%', display: 'flex', borderRadius: 10, p: 1, m: 1 }}
            >


                {<Button name='rent'
                    onClick={onRentBuyClick}
                    variant={rentBuy === 'rent' ? 'contained' : undefined}
                    sx={{ borderRadius: 5 }}>Rent</Button>}
                {<Button name='buy'
                    onClick={onRentBuyClick}
                    variant={rentBuy === 'buy' ? 'contained' : undefined}
                    sx={{ borderRadius: 5 }}>Buy</Button>}

                <Button
                    name='location'
                    size='small'
                    variant={filters.location ? 'contained' : undefined}
                    onClick={onFilterClick}
                    sx={{borderRadius:5, justifyContent: 'flex-start', textAlign: 'left' }}>
                    
                    <Typography
                        sx={{ textTransform: 'capitalize' }}
                    >{filters.location || 'where'}</Typography>
                </Button>
                {showMore &&
                    <>
                        <Button
                            sx={{ textTransform: 'capitalize', borderRadius: 5 }}
                            name='price'
                            variant={priceLabel ==='Price' ? undefined : 'contained'}
                            onClick={onFilterClick}>{priceLabel}</Button>
                        <Button
                            sx={{ textTransform: 'capitalize' }}
                            name='bedrooms'
                            onClick={onFilterClick}>{bedroomsLabel}
                        </Button>
                        <Button
                            sx={{ textTransform: 'capitalize' }}
                            name='More'
                            onClick={onFilterClick}>{'More'}
                        </Button>

                    </>
                }
                {hasFilters && <IconButton onClick={onClear}>
                    <ClearRounded />
                </IconButton>}

                <Fab sx={{ ml: 'auto' }} size='small'>
                    <SearchOutlined />
                </Fab>


            </Card>
            <Popover
                id={id}
                disableAutoFocus
                open={open}
                sx={{ width: '100%', p: 1 }}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {filterName === 'location' && <LocationFilterNew
                    open
                    value={searchForm.location || ''}
                    setValue={setSearchForm}
                    onClick={onLocationClick}
                />}

                {filterName == 'price' && <PriceFilterNarrow
                    showDone
                    open={true}
                    onClose={onPriceRangeClose}
                    setPriceRange={setPriceRange}

                />}
                {filterName == 'bedrooms' && <BedroomsFilter
                    filters={filters}
                    setFilter={setFilters}
                    onClose={handleClose}

                />}

            </Popover>
        </Box>
    )
}