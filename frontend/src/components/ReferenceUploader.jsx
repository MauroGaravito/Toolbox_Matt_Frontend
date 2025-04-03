import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Input,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAuth } from "../context/AuthContext";
import DocumentTable from "./DocumentTable";

export default function ReferenceUploader({ toolboxTalkId, onUploadSuccess }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/reference_documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaded_by", user.id);
    if (toolboxTalkId) {
      formData.append("toolbox_talk_id", toolboxTalkId);
    }

    try {
      await api.post("/reference_documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      fetchDocuments();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Error uploading document:", err);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/reference_documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  return (
    <Box mt={5}>
      <Typography variant="h5" gutterBottom>
          Reference Documents
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <label htmlFor="upload-input">
          <Input
            id="upload-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            sx={{ display: "none" }}
          />
          <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
            Choose File
          </Button>
        </label>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload
        </Button>
      </Stack>

      <DocumentTable documents={documents} onDelete={handleDeleteDocument} />
    </Box>
  );
}
