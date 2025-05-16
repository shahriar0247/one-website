import React from "react";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate, useLocation } from "react-router-dom";
import WordCounter from "./WordCounter.jsx";
import GrammarChecker from "./GrammarChecker.jsx";
import Paraphraser from "./Paraphraser.jsx";
import Summarizer from "./Summarizer.jsx";
import CaseConverter from "./CaseConverter.jsx";
import RemoveLineBreaks from "./RemoveLineBreaks.jsx";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";

const drawerWidth = 260;

const tools = [
  { path: "/word-counter", label: "Word & Sentence Counter", component: <WordCounter /> },
  { path: "/grammar-checker", label: "Grammar Checker", component: <GrammarChecker /> },
  { path: "/paraphraser", label: "Paraphrasing Tool", component: <Paraphraser /> },
  { path: "/summarizer", label: "Text Summarizer", component: <Summarizer /> },
  { path: "/case-converter", label: "Case Converter", component: <CaseConverter /> },
  { path: "/remove-line-breaks", label: "Remove Line Breaks Tool", component: <RemoveLineBreaks /> },
];

function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f5f5f5' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2, fontFamily: 'Roboto' }}>
          One-Use Tools
        </Typography>
        <List>
          {tools.map(tool => (
            <ListItem key={tool.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={tool.path}
                selected={location.pathname === tool.path}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemText
                  primary={tool.label}
                  primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: location.pathname === tool.path ? 700 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

function Main() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 4, fontFamily: 'Roboto' }}>
      <Toolbar />
      <Routes>
        <Route path="/" element={<Navigate to="/word-counter" replace />} />
        {tools.map(tool => (
          <Route key={tool.path} path={tool.path} element={tool.component} />
        ))}
        <Route path="*" element={
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" color="text.secondary" fontFamily="Roboto" gutterBottom>404</Typography>
            <Typography variant="h5" fontFamily="Roboto" gutterBottom>Page Not Found</Typography>
            <Link component={RouterLink} to="/word-counter" underline="hover" fontFamily="Roboto">
              Go to Home
            </Link>
          </Box>
        } />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', fontFamily: 'Roboto' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, fontFamily: 'Roboto' }} color="primary">
          <Toolbar>
            <Typography variant="h6" noWrap component="div" fontFamily="Roboto">
              One-Use Websites
            </Typography>
          </Toolbar>
        </AppBar>
        <Sidebar />
        <Main />
      </Box>
    </Router>
  );
}

export default App;
