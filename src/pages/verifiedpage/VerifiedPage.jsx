import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifiedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const status = params.get("status") || "success"; 

  const isSuccess = status === "success";

  return (
    <div
      style={{
        background: "#2a8ceeff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Tajawal, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "16px",
          color: "white",
          textAlign: "center",
          width: "350px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {isSuccess ? (
          <>
            <h2>✔️ تم تفعيل حسابك</h2>
            <p>حسابك جاهز الآن للاستخدام.</p>

            <button
              onClick={() => navigate("/login")}
              style={{
                marginTop: "20px",
                background: "#007bff",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              الانتقال إلى تسجيل الدخول
            </button>
          </>
        ) : (
          <>
            <h2>❌ فشل تفعيل الحساب</h2>
            <p>حدث خطأ أثناء تفعيل حسابك. الرجاء المحاولة مرة أخرى.</p>

            <button
              onClick={() => navigate("/register")}
              style={{
                marginTop: "20px",
                background: "red",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              العودة إلى صفحة التسجيل
            </button>
          </>
        )}
      </div>
    </div>
  );
}
