import { useEffect, useState, useRef } from "react";
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
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";

export default function ToolboxTalkPreview() {
  const { id } = useParams();
  const [talk, setTalk] = useState(null);
  const [graphicSignatures, setGraphicSignatures] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/toolbox-talks/${id}`);
        setTalk(res.data);
      } catch (err) {
        console.error("Error fetching Toolbox Talk:", err);
      }

      try {
        const sigs = await api.get(`/signatures/toolbox-talk/${id}`);
        setGraphicSignatures(sigs.data);
      } catch (err) {
        console.error("Error fetching graphic signatures:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `Toolbox_Talk_${talk.topic.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!talk) return <Typography>Loading preview...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4, pb: 2 }} ref={contentRef}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Toolbox Talk: {talk.topic}
        </Typography>

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
            strong: (props) => <strong style={{ fontWeight: 600 }} {...props} />,
            em: (props) => <em style={{ fontStyle: "italic" }} {...props} />,
          }}
        />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom fontWeight="medium">
          Signatures
        </Typography>

        {graphicSignatures.length > 0 ? (
          graphicSignatures.map((sig) => (
            <Box
              key={`drawn-${sig.id}`}
              className="avoid-break"
              sx={{
                mb: 2,
                p: 2,
                maxWidth: 350,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#fdfdfd",
                textAlign: "center",
              }}
            >
              {sig.signature_image && (
                <>
                  <Box mt={1} mb={0.5}>
                    <img
                      src={sig.signature_image}
                      alt="Signature"
                      style={{ maxHeight: 100 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      borderBottom: "1px solid #ccc",
                      width: "80%",
                      margin: "0 auto",
                      mt: 1,
                      mb: 1,
                    }}
                  />
                </>
              )}

              <Typography variant="subtitle1" fontWeight="bold">
                {sig.signer_name}
              </Typography>

              <Typography variant="caption" display="block">
                {new Date(sig.signed_at).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">No signatures yet.</Typography>
        )}
      </Paper>
    </Container>
  );
}
