import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { SelectProps } from "../../types";
import useStyles from "./select.styles";

const CustomSelect = (props: SelectProps) => {
  const classes = useStyles();
  const [value, setValue] = useState(props.value);
  
  useEffect(() => {
    props.onChange && props.onChange(value);
  }, [value]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  return (
    <FormControl
      required={props.required}
      className={classes.formControl}
      error={!!props.errorMessage}
      variant="outlined"
      fullWidth
    >
      <InputLabel id={props.name}>{props.name}</InputLabel>
      <Select
        labelId={props.name}
        id={props.name}
        name={props.name}
        value={value}
        onChange={handleChange}
        disabled={props.disabled}
      >
        {props.items.map((item, index) => (
          <MenuItem value={props.objectParametars? item.id: item} key={index}>
            {props.objectParametars
              ? props.objectParametars.map((parametar) => item[parametar] + " ")
              : item}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{props.errorMessage}</FormHelperText>
    </FormControl>
  );
};

export default CustomSelect;
