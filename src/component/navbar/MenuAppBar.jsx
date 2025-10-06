import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import CssIcon from '@mui/icons-material/Style'; // CSS
import ComputerIcon from '@mui/icons-material/Computer'; // MIS
import SmartToyIcon from '@mui/icons-material/SmartToy'; // CAP-AI
import CodeIcon from '@mui/icons-material/Code'; // CAP-SW
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // NIS

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [accountAnchorEl, setAccountAnchorEl] = React.useState(null);

  const handleAccountMenu = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };
  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  // حالة الـ Dropdown
  const [specialty, setSpecialty] = React.useState("");

  const handleSpecialtyChange = (event) => {
    setSpecialty(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Askly
          </Typography>

          {/* Dropdown Menu لاختيار تخصص واحد */}
          <FormControl sx={{ minWidth: 150, mr: 2 }} size="small">
            <InputLabel sx={{ color: "white" }}>Choose</InputLabel>
            <Select
              value={specialty}
              onChange={handleSpecialtyChange}
              label="Choose"
              sx={{
      color: "white",
      ".MuiSelect-select": { padding: "8px 0" }, // تضبيط المسافة
      ".MuiSvgIcon-root": { color: "white" }, // السهم
    }}
            >
<MenuItem value="css">
  <CssIcon sx={{ mr: 1 }} /> CSS
</MenuItem>
<MenuItem value="mis">
  <ComputerIcon sx={{ mr: 1 }} /> MIS
</MenuItem>
<MenuItem value="cap-ai">
  <SmartToyIcon sx={{ mr: 1 }} /> CAP-AI
</MenuItem>
<MenuItem value="cap-sw">
  <CodeIcon sx={{ mr: 1 }} /> CAP-SW
</MenuItem>
<MenuItem value="nis">
  <AccountTreeIcon sx={{ mr: 1 }} /> NIS
</MenuItem>
            </Select>
          </FormControl>

          {/* أيقونة الحساب */}
          {auth && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{mr:1}}>maya </Typography>
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
                <MenuItem onClick={handleAccountClose}>Profile</MenuItem>
                <MenuItem onClick={handleAccountClose}>My account</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
