import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { RadioButtonProps } from "../../types";
import useStyles from "./custom-radio-button.styles";

function RadioButton(props: RadioButtonProps) {
  const classes = useStyles();
  const [value, setValue] = useState<"no" | "yes">("no");
  const [text, setText] = useState("");

  useEffect(() => {
    setValue(props.value ? "yes" : "no");
    setText(props.text ? props.text : "");
  }, [props]);

  useEffect(() => {
    props.onChangeRadio(value === "yes" ? true : false);
  }, [value]);

  useEffect(() => {
    props.onChangeText && props.onChangeText(text);
  }, [text]);

  return (
    <div
      className={
        props.textLabel && props.onChangeText
          ? `${classes.root} ${classes.gridTemplate}`
          : classes.root
      }
    >
      <div className={classes.radioGroup}>
        <FormLabel component="legend">{props.radioLabel}</FormLabel>
        <RadioGroup
          value={value}
          row
          aria-label="infectiousDisease"
          name="row-radio-buttons-group"
          onChange={(event) => {
            setValue(event.target.value as "yes" | "no");
          }}
        >
          <FormControlLabel
            value="yes"
            control={<Radio />}
            label="Да"
            disabled={props.disabled}
          />
          <FormControlLabel
            value="no"
            control={<Radio />}
            label="Не"
            disabled={props.disabled}
          />
        </RadioGroup>
      </div>
      {props.onChangeText && props.textLabel && (
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id={props.textLabel}
          label={props.textLabel}
          type="text"
          name={props.textLabel}
          autoComplete={props.textLabel}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={props.disabled}
        />
      )}
    </div>
  );
}

export default RadioButton;
