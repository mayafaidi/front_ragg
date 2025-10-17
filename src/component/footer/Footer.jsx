import React from 'react'
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";

export default function Footer() {
  return (
     <Box
      component="footer"
      sx={{
        backgroundColor: "transparent",color: "white", textAlign: "center",width: "100%",
        py: 1.5, position: "fixed",bottom: 0, left: 0,fontSize: "0.9rem",zIndex: 1000,
      }}
    >
      <Typography variant="body2">
        Oday Mere & Maya Faidi © 2025
      </Typography>
    </Box>
  )
}
