import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialForm = {
  medicineId: "",
  type: "stock_in",
  quantity: "1",
  reason: "",
};

export function InventoryTransactionsPage() {
  const { api } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [m, tx] = await Promise.all([api.get("/pharmacy/medicines"), api.get("/inventory-transactions")]);
      setMedicines(m.items || []);
      setRows(
        (tx.items || []).map((t) => ({
          id: t._id,
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString().slice(0, 19).replace("T", " ") : "",
          medicine: t.medicineId?.name || "",
          type: t.type,
          quantity: t.quantity,
          reason: t.reason,
          raw: t,
        }))
      );
    } catch (e) {
      setError(e?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setFormValues(initialForm);
    setFormOpen(true);
  }

  async function handleSubmit() {
    setFormLoading(true);
    setError("");
    try {
      await api.post("/inventory-transactions", {
        medicineId: formValues.medicineId,
        type: formValues.type,
        quantity: Number(formValues.quantity || 1),
        reason: formValues.reason || undefined,
      });
      setFormOpen(false);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to create transaction");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/inventory-transactions/${deleteTarget.id}`);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete transaction");
    }
  }

  return (
    <Box>
      <PageHeader
        title="Inventory transactions"
        subtitle="Stock in/out movements (updates medicine stockQuantity)."
        actions={
          <Button variant="contained" onClick={openCreate}>
            + Add Transaction
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
              { id: "createdAt", label: "Date" },
              { id: "medicine", label: "Medicine" },
              { id: "type", label: "Type" },
              { id: "quantity", label: "Qty" },
              { id: "reason", label: "Reason" },
            ]}
            rows={rows}
            loading={loading}
            onDelete={(row) => setDeleteTarget(row)}
          />
        </CardContent>
      </Card>

      <FormModal
        open={formOpen}
        title="Add inventory transaction"
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
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
          select
          label="Type"
          value={formValues.type}
          onChange={(e) => setFormValues((f) => ({ ...f, type: e.target.value }))}
          fullWidth
        >
          <MenuItem value="stock_in">stock_in</MenuItem>
          <MenuItem value="stock_out">stock_out</MenuItem>
        </TextField>
        <TextField
          label="Quantity"
          type="number"
          value={formValues.quantity}
          onChange={(e) => setFormValues((f) => ({ ...f, quantity: e.target.value }))}
          required
          fullWidth
        />
        <TextField
          label="Reason"
          value={formValues.reason}
          onChange={(e) => setFormValues((f) => ({ ...f, reason: e.target.value }))}
          fullWidth
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete transaction"
        message={deleteTarget ? "Delete this inventory transaction record?" : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

