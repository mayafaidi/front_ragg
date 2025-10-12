import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuAppBar from "../../component/navbar/MenuAppBar";
import Footer from "../../component/footer/Footer";
export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "مرحباً! كيف يمكنني مساعدتك اليوم؟" },
    { sender: "user", text: "أريد معرفة كيفية استخدام React" },
    {
      sender: "bot",
      text: "  سوالك جميل ازا عند ملاحظات احكي لمايا تعدل تمام تمام ",
    },
  ]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <>
      <MenuAppBar />
      <Box
        sx={{
          bgcolor: "#0b162b",
          height: "100vh",
          color: "white",
          display: "flex",
          flexDirection: "column",
          pt: 8,
          px: 3,
        }}
      >
        {/* ✅ الرسائل */}
        <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
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
                  bgcolor: msg.sender === "user" ? "#00bcd4" : "#1f2d52",
                  color: "white",
                  borderRadius:
                    msg.sender === "user"
                      ? "16px 16px 0 16px"
                      : "16px 16px 16px 0",
                }}
              >
                <Typography>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* ✅ إدخال الرسالة */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="اكتب عزيزي الطالب"
             dir="rtl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{
              bgcolor: "#fff",
              borderRadius: "10px",
              
              input: { color: "black" },
            }}
          />
          <IconButton
            onClick={handleSend}
            sx={{
              bgcolor: "#00bcd4",
              color: "white",
              borderRadius: "10px",
              "&:hover": { bgcolor: "#0097a7" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
{/* <Footer/> */}
    </>
  );
}
