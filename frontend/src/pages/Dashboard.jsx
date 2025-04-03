// frontend/src/pages/Dashboard.jsx
import { useEffect } from "react";
import { Button, Typography, Box, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GroupIcon from "@mui/icons-material/Group";
import HandymanIcon from "@mui/icons-material/Handyman";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    // Imprime TODAS las variables de entorno
    console.log("🚀 ALL ENV:", import.meta.env);

    // Imprime el valor exacto de VITE_API_URL
    console.log("🚀 API URL:", import.meta.env.VITE_API_URL);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, <strong>{user?.username}</strong>. You are logged in as <strong>{user?.role}</strong>.
      </Typography>

      <Grid container spacing={2}>
        {user?.role === "admin" && (
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <GroupIcon fontSize="small" /> Manage Users
              </Typography>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/admin/users"
              >
                Go to Admin Panel
              </Button>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <HandymanIcon fontSize="small" /> Toolbox Talks
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/toolbox-talks"
            >
              View Talks
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
