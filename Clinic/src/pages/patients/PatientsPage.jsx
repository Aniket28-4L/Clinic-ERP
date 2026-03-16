import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialForm = {
  firstName: "",
  lastName: "",
  gender: "",
  age: "",
  phone: "",
  email: "",
  bloodGroup: "",
  address: "",
  allergies: "",
  medicalHistory: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export function PatientsPage() {
  const { api } = useAuth();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formValues, setFormValues] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const query = useMemo(() => q.trim(), [q]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/patients${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      setRows(
        (res.items || []).map((p) => ({
          id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          gender: p.gender,
          age: p.age,
          phone: p.phone,
          email: p.email,
          bloodGroup: p.bloodGroup,
          raw: p,
        }))
      );
      setMeta({ total: res.total });
    } catch (e) {
      setError(e?.message || "Failed to load patients");
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
    setFormValues(initialForm);
    setFormOpen(true);
  }

  function openEdit(row) {
    const p = row.raw;
    setFormMode("edit");
    setEditingId(row.id);
    setFormValues({
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      gender: p.gender || "",
      age: p.age != null ? String(p.age) : "",
      phone: p.phone || "",
      email: p.email || "",
      bloodGroup: p.bloodGroup || "",
      address: p.address || "",
      allergies: (p.allergies || []).join(", "),
      medicalHistory: p.medicalHistory || "",
      emergencyContactName: p.emergencyContactName || "",
      emergencyContactPhone: p.emergencyContactPhone || "",
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    setFormLoading(true);
    setError("");
    try {
      const payload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        gender: formValues.gender || undefined,
        age: formValues.age ? Number(formValues.age) : undefined,
        phone: formValues.phone || undefined,
        email: formValues.email || undefined,
        bloodGroup: formValues.bloodGroup || undefined,
        address: formValues.address || undefined,
        allergies: formValues.allergies
          ? formValues.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        medicalHistory: formValues.medicalHistory || undefined,
        emergencyContactName: formValues.emergencyContactName || undefined,
        emergencyContactPhone: formValues.emergencyContactPhone || undefined,
      };

      if (formMode === "create") {
        await api.post("/patients", payload);
      } else if (editingId) {
        await api.put(`/patients/${editingId}`, payload);
      }

      setFormOpen(false);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to save patient");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/patients/${deleteTarget.id}`);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete patient");
    }
  }

  return (
    <Box>
      <PageHeader
        title="Patients"
        subtitle="Search, register, and manage patient records."
        actions={
          <>
            <TextField
              size="small"
              placeholder="Search name, phone, email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") load();
              }}
              sx={{ minWidth: { xs: "100%", sm: 260 } }}
            />
            <Button variant="outlined" onClick={load}>
              Search
            </Button>
            <Button variant="contained" onClick={openCreate}>
              + Add Patient
            </Button>
          </>
        }
      />

      <Card>
        <CardContent>
          {error && (
            <Stack sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Stack>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {meta.total} records
          </Typography>

          <DataTable
            columns={[
              { id: "name", label: "Name" },
              { id: "gender", label: "Gender" },
              { id: "age", label: "Age" },
              { id: "phone", label: "Phone" },
              { id: "bloodGroup", label: "Blood group" },
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
        title={formMode === "create" ? "Add patient" : "Edit patient"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <TextField
          label="First name"
          value={formValues.firstName}
          onChange={(e) => setFormValues((f) => ({ ...f, firstName: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Last name"
          value={formValues.lastName}
          onChange={(e) => setFormValues((f) => ({ ...f, lastName: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Gender"
          value={formValues.gender}
          onChange={(e) => setFormValues((f) => ({ ...f, gender: e.target.value }))}
          placeholder="Male/Female/Other"
          fullWidth
        />
        <TextField
          label="Age"
          type="number"
          value={formValues.age}
          onChange={(e) => setFormValues((f) => ({ ...f, age: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Phone"
          value={formValues.phone}
          onChange={(e) => setFormValues((f) => ({ ...f, phone: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Email"
          value={formValues.email}
          onChange={(e) => setFormValues((f) => ({ ...f, email: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Address"
          value={formValues.address}
          onChange={(e) => setFormValues((f) => ({ ...f, address: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Blood group"
          value={formValues.bloodGroup}
          onChange={(e) => setFormValues((f) => ({ ...f, bloodGroup: e.target.value }))}
          placeholder="A+, B-, O+, …"
          fullWidth
        />
        <TextField
          label="Allergies"
          value={formValues.allergies}
          onChange={(e) => setFormValues((f) => ({ ...f, allergies: e.target.value }))}
          placeholder="Comma-separated"
          fullWidth
        />
        <TextField
          label="Medical history"
          value={formValues.medicalHistory}
          onChange={(e) => setFormValues((f) => ({ ...f, medicalHistory: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Emergency contact name"
          value={formValues.emergencyContactName}
          onChange={(e) => setFormValues((f) => ({ ...f, emergencyContactName: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Emergency contact phone"
          value={formValues.emergencyContactPhone}
          onChange={(e) => setFormValues((f) => ({ ...f, emergencyContactPhone: e.target.value }))}
          fullWidth
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete patient"
        message={
          deleteTarget
            ? `Are you sure you want to delete patient "${deleteTarget.name}"? This cannot be undone.`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

