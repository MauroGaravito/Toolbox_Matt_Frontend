import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { FiLogOut } from "react-icons/fi";

// Iconos de MUI
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import HandymanIcon from "@mui/icons-material/Handyman";

export default function LayoutBase({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: <HomeIcon />,
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
    },
    ...(user.role === "admin"
      ? [
          {
            to: "/admin/users",
            label: "Users",
            icon: <GroupIcon />,
          },
        ]
      : []),
    {
      to: "/toolbox-talks",
      label: "Toolbox Talks",
      icon: <HandymanIcon />,
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#f9f9f9",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
            ToolboxApp
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem disablePadding key={item.to}>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  selected={location.pathname === item.to}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, mt: "auto" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={logout}
              startIcon={<FiLogOut />}
              fullWidth
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
