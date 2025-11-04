import React, { useState, useEffect } from "react";
import { Box, IconButton, TextField, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuAppBar from "../../component/navbar/MenuAppBar";
import { useChat } from "../../context/ChatContext";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "../../component/footer/Footer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const majorName ={
MIS: " أنظمة المعلومات الإدارية",
 CS: "علم الحاسوب",
  CSec: " الأمن السيبراني",
  CAP: "علم الحاسوب في سوق العمل ",
  CAP_SW: " علم الحاسوب تركيز برمجيات",
  CAP_AI: "علم الحاسوب تركيز الذكاء الاصطناعي ",
  General: " عام", // 👈 اختياري في حال المستخدم ما اختار تخصص
};
import Markdown from "react-markdown";
import StyledMarkdown from "../../StyleMarkDown";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false); // spinner زر الإرسال
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // لتحميل الصفحة فقط (مش للإرسال)
  const [copiedId, setCopiedId] = useState(null); //هاي عشان اشارة الكوبي
  const messagesEndRef = React.useRef(null);
const [botTyping, setBotTyping] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const { sessions, fetchAllSessions, createSession } = useChat();

  // جلب رسائل جلسة معيّنة
 const fetchMessages = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    setLoading(true);
    const response = await fetch(
      `https://localhost:7017/api/Chats/sessions/${sessionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await response.json();
    const msgs = data?.data?.messages?.map((m, idx) => ({
      id: m.id ?? `srv-${idx}`,
      sender: m.role === "user" ? "user" : "bot",
      text: m.content,
      major: majorName[m.major] || m.major || "غير معروف",
      isTyping: false,
      time: m.createdAt
        ? new Date(
            new Date(m.createdAt).getTime() + 3 * 60 * 60 * 1000
          ).toLocaleTimeString("EG", { hour: "2-digit", minute: "2-digit" })
        : null,
    }));

    // 🟢 إذا ما في رسائل في الجلسة، نضيف الترحيب الديناميكي هون
    if (!msgs || msgs.length === 0) {
      const username = localStorage.getItem("username") || "عزيزي الطالب";
      const majorCode = localStorage.getItem("currentSpecialty") || "General";
      const major = majorName[majorCode] || "التخصص العام";

      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: `مرحباً ${username}! 👋  
أنا المساعد الأكاديمي الخاص بك لتخصص **${major}** 🎓  
كيف يمكنني مساعدتك اليوم؟`,
          isTyping: false,
        },
      ]);
    } else {
      setMessages(msgs);
    }
  } catch (error) {
    console.error("فشل في جلب الرسائل:", error);
    setMessages([
      {
        id: "empty",
        sender: "bot",
        text: "حدث خطأ أثناء تحميل الجلسة.",
        isTyping: false,
      },
    ]);
  } finally {
    setLoading(false);
  }
};


  // إنشاء جلسة جديدة
  const handleCreateSession = async () => {
    const newSession = await createSession();
    if (newSession) {
      setMessages(
        newSession.messages.length > 0
          ? newSession.messages.map((m, idx) => ({
              id: m.id ?? `new-${idx}`,
              sender: m.role === "user" ? "user" : "bot",
              text: m.content,
              isTyping: false,
            }))
          : [
              {
                id: "welcome",
                sender: "bot",
                text: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
                isTyping: false,
              },
            ]
      );
      await fetchAllSessions();
    }
  };

 const handleSend = async () => {
  if (!input.trim() || sending) return;

  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("currentSessionId");
  const majorCode = localStorage.getItem("currentSpecialty") || "General";
  const major = majorName[majorCode] || majorCode || "غير معروف";

  if (!token || !sessionId) return;

  //  يكتب
  const userMsg = {
    id: `u-${Date.now()}`,
    sender: "user",
    text: input,
    isTyping: false,
    major: major,
  };

  const typingId = `typing-${Date.now()}`;
  const typingMsg = {
    id: typingId,
    sender: "bot",
    text: "يكتب…",
    isTyping: true,
  };

  setMessages((prev) => [...prev, userMsg, typingMsg]);

  userMsg.time = new Date().toLocaleTimeString("EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  setInput("");
  setSending(true);

try {
  const completedCoursesResponse  = await fetch(`https://localhost:7017/api/Courses/completed/${majorCode}`,{
    method:"GET",
     headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  const completedCourses = await completedCoursesResponse.json();
console.log(completedCourses, "asdasdsad");
  ///حفظت المواد المنجزة تمام تمام
//فبعطيني رقم المنجزة تمام برضو تمام 
  const response = await fetch("https://localhost:7017/api/Chats/send-message", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: Number(sessionId),
      role: "user",
      content: `${userMsg.text}`,
      major: majorCode,
      completedCourses: completedCourses, 
    }),
  });


    const data = await response.json();
    const botMsg = data?.data;

    if (botMsg && botMsg.content) {
      const fullText = botMsg.content;
      const displayTime = new Date(botMsg.createdAt).toLocaleTimeString("EG", {
  hour: "2-digit",
  minute: "2-digit",
});

      let currentText = "";
      const botMessageId = `b-${Date.now()}`;

      // أضيف رسالة بوت فاضية كبداية
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                id: botMessageId,
                sender: "bot",
                text: "",
                isTyping: false,
                isStreaming: true,
                time: displayTime,
              }
            : m
        )
      );

      
      const chunkSize = 8;   
      const delay = 1;       
      let index = 0;
      let lastTime = 0;

      const typeEffect = (timestamp) => {
        if (index < fullText.length) {
          if (!lastTime || timestamp - lastTime >= delay) {
            currentText += fullText.slice(index, index + chunkSize);
            index += chunkSize;
            lastTime = timestamp;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId ? { ...m, text: currentText } : m
              )
            );
          }

          requestAnimationFrame(typeEffect);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId ? { ...m, isStreaming: false } : m
            )
          );

          setBotTyping(false);
          setSending(false);
        }
      };

      requestAnimationFrame(typeEffect);
    }
  } catch (error) {
    console.error("فشل إرسال الرسالة:", error);
    setMessages((prev) => prev.filter((m) => m.id !== typingId));
  }
};

// 📋 دالة النسخ
const handleCopy = async (text, id) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  } catch (err) {
    console.error("فشل النسخ:", err);
  }
};


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
useEffect(() => {
  const savedMajorCode = localStorage.getItem("currentSpecialty") || "General";
  const fullMajor = majorName[savedMajorCode] || savedMajorCode || "غير معروف";
  
  // نحفظه مؤقتًا في state أو نطبعه للتأكد
  // console.log("📘 التخصص الحالي:", fullMajor);
}, []);

  useEffect(() => {
    const loadSession = async () => {
      let sessionId = localStorage.getItem("currentSessionId");
      if (!sessionId) {
        const newSession = await createSession();
        if (newSession) {
          localStorage.setItem("currentSessionId", newSession.id);
          sessionId = newSession.id;
        }
      }
      if (sessionId) await fetchMessages(sessionId);
    };

    loadSession();

    const handleSessionChange = () => {
      const sessionId = localStorage.getItem("currentSessionId");
      if (sessionId) fetchMessages(sessionId);
    };

    window.addEventListener("sessionSelected", handleSessionChange);
    return () =>
      window.removeEventListener("sessionSelected", handleSessionChange);
  }, []);

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
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          pt: 8,
          px: 3,
          fontFamily: "'Cairo', sans-serif",
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
            messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: "75%",
                    bgcolor:
                      msg.sender === "user"
                        ? "rgba(0,188,212,0.1)"
                        : msg.isTyping
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.1)",
                    color: "white",
                    borderRadius:
                      msg.sender === "user"
                        ? "16px 16px 0 16px"
                        : "16px 16px 16px 0",
                    margin: "5px",
                    opacity: msg.isTyping ? 0.8 : 1,
                    fontStyle: msg.isTyping ? "italic" : "normal",
                    position: "relative",
                    "&:hover .copy-btn": {
                      opacity: 1,
                      transform: "translateY(0) scale(1)",
                    },
                  }}
                >
                  {msg.sender === "user" && msg.major && (
    <Typography
      sx={{
        fontSize: "13px",
        fontWeight: "bold",
       // color: "#00BCD4",
        mb: 0.5,
        textAlign: "right",
borderBottom: "1px solid", 
pb:"4px",
      }}
    >
      {msg.major}
    </Typography>
  )}
              <Box
  sx={{
    direction: /[\u0600-\u06FF]/.test(msg.text) ? "rtl" : "ltr",
    textAlign: /[\u0600-\u06FF]/.test(msg.text) ? "right" : "left",
    fontFamily: "'Cairo', sans-serif",
    fontSize: "16px",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  }}
>
  <StyledMarkdown msg={msg}/>
</Box>




                  {msg.time && (
                    <Typography
                      sx={{ fontSize: "12px", color: "gray", mt: 0.5 }}
                    >
                      {msg.time}
                    </Typography>
                  )}

                  {!msg.isTyping && (
                    <IconButton
                      className="copy-btn"
                      size="small"
                      onClick={() => handleCopy(msg.text, msg.id)}
                      sx={{
                        position: "absolute",
                        bottom: -3,
                        right: msg.sender === "bot" ? 8 : "auto",
                        left: msg.sender === "user" ? 8 : "auto",
                        opacity: 0,
                        transform: "translateY(5px) scale(0.9)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        color:
                          copiedId === msg.id
                            ? "#00BCD4"
                            : "rgba(255,255,255,0.6)",
                        "&:hover": {
                          color: "#00BCD4",
                          transform: "translateY(0) scale(1.1)",
                        },
                      }}
                    >
                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </Paper>
              </Box>
            ))
          )}
        </Box>
        <div ref={messagesEndRef} />
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 100,
            bgcolor: "transparent",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, px: 1, pb: 0.5 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="اكتب عزيزي الطالب..."
              dir="rtl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={sending}
              sx={{
                bgcolor: "rgba(255,255,255,0.95)",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#1E3A8A",
                    boxShadow: "0 0 8px rgba(0,188,212,0.4)",
                  },
                  // "&:hover fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                },
                input: { color: "black", fontFamily: "'Cairo', sans-serif" },
              }}
            />

            <IconButton
              onClick={handleSend}
                disabled={sending || botTyping}
              sx={{
                bgcolor: "#1e3982ff",
                color: "white",
                borderRadius: "10px",

                "&:hover": {
                  backgroundColor: "#1e3982ff", // نفس اللون بدون تغيّر
                  transform: "none", // منع أي حركة
                },
              }}
            >
              {sending||botTyping ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>

          <Footer />
        </Box>
      </Box>
    </>
  );
}
