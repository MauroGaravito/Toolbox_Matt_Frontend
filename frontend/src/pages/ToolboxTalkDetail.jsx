// frontend/src/pages/ToolboxTalkDetail.jsx

import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import DocumentTable from "../components/DocumentTable";
import ReferenceUploader from "../components/ReferenceUploader";
import SignaturePanel from "../components/SignaturePanel";
import { useParams, useNavigate } from "react-router-dom";

export default function ToolboxTalkDetail() {
  const { id } = useParams();
  const [talk, setTalk] = useState(null);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTalk();
  }, []);

  const fetchTalk = async () => {
    try {
      const res = await api.get(`/toolbox-talks/${id}`);
      setTalk(res.data);
      setContent(res.data.content);
    } catch (err) {
      console.error("Error fetching Toolbox Talk:", err);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/toolbox-talks/${id}`, {
        topic: talk.topic,
        content,
      });
      alert("✅ Content updated!");
    } catch (err) {
      console.error("Error updating content:", err);
    }
  };

  const handleGenerateAIContent = async () => {
    const confirm = window.confirm("This will overwrite the current content. Continue?");
    if (!confirm) return;

    setLoading(true);
    try {
      const res = await api.post(`/toolbox-talks/${id}/generate-with-context`);
      setContent(res.data.content);
      alert("✅ AI content generated successfully!");
    } catch (err) {
      console.error("Error generating content:", err);
      if (err.response?.status === 400) {
        alert("⚠️ Documents found, but index not generated yet.");
      } else {
        alert("❌ Failed to generate content.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIndex = async () => {
    if (!talk?.documents?.length) {
      alert("No documents available to generate index.");
      return;
    }

    const documentIds = talk.documents.map((doc) => doc.id);

    try {
      const res = await api.post(`/toolbox-talks/${id}/generate-index`, documentIds);
      alert(res.data.message || "✅ Index generated successfully!");
    } catch (err) {
      console.error("Error generating index:", err);
      alert("Error generating index.");
    }
  };

  if (!talk) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          📝 {talk.topic}
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGenerateAIContent}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          {loading ? "Generating..." : "🤖 Generate with AI"}
        </Button>

        <TextField
          label="Generated Content"
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateIndex}
          sx={{ mt: 2 }}
        >
          🧠 Generate Index
        </Button>

        <Box mt={5}>
          <ReferenceUploader toolboxTalkId={talk.id} onUploadSuccess={fetchTalk} />
        </Box>

        <SignaturePanel toolboxTalkId={talk.id} />

        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/toolbox-talks/${talk.id}/preview`)}
        >
          📄 View Printable Version
        </Button>
      </Box>
    </Container>
  );
}
