import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialDoctorForm = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experienceYears: "",
  consultationFee: "",
  roomNumber: "",
  availableDays: [],
  availableTimeStart: "",
  availableTimeEnd: "",
};

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DoctorsPage() {
  const { api } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formValues, setFormValues] = useState(initialDoctorForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/doctors");
      setRows(
        (res.items || []).map((d) => ({
          id: d._id,
          name: d.userId?.name || "",
          email: d.userId?.email || "",
          phone: d.userId?.phone || "",
          specialization: d.specialization,
          experienceYears: d.experienceYears,
          consultationFee: d.consultationFee,
          roomNumber: d.roomNumber,
          raw: d,
        }))
      );
    } catch (e) {
      setError(e?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setFormMode("create");
    setEditingId(null);
    setFormValues(initialDoctorForm);
    setFormOpen(true);
  }

  function openEdit(row) {
    const d = row.raw;
    setFormMode("edit");
    setEditingId(row.id);
    setFormValues({
      name: d.userId?.name || "",
      email: d.userId?.email || "",
      phone: d.userId?.phone || "",
      specialization: d.specialization || "",
      experienceYears: d.experienceYears != null ? String(d.experienceYears) : "",
      consultationFee: d.consultationFee != null ? String(d.consultationFee) : "",
      roomNumber: d.roomNumber || "",
      availableDays: d.availableDays || [],
      availableTimeStart: d.availableTimeStart || "",
      availableTimeEnd: d.availableTimeEnd || "",
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    setFormLoading(true);
    setError("");
    try {
      if (formMode === "create") {
        // Create backing user (Doctor) then doctor profile
        const user = await api.post("/auth/register", {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone || undefined,
          password: "Doctor@12345",
          role: "doctor",
        });
        await api.post("/doctors", {
          userId: user.user.id,
          specialization: formValues.specialization,
          experienceYears: formValues.experienceYears ? Number(formValues.experienceYears) : undefined,
          consultationFee: formValues.consultationFee ? Number(formValues.consultationFee) : undefined,
          roomNumber: formValues.roomNumber || undefined,
          availableDays: formValues.availableDays,
          availableTimeStart: formValues.availableTimeStart || undefined,
          availableTimeEnd: formValues.availableTimeEnd || undefined,
        });
      } else if (editingId) {
        // Only doctor-specific fields; user details edited elsewhere
        await api.put(`/doctors/${editingId}`, {
          specialization: formValues.specialization,
          experienceYears: formValues.experienceYears ? Number(formValues.experienceYears) : undefined,
          consultationFee: formValues.consultationFee ? Number(formValues.consultationFee) : undefined,
          roomNumber: formValues.roomNumber || undefined,
          availableDays: formValues.availableDays,
          availableTimeStart: formValues.availableTimeStart || undefined,
          availableTimeEnd: formValues.availableTimeEnd || undefined,
        });
      }
      setFormOpen(false);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to save doctor");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/doctors/${deleteTarget.id}`);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete doctor");
    }
  }

  function toggleDay(day) {
    setFormValues((f) => {
      const exists = f.availableDays.includes(day);
      return {
        ...f,
        availableDays: exists ? f.availableDays.filter((d) => d !== day) : [...f.availableDays, day],
      };
    });
  }

  return (
    <Box>
      <PageHeader
        title="Doctors"
        subtitle="Doctor profiles and schedules (Admin/Reception)."
        actions={
          <Button variant="contained" onClick={openCreate}>
            + Add Doctor
          </Button>
        }
      />
      <Card>
        <CardContent>
          {error && (
            <Stack sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Stack>
          )}
          <DataTable
            columns={[
              { id: "name", label: "Name" },
              { id: "specialization", label: "Specialization" },
              { id: "experienceYears", label: "Experience (yrs)" },
              { id: "consultationFee", label: "Fee" },
              { id: "roomNumber", label: "Room" },
            ]}
            rows={rows}
            loading={loading}
            onEdit={openEdit}
            onDelete={(row) => setDeleteTarget(row)}
          />
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        title={formMode === "create" ? "Add doctor" : "Edit doctor"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <TextField
          label="Name"
          value={formValues.name}
          onChange={(e) => setFormValues((f) => ({ ...f, name: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Email"
          value={formValues.email}
          onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Phone"
          value={formValues.phone}
          onChange={(e) => setFormValues((f) => ({ ...f, phone: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Specialization"
          value={formValues.specialization}
          onChange={(e) => setFormValues((f) => ({ ...f, specialization: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Experience (years)"
          type="number"
          value={formValues.experienceYears}
          onChange={(e) => setFormValues((f) => ({ ...f, experienceYears: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Consultation fee"
          type="number"
          value={formValues.consultationFee}
          onChange={(e) => setFormValues((f) => ({ ...f, consultationFee: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Room number"
          value={formValues.roomNumber}
          onChange={(e) => setFormValues((f) => ({ ...f, roomNumber: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Available time start"
          type="time"
          value={formValues.availableTimeStart}
          onChange={(e) => setFormValues((f) => ({ ...f, availableTimeStart: e.target.value }))}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Available time end"
          type="time"
          value={formValues.availableTimeEnd}
          onChange={(e) => setFormValues((f) => ({ ...f, availableTimeEnd: e.target.value }))}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          SelectProps={{ multiple: true }}
          label="Available days"
          value={formValues.availableDays}
          onChange={(e) =>
            setFormValues((f) => ({ ...f, availableDays: typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value }))
          }
          fullWidth
        >
          {DAY_OPTIONS.map((day) => (
            <MenuItem key={day} value={day} onClick={() => toggleDay(day)}>
              {day}
            </MenuItem>
          ))}
        </TextField>
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete doctor"
        message={
          deleteTarget ? `Are you sure you want to delete doctor "${deleteTarget.name}"? This cannot be undone.` : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

