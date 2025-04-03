import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout"; // Layout para páginas públicas

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token } = response.data;
      await login(access_token);
      setError("");
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <PublicLayout>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </PublicLayout>
  );
}
