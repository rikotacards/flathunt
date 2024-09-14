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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HolidayVillageRoundedIcon from "@mui/icons-material/HolidayVillageRounded";
import { useAuthContext } from "../Providers/contextHooks";
import { signIn } from "../utils/signInWithGoogle";
const settings = [
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
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{
            ml: "auto",
            p: 0,
            boxShadow:
              "0 3px 12px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.08)",
          }}
        >
          {user ? (
            <Avatar
              sx={{ height: 35, width: 35 }}
              src={user?.photoURL || undefined}
            />
          ) : (
            <AccountCircleIcon fontSize="large" />
          )}
        </IconButton>
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
            <ListItemIcon
             
            >
              <HolidayVillageRoundedIcon />
            </ListItemIcon>
            <Typography sx={{ textAlign: "center" }}>Home</Typography>
          </MenuItem>
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
