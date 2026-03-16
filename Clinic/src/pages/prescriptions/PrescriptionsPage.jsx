import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialForm = {
  patientId: "",
  doctorId: "",
  appointmentId: "",
  diagnosis: "",
  medicineId: "",
  dosage: "",
  frequency: "",
  durationDays: "7",
  instructions: "",
  notes: "",
};

export function PrescriptionsPage() {
  const { api, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [myDoctorId, setMyDoctorId] = useState("");

  async function loadLookups() {
    const [p, d, m] = await Promise.all([
      api.get("/patients"),
      api.get("/doctors"),
      api.get("/pharmacy/medicines"),
    ]);
    setPatients(p.items || []);
    setDoctors(d.items || []);
    setMedicines(m.items || []);
  }

  async function loadPrescriptions() {
    setLoading(true);
    setError("");
    try {
      const params = user.role === "doctor" && myDoctorId ? "?doctorId=" + myDoctorId : "";
      const res = await api.get(`/prescriptions${params}`);
      setRows(
        (res.items || []).map((pr) => ({
          id: pr._id,
          patientName: pr.patientId?.firstName ? `${pr.patientId.firstName} ${pr.patientId.lastName}` : "",
          doctorName: pr.doctorId?.userId?.name || "",
          diagnosis: pr.diagnosis || "",
          medsSummary:
            pr.medicines
              ?.map((i) => `${i.medicineId?.name || ""} ${i.dosage} – ${i.frequency} x${i.durationDays}d`)
              .join("; ") || "",
          raw: pr,
        }))
      );
    } catch (e) {
      setError(e?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadLookups();
        if (user.role === "doctor") {
          try {
            const me = await api.get("/doctors/me");
            setMyDoctorId(me._id);
          } catch {
            setMyDoctorId("");
          }
        }
        await loadPrescriptions();
      } catch (e) {
        setError(e?.message || "Failed to load data");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDoctorId]);

  function openCreate() {
    setEditingId(null);
    setFormValues({
      ...initialForm,
      doctorId: user.role === "doctor" ? myDoctorId : "",
    });
    setFormOpen(true);
  }

  function openEdit(row) {
    const pr = row.raw;
    const first = pr.medicines?.[0];
    setEditingId(row.id);
    setFormValues({
      patientId: pr.patientId?._id || pr.patientId,
      doctorId: pr.doctorId?._id || pr.doctorId,
      appointmentId: pr.appointmentId?._id || pr.appointmentId || "",
      diagnosis: pr.diagnosis || "",
      medicineId: first?.medicineId || "",
      dosage: first?.dosage || "",
      frequency: first?.frequency || "",
      durationDays: String(first?.durationDays ?? 7),
      instructions: first?.instructions || "",
      notes: pr.notes || "",
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    setFormLoading(true);
    setError("");
    try {
      const item = {
        medicineId: formValues.medicineId,
        dosage: formValues.dosage,
        frequency: formValues.frequency,
        durationDays: Number(formValues.durationDays || 7),
        instructions: formValues.instructions || undefined,
      };
      const payload = {
        patientId: formValues.patientId,
        doctorId: formValues.doctorId || myDoctorId,
        appointmentId: formValues.appointmentId || undefined,
        diagnosis: formValues.diagnosis || undefined,
        medicines: [item],
        notes: formValues.notes || undefined,
      };
      if (!editingId) {
        await api.post("/prescriptions", payload);
      } else {
        await api.put(`/prescriptions/${editingId}`, payload);
      }
      setFormOpen(false);
      await loadPrescriptions();
    } catch (e) {
      setError(e?.message || "Failed to save prescription");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/prescriptions/${deleteTarget.id}`);
      setDeleteTarget(null);
      await loadPrescriptions();
    } catch (e) {
      setError(e?.message || "Failed to delete prescription");
    }
  }

  return (
    <Box>
      <PageHeader
        title="Prescriptions"
        subtitle="Create and review prescriptions."
        actions={
          <Button variant="contained" onClick={openCreate}>
            + Add Prescription
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
              { id: "patientName", label: "Patient" },
              { id: "doctorName", label: "Doctor" },
              { id: "diagnosis", label: "Diagnosis" },
              { id: "medsSummary", label: "Medicines" },
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
        title={editingId ? "Edit prescription" : "Add prescription"}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <TextField
          select
          label="Patient"
          value={formValues.patientId}
          onChange={(e) => setFormValues((f) => ({ ...f, patientId: e.target.value }))}
          required
          fullWidth
        >
          {patients.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Doctor"
          value={formValues.doctorId}
          onChange={(e) => setFormValues((f) => ({ ...f, doctorId: e.target.value }))}
          required
          fullWidth
        >
          {doctors.map((d) => (
            <MenuItem key={d._id} value={d._id}>
              {d.userId?.name || ""}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Appointment ID (optional)"
          value={formValues.appointmentId}
          onChange={(e) => setFormValues((f) => ({ ...f, appointmentId: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Diagnosis"
          value={formValues.diagnosis}
          onChange={(e) => setFormValues((f) => ({ ...f, diagnosis: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          select
          label="Medicine"
          value={formValues.medicineId}
          onChange={(e) => setFormValues((f) => ({ ...f, medicineId: e.target.value }))}
          required
          fullWidth
        >
          {medicines.map((m) => (
            <MenuItem key={m._id} value={m._id}>
              {m.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Dosage"
          value={formValues.dosage}
          onChange={(e) => setFormValues((f) => ({ ...f, dosage: e.target.value }))}
          placeholder="1 tablet"
          fullWidth
        />
        <TextField
          label="Frequency"
          value={formValues.frequency}
          onChange={(e) => setFormValues((f) => ({ ...f, frequency: e.target.value }))}
          placeholder="twice a day"
          fullWidth
        />
        <TextField
          label="Duration (days)"
          type="number"
          value={formValues.durationDays}
          onChange={(e) => setFormValues((f) => ({ ...f, durationDays: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Instructions"
          value={formValues.instructions}
          onChange={(e) => setFormValues((f) => ({ ...f, instructions: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Notes"
          value={formValues.notes}
          onChange={(e) => setFormValues((f) => ({ ...f, notes: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete prescription"
        message={
          deleteTarget
            ? `Are you sure you want to delete this prescription for "${deleteTarget.patientName}"?`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

