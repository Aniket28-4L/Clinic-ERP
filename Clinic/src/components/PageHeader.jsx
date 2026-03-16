import { Box, Stack, Typography } from "@mui/material";

export function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions ? <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", sm: "flex-end" } }}>{actions}</Box> : null}
    </Stack>
  );
}

