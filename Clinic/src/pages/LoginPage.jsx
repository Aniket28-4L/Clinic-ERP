import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../app/providers/AuthProvider";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(1200px 500px at 20% 10%, rgba(46,91,255,0.16), transparent 60%), radial-gradient(900px 450px at 80% 30%, rgba(14,165,233,0.12), transparent 60%)",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2.5} alignItems="center">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Clinic ERP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your dashboard
            </Typography>
          </Box>

          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={onSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      fullWidth
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </Stack>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Backend default: `POST /auth/login` (configure `VITE_API_URL` if needed)
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

