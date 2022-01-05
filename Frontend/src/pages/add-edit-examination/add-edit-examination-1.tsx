import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StaticContext } from "react-router";
import { GlobalState } from "../../reducers";
import { getUser } from "../../actions";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { AccountBoxOutlined as AccountBoxOutlinedIcon } from "@material-ui/icons";
import useStyles from "./add-edit-examination.styles";
import examinationValidation from "../../utils/validations/examination-validation";
import { getPetBackendAPI } from "../../api";
import { Examination } from "../../types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import DateFnsUtils from "@date-io/date-fns";
import CustomSelect from "../../components/select/select";
import RadioButton from "../../components/custom-radio-button/custom-radio-button.component";

export default function AddEditExamination(
  props: RouteComponentProps<
    {},
    StaticContext,
    {
      examination: Examination;
      successMessage?: string;
      patientId?: string
      tab?: number
    }
  >
) {
  const classes = useStyles();
  const { profile } = useSelector((state: GlobalState) => state.user);

  const [examination, setExamination] = useState<Examination>({
      id: "",
      examinationType: "",
      patientId: ""
  })

  const [patientId, setPatientId] = useState("");
  const [examinationType, setExaminationType] = useState("");
  const [date, setDate] = useState<string>();
  const [lastMenstruation, setLastMenstruation] = useState<string>();

  const [errors, setErrors] = useState({
    patientId: "",
    examinationType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [isUpdate] = useState(
    window.location.href.split("/").reverse()[0] === "edit" ? true : false
  );

  console.log(examination)
  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    console.log(event.target.value)
    if ( type === 'number') {
        setExamination({[name]: +value , ...examination})
    } else {
        setExamination({[name]: value, ...examination})
    }
     

  };

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (props.location.state) {
      const { examination, patientId } = props.location.state;

      if(patientId) {
        setPatientId(patientId)
      }
      //   setState((prevState: any) => ({ ...prevState, ...examination }));
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors, valid } = examinationValidation({
      patientId,
      examinationType,
    });

    if (valid) {
      try {
        if (isUpdate) {
          await getPetBackendAPI().updateExamination(patientId, examination);
        } else {
          await getPetBackendAPI().addExamination(examination);
        }
        props.history.push({
          pathname: `/patients/${patientId}`,
          state: {
            successMessage: `Successfully ${
              isUpdate ? "edited" : "added"
            } patient!`,
            examination: {
              id: "",
              examinationType: "",
              patientId: ""
            },
            tab: 1
          }
        })
      } catch (error: any) {
        console.log(error);
        setErrorMessage(error.response.data.message);
      }
    } else {
      setErrors(errors);
    }
  }

  return (
    <Container component="main" maxWidth="lg">
      {errorMessage && (
        <div className="errorMessage" style={{ margin: "20px auto 0" }}>
          {errorMessage}
        </div>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountBoxOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isUpdate ? "Edit examination" : "Create examination"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="patientId"
                label="PET Id"
                type="text"
                name="patientId"
                autoComplete="patientId"
                value={examination.patientId}
                onChange={handleChange}
                error={!!errors.patientId}
                helperText={errors.patientId}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="examinationType"
                label="Examination Type"
                type="text"
                name="examinationType"
                autoComplete="examinationType"
                autoFocus
                value={examination.examinationType}
                onChange={(event) => handleChange(event)}
                error={!!errors.examinationType}
                helperText={errors.examinationType}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="height"
                label="Height"
                type="number"
                name="height"
                autoComplete="height"
                value={examination.height}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="weight"
                label="weight"
                type="number"
                name="weight"
                autoComplete="weight"
                value={examination.weight}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="glycemia"
                label="Glycemia"
                type="text"
                name="glycemia"
                autoComplete="glycemia"
                autoFocus
                value={examination.glycemia}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="dose"
                label="Dose"
                type="text"
                name="dose"
                autoComplete="dose"
                value={examination.dose}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="diagnose"
                label="Diagnose"
                type="text"
                name="diagnose"
                autoComplete="diagnose"
                value={examination.diagnose}
                onChange={handleChange}
              />

              <RadioButton
                radioLabel="GynecologicalDiseasesInterventions"
                onChangeRadio={(value) =>
                    setExamination({gynecologicalDiseasesInterventions: value ,...examination})
                }
                value={examination.gynecologicalDiseasesInterventions!}
                textLabel="GynecologicalDiseasesInterventions Note"
                onChangeText={(value) =>
                    setExamination({gynecologicalDiseasesInterventionsNote: value ,...examination})
                }
                text={examination.gynecologicalDiseasesInterventionsNote}
              />
              <RadioButton
                radioLabel="Transplantation"
                onChangeRadio={(value) =>  setExamination({transplantation: value ,...examination})}
                value={examination.transplantation!}
                textLabel="Transplantation Note"
                onChangeText={(value) =>  setExamination({transplantationNote: value ,...examination})}
                text={examination.transplantationNote}
              />
              <RadioButton
                radioLabel="RecentInjury"
                onChangeRadio={(value) =>  setExamination({recentInjury: value ,...examination})}
                value={examination.recentInjury!}
                textLabel="RecentInjury Note"
                onChangeText={(value) =>  setExamination({recentInjuryNote: value ,...examination})}
                text={examination.transplantationNote}
              />
              <RadioButton
                radioLabel="KT"
                onChangeRadio={(value) =>  setExamination({kt: value ,...examination})}
                value={examination.kt!}
                textLabel="KT Note"
                onChangeText={(value) =>  setExamination({ktNote: value ,...examination})}
                text={examination.ktNote}
              />
              <RadioButton
                radioLabel="MR"
                onChangeRadio={(value) =>  setExamination({mr: value ,...examination})}
                value={examination.mr!}
                textLabel="MR Note"
                onChangeText={(value) =>  setExamination({mrNote: value ,...examination})}
                text={examination.mrNote}
              />
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <RadioButton
                    radioLabel="Insulin Therapy"
                    onChangeRadio={(value) =>  setExamination({insulinTherapy: value ,...examination})}
                    value={examination.insulinTherapy!}
                  />
                  <RadioButton
                    radioLabel="Claustrophobia"
                    onChangeRadio={(value) =>  setExamination({claustrophobia: value ,...examination})}
                    value={examination.claustrophobia!}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RadioButton
                    radioLabel="Allergy"
                    onChangeRadio={(value) =>  setExamination({allergy: value ,...examination})}
                    value={examination.allergy!}

                  />
                  <RadioButton
                    radioLabel="Pregnancy"
                    onChangeRadio={(value) =>  setExamination({pregnancy: value ,...examination})}
                    value={examination.pregnancy!}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="protocol"
                label="Protocol"
                type="text"
                name="protocol"
                autoComplete="protocol"
                value={examination.protocol}
                onChange={handleChange}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <DatePicker
                    defaultValue={null}
                    inputVariant="outlined"
                    disableFuture
                    margin="normal"
                    fullWidth
                    id="datePicker"
                    name="date"
                    cancelLabel="Cancel"
                    label="Date of examination"
                    format="dd-MM-yyyy"
                    value={!date ? null : new Date(date)}
                    onChange={(date: MaterialUiPickersDate) =>
                        setDate(new Date(date!).toISOString())
                    }
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="generalCondition"
                label="General Condition"
                type="text"
                name="generalCondition"
                autoComplete="generalCondition"
                value={examination.generalCondition}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="doctorRefers"
                label="Doctor Refers"
                type="text"
                name="doctorRefers"
                autoComplete="doctorRefers"
                value={examination.doctorRefers}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="clinicRefers"
                label="Clinic Refers"
                type="text"
                name="clinicRefers"
                autoComplete="clinicRefers"
                value={examination.clinicRefers}
                onChange={handleChange}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <DatePicker
                    defaultValue={null}
                    inputVariant="outlined"
                    disableFuture
                    margin="normal"
                    fullWidth
                    id="datePicker"
                    name="lastMenstruation"
                    cancelLabel="Cancel"
                    label="Last Menstruation"
                    format="dd-MM-yyyy"
                    value={
                      !lastMenstruation ? null : new Date(lastMenstruation)
                    }
                    onChange={(date: MaterialUiPickersDate) =>
                      setLastMenstruation(new Date(date!).toISOString())
                    }
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <RadioButton
                radioLabel="Surgery"
                onChangeRadio={(value) => setExamination({surgery: value, ...examination})}
                value={examination.surgery!}
                onChangeText={(value) => setExamination({surgeryNote: value, ...examination})}
                textLabel="Surgery Note"
                text={examination.surgeryNote}
              />
              <RadioButton
                radioLabel="Companion"
                onChangeRadio={(value) => setExamination({companion: value, ...examination})}
                value={examination.companion!}
                textLabel="Companion Comment"
                onChangeText={(value) => setExamination({companionComment: value, ...examination})}
                text={examination.companionComment}
              />
              <RadioButton
                radioLabel="Radiotherapy"
                onChangeRadio={(value) => setExamination({radiotherapy: value, ...examination})}
                value={examination.radiotherapy!}
                textLabel="Radiotherapy Note"
                onChangeText={(value) => setExamination({radiotherapyNote: value, ...examination})}
                text={examination.radiotherapyNote}
              />
              <RadioButton
                radioLabel="ChemotherapyImmunotherapy"
                onChangeRadio={(value) => setExamination({chemotherapyImmunotherapy: value, ...examination})}
                value={examination.chemotherapyImmunotherapy!}
                textLabel="ChemotherapyImmunotherapy Note"
                onChangeText={(value) =>
                    setExamination({chemotherapyImmunotherapyNote: value, ...examination})
                }
                text={examination.chemotherapyImmunotherapyNote}
              />
              <RadioButton
                radioLabel="PETKT"
                onChangeRadio={(value) => setExamination({petKT: value, ...examination})}
                value={examination.petKT!}
                textLabel="PETKT Note"
                onChangeText={(value) => setExamination({petKTNote: value, ...examination})}
                text={examination.petKTNote}
              />
              <RadioButton
                radioLabel="BoneScan"
                onChangeRadio={(value) => setExamination({boneScan: value, ...examination})}
                value={examination.boneScan!}
                textLabel="BoneScan Note"
                onChangeText={(value) => setExamination({boneScanNote: value, ...examination})}
                text={examination.boneScanNote}
              />

              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <RadioButton
                    radioLabel="Infectious Disease"
                    onChangeRadio={(value) => setExamination({infectiousDisease: value, ...examination})}
                    value={examination.infectiousDisease!}
                    textLabel="Infectious Disease Note"
                    onChangeText={(value) => setExamination({infectiousDiseaseComment: value, ...examination})}
                    text={examination.infectiousDiseaseComment}
                  />
                  <RadioButton
                    radioLabel="Astma"
                    onChangeRadio={(value) => setExamination({asthma: value, ...examination})}
                    value={examination.asthma!}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RadioButton
                    radioLabel="Hyperthyroidism"
                    onChangeRadio={(value) => setExamination({hyperthyroidism: value, ...examination})}
                    value={examination.hyperthyroidism!}
                  />
                  <RadioButton
                    radioLabel="Diabetes"
                    onChangeRadio={(value) => setExamination({diabetes: value, ...examination})}
                    value={examination.diabetes!}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            className={classes.submit}
            color="primary"
          >
            {isUpdate ? "edit" : "create"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
