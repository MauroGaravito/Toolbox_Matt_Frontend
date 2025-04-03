import { Container, Box, Typography } from "@mui/material";

export default function PublicLayout({ children }) {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to ToolboxApp
      </Typography>
        {children}
      </Box>
    </Container>
  );
}
