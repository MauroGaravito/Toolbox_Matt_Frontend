import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  Button,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PrintIcon from "@mui/icons-material/Print";

export default function ToolboxTalkPreview() {
  const { id } = useParams();
  const [talk, setTalk] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.get(`/toolbox-talks/${id}/preview`);
        setTalk(res.data);
      } catch (err) {
        console.error("Error fetching preview:", err);
      }
    };
    fetchPreview();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!talk) return <Typography>Loading preview...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }} className="printable">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Toolbox Talk: {talk.topic}
          </Typography>
          <Button variant="outlined" onClick={handlePrint} startIcon={<PrintIcon />} className="no-print">
            Print
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <ReactMarkdown
          children={talk.content}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => <Typography variant="h4" gutterBottom {...props} />,
            h2: (props) => <Typography variant="h5" gutterBottom {...props} />,
            h3: (props) => <Typography variant="h6" gutterBottom {...props} />,
            p: (props) => <Typography variant="body1" paragraph {...props} />,
            li: (props) => (
              <li>
                <Typography component="span" variant="body1" {...props} />
              </li>
            ),
          }}
        />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          📄 Reference Documents
        </Typography>
        {talk.documents?.length > 0 ? (
          <ul>
            {talk.documents.map((doc) => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  {doc.filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <Typography color="text.secondary">No documents uploaded.</Typography>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          ✍️ Signatures
        </Typography>
        {talk.signatures?.length > 0 ? (
          talk.signatures.map((sig, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {sig.full_name}
              </Typography>
              <Typography variant="body2">{sig.email}</Typography>
              <Typography variant="caption">
                Signed at: {new Date(sig.signed_at).toLocaleString()}
              </Typography>
              {sig.signature_image && (
                <Box mt={1}>
                  <img
                    src={sig.signature_image}
                    alt="Signature"
                    style={{ maxHeight: 100 }}
                  />
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">No signatures yet.</Typography>
        )}
      </Paper>
    </Container>
  );
}
