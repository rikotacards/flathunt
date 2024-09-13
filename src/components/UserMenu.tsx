import {
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuthContext } from "../Providers/contextHooks";
import { signIn } from "../utils/signInWithGoogle";
const settings = [
  {
    path: "profile",
    name: "Profile",
    icon: <Avatar sx={{ height: 25, width: 25 }} />,
  },
  { path: "listings", name: "My Listings", icon: <ViewListIcon /> },
  {
    path: "saved-listings",
    name: "Saved Listings",
    icon: <FavoriteBorderIcon />,
  },
  { path: "requests", name: "requests", icon: <ForumIcon /> },
];
export const UserMenu: React.FC = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user } = useAuthContext();
  const nav = useNavigate();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ ml: "auto", p: 0 }}>
          <Avatar
            sx={{ height: 35, width: 35 }}
            src={user?.photoURL || undefined}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px", borderRadius: 9, overflow: "hidden" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        slotProps={{'paper': {style: {borderRadius:10}
        }}}
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
          {!user && <Button onClick={signIn} variant="contained" fullWidth sx={{ mb: 1 }}>
            Log in
          </Button>}

          {settings.map((setting) => (
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
        </MenuList>
      </Menu>
    </>
  );
};
