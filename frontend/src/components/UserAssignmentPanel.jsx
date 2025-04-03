import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import api from "../api/axios";

export default function UserAssignmentPanel({ toolboxTalkId, assigned }) {
  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState(
    assigned.map((u) => u.user_id)
  );

  useEffect(() => {
    console.log("🚀 URL DE API ACTUAL →", import.meta.env.VITE_API_URL);
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const assignUser = async (userId) => {
    try {
      await api.post(`/toolbox-talks/${toolboxTalkId}/assign-user/${userId}`);
      setAssignedUserIds((prev) => [...prev, userId]);
    } catch (err) {
      alert("Error assigning user");
      console.error(err);
    }
  };

  const unassignUser = async (userId) => {
    try {
      await api.delete(
        `/toolbox-talks/${toolboxTalkId}/unassign-user/${userId}`
      );
      setAssignedUserIds((prev) => prev.filter((id) => id !== userId));
    } catch (err) {
      alert("Error unassigning user");
      console.error(err);
    }
  };

  return (
    <Box mt={5}>
      <Typography variant="h6" gutterBottom>
        👥 Manage Participants
      </Typography>
      <List dense>
        {users.map((user) => {
          const isAssigned = assignedUserIds.includes(user.id);
          return (
            <Box key={user.id}>
              <ListItem
                secondaryAction={
                  <Button
                    size="small"
                    variant={isAssigned ? "outlined" : "contained"}
                    color={isAssigned ? "error" : "primary"}
                    onClick={() =>
                      isAssigned
                        ? unassignUser(user.id)
                        : assignUser(user.id)
                    }
                  >
                    {isAssigned ? "Remove" : "Add"}
                  </Button>
                }
              >
                <ListItemText
                  primary={`${user.username} (${user.email})`}
                  secondary={user.role}
                />
              </ListItem>
              <Divider />
            </Box>
          );
        })}
      </List>
    </Box>
  );
}
