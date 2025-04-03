import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Box,
  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
  
  export default function DocumentTable({ documents = [], onDelete }) {
    return (
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
            Uploaded Documents
        </Typography>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>File Name</TableCell>
                <TableCell sx={{ color: "white" }}>Uploaded At</TableCell>
                {onDelete && (
                  <TableCell sx={{ color: "white" }} align="right">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.file_name}</TableCell>
                  <TableCell>{new Date(doc.uploaded_at).toLocaleString()}</TableCell>
                  {onDelete && (
                    <TableCell align="right">
                      <IconButton onClick={() => onDelete(doc.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {documents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No documents uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
  