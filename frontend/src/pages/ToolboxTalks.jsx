import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Visibility, Build } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function ToolboxTalks() {
  const { user } = useAuth();
  const [talks, setTalks] = useState([]);
  const [topic, setTopic] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    try {
      const res = await api.get("/toolbox-talks");
      setTalks(res.data);
    } catch (err) {
      console.error("Error fetching talks:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/toolbox-talks/${editingId}`, { topic });
      } else {
        await api.post("/toolbox-talks", {
          topic,
          content: "Content generated by AI will go here.",
          created_by: user.id,
        });
      }

      setTopic("");
      setEditingId(null);
      fetchTalks();
    } catch (err) {
      console.error("Error submitting Toolbox Talk:", err);
    }
  };

  const handleEdit = (talk) => {
    setTopic(talk.topic);
    setEditingId(talk.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this Toolbox Talk?")) {
      try {
        await api.delete(`/toolbox-talks/${id}`);
        fetchTalks();
      } catch (err) {
        console.error("Error deleting Toolbox Talk:", err);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          <Build sx={{ verticalAlign: "middle", mr: 1 }} />
          Toolbox Talks
        </Typography>

        {(user?.role === "admin" || user?.role === "supervisor") && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <TextField
              label="Toolbox Talk Topic"
              variant="outlined"
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Update Talk" : "Generate Toolbox Talk"}
            </Button>
          </Box>
        )}

        <Paper sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {talks.map((talk) => (
                <TableRow key={talk.id}>
                  <TableCell>{talk.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      color="primary"
                      startIcon={<Visibility />}
                      component={Link}
                      to={`/toolbox-talks/${talk.id}`}
                    >
                      {talk.topic}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(talk.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {(user?.role === "admin" || user?.role === "supervisor") && (
                      <>
                        <IconButton onClick={() => handleEdit(talk)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(talk.id)} color="error">
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
}
