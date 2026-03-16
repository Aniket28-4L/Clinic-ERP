import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialAppointmentForm = {
  patientId: "",
  doctorId: "",
  date: "",
  time: "",
  status: "scheduled",
  reason: "",
};

export function AppointmentCalendarPage() {
  const { api } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formValues, setFormValues] = useState(initialAppointmentForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const todayLabel = dayjs().format("ddd, MMM D");

  async function loadLookups() {
    const [p, d] = await Promise.all([api.get("/patients"), api.get("/doctors")]);
    setPatients(p.items || []);
    setDoctors(d.items || []);
  }

  async function loadAppointments() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/appointments");
      setAppointments(
        (res.items || []).map((a) => ({
          id: a._id,
          patientName: a.patientId?.firstName
            ? `${a.patientId.firstName} ${a.patientId.lastName}`
            : "",
          doctorName: a.doctorId?.userId?.name || "",
          start: `${dayjs(a.appointmentDate).format("YYYY-MM-DD")} ${a.appointmentTime}`,
          status: a.status,
          raw: a,
        }))
      );
    } catch (e) {
      setError(e?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadLookups();
        await loadAppointments();
      } catch (e) {
        setError(e?.message || "Failed to load data");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setFormMode("create");
    setEditingId(null);
    setFormValues({
      ...initialAppointmentForm,
      date: dayjs().format("YYYY-MM-DD"),
      time: "10:00",
    });
    setFormOpen(true);
  }

  function openEdit(row) {
    const a = row.raw;
    setFormMode("edit");
    setEditingId(row.id);
    setFormValues({
      patientId: a.patientId?._id || a.patientId,
      doctorId: a.doctorId?._id || a.doctorId,
      date: dayjs(a.appointmentDate).format("YYYY-MM-DD"),
      time: a.appointmentTime,
      status: a.status,
      reason: a.reason || "",
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    setFormLoading(true);
    setError("");
    try {
      const payload = {
        patientId: formValues.patientId,
        doctorId: formValues.doctorId,
        appointmentDate: dayjs(formValues.date).toDate(),
        appointmentTime: formValues.time,
        status: formValues.status,
        reason: formValues.reason || undefined,
      };
      if (formMode === "create") {
        await api.post("/appointments", payload);
      } else if (editingId) {
        await api.put(`/appointments/${editingId}`, payload);
      }
      setFormOpen(false);
      await loadAppointments();
    } catch (e) {
      setError(e?.message || "Failed to save appointment");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/appointments/${deleteTarget.id}`);
      setDeleteTarget(null);
      await loadAppointments();
    } catch (e) {
      setError(e?.message || "Failed to delete appointment");
    }
  }

  return (
    <Box>
      <PageHeader
        title="Appointments"
        subtitle={`Today — ${todayLabel}`}
        actions={
          <Button variant="contained" onClick={openCreate}>
            + Add Appointment
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
          { id: "start", label: "Start" },
              { id: "patientName", label: "Patient" },
              { id: "doctorName", label: "Doctor" },
              { id: "status", label: "Status" },
            ]}
            rows={appointments}
            loading={loading}
            onEdit={openEdit}
            onDelete={(row) => setDeleteTarget(row)}
          />
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        title={formMode === "create" ? "Add appointment" : "Edit appointment"}
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
              {p.fullName}
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
              {d.fullName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          type="date"
          value={formValues.date}
          onChange={(e) => setFormValues((f) => ({ ...f, date: e.target.value }))}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Time"
          type="time"
          value={formValues.time}
          onChange={(e) => setFormValues((f) => ({ ...f, time: e.target.value }))}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Status"
          value={formValues.status}
          onChange={(e) => setFormValues((f) => ({ ...f, status: e.target.value }))}
          fullWidth
        >
          {["scheduled", "completed", "cancelled"].map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Reason"
          value={formValues.reason}
          onChange={(e) => setFormValues((f) => ({ ...f, reason: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete appointment"
        message={
          deleteTarget
            ? `Are you sure you want to delete this appointment on ${deleteTarget.start}? This cannot be undone.`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

