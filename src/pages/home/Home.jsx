import React, { useState, useEffect } from "react";
import { Box, IconButton, TextField, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuAppBar from "../../component/navbar/MenuAppBar";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useChat } from "../../context/ChatContext";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const location = useLocation();
  const { sessions, fetchAllSessions, createSession, searchMessages } = useChat();

  
 // عند تحميل الصفحة
useEffect(() => {
  const loadCurrentSession = async () => {
    let selectedId = localStorage.getItem("currentSessionId");

    if (!selectedId) {
     
      const newSession = await createSession();
      if (newSession) {
        selectedId = newSession.id;
        localStorage.setItem("currentSessionId", selectedId);
        setMessages(
          newSession.messages.length > 0
            ? newSession.messages.map((m) => ({ sender: m.role === "user" ? "user" : "bot", text: m.content }))
            : [{ sender: "bot", text: "مرحباً! كيف يمكنني مساعدتك اليوم؟" }]
        );
        await fetchAllSessions();
      }
    } else {
      setLoading(true);
      await fetchMessages(selectedId);
      setLoading(false);
    }
  };

  loadCurrentSession();
}, []);


  useEffect(() => {
    if (location.state?.newLogin) {
      console.log("🔹 تسجيل دخول جديد — جاري إنشاء جلسة جديدة...");
      handleCreateSession();
    }
  }, [location.state]);

  const fetchMessages = async (sessionId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `https://localhost:7017/api/Chats/sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msgs = response.data?.data?.messages?.map((m) => ({
        sender: m.role === "user" ? "user" : "bot",
        text: m.content,
      })) || [{ sender: "bot", text: "مرحباً! كيف يمكنني مساعدتك اليوم؟" }];

      setMessages(msgs);
    } catch (error) {
      console.error("فشل في جلب الرسائل:", error);
      setMessages([{ sender: "bot", text: "لا توجد رسائل بعد، ابدأ المحادثة" }]);
    }
  };

  // إنشاء جلسة جديدة مع رسالة ترحيبية مباشرة
  const handleCreateSession = async () => {
    const newSession = await createSession();
    if (newSession) {
      const msgs = newSession.messages && newSession.messages.length > 0
        ? newSession.messages.map((m) => ({
            sender: m.role === "user" ? "user" : "bot",
            text: m.content,
          }))
        : [{ sender: "bot", text: "مرحباً! كيف يمكنني مساعدتك اليوم؟" }];

      setMessages(msgs); 
      fetchAllSessions(); 
    }
  };

  // إرسال رسالة جديدة
  const handleSend = async () => {
    if (input.trim() === "") return;

    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("currentSessionId");
    const major = localStorage.getItem("currentSpecialty") || "General";

    if (!token || !sessionId) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7017/api/Chats/send-message",
        { sessionId: Number(sessionId), role: "user", content: input, major },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const botMsg = response.data?.data;
      if (botMsg && botMsg.content) {
        setMessages((prev) => [...prev, { sender: "bot", text: botMsg.content }]);
      }
    } catch (error) {
      console.error("فشل إرسال الرسالة:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MenuAppBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />

      <Box
        component="main"
        sx={{
          height: "100vh",
          background: "linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          pt: 8,
          px: 3,
          fontFamily: "'Cairo', sans-serif",
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginRight: open ? "280px" : 0,
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress sx={{ color: "white" }} />
            </Box>
          ) : messages.length === 0 ? (
            <Typography sx={{ textAlign: "center", mt: 4 }}>
              مرحبا بك ! كيف يمكنني مساعدتك 
            </Typography>
          ) : (
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: "75%",
                    bgcolor: msg.sender === "user" ? "rgba(0,188,212,0.1)" : "rgba(255,255,255,0.1)",
                    color: "white",
                    borderRadius: msg.sender === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
                    fontFamily: "'Cairo', sans-serif",
                    margin: "5px",
                  }}
                >
                  <Typography sx={{ fontSize: "16px" }}>{msg.text}</Typography>
                </Paper>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="اكتب عزيزي الطالب..."
            dir="rtl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{
              bgcolor: "rgba(255,255,255,0.95)",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "&.Mui-focused fieldset": {
                  borderColor: "#00BCD4",
                  boxShadow: "0 0 8px rgba(0,188,212,0.4)",
                },
                "&:hover fieldset": { borderColor: "rgba(0,0,0,0.1)" },
              },
              input: { color: "black", fontFamily: "'Cairo', sans-serif" },
            }}
          />
          <IconButton
            onClick={handleSend}
            sx={{ bgcolor: "#00bcd4", color: "white", borderRadius: "10px", "&:hover": { bgcolor: "#0097a7" } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
