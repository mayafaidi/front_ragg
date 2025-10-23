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
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newSession = response.data.data;
    newSession.messages = [
      { role: "bot", content: "مرحباً! كيف يمكنني مساعدتك اليوم؟" },
    ];

    localStorage.setItem("currentSessionId", newSession.id);
    setSessions((prev) => [...prev, newSession]);

    window.dispatchEvent(new Event("sessionsUpdated"));
    window.dispatchEvent(new Event("sessionSelected"));

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
    window.dispatchEvent(new Event("sessionsUpdated"));

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
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    const current = localStorage.getItem("currentSessionId");
    if (Number(current) === sessionId) {
      // إنشاء جلسة جديدة مباشرة
      const newSession = await createSession();
      if (newSession) {
        localStorage.setItem("currentSessionId", newSession.id);
        window.dispatchEvent(new Event("sessionSelected")); // تحديث الرسائل للجلسة الجديدة
      }
    }

    window.dispatchEvent(new Event("sessionsUpdated"));
    console.log(`تم حذف الجلسة رقم ${sessionId}`);
  } catch (error) {
    console.error("فشل حذف الجلسة:", error);
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
 window.dispatchEvent(new Event("sessionsUpdated"));
    console.log(" Session renamed:", updatedSession);
    return updatedSession;

}
catch(err){

   console.error(" فشل إعادة تسمية الجلسة:", err);
    return null;
}





}
const searchMessages = async (query) => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const response = await axios.get(
      `https://localhost:7017/api/Chats/messages/search`,
      {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data?.data || [];
  } catch (err) {
    console.error("فشل البحث في الرسائل:", err);
    return [];
  }
};

const handleDownloadSession = async (id) => {
  console.log(id);
  const token = localStorage.getItem("token"); 
  try {
      const response = await axios.get(`https://localhost:7017/api/Chats/${id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `session_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("خطأ أثناء تحميل الجلسة:", error);
    }

const getUserStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("https://localhost:7017/api/Chats/user-stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
    console.error(" فشل جلب الإحصائيات:", error);
    return null;
  }
};




  return (
    <ChatContext.Provider value={{ sessions, createSession, fetchAllSessions, deleteSession ,renamesession , searchMessages ,handleDownloadSession,getUserStats,   }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
