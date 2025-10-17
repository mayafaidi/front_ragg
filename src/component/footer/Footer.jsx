import React from 'react';
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "transparent", 
        color: "white",
        textAlign: "center",
        width: "100%",
        py: 0.5,
        bottom: 0,
        left: 0,
        fontSize: "0.7rem",
        zIndex: 1000,
      }}
    >
      <Typography variant="body2"  sx={{width:"50%",margin:"auto " }}>
        © 2025 Oday Maree & Maya Faidi | Supervisor: Dr. Moamen Abu Ghazaleh
      </Typography>
    </Box>
  );
}
