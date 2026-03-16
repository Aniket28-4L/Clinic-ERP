import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

function StatCard({ label, value, hint }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5">{value}</Typography>
          {hint && (
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  return (
    <Box>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4">Admin dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Clinic-level KPIs and operations overview.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <StatCard label="Today appointments" value="—" hint="Scheduled / Checked-in / Completed" />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard label="Revenue (today)" value="—" hint="Payments received" />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard label="Receivables" value="—" hint="Outstanding due" />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard label="Low stock" value="—" hint="Medicines below reorder level" />
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6">Next</Typography>
            <Typography variant="body2" color="text.secondary">
              We’ll wire these cards to `/appointments`, `/billing`, and inventory analytics once those backend APIs are
              implemented.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

