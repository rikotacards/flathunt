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
import { signIn } from "../utils/signInWithGoogle";

import { useAuthContext, useSnackbarContext } from "../Providers/contextHooks";
import { addUser, getUser, updateUser } from "../firebase/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const ProfilePage: React.FC = () => {
  const nav = useNavigate();
  const s = useSnackbarContext();
  const { user } = useAuthContext();
  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(user?.uid || ""),
  });
  
  const [form, setForm] = React.useState({
    name: user?.displayName,
    email: user?.email,
    contactNumber: data?.contactNumber,
    realEstateCompany: data?.realEstateCompany,
    licenseNumber: data?.licenseNumber,
  });
  React.useEffect(() => {
    setForm({...data,   
      name: user?.displayName,
      email: user?.email})
  }, [isLoading])
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
     
      await addUser( {userId: user?.uid, contactNumber: 
        form.contactNumber || '', 
        licenseNumber: form?.licenseNumber || "",
        realEstateCompany: form.realEstateCompany || ""
        
      });
      queryClient.invalidateQueries({
        queryKey: ["getUser"],
        exact: true,
      });
      s.setSnackbarChildComponent(
        <Alert variant="filled" severity="success">
          <Typography>Updated user information</Typography>
        </Alert>
      );
      s.toggleSnackbar();
    } catch (e) {
      alert(e)
    }

    onSetField(null);
  };
  const settings = [
    { label: "name", value: user?.displayName },
    { label: "email", value: user?.email },
    {
      name: "contactNumber",
      label: "Whatsapp contact",
      value: data?.contactNumber,
    },
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
        position: 'relative'
      }}
    >
      <Typography variant='h4' sx={{mb:3}}>Profile</Typography>
      {settings.map((setting, i) => {
        return (
          <>
            <Box sx={{ display: "flex", mb: 3 }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ textTransform: "capitalize" }}
                    variant="body2"
                    fontWeight={"bold"}
                  >
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
      <Divider sx={{mb:2}}/>
      <Typography sx={{ mb: 3 }} variant="h6">
        For Agents
      </Typography>
      <>
      <Box sx={{ display: "flex", mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" fontWeight={"bold"}>
            Real Estate Company
          </Typography>
          <Typography variant="body1">{data?.realEstateCompany || "N/A"}</Typography>
          
        </Box>
        <Button size="small" onClick={() => onSetField(3)} sx={{ ml: "auto" }}>
          Edit
        </Button>
      </Box>
      <Collapse in={3 === field} sx={{ mb: 1 }}>
              <OutlinedInput
                type="string"
                onChange={onChange}
                name={'realEstateCompany'}
                placeholder={'Real estate company'}
                fullWidth
                value={form.realEstateCompany}
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
      <>
      <Box sx={{ display: "flex", mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" fontWeight={"bold"}>
            Company License No.
          </Typography>
          <Typography variant="body1">{data?.licenseNumber}</Typography>
        </Box>
        <Button size="small" onClick={() => onSetField(4)} sx={{ ml: "auto" }}>
          Edit
        </Button>
      </Box>
      <Collapse in={4 === field} sx={{ mb: 1 }}>
              <OutlinedInput
                type="string"
                onChange={onChange}
                name={'licenseNumber'}
                placeholder={'License Number'}
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
      <Button
        variant="contained"
        color="error"
        sx={{mt:4}}
        onClick={() => onSignOut(() => nav("/"))}
      >
        Log out
      </Button>
    </Box>
  );
};
