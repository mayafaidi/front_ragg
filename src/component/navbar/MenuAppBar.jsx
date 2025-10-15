import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

// MUI Components
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

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Chat Context
import { useChat } from "../../context/ChatContext";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  const [auth] = useState(true);//هون لتسجيل دخول تمام 
  const { sessions, createSession, fetchAllSessions, deleteSession,renamesession } = useChat(); //  استخدام الـ Context
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [specialty, setSpecialty] = useState("");//عشان تخصصي 
  const navigate = useNavigate();

  // هدول عشان صفحة تسجيل دخول
  const handleAccountMenu = (e) => setAccountAnchorEl(e.currentTarget);
  const handleAccountClose = () => setAccountAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleRenameSession = async (sessionId) => {
  const newTitle = prompt("ادخل الاسم الجديد للجلسة:"); // يفتح مربع لإدخال الاسم
  if (!newTitle) return;

  const updated = await renamesession(sessionId, newTitle); // ينادي الـ API
  if (updated) {
    console.log("تمت إعادة تسمية الجلسة:", updated);
    fetchAllSessions(); // لتحديث قائمة الجلسات بعد التغيير
  }
};

//استخدام عند ارسال رسائل 
  const handleSpecialtyChange = (event) => {
    setSpecialty(event.target.value);
    localStorage.setItem("currentSpecialty", event.target.value);
  };
useEffect(() => {
  fetchAllSessions(); // جلب كل الجلسات من السيرفر عند التحميل
}, []);
  // دالة إنشاء محادثة جديدة
  const handleCreateSession = async () => {
    const newSession = await createSession();
    if (newSession) {
      console.log("✅ Session created:", newSession);
    }
  };

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
                "& .MuiSelect-select": {
                  color: "white",
                  textAlign: "right",
                  fontWeight: 500,
                  paddingRight: "8px",
                },
                "&:hover": { backgroundColor: "rgba(0, 188, 212, 0.15)" },
              }}
            >
              <Select
                value={specialty}
                onChange={handleSpecialtyChange}
                displayEmpty
                MenuProps={{
                  PaperProps: { sx: { direction: "rtl", bgcolor: "#0b162b", color: "white" } },
                }}
              >
                <MenuItem value="" disabled>
                  🎓 اختر تخصصك
                </MenuItem>
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
          </Box>

          <Typography variant="h6" sx={{ textAlign: "right", flexGrow: 1, fontWeight: 700 }}>
            Askly
          </Typography>

          <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </MyAppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)",
            color: "white",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography sx={{ ml: 1 }}>المحادثات</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ display: "flex", alignItems: "center", p: 1.5, justifyContent: "center" }}>
          <Button
            sx={{ backgroundColor: "#00BCD4", color: "white", borderRadius: "8px", textTransform: "none", "&:hover": { backgroundColor: "#0097a7" } }}
            onClick={handleCreateSession} //  الزر ينادي createSession من الـ Context
          >
            إنشاء محادثة جديدة +
          </Button>
        </Box>

        <Box sx={{ p: 1.5 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ابحث في المحادثات..."
            size="small"
            dir="rtl"
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              input: { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00bcd4" },
            }}
          />
        </Box>

        <List>
  {(() => {
    const currentSessionId = Number(localStorage.getItem("currentSessionId"));

    return sessions.map((session, index) => (
      <ListItem
        key={session.id}
        selected={session.id === currentSessionId}
        divider
        sx={{
          direction: "rtl",
          justifyContent: "space-between", // نعدل لوجود زر الحذف
          textAlign: "right",
          "&:hover": { cursor: "pointer", backgroundColor: "rgba(0,188,212,0.2)" },
        }}
      >
        <ListItemText
          // primary={`محادثة ${index + 1}`}
          // secondary={session.title || "محادثة جديدة"}
           primary={session.title || `محادثة ${index + 1}`}//
  secondary={null} // تحذف النص القديم
          primaryTypographyProps={{ color: "#fff" }}
          secondaryTypographyProps={{ color: "#aaa" }}
          onClick={() => {
            localStorage.setItem("currentSessionId", session.id);
            window.dispatchEvent(new Event("sessionSelected"));
            handleDrawerClose();
          }}
        />
{/* تسمية  */}

<IconButton
  edge="end"
  sx={{ color: "#FFD700", mr: 1 }}
  onClick={(e) => {
    e.stopPropagation(); // مهم حتى لا يفتح الجلسة عند الضغط على Edit
    handleRenameSession(session.id);
  }}
>
  <EditIcon />
</IconButton>









        {/* //حذف */}
        <IconButton
          edge="end"
          sx={{ color: "#ff5252" }}
          onClick={async (e) => {
            e.stopPropagation(); // مهم حتى لا يفتح الجلسة عند الضغط على الحذف
            if (window.confirm("هل تريد حذف هذه المحادثة؟")) {
              await deleteSession(session.id); // دالة حذف من ChatContext
              fetchAllSessions(); // تحديث قائمة الجلسات
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    ));
  })()}
</List>

      </Drawer>
    </>
  );
}
