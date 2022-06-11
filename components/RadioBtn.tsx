import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function ChatRadioBtn() {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Chat Layout</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
        <FormControlLabel value="Recipe" control={<Radio />} label="Recipe" />
      </RadioGroup>
    </FormControl>
  );
}
