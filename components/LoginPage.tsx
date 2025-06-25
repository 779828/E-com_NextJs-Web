"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link as MuiLink,
  Paper,
} from "@mui/material";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 350,
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Login
        </Typography>

        <TextField
          label="Email"
          variant="standard"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          variant="contained"
          onClick={handleEmailLogin}
          disabled={loading}
          sx={{
            background: "linear-gradient(to right, #2193b0, #6dd5ed)",
            color: "#fff",
            fontWeight: "bold",
            mt: 1,
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>

        <Box textAlign="center" mt={1}>
          <MuiLink href="#" underline="hover" fontSize={14}>
            Forgot <strong>Password?</strong>
          </MuiLink>
        </Box>
        <Box textAlign="center">
          <Typography fontSize={14}>
            Don’t have an account?{" "}
            <MuiLink href="#" underline="hover" fontWeight="bold">
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
