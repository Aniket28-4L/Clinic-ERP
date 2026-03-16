import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export function DoctorDashboard() {
  return (
    <Box>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4">Doctor dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Your schedule, patients, and prescriptions.
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6">Today</Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming appointments and quick actions will appear here.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

