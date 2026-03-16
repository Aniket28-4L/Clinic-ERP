import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialBillForm = {
  patientId: "",
  appointmentId: "",
  doctorFee: "0",
  medicineCharges: "0",
  labCharges: "0",
  paymentStatus: "pending",
  paymentMethod: "cash",
};

const initialPaymentForm = {
  billId: "",
  paymentMethod: "cash",
};

export function BillingPage() {
  const { api } = useAuth();
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [billFormOpen, setBillFormOpen] = useState(false);
  const [billFormLoading, setBillFormLoading] = useState(false);
  const [billFormMode, setBillFormMode] = useState("create");
  const [billFormValues, setBillFormValues] = useState(initialBillForm);
  const [editingBillId, setEditingBillId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentValues, setPaymentValues] = useState(initialPaymentForm);

  async function loadLookups() {
    const p = await api.get("/patients");
    setPatients(p.items || []);
  }

  async function loadBills() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/billing");
      setBills(
        (res.items || []).map((b) => ({
          id: b._id,
          patientName: b.patientId?.firstName ? `${b.patientId.firstName} ${b.patientId.lastName}` : "",
          doctorFee: b.doctorFee ?? 0,
          medicineCharges: b.medicineCharges ?? 0,
          labCharges: b.labCharges ?? 0,
          totalAmount: b.totalAmount ?? 0,
          paymentStatus: b.paymentStatus,
          paymentMethod: b.paymentMethod,
          raw: b,
        }))
      );
    } catch (e) {
      setError(e?.message || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadLookups();
        await loadBills();
      } catch (e) {
        setError(e?.message || "Failed to load data");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateBill() {
    setBillFormMode("create");
    setEditingBillId(null);
    setBillFormValues(initialBillForm);
    setBillFormOpen(true);
  }

  function openEditBill(row) {
    const b = row.raw;
    setBillFormMode("edit");
    setEditingBillId(row.id);
    setBillFormValues({
      patientId: b.patientId?._id || b.patientId,
      appointmentId: b.appointmentId?._id || b.appointmentId || "",
      doctorFee: String(b.doctorFee ?? 0),
      medicineCharges: String(b.medicineCharges ?? 0),
      labCharges: String(b.labCharges ?? 0),
      paymentStatus: b.paymentStatus || "pending",
      paymentMethod: b.paymentMethod || "cash",
    });
    setBillFormOpen(true);
  }

  async function handleBillSubmit() {
    setBillFormLoading(true);
    setError("");
    try {
      const payload = {
        patientId: billFormValues.patientId,
        appointmentId: billFormValues.appointmentId || undefined,
        doctorFee: Number(billFormValues.doctorFee || 0),
        medicineCharges: Number(billFormValues.medicineCharges || 0),
        labCharges: Number(billFormValues.labCharges || 0),
        paymentStatus: billFormValues.paymentStatus,
        paymentMethod: billFormValues.paymentMethod,
      };
      if (billFormMode === "create") {
        await api.post("/billing", payload);
      } else if (editingBillId) {
        await api.put(`/billing/${editingBillId}`, payload);
      }
      setBillFormOpen(false);
      await loadBills();
    } catch (e) {
      setError(e?.message || "Failed to save bill");
    } finally {
      setBillFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/billing/${deleteTarget.id}`);
      setDeleteTarget(null);
      await loadBills();
    } catch (e) {
      setError(e?.message || "Failed to delete bill");
    }
  }

  function openRecordPayment(row) {
    setPaymentValues({
      billId: row.id,
      paymentMethod: row.paymentMethod || "cash",
    });
    setPaymentOpen(true);
  }

  async function handlePaymentSubmit() {
    setPaymentLoading(true);
    setError("");
    try {
      await api.post("/billing/payments", {
        billId: paymentValues.billId,
        paymentMethod: paymentValues.paymentMethod,
      });
      setPaymentOpen(false);
      await loadBills();
    } catch (e) {
      setError(e?.message || "Failed to record payment");
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <Box>
      <PageHeader
        title="Billing"
        subtitle="Invoices and payments."
        actions={
          <Button variant="contained" onClick={openCreateBill}>
            + Add Invoice
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
              { id: "doctorFee", label: "Doctor fee" },
              { id: "medicineCharges", label: "Medicine" },
              { id: "labCharges", label: "Lab" },
              { id: "totalAmount", label: "Total" },
              { id: "paymentStatus", label: "Payment status" },
              { id: "paymentMethod", label: "Method" },
            ]}
            rows={bills}
            loading={loading}
            onEdit={openEditBill}
            onDelete={(row) => setDeleteTarget(row)}
            onView={openRecordPayment}
          />
        </CardContent>
      </Card>

      <FormModal
        open={billFormOpen}
        title={billFormMode === "create" ? "Add invoice" : "Edit invoice"}
        onClose={() => setBillFormOpen(false)}
        onSubmit={handleBillSubmit}
        loading={billFormLoading}
      >
        <TextField
          select
          label="Patient"
          value={billFormValues.patientId}
          onChange={(e) => setBillFormValues((f) => ({ ...f, patientId: e.target.value }))}
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
          label="Appointment ID (optional)"
          value={billFormValues.appointmentId}
          onChange={(e) => setBillFormValues((f) => ({ ...f, appointmentId: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Doctor fee"
          type="number"
          value={billFormValues.doctorFee}
          onChange={(e) => setBillFormValues((f) => ({ ...f, doctorFee: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Medicine charges"
          type="number"
          value={billFormValues.medicineCharges}
          onChange={(e) => setBillFormValues((f) => ({ ...f, medicineCharges: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Lab charges"
          type="number"
          value={billFormValues.labCharges}
          onChange={(e) => setBillFormValues((f) => ({ ...f, labCharges: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          select
          label="Payment status"
          value={billFormValues.paymentStatus}
          onChange={(e) => setBillFormValues((f) => ({ ...f, paymentStatus: e.target.value }))}
          fullWidth
        >
          <MenuItem value="pending">pending</MenuItem>
          <MenuItem value="paid">paid</MenuItem>
        </TextField>
        <TextField
          select
          label="Payment method"
          value={billFormValues.paymentMethod}
          onChange={(e) => setBillFormValues((f) => ({ ...f, paymentMethod: e.target.value }))}
          fullWidth
        >
          <MenuItem value="cash">cash</MenuItem>
          <MenuItem value="card">card</MenuItem>
          <MenuItem value="upi">upi</MenuItem>
        </TextField>
      </FormModal>

      <FormModal
        open={paymentOpen}
        title="Record payment"
        onClose={() => setPaymentOpen(false)}
        onSubmit={handlePaymentSubmit}
        loading={paymentLoading}
        submitLabel="Record"
      >
        <TextField
          select
          label="Method"
          value={paymentValues.paymentMethod}
          onChange={(e) => setPaymentValues((f) => ({ ...f, paymentMethod: e.target.value }))}
          fullWidth
        >
          <MenuItem value="cash">cash</MenuItem>
          <MenuItem value="card">card</MenuItem>
          <MenuItem value="upi">upi</MenuItem>
        </TextField>
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete invoice"
        message={
          deleteTarget ? "Are you sure you want to delete this bill? This cannot be undone." : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

