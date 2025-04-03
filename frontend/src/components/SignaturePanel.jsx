import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const SignaturePanel = ({ toolboxTalkId }) => {
  const { token, user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [signatures, setSignatures] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const sigPadRef = useRef(null);

  useEffect(() => {
    if (!loading && token) {
      fetchSignatures();
      fetchUsers();
    }
  }, [toolboxTalkId, token, loading]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const fetchSignatures = async () => {
    try {
      const res = await api.get(`/digital-signatures/toolbox-talk/${toolboxTalkId}`);
      setSignatures(res.data);
    } catch (err) {
      console.error("Error fetching signatures:", err);
    }
  };

  const handleClear = () => {
    sigPadRef.current?.clear();
  };

  const handleUserSelect = (event) => {
    const selectedId = event.target.value;
    const found = users.find((u) => u.id === selectedId);
    setSelectedUserId(selectedId);
    setFullName(found?.username || "");
    setEmail(found?.email || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      setErrorMessage("✋ Please draw your signature before submitting.");
      return;
    }

    const signatureImage = sigPadRef.current.getCanvas().toDataURL("image/png");

    try {
      const res = await api.post("/digital-signatures", {
        toolbox_talk_id: toolboxTalkId,
        full_name: fullName,
        email,
        signature_image: signatureImage,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("✅ Signed successfully.");
        fetchSignatures();
        setTimeout(() => {
          setSuccessMessage("");
          handleClear();
        }, 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Something went wrong.";
      setErrorMessage(msg);
    }
  };

  const handleDeleteSignature = async (emailToDelete) => {
    if (!window.confirm("Are you sure you want to delete this signature?")) return;
    try {
      await api.delete(
        `/signatures/by-toolbox-talk/${toolboxTalkId}/email/${encodeURIComponent(emailToDelete)}`
      );
      fetchSignatures();
    } catch (err) {
      console.error("❌ Error deleting signature:", err);
      alert("Failed to delete signature.");
    }
  };

  if (loading) return <Typography>Loading signature section...</Typography>;
  if (!token || !user) return null;

  return (
    <Box mt={4}>
      <Typography variant="h6">Sign the Toolbox Talk</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select User</InputLabel>
        <Select value={selectedUserId} onChange={handleUserSelect} label="Select User">
          <MenuItem value="">-- No selection --</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.username} ({u.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Typography variant="subtitle1" mt={2}>
          Draw Your Signature:
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginTop: 1,
            marginBottom: 1,
          }}
        >
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
            ref={sigPadRef}
          />
        </Box>
        <Box display="flex" gap={2}>
          <Button type="submit" variant="contained" color="primary">
            Sign
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Box>
        {errorMessage && (
          <Typography color="error" mt={2}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success.main" mt={2}>
            {successMessage}
          </Typography>
        )}
      </form>

      <Typography variant="h6" mt={4}>
        Existing Signatures
      </Typography>
      <List>
        {signatures.map((sig) => (
          <ListItem key={sig.id} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1">
                {sig.full_name} - {sig.email}
              </Typography>
              {sig.signature_image && (
                <img
                  src={sig.signature_image}
                  alt="signature"
                  style={{ maxHeight: 100, marginTop: 8 }}
                />
              )}
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteSignature(sig.email)}
              sx={{ ml: 2 }}
            >
              🗑️ Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SignaturePanel;
