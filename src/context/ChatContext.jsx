import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);

  const createSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await axios.post(
        "https://localhost:7017/api/Chats/create-session",
        {},
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const newSession = response.data.data;
      localStorage.setItem("currentSessionId", newSession.id);
      setSessions((prev) => [...prev, newSession]);
      window.dispatchEvent(new Event("sessionCreated"));
      return newSession;
    } catch (err) {
      console.error("Failed to create session", err);
      return null;
    }
  };
const fetchAllSessions = async () => {
const token =localStorage.getItem("token");
if(!token)return;
try{
const response =await axios.get("https://localhost:7017/api/Chats/sessions",

 {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  const allSessions = response.data?.data || [];
    setSessions(allSessions);
    return allSessions;

}
catch(error){

console.error("❌ فشل في جلب كل الجلسات:", error);
}



}
const deleteSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.delete(
      `https://localhost:7017/api/Chats/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // إزالة الجلسة من الواجهة بعد الحذف
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    // في حال كانت الجلسة المحذوفة هي الحالية
    const current = localStorage.getItem("currentSessionId");
    if (Number(current) === sessionId) {
      localStorage.removeItem("currentSessionId");
      window.dispatchEvent(new Event("sessionDeleted"));
    }

    console.log(`✅ تم حذف الجلسة رقم ${sessionId}`);
  } catch (error) {
    console.error("❌ فشل حذف الجلسة:", error);
  }
};

  const renamesession = async (sessionId, newTitle) => {
 const token = localStorage.getItem("token");
  if (!token) return null;
try{
const response = await axios.put(`https://localhost:7017/api/Chats/sessions/${sessionId}/rename`,{newTitle},{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

   const updatedSession = response.data;
   console.log(response.data);

    console.log(" Session renamed:", updatedSession);
    return updatedSession;

}
catch(err){

   console.error(" فشل إعادة تسمية الجلسة:", err);
    return null;
}





}





  return (
    <ChatContext.Provider value={{ sessions, createSession, fetchAllSessions, deleteSession ,renamesession     }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
