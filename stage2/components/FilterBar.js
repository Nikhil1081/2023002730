import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const OPTIONS = ["All", "Placement", "Result", "Event"];

export default function FilterBar({ type, setType }) {
  return (
    <Box sx={{ my: 2, maxWidth: 280 }}>
      <FormControl fullWidth>
        <InputLabel>Filter by Type</InputLabel>
        <Select value={type} label="Filter by Type" onChange={(event) => setType(event.target.value)}>
          {OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
