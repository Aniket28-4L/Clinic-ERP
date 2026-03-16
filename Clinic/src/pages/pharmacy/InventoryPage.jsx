import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAuth } from "../../app/providers/AuthProvider";

const initialMedicineForm = {
  name: "",
  manufacturer: "",
  category: "",
  price: "",
  stockQuantity: "",
  expiryDate: "",
  reorderLevel: "",
};

export function InventoryPage() {
  const { api } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formValues, setFormValues] = useState(initialMedicineForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/pharmacy/medicines");
      setRows(
        (res.items || []).map((m) => ({
          id: m._id,
          name: m.name,
          category: m.category,
          stockQuantity: m.stockQuantity ?? 0,
          price: m.price ?? 0,
          expiryDate: m.expiryDate ? new Date(m.expiryDate).toISOString().slice(0, 10) : "",
          raw: m,
        }))
      );
    } catch (e) {
      setError(e?.message || "Failed to load medicines");
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
    setFormValues(initialMedicineForm);
    setFormOpen(true);
  }

  function openEdit(row) {
    const m = row.raw;
    setFormMode("edit");
    setEditingId(row.id);
    setFormValues({
      name: m.name || "",
      manufacturer: m.manufacturer || "",
      category: m.category || "",
      price: String(m.price ?? 0),
      stockQuantity: String(m.stockQuantity ?? 0),
      expiryDate: m.expiryDate ? new Date(m.expiryDate).toISOString().slice(0, 10) : "",
      reorderLevel: String(m.reorderLevel ?? 0),
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    setFormLoading(true);
    setError("");
    try {
      const payload = {
        name: formValues.name,
        manufacturer: formValues.manufacturer || undefined,
        category: formValues.category || undefined,
        price: Number(formValues.price || 0),
        stockQuantity: Number(formValues.stockQuantity || 0),
        expiryDate: formValues.expiryDate ? new Date(formValues.expiryDate) : undefined,
        reorderLevel: formValues.reorderLevel ? Number(formValues.reorderLevel) : undefined,
      };

      if (formMode === "create") {
        await api.post("/pharmacy/medicines", payload);
      } else if (editingId) {
        await api.put(`/pharmacy/medicines/${editingId}`, payload);
      }

      setFormOpen(false);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to save medicine");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await api.del(`/pharmacy/medicines/${deleteTarget.id}`);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete medicine");
    }
  }

  return (
    <Box>
      <PageHeader
        title="Pharmacy inventory"
        subtitle="Medicines, stock on hand, and expiries."
        actions={
          <Button variant="contained" onClick={openCreate}>
            + Add Medicine
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
              { id: "category", label: "Category" },
              { id: "stockQuantity", label: "Stock" },
              { id: "price", label: "Price" },
              { id: "expiryDate", label: "Expiry date" },
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
        title={formMode === "create" ? "Add medicine" : "Edit medicine"}
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
          label="Manufacturer"
          value={formValues.manufacturer}
          onChange={(e) => setFormValues((f) => ({ ...f, manufacturer: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Category"
          value={formValues.category}
          onChange={(e) => setFormValues((f) => ({ ...f, category: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={formValues.price}
          onChange={(e) => setFormValues((f) => ({ ...f, price: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Stock quantity"
          type="number"
          value={formValues.stockQuantity}
          onChange={(e) => setFormValues((f) => ({ ...f, stockQuantity: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Reorder level"
          type="number"
          value={formValues.reorderLevel}
          onChange={(e) => setFormValues((f) => ({ ...f, reorderLevel: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Expiry date"
          type="date"
          value={formValues.expiryDate}
          onChange={(e) => setFormValues((f) => ({ ...f, expiryDate: e.target.value }))}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete medicine"
        message={
          deleteTarget
            ? `Are you sure you want to delete medicine "${deleteTarget.name}"? This cannot be undone.`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}

