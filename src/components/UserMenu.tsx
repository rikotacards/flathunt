import {
  Tooltip,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Button,
  Avatar,
  Box,
  Zoom,
} from "@mui/material";
import React from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useLocation, useNavigate } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuthContext } from "../Providers/contextHooks";
import { signIn } from "../utils/signInWithGoogle";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
const settings = [
  { path: "listings", name: "My Listings", icon: <ViewListIcon /> },
  {
    path: "saved-listings",
    name: "Saved Listings",
    icon: <BookmarkIcon />,
  },
    // { path: "requests", name: "requests", icon: <ForumIcon /> },
];

export const UserMenu: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user } = useAuthContext();
  const nav = useNavigate();
  const loc = useLocation();
  const pathname = loc.pathname;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const icons = {
    "/": {icon: <HomeRoundedIcon />},
    "/listings":{icon: <Zoom in={true}><ViewListIcon /></Zoom>, name: 'My Listings'},
    "/saved-listings":{icon: <Zoom in={true}><BookmarkIcon /></Zoom>, name: 'saved listings'},
    "/profile":{icon: <Avatar sx={{ height: 30, width: 30 }} src={user?.photoURL} />, name: 'profile'},
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <>
      <Tooltip title="Open settings">
        <Box sx={{ display: "flex", alignItems: "center", }}>
          {icons[pathname]?.name && <Typography fontWeight={'600'} color='textPrimary'>
        
          </Typography>}
          <IconButton
            onClick={handleOpenUserMenu}
            sx={{
              ml: "auto",
            }}
          >
            {icons[pathname]?.icon || <HomeRoundedIcon />}
          </IconButton>
        </Box>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        slotProps={{ paper: { style: { borderRadius: 10 } } }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuList sx={{ m: 1 }}>
          {!user && (
            <Button
              onClick={signIn}
              variant="contained"
              fullWidth
              sx={{ mb: 1 }}
            >
              Log in
            </Button>
          )}
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              nav("/");
            }}
          >
            <ListItemIcon>
              <HomeRoundedIcon />
            </ListItemIcon>
            <Typography sx={{ textAlign: "center" }}>Home</Typography>
          </MenuItem>

          {settings.map((setting, i) => (
            <MenuItem
              key={setting.path}
              onClick={() => {
                handleCloseUserMenu();
                nav(setting.path);
              }}
            >
              <ListItemIcon>{setting.icon}</ListItemIcon>
              <Typography sx={{ textAlign: "center" }}>
                {setting.name}
              </Typography>
            </MenuItem>
          ))}
          {user && (
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                nav("profile");
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <Typography sx={{ textAlign: "center" }}>Profile</Typography>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
