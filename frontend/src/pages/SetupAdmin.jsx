import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import { createFirstAdmin } from "../services/setupService";

export default function SetupAdmin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {

      await createFirstAdmin({
  username: form.username,
  email: form.email,
  password: form.password,
});

window.location.href = "/login"; // au lieu de navigate("/login")

    } catch (err) {

      setError("Unable to create administrator.");

    }

  };

  return (

    <Paper
      sx={{
        maxWidth: 500,
        margin: "60px auto",
        p: 4,
      }}
    >

      <Stack spacing={3}>

        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
        >
          Initial Administrator Setup
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <TextField
          label="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <TextField
          type="password"
          label="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <TextField
          type="password"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Create Administrator
        </Button>

      </Stack>

    </Paper>

  );

}