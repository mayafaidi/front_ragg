import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

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
import Grow from "@mui/material/Grow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { useChat } from "../../context/ChatContext";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import {jwtDecode}  from "jwt-decode";

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
const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("يرجى إدخال كلمة المرور الحالية")
    .min(6, "كلمة المرور الحالية يجب أن تتكون من 6 أحرف على الأقل"),

  newPassword: yup
    .string()
    .required("يرجى إدخال كلمة المرور الجديدة")
    .min(6, "الحد الأدنى لطول كلمة المرور هو 6 أحرف")
    .matches(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)")
    .matches(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)")
    .matches(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل (0-9)")
    .matches(/[@$!%*?&]/, "يجب أن تحتوي على رمز خاص واحد على الأقل مثل @$!%*?&")
    .notOneOf(
      [yup.ref("currentPassword")],
      "يجب أن تختلف كلمة المرور الجديدة عن الحالية"
    ),
});
const token=localStorage.getItem('token');
if(token){
  const decoded=jwtDecode(token);
  const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  localStorage.setItem('username',username)
}
export default function MenuAppBar({
  open,
  handleDrawerOpen,
  handleDrawerClose,
}) {
  const [auth] = useState(true);
  const {
    sessions,
    createSession,
    fetchAllSessions,
    deleteSession,
    renamesession,
    searchMessages,
    handleDownloadSession,
    getUserStats,
  } = useChat();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [specialty, setSpecialty] = useState(
    localStorage.getItem("currentSpecialty") || ""
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [username, setUsername] = useState("");
  // rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameSessionId, setRenameSessionId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
// 🔔 إعلانات زاجل
const [zajelAnchorEl, setZajelAnchorEl] = useState(null);
const [subAnchorEl, setSubAnchorEl] = useState(null);
const [selectedCategory, setSelectedCategory] = useState(null);
const [zajelCategories, setZajelCategories] = useState([]);
const [hasNew, setHasNew] = useState(false);

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/zajel")
    .then((res) => res.json())
    .then((data) => {
      setZajelCategories(data.data || []);
      // 🔴 تحقق إذا في أي مقالة جديدة
      const hasNewArticle = data.data?.some((cat) =>
        cat.articles?.some((a) => a.is_new)
      );
      console.log(data)
      setHasNew(hasNewArticle);
    })
    .catch((err) => console.error("خطأ في جلب إعلانات زاجل:", err));
}, []);


const handleOpenZajel = (e) => setZajelAnchorEl(e.currentTarget);
const handleCloseZajel = () => {
  setZajelAnchorEl(null);
  setSubAnchorEl(null);
};
// 🟢 فتح القوائم
const handleOpenMainMenu = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleCloseMainMenu = () => {
  // ننتظر قليل قبل الإغلاق حتى لا تختفي عند الانتقال للقائمة الفرعية
  setTimeout(() => {
    setAnchorEl(null);
    setSubAnchorEl(null);
  }, 200);
};

const handleOpenSubMenu = (event, category) => {
  setSelectedCategory(category);
  setSubAnchorEl(event.currentTarget);
};

const handleCloseSubMenu = () => {
  setTimeout(() => {
    setSubAnchorEl(null);
  }, 200);
};

const handleOpenSub = (e, cat) => {
  setSelectedCategory(cat);
  setSubAnchorEl(e.currentTarget);
};
const handleCloseSub = () => setSubAnchorEl(null);

const getCategoryIcon = (name) => {
  if (name.includes("هامة")) return "📢";
  if (name.includes("عامة")) return "📰";
  if (name.includes("دورات")) return "🎓";
  return "📁";
};

  // Account Menu handlers
  const handleAccountMenu = (e) => setAccountAnchorEl(e.currentTarget);
  const handleAccountClose = () => setAccountAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpenPasswordDialog = () => {
    handleAccountClose();
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

  const handleRenameSession = (sessionId, currentTitle) => {
    setRenameSessionId(sessionId);
    setRenameTitle(currentTitle || "");
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (!renameTitle.trim()) {
      alert("يرجى إدخال اسم صالح");
      return;
    }
    const updated = await renamesession(renameSessionId, renameTitle.trim());
    if (updated) {
      await fetchAllSessions();
      setRenameDialogOpen(false);
    }
  };

  const handleChangePassword = async (data) => {
    const { currentPassword, newPassword } = data;
    const token = localStorage.getItem("token");
    if (!token) return;

    setChangingPassword(true);
    try {
      await axios.patch(
        "https://localhost:7017/api/Accounts/ChangePassword",
        {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ تم تغيير كلمة المرور بنجاح");
    } catch (error) {
      alert(error.response?.data?.message || "❌ فشل تغيير كلمة المرور");
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);
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
        (s.title || `محادثة ${index + 1}`)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
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
                backgroundColor: "rgba(82, 90, 118, 0.9)",
                borderRadius: "12px",
                mr: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <Select
                value={specialty}
                onChange={handleSpecialtyChange}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      direction: "rtl",
                      bgcolor: "#0b162b",
                      color: "white",
                    },
                  },
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
                <MenuItem value="CAP_AI">
                  علم الحاسوب تركيز الذكاء الاصطناعي
                </MenuItem>
                <MenuItem value="MIS">أنظمة المعلومات الإدارية</MenuItem>
              </Select>
            </FormControl>

            {auth && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Typography sx={{ ml: 2, fontWeight: "bold", paddingRight: 2 }}>
                  {username || "User"}
                </Typography>
                {/* <IconButton onClick={handleAccountMenu} color="inherit" sx={{ p: 0 }}>
  <Avatar
    sx={{
      bgcolor: "#757a7bff",
      color: "white",
      fontWeight: "bold",
      textTransform: "uppercase",
      width: 36,
      height: 36,
      fontSize: "16px",
      
    }}
  >
    {username ? username.charAt(0) : "U"}
  </Avatar>
</IconButton> */}
                <IconButton
                  onClick={handleAccountMenu}
                  color="inherit"
                  sx={{ p: 0 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#0b162b",
                      color: "#ffffffff",
                      border: "2px solid #0b162b",
                      width: 40,
                      height: 40,
                      position: "relative",
                      fontWeight: "bold",
                      fontSize: "16px",
                      textTransform: "uppercase",
                    }}
                  >
                    <PersonIcon
                      sx={{
                        position: "absolute",
                        opacity: 0.15,
                        fontSize: 28,
                        color: "#0b162b",
                      }}
                    />

                    {username ? username.charAt(0) : "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={accountAnchorEl}
                  open={Boolean(accountAnchorEl)}
                  onClose={handleAccountClose}
                  PaperProps={{
                    sx: { bgcolor: "rgba(11,22,43)", color: "white" },
                  }}
                >
                  <MenuItem onClick={handleOpenPasswordDialog}>
                    تغيير كلمة المرور
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: "right",
              flexGrow: 1,
              fontWeight: 700,
              color: "white",
              "&::first-letter": { color: "red" },
              fontFamily: "Cairo, Poppins, sans-serif",
            }}
          >
            Askly
          </Typography>
{/* 🔔 زر إعلانات زاجل */}
{/* 🔔 زر إعلانات زاجل */}
<Box sx={{ position: "relative", ml: 2 }}>
  <Button
    sx={{
      color: "white",
      fontSize: "1rem",
      backgroundColor: "#6b0f1a",
      "&:hover": { backgroundColor: "#8b1f2b" },
      // borderRadius: "8px",
      px: 2,
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      position: "relative",
    }}
    endIcon={<ArrowDropDownIcon />}
    onClick={(e) =>
      setZajelAnchorEl(zajelAnchorEl ? null : e.currentTarget)
    }
  >
    🔔 إعلانات زاجل
  </Button>

  {hasNew && (
    <Box
      sx={{
        position: "absolute",
        top: "-4px",
        left: "-8px", // 👈 أقصى اليسار
        width: 12,
        height: 12,
        bgcolor: "red",
        borderRadius: "50%",
        boxShadow: "0 0 6px red",
        animation: "pulse 1.5s infinite",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.3)", opacity: 0.6 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      }}
    />
  )}

  {/* القائمة الأولى للفئات */}
  {zajelAnchorEl && (
    <Menu
      anchorEl={zajelAnchorEl}
      open={Boolean(zajelAnchorEl)}
      onClose={() => {
        setZajelAnchorEl(null);
        setSubAnchorEl(null);
      }}
      MenuListProps={{
        sx: {
           backgroundColor: "#1a1e9fff",
      color: "#fff",
      fontFamily: "Cairo",
      borderRadius: "0", 
      textAlign: "right",
      direction: "rtl",
      boxShadow: "none", 
      p: 1, 
      m: 0, 
        },
      }}
       PaperProps={{
    sx: {
      backgroundColor: "#1a1e9fff",
      border: "none", 
      boxShadow: "none", 
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)", // ظل خفيف أنعم
      borderRadius: "12px", // 🔹 حواف ناعمة
      overflow: "hidden", // 🔹 يمنع ظهور حواف بيضاء عند الزوايا
    },
  }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {zajelCategories.map((cat) => (
        <MenuItem
          key={cat.category_id}
          onClick={(e) => {
            setSelectedCategory(cat);
            setSubAnchorEl(e.currentTarget);
          }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "230px",
            transition: "background-color 0.2s ease"
            // "&:hover": { backgroundColor: "#f2f2f2" },
          }}
        >
          <span>{cat.category_name}</span>
          <span>{getCategoryIcon(cat.category_name)}</span>
        </MenuItem>
      ))}
    </Menu>
  )}

  {/* القائمة الفرعية للمقالات */}
  {subAnchorEl && (
   <Menu
  anchorEl={subAnchorEl}
  open={Boolean(subAnchorEl)}
  onClose={() => setSubAnchorEl(null)}
  MenuListProps={{
    sx: {
      backgroundColor: "#1a1e9fff",
      color: "#fff",
      fontFamily: "Cairo",
      borderRadius: "0",
      textAlign: "right",
      direction: "rtl",
      boxShadow: "none",
      p: 1,
      m: 0,
    },
  }}
  PaperProps={{
    sx: {
      backgroundColor: "#1a1e9fff",
      border: "none",
      boxShadow: "none",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)", // ظل خفيف أنعم
      borderRadius: "12px", // 🔹 حواف ناعمة
      overflow: "hidden", // 🔹 يمنع ظهور حواف بيضاء عند الزوايا
    },
  }}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
>

      {selectedCategory?.articles?.map((article, index) => (
        <Box key={index}>
          <MenuItem
            component="a"
            href={article.link}
            target="_blank"
            onClick={() => setSubAnchorEl(null)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              minWidth: "320px",
              transition: "background-color 0.2s ease"
              // "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            {article.title}
            {article.is_new && (
              <span style={{ color: "crimson", fontSize: "0.8rem" }}>جديد</span>
            )}
          </MenuItem>
          {index < selectedCategory.articles.length - 1 && (
            <Divider sx={{ my: 0.5 }} />
          )}
        </Box>
      ))}
    </Menu>
  )}
</Box>








          <IconButton color="inherit" edge="end" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </MyAppBar>

      {/*  Dialog تغيير كلمة المرور */}
      <Dialog
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
        TransitionComponent={Grow}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            bgcolor: "#0e1d3a",
            color: "white",
            textAlign: "center",
            width: 420,
          },
        }}
        BackdropProps={{
          sx: { backdropFilter: "blur(6px)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#90caf9" }}>
          تغيير كلمة المرور
        </DialogTitle>

        <form
          onSubmit={handleSubmit(async (data) => {
            await handleChangePassword(data);
            handleClosePasswordDialog();
            reset();
          })}
        >
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="كلمة المرور الحالية"
              type="password"
              fullWidth
              {...register("currentPassword")}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              sx={{
                input: { color: "white" },
                label: { color: "#aaa" },
                "& .MuiFormHelperText-root": { color: "#f87171" },
              }}
            />

            <TextField
              label="كلمة المرور الجديدة"
              type="password"
              fullWidth
              {...register("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              sx={{
                input: { color: "white" },
                label: { color: "#aaa" },
                "& .MuiFormHelperText-root": { color: "#f87171" },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button onClick={handleClosePasswordDialog} sx={{ color: "#aaa" }}>
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="outlined"
              disabled={changingPassword}
              sx={{
                color: "#4caf50",
                borderColor: "#4caf50",
                "&:hover": { backgroundColor: "#1b5e20", color: "white" },
              }}
            >
              {changingPassword ? "جاري التغيير..." : "حفظ"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/*  Dialog إعادة تسمية المحادثة */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        TransitionComponent={Grow}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            bgcolor: "#0e1d3a",
            color: "white",
            textAlign: "center",
            width: 400,
          },
        }}
        BackdropProps={{
          sx: { backdropFilter: "blur(6px)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#90caf9" }}>
          إعادة تسمية المحادثة
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="الاسم الجديد"
            fullWidth
            variant="outlined"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            sx={{
              input: { color: "white" },
              label: { color: "#aaa" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#233a6b" },
                "&:hover fieldset": { borderColor: "#64b5f6" },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setRenameDialogOpen(false)}
            sx={{ color: "#aaa" }}
          >
            إلغاء
          </Button>
          <Button
            variant="outlined"
            onClick={confirmRename}
            sx={{
              color: "#4caf50",
              borderColor: "#4caf50",
              "&:hover": { backgroundColor: "#1b5e20", color: "white" },
            }}
          >
            حفظ
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Drawer المحادثات */}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography sx={{ ml: 1 }}>المحادثات</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            justifyContent: "center",
          }}
        >
          <Button
            sx={{
              backgroundColor: " #1E3A8A",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1E3A8A" },
            }}
            onClick={handleCreateSession}
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
            value={searchQuery}
            dir="rtl"
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              input: { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#00bcd4",
              },
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
                اخر ظهور:{" "}
                {userStats.lastActivity
                  ? (() => {
                      const date = new Date(userStats.lastActivity);
                      date.setHours(date.getHours() + 3); // إضافة 3 ساعات
                      return `${date.toLocaleDateString(
                        "ar-EG"
                      )} - ${date.toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`;
                    })()
                  : "غير متاح"}
              </Typography>
            </Box>
          )}
        </Box>

        {searchResults.map((msg) => (
          <ListItem
            key={msg.id}
            divider
            button
            onClick={() => {
              // تخزين الجلسة الحالية
              localStorage.setItem("currentSessionId", msg.chatSessionId);
              // إرسال حدث لتحديث الصفحة الرئيسية
              window.dispatchEvent(new Event("sessionSelected"));
              // إغلاق القائمة الجانبية
              handleDrawerClose();
              // تنظيف البحث
              setSearchQuery("");
              setSearchResults([]);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0,188,212,0.15)",
                cursor: "pointer",
              },
            }}
          >
            <ListItemText
              primary={`${
                msg.content.length > 60
                  ? msg.content.slice(0, 60) + "..."
                  : msg.content
              }`}
              secondary={`في الجلسة: ${msg.sessionTitle || msg.chatSessionId}`}
              primaryTypographyProps={{ color: "#fff" }}
              secondaryTypographyProps={{ color: "#aaa" }}
            />
          </ListItem>
        ))}

        <List>
          {filteredSessions.map((session, index) => {
            const currentSessionId = Number(
              localStorage.getItem("currentSessionId")
            );
            return (
              <ListItem
                key={session.id}
                selected={session.id === currentSessionId}
                divider
                sx={{
                  direction: "rtl",
                  justifyContent: "space-between",
                  textAlign: "right",
                  position: "relative",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0,188,212,0.15)",
                  },
                  "&:hover .actions": {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                }}
              >
                <ListItemText
                  primary={session.title || `محادثة ${index + 1}`}
                  onClick={() => {
                    localStorage.setItem("currentSessionId", session.id);
                    window.dispatchEvent(new Event("sessionSelected"));
                    handleDrawerClose();
                  }}
                />

                {/* مجموعة الأيقونات */}
                <Box
                  className="actions"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    opacity: 0,
                    transform: "translateX(10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadSession(session.id);
                    }}
                    title="تحميل PDF"
                    sx={{ color: "#ffffffff" }}
                  >
                    <FileDownloadIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    edge="end"
                    sx={{ color: "#ffffffff" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameSession(session.id, session.title);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    edge="end"
                    sx={{ color: "#ffffffff" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            );
          })}
        </List>
        {/* Dialog تأكيد الحذف */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          TransitionComponent={Grow}
          transitionDuration={300}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              bgcolor: "#0e1d3a",
              color: "white",
              textAlign: "center",
              width: 380,
            },
          }}
          BackdropProps={{
            sx: { backdropFilter: "blur(6px)" },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", color: "#f87171" }}>
            تأكيد الحذف
          </DialogTitle>

          <DialogContent sx={{ mt: 1 }}>
            <Typography sx={{ color: "white" }}>
              هل تريد حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: "#aaa" }}
            >
              إلغاء
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                await deleteSession(sessionToDelete);
                await fetchAllSessions();
                setDeleteDialogOpen(false);
              }}
              sx={{
                color: "#ef4444",
                borderColor: "#ef4444",
                "&:hover": { backgroundColor: "#b91c1c", color: "white" },
              }}
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </Drawer>
    </>
  );
}
