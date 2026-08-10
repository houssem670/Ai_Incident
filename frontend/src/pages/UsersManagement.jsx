import { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { getUsers, createUser, updateUser, deleteUser } from "../services/usersService";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "analyst",
  });

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Unable to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    try {
      await createUser(form);
      setSuccess(`User "${form.username}" created successfully.`);
      setForm({ username: "", email: "", password: "", role: "analyst" });
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to create user.");
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update user.");
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await updateUser(user.id, { role: newRole });
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update role.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.username}"?`)) return;

    try {
      await deleteUser(user.id);
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to delete user.");
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        User Management
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create New Account
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit,minmax(180px,1fr))"
          gap={2}
          mb={2}
        >
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            type="password"
            label="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value="analyst">Analyst</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
        </Box>

        <Button variant="contained" onClick={handleCreate}>
          Create Account
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Accounts
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <Chip label="Admin" color="error" size="small" />
                  ) : (
                    <TextField
                      select
                      size="small"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                    >
                      <MenuItem value="analyst">Analyst</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                    </TextField>
                  )}
                </TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <Chip label="Active" color="success" size="small" />
                  ) : (
                    <Chip
                      label={user.is_active ? "Active" : "Disabled"}
                      color={user.is_active ? "success" : "default"}
                      size="small"
                      onClick={() => handleToggleActive(user)}
                      sx={{ cursor: "pointer" }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  {user.role !== "admin" && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}