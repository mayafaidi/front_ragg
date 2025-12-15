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
import { jwtDecode } from "jwt-decode";
import { toast, Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
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
const token = localStorage.getItem("token");
if (token) {
  const decoded = jwtDecode(token);
  const username =
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  localStorage.setItem("username", username);
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
    localStorage.getItem("currentSpecialty") || "General"
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
  const [year, setYear] = useState(localStorage.getItem("year") || "1");
  const [semester, setSemester] = useState(
    localStorage.getItem("semester") || "1"
  );

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameSessionId, setRenameSessionId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [zajelAnchorEl, setZajelAnchorEl] = useState(null);
  const [subAnchorEl, setSubAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [zajelCategories, setZajelCategories] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/zajel")
      .then((res) => res.json())
      .then((data) => {
        setZajelCategories(data.data || []);
        const hasNewArticle = data.data?.some((cat) =>
          cat.articles?.some((a) => a.is_new)
        );
        setHasNew(hasNewArticle);
      })
      .catch((err) => console.error("خطأ في جلب إعلانات زاجل:", err));
  }, []);

  const handleOpenZajel = (e) => setZajelAnchorEl(e.currentTarget);
  const handleCloseZajel = () => {
    setZajelAnchorEl(null);
    setSubAnchorEl(null);
  };
  const handleOpenMainMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMainMenu = () => {
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
  toast.success("تم تغيير كلمة المرور بنجاح ✅", {
      position: "top-right",
      autoClose: 2500,
      transition: Bounce,
    });
    } catch (error) {
      alert(error.response?.data?.message || " فشل تغيير كلمة المرور");
    } finally {
      setChangingPassword(false);
    }
  };
  useEffect(() => {
    if (!openCoursesDialog) return;

    const fetchCourses = async () => {
      try {
        const res = await axios.post(
          "https://localhost:7017/api/Courses/get-by-major",
          { major: specialty },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let data = res.data;

        
        const completedRes = await axios.get(
          `https://localhost:7017/api/Courses/completed/${specialty}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const completedList = completedRes.data;

        Object.values(data).forEach((cat) => {
          cat["المساقات"] = cat["المساقات"].map((course) => ({
            ...course,

            IsCompleted: completedList.includes(course["اسم المساق"]),
          }));
        });

        setCoursesByCategory(data);
      } catch (err) {
        console.error("خطأ في تحميل المواد:", err);
      }
    };

    fetchCourses();
  }, [openCoursesDialog, specialty]);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);
  useEffect(() => {
    const updateData = async () => {
      await fetchAllSessions(true);
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

          <Box sx={{ position: "relative", ml: 2 }}>
            <Button
              sx={{
                color: "white",
                fontSize: "1rem",
                backgroundColor: "#6b0f1a",
                "&:hover": { backgroundColor: "#8b1f2b" },
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
                  left: "-8px",
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
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    overflow: "hidden",
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
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <span>{cat.category_name}</span>
                    <span>{getCategoryIcon(cat.category_name)}</span>
                  </MenuItem>
                ))}
              </Menu>
            )}

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
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    overflow: "hidden",
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
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      {article.title}
                      {article.is_new && (
                        <span style={{ color: "crimson", fontSize: "0.8rem" }}>
                          جديد
                        </span>
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
          هل أنت متأكد من حذف هذه المحادثة؟
        </DialogTitle>

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
              setDeleteDialogOpen(false);
              await fetchAllSessions();
            }}
            sx={{
              color: "#f44336",
              borderColor: "#f44336",
              "&:hover": { backgroundColor: "#b71c1c", color: "white" },
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

     
      <Drawer
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              <ChevronRightIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: "bold" }}>
              المحادثات
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1.5,
            }}
          >
            <Button
              sx={{
                backgroundColor: "#1E3A8A",
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0.5,
            }}
          >
            <Button
              sx={{
                backgroundColor: "#1E3A8A",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#1E3A8A" },
              }}
              onClick={() => setOpenCoursesDialog(true)}
            >
              المواد المنجزة
            </Button>
          </Box>

          <Dialog
            open={openCoursesDialog}
            onClose={() => setOpenCoursesDialog(false)}
            TransitionComponent={Grow}
            transitionDuration={300}
            PaperProps={{
              sx: {
                borderRadius: 5,
                p: 2,
                bgcolor: "#0e1d3a",
                color: "white",
                width: "70vw",
                maxWidth: "960px",
                maxHeight: "90vh",
              },
            }}
            BackdropProps={{
              sx: { backdropFilter: "blur(6px)" },
            }}
          >
            <DialogTitle
              sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}
            >
              المواد المنجزة
            </DialogTitle>

            <DialogContent
              dividers
              sx={{
                direction: "rtl",
                maxHeight: "65vh",
                overflowY: "auto",
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label="السنة"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  sx={{
                    width: 120,
                    "& .MuiInputBase-root": {
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderRadius: 1,
                      px: 1,
                    },
                    "& .MuiInputLabel-root": { color: "#90caf9" },
                    "& .MuiInputBase-input": { textAlign: "center" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#90caf9",
                    },
                  }}
                />
                <TextField
                  label="الفصل"
                  type="number"
                  value={semester}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (val > 2) val = 2; 
                    setSemester(val);
                  }}
                  sx={{
                    width: 120,
                    "& .MuiInputBase-root": {
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderRadius: 1,
                      px: 1,
                    },
                    "& .MuiInputLabel-root": { color: "#90caf9" },
                    "& .MuiInputBase-input": { textAlign: "center" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#90caf9",
                    },
                  }}
                />
              </Box>

              {coursesByCategory && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "start",
                    justifyItems: "center",
                  }}
                >
                  {Object.entries(coursesByCategory).map(
                    ([categoryName, categoryData]) => {
                      if (
                        !categoryData["عدد_الساعات_المطلوبة"] ||
                        categoryData["عدد_الساعات_المطلوبة"] === 0
                      ) {
                        return null;
                      }

                      const allChecked = categoryData["المساقات"].every(
                        (c) => c.IsCompleted
                      );

                      return (
                        <Box
                          key={categoryName}
                          sx={{
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: 2,
                            p: 2,
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 3,
                              flexDirection: "column",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                color: "#90caf9",
                                textAlign: "center",
                              }}
                            >
                              {categoryName} (
                              {categoryData["عدد_الساعات_المطلوبة"]} ساعة)
                            </Typography>

                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                color: allChecked ? "#ff8a8a" : "#8aff8a",
                                borderColor: "rgba(255,255,255,0.3)",
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.15)",
                                },
                              }}
                              onClick={() => {
                                setCoursesByCategory((prev) => ({
                                  ...prev,
                                  [categoryName]: {
                                    ...prev[categoryName],
                                    المساقات: prev[categoryName][
                                      "المساقات"
                                    ].map((course) => ({
                                      ...course,
                                      IsCompleted: !allChecked,
                                    })),
                                  },
                                }));
                              }}
                            >
                              {allChecked ? "إلغاء الكل" : "اختيار الكل"}
                            </Button>
                          </Box>

                          {categoryData["المساقات"].map((course) => (
                            <Box
                              key={course["رقم المساق"]}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={course.IsCompleted}
                                onChange={() => {
                                  setCoursesByCategory((prev) => ({
                                    ...prev,
                                    [categoryName]: {
                                      ...prev[categoryName],
                                      المساقات: prev[categoryName][
                                        "المساقات"
                                      ].map((c) =>
                                        c["رقم المساق"] === course["رقم المساق"]
                                          ? {
                                              ...c,
                                              IsCompleted: !c.IsCompleted,
                                            }
                                          : c
                                      ),
                                    },
                                  }));
                                }}
                              />
                              <Typography sx={{ mr: 1, fontSize: "0.9rem" }}>
                                {course["اسم المساق"]}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      );
                    }
                  )}
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center" }}>
              <Button
                variant="outlined"
                sx={{
                  color: "#eeeeeeff",
                  "&:hover": { backgroundColor: "#933313ff", color: "white" },
                }}
                onClick={() => setOpenCoursesDialog(false)}
              >
                إغلاق
              </Button>

              <Button
                variant="outlined"
                sx={{
                  color: "#ffffffff",
                  "&:hover": { backgroundColor: "#2115c7ff", color: "white" },
                }}
                onClick={async () => {
                  const completedCodes = [];
                  Object.values(coursesByCategory).forEach((cat) => {
                    cat["المساقات"].forEach((c) => {
                      if (c.IsCompleted)
                        completedCodes.push(String(c["رقم المساق"]));
                    });
                  });

                  console.log("✅ الكود قبل الحفظ:", completedCodes);

                  await axios.post(
                    "https://localhost:7017/api/Courses/save-completed",
                    {
                      major: specialty,
                      completedCourseCodes: completedCodes,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  console.log("💾 تم إرسال البيانات للباك:", {
                    major: specialty,
                    completedCourseCodes: completedCodes,
                  });
                  localStorage.setItem("year", String(year));
                  localStorage.setItem("semester", String(semester));
                  localStorage.setItem(
                    "completedCourses",
                    JSON.stringify(completedCodes)
                  );
                   toast.success( "تم حفظ المواد بنجاح ", {
      position: "top-right",
      autoClose: 2500,
      transition: Bounce,
    });
                  setOpenCoursesDialog(false);
                }}
              >
                حفظ
              </Button>
            </DialogActions>
          </Dialog>

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
                  mt: 2,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
                  عدد المحادثات: {userStats.totalSessions || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
                  إجمالي الرسائل: {userStats.totalMessages || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  آخر ظهور:{" "}
                  {userStats.lastActivity
                    ? (() => {
                        const date = new Date(userStats.lastActivity);
                        date.setHours(date.getHours() + 3);
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
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
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
                  "&:hover": {
                    backgroundColor: "rgba(0,188,212,0.15)",
                    cursor: "pointer",
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
                    sx={{ color: "#fff" }}
                  >
                    <FileDownloadIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    edge="end"
                    sx={{ color: "#fff" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameSession(session.id, session.title);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    edge="end"
                    sx={{ color: "#fff" }}
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
        </Box>
      </Drawer>
      <ToastContainer />
    </>
  );
}
