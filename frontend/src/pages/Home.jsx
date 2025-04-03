// frontend/src/pages/Home.jsx
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SettingsIcon from "@mui/icons-material/Settings";
import EditNoteIcon from "@mui/icons-material/EditNote";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <Box sx={{ fontFamily: "Roboto, sans-serif" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to ToolboxApp
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        ToolboxApp is a modern tool to help teams create, manage, and sign Toolbox Talks with ease.
        It ensures compliance with Australian WHS standards and keeps your safety meetings organised and accessible.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Key Benefits
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="AI-powered content generation for Toolbox Talks" />
        </ListItem>
        <ListItem>
          <ListItemIcon><EditNoteIcon /></ListItemIcon>
          <ListItemText primary="Digital and drawn signature support" />
        </ListItem>
        <ListItem>
          <ListItemIcon><UploadFileIcon /></ListItemIcon>
          <ListItemText primary="Upload and attach reference documents" />
        </ListItem>
        <ListItem>
          <ListItemIcon><LockIcon /></ListItemIcon>
          <ListItemText primary="Secure access with role-based permissions" />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        What can you do as a <strong>{user?.role}</strong>?
      </Typography>

      <Grid container spacing={2} mt={1}>
        {user?.role === "admin" && (
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AdminPanelSettingsIcon fontSize="small" /> Admin
              </Typography>
              <ul>
                <li>Manage all users</li>
                <li>View all Toolbox Talks</li>
                <li>Access audit logs</li>
              </ul>
            </Paper>
          </Grid>
        )}

        {(user?.role === "supervisor" || user?.role === "admin") && (
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AssignmentIndIcon fontSize="small" /> Supervisor
              </Typography>
              <ul>
                <li>Create and edit Toolbox Talks</li>
                <li>Assign topics</li>
                <li>Upload reference documents</li>
              </ul>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EngineeringIcon fontSize="small" /> Worker
            </Typography>
            <ul>
              <li>View assigned Toolbox Talks</li>
              <li>Sign digitally</li>
              <li>Access your past signatures</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="body2" color="text.secondary">
        Need help or have questions? Contact your supervisor or admin for guidance.
      </Typography>
    </Box>
  );
}
