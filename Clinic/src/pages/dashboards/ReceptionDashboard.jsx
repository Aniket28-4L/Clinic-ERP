import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export function ReceptionDashboard() {
  return (
    <Box>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4">Reception dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage appointments, check-ins, and patient registration.
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6">Front desk</Typography>
            <Typography variant="body2" color="text.secondary">
              Today queue and appointment actions will appear here.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

