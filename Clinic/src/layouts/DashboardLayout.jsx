import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { useAuth } from "../app/providers/AuthProvider";

const drawerWidth = 280;

function roleHome(role) {
  if (role === "admin") return "/admin";
  if (role === "doctor") return "/doctor";
  if (role === "receptionist") return "/reception";
  if (role === "pharmacist") return "/pharmacy/inventory";
  return "/admin";
}

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = useMemo(() => {
    const base = [
      { label: "Dashboard", to: roleHome(user.role), icon: <DashboardRoundedIcon /> },
      { label: "Appointments", to: "/appointments", icon: <EventAvailableRoundedIcon /> },
      { label: "Patients", to: "/patients", icon: <PeopleAltRoundedIcon /> },
    ];

    if (user.role === "admin") {
      base.push({ label: "Doctors", to: "/doctors", icon: <MedicalServicesRoundedIcon /> });
      base.push({ label: "Billing", to: "/billing", icon: <ReceiptLongRoundedIcon /> });
      base.push({ label: "Pharmacy Inventory", to: "/pharmacy/inventory", icon: <LocalPharmacyRoundedIcon /> });
      base.push({ label: "Inventory Transactions", to: "/pharmacy/transactions", icon: <LocalPharmacyRoundedIcon /> });
      base.push({ label: "Reports", to: "/reports", icon: <DescriptionRoundedIcon /> });
    }

    if (user.role === "receptionist") {
      base.push({ label: "Billing", to: "/billing", icon: <ReceiptLongRoundedIcon /> });
    }

    if (user.role === "pharmacist") {
      return [
        { label: "Dashboard", to: "/pharmacy/inventory", icon: <DashboardRoundedIcon /> },
        { label: "Pharmacy Inventory", to: "/pharmacy/inventory", icon: <LocalPharmacyRoundedIcon /> },
        { label: "Inventory Transactions", to: "/pharmacy/transactions", icon: <LocalPharmacyRoundedIcon /> },
      ];
    }

    if (user.role === "doctor") {
      base.push({ label: "Prescriptions", to: "/prescriptions", icon: <DescriptionRoundedIcon /> });
    }

    return base;
  }, [user.role]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
          Clinic ERP
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.25, py: 1 }}>
        {navItems.map((item) => {
          const selected = pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <ListItemButton
              key={item.to}
              selected={selected}
              onClick={() => {
                navigate(item.to);
                if (isSmall) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(46, 91, 255, 0.10)",
                  "&:hover": { backgroundColor: "rgba(46, 91, 255, 0.14)" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ flex: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Production-ready foundation (frontend)
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          {isSmall && (
            <IconButton onClick={() => setMobileOpen(true)} edge="start" aria-label="open sidebar">
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {navItems.find((i) => pathname === i.to)?.label || "Dashboard"}
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
              {user.name}
            </Typography>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar sx={{ width: 32, height: 32 }}>
                {(user.name || "?").slice(0, 1).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
                navigate("/login");
              }}
            >
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(15, 23, 42, 0.08)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          pt: 10,
          px: { xs: 2, sm: 3 },
          pb: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

