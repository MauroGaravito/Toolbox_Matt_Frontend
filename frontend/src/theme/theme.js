// frontend/src/theme/theme.js
import { createTheme } from "@mui/material/styles";

// Fuente moderna (instala con: npm install @fontsource/inter)
import "@fontsource/inter";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 8px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f9f9f9",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#1565c0",
          color: "#ffffff",
          fontWeight: 600,
        },
        body: {
          fontSize: 14,
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
  },
});

export default theme;
