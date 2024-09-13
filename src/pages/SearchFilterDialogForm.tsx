import { CheckBox } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';
interface SearchFilterFormProps {
    open: boolean;
    handleClose: () => void;
    onSetFilter: (args: {maxPrice: string}) => void;
}
export const SearchFilterDialogForm: React.FC<SearchFilterFormProps> = (props) => {
    const {
        open,
        handleClose,
        onSetFilter
    } = props;
    const [filters, setFilters] = React.useState({})
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((p) => ({...p, [e.target.name]: e.target.value}))
    }
    return <Box>
        <Dialog
        open={open}
        onClose={handleClose}
        
      >
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <Typography>Price Range</Typography>

          <Box sx={{display: 'flex', flexDirection:"row"}}>
          <TextField
            required
            margin="dense"
            id="minPrice"
            name="minPrice"
            label="min price"
            fullWidth
            onChange={onChange}
            value={filters['minPrice']}
            type='number'
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="maxPrice"
            name="maxPrice"
            label="max price"
            fullWidth
            onChange={onChange}
            value={filters['maxPrice']}
            type='number'
            variant="outlined"
          />

          </Box>
          <Typography>Area (sqft)</Typography>

          <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <TextField
            required
            margin="dense"
            id="minNetArea"
            name="minNetArea"
            label="Min Area"
            fullWidth
            onChange={onChange}
            value={filters['minNetArea']}
            type='number'
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="maxNetArea"
            name="maxNetArea"
            label="max Area"
            fullWidth
            onChange={onChange}
            value={filters['maxNetArea']}
            type='number'
            variant="outlined"
          />
          </Box>
          <Box>
            <Typography>Neighborhood</Typography>
            <Select placeholder='neighborhood'>
              <MenuItem>Central</MenuItem>
            </Select>
          </Box>
          <Box>
            <CheckBox/>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => onSetFilter(filters)} type="submit">Filter</Button>
        </DialogActions>
      </Dialog>
    </Box>
}