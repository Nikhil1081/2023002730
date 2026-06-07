import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="sticky" elevation={0} sx={{ background: "linear-gradient(90deg, #0f172a 0%, #1d4ed8 100%)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
          Student Notifications App
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button component={Link} href="/" color="inherit" sx={{ fontWeight: 600 }}>
            All Notifications
          </Button>
          <Button component={Link} href="/priority" color="inherit" sx={{ fontWeight: 600 }}>
            Priority Notifications
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
