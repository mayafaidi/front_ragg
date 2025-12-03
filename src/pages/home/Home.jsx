import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, TextField, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuAppBar from "../../component/navbar/MenuAppBar";
import { useChat } from "../../context/ChatContext";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "../../component/footer/Footer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
const majorName = {
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
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = React.useRef(null);
  const [botTyping, setBotTyping] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const { sessions, fetchAllSessions, createSession, renamesession } =
    useChat();

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

  const handleCreateSession = async () => {
    const newSession = await createSession();

    if (newSession) {
      localStorage.setItem("currentSessionId", newSession.id);
      window.dispatchEvent(new Event("sessionSelected"));

      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
          isTyping: false,
        },
      ]);

      await fetchAllSessions(true);
    }
  };
  
  const botMessageRef = useRef("");
const streamText = (finalText, messageId) => {
  let index = 0;
  const step = 5; // عدد الحروف في كل تحديث
  const interval = setInterval(() => {
    botMessageRef.current = finalText.slice(0, index);

    // تحديث جزئي كل دفعة كبيرة
    if (index % 20 === 0 || index + step >= finalText.length) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, text: botMessageRef.current }
            : msg
        )
      );
    }

    index += step;
    if (index >= finalText.length) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, text: finalText } : msg
        )
      );
      clearInterval(interval);
    }
  }, 1);
};
 const handleSend = async () => {
  if (!inputRef.current.value.trim() || sending) return;
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("currentSessionId");
  const majorCode = localStorage.getItem("currentSpecialty") || "General";
  const major = majorName[majorCode] || majorCode || "غير معروف";
  if (!token || !sessionId) return;

  const userMsg = {
    id: `u-${Date.now()}`,
    sender: "user",
    text: inputRef.current.value,
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
  setInput("");
  setSending(true);

  if (messages.length <= 1) {
    await renamesession(Number(sessionId), userMsg.text.slice(0, 20));
    await fetchAllSessions(true);
    window.dispatchEvent(new Event("sessionsUpdated"));
  }

  let fullText = "";
  let isErrorMessage = false;

  try {
    // جلب المواد المنجزة
    const completedCoursesResponse = await fetch(
      `https://localhost:7017/api/Courses/completed/${majorCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const completedCourses = await completedCoursesResponse.json();

    // إرسال الرسالة للسيرفر
    const response = await fetch(
      "https://localhost:7017/api/Chats/send-message",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          role: "user",
          content: userMsg.text,
          major: majorCode,
          completedCourses: completedCourses,
          year: localStorage.getItem("year") || "1",
          semester: localStorage.getItem("semester") || "1",
        }),
      }
    );

    if (response.status === 204) {
      fullText =
        "⚠️ لا يوجد رد من المساعد، تأكد أن سؤالك ضمن نطاق النظام الأكاديمي.";
      isErrorMessage = true;
    } else {
      try {
        const data = await response.json();
        const botMsg = data?.data || data;
        if (botMsg?.content) fullText = botMsg.content;
        else if (botMsg?.message) fullText = botMsg.message;
        else if (botMsg?.data?.content) fullText = botMsg.data.content;
        else {
          fullText = "⚠️ لم يتم استلام رد واضح من المساعد. (message=null)";
          isErrorMessage = true;
        }
      } catch (err) {
        console.error("فشل قراءة الرد:", err);
        fullText = "⚠️ حدث خطأ أثناء قراءة الرد من الخادم.";
        isErrorMessage = true;
      }
    }

if (isErrorMessage) {
  await fetch("https://localhost:7017/api/Chats/send-message", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: Number(sessionId),
      role: "bot",
      content: fullText, // رسالة الخطأ نفسها
      major: majorCode,
      isErrorMessage: true,
    }),
  });
}
    const displayTime = new Date().toLocaleTimeString("EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const botMessageId = `b-${Date.now()}`;

    // استبدال رسالة "يكتب..." برد فعلي
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

    // بث النص بشكل سلس
    setTimeout(() => streamText(fullText, botMessageId), 100);
  } catch (error) {
    console.error("فشل إرسال الرسالة:", error);
    setMessages((prev) => prev.filter((m) => m.id !== typingId));
  } finally {
    setBotTyping(false);
    setSending(false);
    inputRef.current.value = "";
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
    const savedMajorCode =
      localStorage.getItem("currentSpecialty") || "General";
    const fullMajor =
      majorName[savedMajorCode] || savedMajorCode || "غير معروف";

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
                        pb: "4px",
                      }}
                    >
                      {msg.major}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      direction: /[\u0600-\u06FF]/.test(msg.text)
                        ? "rtl"
                        : "ltr",
                      textAlign: /[\u0600-\u06FF]/.test(msg.text)
                        ? "right"
                        : "left",
                      fontFamily: "'Cairo', sans-serif",
                      fontSize: "16px",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <StyledMarkdown msg={msg} />
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
              inputRef={inputRef}
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
              {sending || botTyping ? (
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
