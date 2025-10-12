// import React, { useState } from "react";
// import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import { motion } from "framer-motion";

// export default function ChatInterface() {
// //   const [messages, setMessages] = useState([
// //     { sender: "bot", text: "مرحباً! كيف يمكنني مساعدتك اليوم؟" },
// //   ]);
// //   const [input, setInput] = useState("");

// //   const handleSend = () => {
// //     if (!input.trim()) return;
// //     setMessages([...messages, { sender: "user", text: input }]);
// //     setInput("");
// //     setTimeout(() => {
// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "bot", text: "تم استلام رسالتك 👍" },
// //       ]);
// //     }, 700);
// //   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//        // height: "calc(100vh - 64px)", // ناقص ارتفاع الـ AppBar
//       //  background: "linear-gradient(to bottom right, #0b1b35, #162447)",
//        // color: "white",
//       }}
//     >
//       {/* منطقة الشات */}
//       <Box
//         sx={{
//         //  flex: 1,
//         //  display: "flex",
//          // flexDirection: "column",
//          // p: 2,
//         }}
//       >
//         {/* الرسائل
//         <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
//           {messages.map((msg, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Paper
//                 sx={{
//                   maxWidth: "60%",
//                   p: 1.5,
//                   mb: 1.5,
//                   bgcolor: msg.sender === "user" ? "#1f4068" : "#16213e",
//                   alignSelf:
//                     msg.sender === "user" ? "flex-end" : "flex-start",
//                   color: "white",
//                 }}
//               >
//                 <Typography variant="body1">{msg.text}</Typography>
//               </Paper>
//             </motion.div>
//           ))}
//         </Box> */}

//         {/* إدخال الرسالة */}
//         {/* <Box sx={{ display: "flex", gap: 1 }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="اكتب رسالتك هنا..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             sx={{
//               backgroundColor: "white",
//               borderRadius: "8px",
//               input: { color: "black" },
//             }}
//           />
//           <IconButton
//             color="primary"
//             sx={{ bgcolor: "#00bcd4", color: "white", borderRadius: "10px" }}
//             onClick={handleSend}
//           >
//             <SendIcon />
//           </IconButton>
//         </Box> */}
//       </Box>

//       {/* الشريط الجانبي */}
//       {/* <Box
//         sx={{
//           width: 250,
//           bgcolor: "#1a1a2e",
//           p: 2,
//           borderLeft: "1px solid #333",
//         }}
//       >
//         <Typography variant="h6" mb={2}>
//           المحادثات
//         </Typography>
//         <Box>
//           <Typography sx={{ mb: 1, cursor: "pointer" }}>محادثة 1</Typography>
//           <Typography sx={{ mb: 1, cursor: "pointer" }}>محادثة 2</Typography>
//           <Typography sx={{ mb: 1, cursor: "pointer" }}>محادثة 3</Typography>
//         </Box>
//       </Box> */}
//     </Box>
//   );
// }
