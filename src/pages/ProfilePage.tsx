import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  OutlinedInput,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { onSignOut } from "../utils/signOut";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import { signIn } from "../utils/signInWithGoogle";

import { useAuthContext, useFilterContext, useSnackbarContext } from "../Providers/contextHooks";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { updateUser } from "../firebase/user";
import { useQueryClient } from "@tanstack/react-query";

export const ProfilePage: React.FC = () => {
  const nav = useNavigate();
  const s = useSnackbarContext();
  const { user, contactNumber } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [form, setForm] = React.useState({
    name: user?.displayName,
    email: user?.email,
    contactNumber,
  });
  const queryClient = useQueryClient();

  const onChange = (
    e: React.ChangeEvent<HTMLFormElement | HTMLTextAreaElement>
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const [field, setField] = React.useState<null | number>(null);
  const onSetField = (field: number | null) => {
    setField(field);
  };
  const onSave = async () => {
    if (!user?.uid) {
      return;
    }
    try {
      await updateUser(user?.uid, { contactNumber: form.contactNumber });
      queryClient.invalidateQueries({
        queryKey: ["getUser"],
        exact: true,
      });
      s.setSnackbarChildComponent(<Alert variant="filled" severity='success'><Typography>Updated user information</Typography></Alert>)
      s.toggleSnackbar();
    } catch (e) {}

    onSetField(null);
  };
  const settings = [
    { label: "name", value: user?.displayName },
    { label: "email", value: user?.email },
    { name: "contactNumber", label: "Whatsapp contact", value: contactNumber },
  ];

  if (!user) {
    return (
      <>
        <Button onClick={signIn} sx={{ p: 1, m: 1 }} variant="contained">
          Sign in with Google
        </Button>
      </>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        textAlign: "left",
      }}
    >
      {/* <Toolbar /> */}
      {settings.map((setting, i) => {
        return (
          <>
            <Box sx={{ display: "flex", mb: 3 }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{textTransform: 'capitalize'}} variant="body2" fontWeight={"bold"}>
                    {setting.label}
                  </Typography>
                  {i == 2 && (
                    <Button
                      size="small"
                      onClick={() => onSetField(i)}
                      sx={{ ml: "auto" }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                <Typography variant="body1">{setting.value}</Typography>
              </Box>
            </Box>
            <Collapse in={i === field} sx={{ mb: 1 }}>
              <OutlinedInput
                type="tel"
                onChange={onChange}
                name={setting.name}
                placeholder={setting.label}
                fullWidth
              />
              <Button
                onClick={onSave}
                sx={{ mt: 2, mb: 1 }}
                variant="contained"
                fullWidth
              >
                Save
              </Button>
              <Button
                onClick={() => onSetField(null)}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </Collapse>
          </>
        );
      })}

      <Typography sx={{ mb: 3 }} variant="h6">
        For Agents
      </Typography>
      <Box sx={{ display: "flex", mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" fontWeight={"bold"}>
            Real Estate Company
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Box>
        <IconButton sx={{ ml: "auto" }}>
          <KeyboardArrowDownRounded />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" fontWeight={"bold"}>
            Real Estate License No.
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Box>
        <IconButton sx={{ ml: "auto" }}>
          <KeyboardArrowDownRounded />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        color="error"
        sx={{ mt: "auto" }}
        onClick={() => onSignOut(() => nav("/"))}
      >
        Log out
      </Button>
    </Box>
  );
};
