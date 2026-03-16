import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";

export function FormModal({ open, title, children, onClose, onSubmit, submitLabel = "Save", loading }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" id="form-modal" spacing={2} sx={{ mt: 1 }}>
          {children}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          form="form-modal"
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Saving…" : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

