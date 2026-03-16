import { Box, Card, CardContent, Typography } from "@mui/material";
import { PageHeader } from "../components/PageHeader";

export function ReportsPage() {
  return (
    <Box>
      <PageHeader title="Reports" subtitle="Operational and financial analytics." />
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Coming next: revenue reports, appointment utilization, no-show rates, and inventory consumption trends.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

