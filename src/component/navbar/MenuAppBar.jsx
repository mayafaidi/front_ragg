import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";

import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { useChat } from "../../context/ChatContext";

const drawerWidth = 280;

const MyAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: "linear-gradient(90deg, #0F172A 0%, #1E3A8A 100%)",
  fontFamily: "'Cairo', sans-serif",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function MenuAppBar({ open, handleDrawerOpen, handleDrawerClose }) {
  const [auth] = useState(true);
  const { sessions, createSession, fetchAllSessions, deleteSession, renamesession, searchMessages, handleDownloadSession, getUserStats } = useChat();
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [specialty, setSpecialty] = useState(localStorage.getItem("currentSpecialty") || "");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Account Menu handlers
  const handleAccountMenu = (e) => setAccountAnchorEl(e.currentTarget);
  const handleAccountClose = () => setAccountAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Open password dialog
  const handleOpenPasswordDialog = () => {
    handleAccountClose(); // يغلق القائمة أولاً
    setOpenPasswordDialog(true);
  };
  const handleClosePasswordDialog = () => setOpenPasswordDialog(false);

  const handleSpecialtyChange = (event) => {
    setSpecialty(event.target.value);
    localStorage.setItem("currentSpecialty", event.target.value);
  };

  const handleCreateSession = async () => {
    await createSession();
    fetchAllSessions();
  };

  const handleRenameSession = async (sessionId) => {
    const newTitle = prompt("ادخل الاسم الجديد :");
    if (!newTitle) return;
    const updated = await renamesession(sessionId, newTitle);
    if (updated) fetchAllSessions();
  };

  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword) {
    alert("يرجى إدخال كلمتي المرور");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) return;

  setChangingPassword(true);
  try {
    console.log("Sending password change request:", { currentPassword, newPassword });

    const response = await axios.patch(
      "https://localhost:7017/api/Accounts/ChangePassword",
      {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);
    alert("تم تغيير كلمة المرور بنجاح");
    setCurrentPassword("");
    setNewPassword("");
  } catch (error) {
    console.error("فشل تغيير كلمة المرور:", error);
    alert(error.response?.data?.message || "فشل تغيير كلمة المرور");
  } finally {
    setChangingPassword(false);
  }
};


  useEffect(() => {
    const updateData = async () => {
      await fetchAllSessions();
      const stats = await getUserStats();
      if (stats) setUserStats(stats);
    };
    updateData();
    window.addEventListener("sessionsUpdated", updateData);
    return () => window.removeEventListener("sessionsUpdated", updateData);
  }, []);

  const filteredSessions = searchQuery
    ? sessions.filter((s, index) =>
        (s.title || `محادثة ${index + 1}`).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sessions;

  return (
    <>
      <MyAppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              size="small"
              sx={{
                minWidth: 170,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                mr: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-icon": { color: "#00bcd4", right: "auto", left: 8 },
                "& .MuiSelect-select": { color: "white", textAlign: "right", fontWeight: 500, paddingRight: "8px" },
                "&:hover": { backgroundColor: "rgba(0, 188, 212, 0.15)" },
              }}
            >
              <Select
                value={specialty}
                onChange={handleSpecialtyChange}
                displayEmpty
                MenuProps={{ PaperProps: { sx: { direction: "rtl", bgcolor: "#0b162b", color: "white" } } }}
              >
                <MenuItem value="" disabled>🎓 اختر تخصصك</MenuItem>
                <MenuItem value="General">عام</MenuItem>
                <MenuItem value="CS">علم الحاسوب</MenuItem>
                <MenuItem value="CSec">الأمن السيبراني</MenuItem>
                <MenuItem value="CAP">علم الحاسوب في سوق العمل</MenuItem>
                <MenuItem value="CAP_SW">علم الحاسوب تركيز برمجيات</MenuItem>
                <MenuItem value="CAP_AI">علم الحاسوب تركيز الذكاء الاصطناعي</MenuItem>
                <MenuItem value="MIS">أنظمة المعلومات الإدارية</MenuItem>
              </Select>
            </FormControl>

            {auth && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Typography sx={{ mr: 1 }}>مايا</Typography>
                <IconButton size="large" onClick={handleAccountMenu} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={accountAnchorEl}
                  open={Boolean(accountAnchorEl)}
                  onClose={handleAccountClose}
                  PaperProps={{ sx: { bgcolor: "rgba(11,22,43)", color: "white" } }}
                >
                  <MenuItem onClick={handleOpenPasswordDialog}>تغيير كلمة المرور</MenuItem>
                  <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          <Typography
          component="h1"
          variant="h5"
          sx={{
            textAlign:"right",
            flexGrow:1,
            fontWeight: 700,
            color: "white",
            "&::first-letter": { color: "red" },
            fontFamily: "Cairo, Poppins, sans-serif",
          }}
        >
          Askly
        </Typography>

          <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </MyAppBar>

      {/* Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>تغيير كلمة المرور</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
          <TextField
            label="كلمة المرور الحالية"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="كلمة المرور الجديدة"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClosePasswordDialog}>إلغاء</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await handleChangePassword();
              handleClosePasswordDialog();
            }}
            disabled={changingPassword}
          >
            {changingPassword ? "جاري التغيير..." : "تغيير"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drawer for sessions */}
      <Drawer
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", background: "linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)", color: "white" },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          <IconButton onClick={handleDrawerClose}><ChevronRightIcon sx={{ color: "white" }} /></IconButton>
          <Typography sx={{ ml: 1 }}>المحادثات</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ display: "flex", alignItems: "center", p: 1.5, justifyContent: "center" }}>
          <Button sx={{ backgroundColor: "#00BCD4", color: "white", borderRadius: "8px", textTransform: "none", "&:hover": { backgroundColor: "#0097a7" } }} onClick={handleCreateSession}>
            إنشاء محادثة جديدة +
          </Button>
        </Box>

        <Box sx={{ p: 1.5 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ابحث في المحادثات..."
            size="small"
            value={searchQuery}
            dir="rtl"
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              input: { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00bcd4" },
            }}
            onChange={async (e) => {
              const query = e.target.value;
              setSearchQuery(query);
              if (!query.trim()) {
                setSearchResults([]);
                return;
              }
              const results = await searchMessages(query);
              setSearchResults(results);
            }}
          />
          {userStats && (
  <Box
    sx={{
      textAlign: "center",
      p: 2,
      borderTop: "1px solid rgba(255,255,255,0.2)",
      mt: 2,
      background: "rgba(255,255,255,0.05)",
      borderRadius: 1,
    }}
  >
    <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
      عدد المحادثات: {userStats.totalSessions || 0}
    </Typography>

    <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
      إجمالي الرسائل: {userStats.totalMessages || 0}
    </Typography>

    <Typography variant="body2" sx={{ color: "white" }}>
      اخر ظهور: {userStats.lastActivity
        ? `${new Date(userStats.lastActivity).toLocaleDateString("ar-EG")}-${new Date(userStats.lastActivity).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`
        : "غير متاح"}
    </Typography>
  </Box>
)}

        </Box>

        {searchResults.length > 0 && (
          <List sx={{ maxHeight: 200, overflow: "auto", mt: 1 }}>
            {searchResults.map((msg) => (
              <ListItem key={msg.id} divider>
                <ListItemText
                  primary={msg.content}
                  secondary={`في الجلسة: ${msg.sessionTitle || msg.sessionId}`}
                  primaryTypographyProps={{ color: "#fff" }}
                  secondaryTypographyProps={{ color: "#aaa" }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <List>
          {filteredSessions.map((session, index) => {
            const currentSessionId = Number(localStorage.getItem("currentSessionId"));
            return (
              <ListItem
                key={session.id}
                selected={session.id === currentSessionId}
                divider
                sx={{ direction: "rtl", justifyContent: "space-between", textAlign: "right", "&:hover": { cursor: "pointer", backgroundColor: "rgba(0,188,212,0.2)" } }}
              >
                <ListItemText
                  primary={session.title || `محادثة ${index + 1}`}
                  secondary={null}
                  primaryTypographyProps={{ color: "#fff" }}
                  secondaryTypographyProps={{ color: "#aaa" }}
                  onClick={() => {
                    localStorage.setItem("currentSessionId", session.id);
                    window.dispatchEvent(new Event("sessionSelected"));
                    handleDrawerClose();
                  }}
                />
                <IconButton onClick={() => handleDownloadSession(session.id)} title="تحميل PDF">
                  <FileDownloadIcon />
                </IconButton>
                <IconButton edge="end" sx={{ color: "#FFD700", mr: 1 }} onClick={(e) => { e.stopPropagation(); handleRenameSession(session.id); }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" sx={{ color: "#ff5252" }} onClick={async (e) => {
                  e.stopPropagation();
                  if (window.confirm("هل تريد حذف هذه المحادثة؟")) {
                    await deleteSession(session.id);
                    fetchAllSessions();
                  }
                }}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
