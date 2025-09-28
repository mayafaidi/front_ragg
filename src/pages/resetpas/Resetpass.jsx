import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  code: yup.string().required("Verification code is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPass() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await axios.patch(
        "https://askly.runasp.net/api/Accounts/ResetPassword",
        {
          email: email,
          code: data.code,
          newPassword: data.newPassword,
        }
      );

      if (response.status === 200) {
        setMessage("Password has been changed successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message ||
          "Password reset failed. Please check the code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "400px",
          padding: "2rem",
          borderRadius: "12px",
          textAlign: "center",
          backgroundColor: "#0f172a99",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          mb={3}
          sx={{
            fontWeight: 700,
            color: "white",
            fontFamily: "Cairo, Poppins, sans-serif",
          }}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              disabled
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />

            <TextField
              {...register("code")}
              label="Verification Code"
              variant="outlined"
              fullWidth
              error={!!errors.code}
              helperText={errors.code?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />

            <TextField
              {...register("newPassword")}
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />

            <TextField
              {...register("confirmPassword")}
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.2,
                fontSize: "14px",
                fontWeight: 700,
                backgroundColor: "#2563EB",
                "&:hover": { backgroundColor: "#1D4ED8" },
                borderRadius: "8px",
                fontFamily: "Cairo, Poppins, sans-serif",
                textTransform: "none",
                color: "white",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </Button>

            {message && (
              <Typography
                align="center"
                mt={2}
                color={message.includes("successfully") ? "green" : "error"}
              >
                {message}
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
