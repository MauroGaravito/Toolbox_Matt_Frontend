// frontend/src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function AdminUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "worker" });

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    const res = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingUser ? "put" : "post";
      const url = editingUser ? `/users/${editingUser.id}` : "/users";

      await api[method](url, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsers();
      setForm({ username: "", email: "", password: "", role: "worker" });
      setEditingUser(null);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        👥 User Management
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Username"
          fullWidth
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          required={!editingUser}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Role"
          fullWidth
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingUser ? "Update User" : "Create User"}
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(u)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(u.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
