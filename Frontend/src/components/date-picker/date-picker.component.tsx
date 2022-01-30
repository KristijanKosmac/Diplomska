import { useEffect, useState } from "react";
import { DatePickerProps } from "../../types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import DateFnsUtils from "@date-io/date-fns";
import { Grid } from "@material-ui/core";

const CustomSelect = (props: DatePickerProps) => {
  //   const classes = useStyles();
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    props.onChange && props.onChange(value);
  }, [value]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <DatePicker
          defaultValue={null}
          inputVariant="outlined"
          disableFuture
          required
          margin="normal"
          fullWidth
          id={props.name}
          name={props.name}
          cancelLabel="Cancel"
          label={props.name}
          format="dd-MM-yyyy"
          value={!value ? null : new Date(value)}
          onChange={(date: MaterialUiPickersDate) =>
            setValue(new Date(date!).toISOString())
          }
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default CustomSelect;
