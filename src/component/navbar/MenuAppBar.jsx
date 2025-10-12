import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";

// MUI Components
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CssIcon from "@mui/icons-material/Style";
import ComputerIcon from "@mui/icons-material/Computer";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const drawerWidth = 280;

// ✅ AppBar Style
const MyAppBar = styled(MuiAppBar)(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function MenuAppBar() {
  const [auth] = useState(true);
  const [open, setOpen] = useState(false);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [specialty, setSpecialty] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // 🔹 فتح وإغلاق Drawer
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // 🔹 قائمة الحساب
  const handleAccountMenu = (e) => setAccountAnchorEl(e.currentTarget);
  const handleAccountClose = () => setAccountAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSpecialtyChange = (event) => setSpecialty(event.target.value);

  return (
    <Box sx={{ flexGrow: 1, direction: "rtl" }}>
      {/* ✅ AppBar */}
      <MyAppBar position="fixed" sx={{ bgcolor: "#0b1b35" }}>
        <Toolbar>
          {/* أيقونة القائمة */}
          <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>

          {/* اسم التطبيق */}
          <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>
            Askly
          </Typography>

          {/* قائمة التخصصات */}
          <FormControl sx={{ minWidth: 150, ml: 2 }} size="small">
            <InputLabel sx={{ color: "white" }}>اختر التخصص</InputLabel>
            <Select
              value={specialty}
              onChange={handleSpecialtyChange}
              label="اختر التخصص"
              sx={{
                color: "white",
                ".MuiSvgIcon-root": { color: "white" },
              }}
            >
              <MenuItem value="general">
                <CssIcon sx={{ ml: 1 }} /> General
              </MenuItem>
              <MenuItem value="css">
                <CssIcon sx={{ ml: 1 }} /> CSS
              </MenuItem>
              <MenuItem value="mis">
                <ComputerIcon sx={{ ml: 1 }} /> MIS
              </MenuItem>
              <MenuItem value="cap-ai">
                <SmartToyIcon sx={{ ml: 1 }} /> CAP-AI
              </MenuItem>
              <MenuItem value="cap-sw">
                <CodeIcon sx={{ ml: 1 }} /> CAP-SW
              </MenuItem>
              <MenuItem value="nis">
                <AccountTreeIcon sx={{ ml: 1 }} /> NIS
              </MenuItem>
            </Select>
          </FormControl>

          {/* أيقونة الحساب */}
          {auth && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ ml: 1 }}>مايا</Typography>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAccountMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              <Menu
                anchorEl={accountAnchorEl}
                open={Boolean(accountAnchorEl)}
                onClose={handleAccountClose}
              >
                <MenuItem onClick={handleAccountClose}>الملف الشخصي</MenuItem>
                <MenuItem onClick={handleAccountClose}>حسابي</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleAccountClose();
                    handleLogout();
                  }}
                >
                  تسجيل الخروج
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </MyAppBar>

      {/* ✅ Drawer متحرك */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: drawerWidth,
            bgcolor: "#0e1d3a",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderBottom: "1px solid #233a6b",
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography sx={{ ml: 1 }}>chat</Typography>
        </Box>

        <Divider sx={{ borderColor: "#233a6b" }} />
  <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            border: "5px solid #233a6b",
            justifyContent:"center",
          }}
        >
         <Button>انشاء محادثة جديدة +</Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            border: "5px solid #233a6b",
            justifyContent:"center",
          }}
        >
       <TextField fullWidth variant="outlined"placeholder="ابحث في المحادثات..." size="small" dir="rtl" sx={{ bgcolor: "#152a52", 
    // color: "white", // لون النص
    "& .MuiInputBase-input::placeholder": {
      color: "#ffffffff", // لون النص داخل placeholder
      },
  }}
  inputProps={{
    style: { color: "white" }, // بخلي نص ابيض لجوا 
  }}
/>
        

        </Box>
        <List>
          <ListItem button selected>
            <ListItemText
              primary="محادثة 1"
              secondary="مساعدة في React"
              primaryTypographyProps={{ color: "#fff" }}
              secondaryTypographyProps={{ color: "#aaa" }}
            />
          </ListItem>
          
        </List>
      </Drawer>
    </Box>
  );
}
