import { FormEvent, useEffect, useState } from "react";
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
      patientId?: string;
      tab?: number;
      readOnly?: boolean;
    }
  >
) {
  const classes = useStyles();
  const { profile } = useSelector((state: GlobalState) => state.user);

  const [patientId, setPatientId] = useState("");
  const [examinationType, setExaminationType] = useState("");
  const [date, setDate] = useState<string>();
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [glycemia, setGlycemia] = useState("");
  const [dose, setDose] = useState("");
  const [diagnose, setDiagnose] = useState("");
  const [protocol, setProtocol] = useState("");
  const [infectiousDisease, setInfectiousDisease] = useState(false);
  const [infectiousDiseaseComment, setInfectiousDiseaseComment] = useState("");
  const [companionComment, setCompanionComment] = useState("");
  const [generalCondition, setGeneralCondition] = useState("");
  const [companion, setCompanion] = useState(false);
  const [doctorRefers, setDoctorRefers] = useState("");
  const [clinicRefers, setClinicRefers] = useState("");
  const [asthma, setAsthma] = useState(false);
  const [hyperthyroidism, setHyperthyroidism] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [insulinTherapy, setInsulinTherapy] = useState(false);
  const [lastMenstruation, setLastMenstruation] = useState<string>();
  const [claustrophobia, setClaustrophobia] = useState(false);
  const [allergy, setAllergy] = useState(false);
  const [pregnancy, setPregnancy] = useState(false);
  const [surgery, setSurgery] = useState(false);
  const [surgeryNote, setSurgeryNote] = useState("");
  const [radiotherapy, setRadiotherapy] = useState(false);
  const [radiotherapyNote, setRadiotherapyNote] = useState("");
  const [chemotherapyImmunotherapy, setChemotherapyImmunotherapy] =
    useState(false);
  const [chemotherapyImmunotherapyNote, setChemotherapyImmunotherapyNote] =
    useState("");
  const [petKT, setPETKT] = useState(false);
  const [petKTNote, setPETKTNote] = useState("");
  const [boneScan, setBoneScan] = useState(false);
  const [boneScanNote, setBoneScanNote] = useState("");
  const [
    gynecologicalDiseasesInterventions,
    setGynecologicalDiseasesInterventions,
  ] = useState(false);
  const [
    gynecologicalDiseasesInterventionsNote,
    setGynecologicalDiseasesInterventionsNote,
  ] = useState("");
  const [transplantation, setTransplantation] = useState(false);
  const [transplantationNote, setTransplantationNote] = useState("");
  const [recentInjury, setRecentInjury] = useState(false);
  const [recentInjuryNote, setRecentInjuryNote] = useState("");
  const [kt, setKT] = useState(false);
  const [ktNote, setKTNote] = useState("");
  const [mr, setMR] = useState(false);
  const [mrNote, setMRNote] = useState("");
  const [nurseAnamnesis, setNurseAnamnesis] = useState("");
  const [doctorAnamnesis, setDoctorAnamnesis] = useState("");

  const [errors, setErrors] = useState({
    patientId: "",
    examinationType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [isUpdate] = useState(
    window.location.href.split("/").reverse()[0] === "edit" ? true : false
  );

  const [readOnly] = useState(
    props.location.state.readOnly ? props.location.state.readOnly : false
  );

  const examinationTypes = ["Преглед1", "Преглед2", "Преглед3"];

  const protocolItems = ["Протокол1", "Протокол2", "Протокол3"];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (props.location.state) {
      const { examination, patientId } = props.location.state;
      if (examination) {
        setPatientId(examination.patientId);
        setAllergy(examination.allergy ? examination.allergy : false);
        setAsthma(examination.asthma ? examination.asthma : false);
        setBoneScan(examination.boneScan ? examination.boneScan : false);
        setBoneScanNote(
          examination.boneScanNote ? examination.boneScanNote : ""
        );
        setSurgery(examination.surgery ? examination.surgery : false);
        setSurgeryNote(examination.surgeryNote ? examination.surgeryNote : "");
        setWeight(examination.weight);
        setHeight(examination.height);
        setChemotherapyImmunotherapy(
          examination.chemotherapyImmunotherapy
            ? examination.chemotherapyImmunotherapy
            : false
        );
        setChemotherapyImmunotherapyNote(
          examination.chemotherapyImmunotherapyNote
            ? examination.chemotherapyImmunotherapyNote
            : ""
        );
        setClaustrophobia(
          examination.claustrophobia ? examination.claustrophobia : false
        );
        setClinicRefers(
          examination.clinicRefers ? examination.clinicRefers : ""
        );
        setCompanion(examination.companion ? examination.companion : false);
        setCompanionComment(
          examination.companionComment ? examination.companionComment : ""
        );
        setDate(
          examination.date ? new Date(examination.date).toISOString() : ""
        );
        setLastMenstruation(
          examination.lastMenstruation
            ? new Date(examination.lastMenstruation).toISOString()
            : ""
        );
        setDiabetes(examination.diabetes ? examination.diabetes : false);
        setDiagnose(examination.diagnose ? examination.diagnose : "");
        setDoctorAnamnesis(
          examination.doctorAnamnesis ? examination.doctorAnamnesis : ""
        );
        setDoctorRefers(
          examination.doctorRefers ? examination.doctorRefers : ""
        );
        setDose(examination.dose ? examination.dose : "");
        setExaminationType(examination.examinationType);
        setGeneralCondition(
          examination.generalCondition ? examination.generalCondition : ""
        );
        setGlycemia(examination.glycemia ? examination.glycemia : "");
        setGynecologicalDiseasesInterventions(
          examination.gynecologicalDiseasesInterventions
            ? examination.gynecologicalDiseasesInterventions
            : false
        );
        setGynecologicalDiseasesInterventionsNote(
          examination.gynecologicalDiseasesInterventionsNote
            ? examination.gynecologicalDiseasesInterventionsNote
            : ""
        );
        setHyperthyroidism(
          examination.hyperthyroidism ? examination.hyperthyroidism : false
        );
        setInfectiousDisease(
          examination.infectiousDisease ? examination.infectiousDisease : false
        );
        setInfectiousDiseaseComment(
          examination.infectiousDiseaseComment
            ? examination.infectiousDiseaseComment
            : ""
        );
        setInsulinTherapy(
          examination.insulinTherapy ? examination.insulinTherapy : false
        );
        setMR(examination.mr ? examination.mr : false);
        setMRNote(examination.mrNote ? examination.mrNote : "");
        setKT(examination.kt ? examination.kt : false);
        setKTNote(examination.ktNote ? examination.ktNote : "");
        setNurseAnamnesis(
          examination.nurseAnamnesis ? examination.nurseAnamnesis : ""
        );
        setPETKT(examination.petKT ? examination.petKT : false);
        setPETKTNote(examination.petKTNote ? examination.petKTNote : "");
        setPregnancy(examination.pregnancy ? examination.pregnancy : false);
        setProtocol(examination.protocol ? examination.protocol : "");
        setRadiotherapy(
          examination.radiotherapy ? examination.radiotherapy : false
        );
        setRadiotherapyNote(
          examination.radiotherapyNote ? examination.radiotherapyNote : ""
        );
        setRecentInjury(
          examination.recentInjury ? examination.recentInjury : false
        );
        setRecentInjuryNote(
          examination.recentInjuryNote ? examination.recentInjuryNote : ""
        );
        setSurgery(examination.surgery ? examination.surgery : false);
        setSurgeryNote(examination.surgeryNote ? examination.surgeryNote : "");
        setTransplantation(
          examination.transplantation ? examination.transplantation : false
        );
        setTransplantationNote(
          examination.transplantationNote ? examination.transplantationNote : ""
        );
      }

      if (patientId) {
        setPatientId(patientId);
      }
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
        if (!readOnly) {
          if (isUpdate) {
            await getPetBackendAPI().updateExamination(
              props.location.state.examination.id,
              {
                createdAt: props.location.state.examination.createdAt,
                examinationType,
                patientId,
                weight,
                kt,
                mr,
                petKT,
                allergy,
                asthma: asthma,
                boneScan,
                boneScanNote,
                chemotherapyImmunotherapy,
                chemotherapyImmunotherapyNote,
                dose,
                claustrophobia,
                changedBy: `${profile.firstName} ${profile.lastName}`,
                clinicRefers,
                companion,
                companionComment,
                date: date ? Date.parse(date) : undefined,
                diabetes,
                diagnose,
                doctorAnamnesis,
                doctorRefers,
                generalCondition,
                glycemia,
                gynecologicalDiseasesInterventions,
                gynecologicalDiseasesInterventionsNote,
                height,
                hyperthyroidism,
                infectiousDisease,
                infectiousDiseaseComment,
                insulinTherapy,
                pregnancy,
                nurseAnamnesis,
                radiotherapy,
                protocol,
                radiotherapyNote,
                recentInjury,
                recentInjuryNote,
                surgery,
                lastMenstruation: lastMenstruation
                  ? Date.parse(lastMenstruation)
                  : undefined,
                surgeryNote,
                transplantation,
                transplantationNote,
                ktNote,
                mrNote,
                petKTNote,
              }
            );
          } else {
            await getPetBackendAPI().addExamination({
              examinationType,
              patientId,
              weight,
              kt,
              mr,
              petKT,
              allergy,
              asthma,
              boneScan,
              boneScanNote,
              chemotherapyImmunotherapy,
              chemotherapyImmunotherapyNote,
              dose,
              claustrophobia,
              changedBy: `${profile.firstName} ${profile.lastName}`,
              clinicRefers,
              companion,
              companionComment,
              date: date ? Date.parse(date) : undefined,
              diabetes,
              diagnose,
              doctorAnamnesis,
              doctorRefers,
              generalCondition,
              glycemia,
              gynecologicalDiseasesInterventions,
              gynecologicalDiseasesInterventionsNote,
              height,
              hyperthyroidism,
              infectiousDisease,
              infectiousDiseaseComment,
              insulinTherapy,
              pregnancy,
              nurseAnamnesis,
              radiotherapy,
              protocol,
              radiotherapyNote,
              recentInjury,
              recentInjuryNote,
              surgery,
              lastMenstruation: lastMenstruation
                ? Date.parse(lastMenstruation)
                : undefined,
              surgeryNote,
              transplantation,
              transplantationNote,
              ktNote,
              mrNote,
              petKTNote,
            });
          }
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
              patientId: "",
            },
            tab: 1,
          },
        });
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
          {readOnly
            ? "Информации за преглед"
            : isUpdate
            ? "Промени преглед"
            : "Креирај преглед"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="petId"
                label="ПЕТ број"
                type="number"
                name="petId"
                autoComplete="petId"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                error={!!errors.patientId}
                helperText={errors.patientId}
              />
              <CustomSelect
                disabled={readOnly}
                required
                value={examinationType}
                items={examinationTypes}
                errorMessage={errors.examinationType}
                name="Тип на преглед"
                onChange={(value) => {
                  setExaminationType(value);
                }}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <DatePicker
                    required
                    disabled={readOnly}
                    defaultValue={null}
                    inputVariant="outlined"
                    disableFuture
                    margin="normal"
                    fullWidth
                    id="datePicker"
                    name="date"
                    cancelLabel="Cancel"
                    label="Датум на преглед"
                    format="dd-MM-yyyy"
                    value={!date ? null : new Date(date)}
                    onChange={(date: MaterialUiPickersDate) =>
                      setDate(new Date(date!).toISOString())
                    }
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="height"
                label="Висина"
                type="number"
                name="height"
                autoComplete="height"
                value={height}
                onChange={(event) => setHeight(+event.target.value)}
              />
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="weight"
                label="Тежина"
                type="number"
                name="weight"
                autoComplete="weight"
                value={weight}
                onChange={(event) => setWeight(+event.target.value)}
              />
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="glycemia"
                label="Гликемија"
                type="text"
                name="glycemia"
                autoComplete="glycemia"
                autoFocus
                value={glycemia}
                onChange={(event) => setGlycemia(event.target.value)}
              />
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="dose"
                label="Доза"
                type="text"
                name="dose"
                autoComplete="dose"
                value={dose}
                onChange={(event) => setDose(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomSelect
                disabled={readOnly}
                value={protocol}
                items={protocolItems}
                name="Протокол"
                onChange={(value) => {
                  setProtocol(value);
                }}
              />
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="diagnose"
                label="Дијагноза"
                type="text"
                name="diagnose"
                autoComplete="diagnose"
                value={diagnose}
                onChange={(event) => setDiagnose(event.target.value)}
              />
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="generalCondition"
                label="Општа состојба на пациет"
                type="text"
                name="generalCondition"
                autoComplete="generalCondition"
                value={generalCondition}
                onChange={(event) => setGeneralCondition(event.target.value)}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                  <DatePicker
                    disabled={readOnly}
                    defaultValue={null}
                    inputVariant="outlined"
                    disableFuture
                    margin="normal"
                    fullWidth
                    id="datePicker"
                    name="lastMenstruation"
                    cancelLabel="Cancel"
                    label="Последна менструација"
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
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="doctorRefers"
                label="Доктор кој упатува"
                type="text"
                name="doctorRefers"
                autoComplete="doctorRefers"
                value={doctorRefers}
                onChange={(event) => setDoctorRefers(event.target.value)}
              />
              <TextField
                multiline
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="clinicRefers"
                label="Клиника која упатува"
                type="text"
                name="clinicRefers"
                autoComplete="clinicRefers"
                value={clinicRefers}
                onChange={(event) => setClinicRefers(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <RadioButton
                disabled={readOnly}
                radioLabel="Гинеколошки болести/интервенции"
                onChangeRadio={(value) =>
                  setGynecologicalDiseasesInterventions(value)
                }
                value={gynecologicalDiseasesInterventions}
                textLabel="Гинеколошки болести/интервенции забелешка"
                onChangeText={(value) =>
                  setGynecologicalDiseasesInterventionsNote(value)
                }
                text={gynecologicalDiseasesInterventionsNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Трансплантација"
                onChangeRadio={(value) => setTransplantation(value)}
                value={transplantation}
                textLabel="Трансплантација забелешка"
                onChangeText={(value) => setTransplantationNote(value)}
                text={transplantationNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Скорешна повреда"
                onChangeRadio={(value) => setRecentInjury(value)}
                value={recentInjury}
                textLabel="Скорешна повреда забелешка"
                onChangeText={(value) => setRecentInjuryNote(value)}
                text={recentInjuryNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="КТ"
                onChangeRadio={(value) => setKT(value)}
                value={kt}
                textLabel="КТ забелешка"
                onChangeText={(value) => setKTNote(value)}
                text={ktNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="МР"
                onChangeRadio={(value) => setMR(value)}
                value={mr}
                textLabel="МР забелешка"
                onChangeText={(value) => setMRNote(value)}
                text={mrNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Операција"
                onChangeRadio={(value) => setSurgery(value)}
                value={surgery}
                onChangeText={(value) => setSurgeryNote(value)}
                textLabel="Операција забелешка"
                text={surgeryNote}
              />
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Терапија со инсулин"
                    onChangeRadio={(value) => setInsulinTherapy(value)}
                    value={insulinTherapy}
                  />
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Клаустрофобија"
                    onChangeRadio={(value) => setClaustrophobia(value)}
                    value={claustrophobia}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Алергија"
                    onChangeRadio={(value) => setAllergy(value)}
                    value={allergy}
                  />
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Бременост"
                    onChangeRadio={(value) => setPregnancy(value)}
                    value={pregnancy}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <RadioButton
                disabled={readOnly}
                radioLabel="Придружба"
                onChangeRadio={(value) => setCompanion(value)}
                value={companion}
                textLabel="Придружба забелешка"
                onChangeText={(value) => setCompanionComment(value)}
                text={companionComment}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Радиотерапија"
                onChangeRadio={(value) => setRadiotherapy(value)}
                value={radiotherapy}
                textLabel="Радиотерапија забелешка"
                onChangeText={(value) => setRadiotherapyNote(value)}
                text={radiotherapyNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Хемотерапија / Имунотерапија"
                onChangeRadio={(value) => setChemotherapyImmunotherapy(value)}
                value={chemotherapyImmunotherapy}
                textLabel="Хемотерапија / Имунотерапија забелешка"
                onChangeText={(value) =>
                  setChemotherapyImmunotherapyNote(value)
                }
                text={chemotherapyImmunotherapyNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="ПЕТ/КТ"
                onChangeRadio={(value) => setPETKT(value)}
                value={petKT}
                textLabel="ПЕТ/КТ забелешка"
                onChangeText={(value) => setPETKTNote(value)}
                text={petKTNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Скен на коски"
                onChangeRadio={(value) => setBoneScan(value)}
                value={boneScan}
                textLabel="Скен на коски забелешка"
                onChangeText={(value) => setBoneScanNote(value)}
                text={boneScanNote}
              />
              <RadioButton
                disabled={readOnly}
                radioLabel="Инфективно заболување"
                onChangeRadio={(value) => setInfectiousDisease(value)}
                value={infectiousDisease}
                textLabel="Инфективно заболување забелешка"
                onChangeText={(value) => setInfectiousDiseaseComment(value)}
                text={infectiousDiseaseComment}
              />
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Астма"
                    onChangeRadio={(value) => setAsthma(value)}
                    value={asthma}
                  />
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Хипертиреоза"
                    onChangeRadio={(value) => setHyperthyroidism(value)}
                    value={hyperthyroidism}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RadioButton
                    disabled={readOnly}
                    radioLabel="Дијабетес"
                    onChangeRadio={(value) => setDiabetes(value)}
                    value={diabetes}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <TextField
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="doctorsAnamnesis"
                label="Докторска анамнеза"
                type="text"
                name="doctorsAnamnesis"
                autoComplete="doctorsAnamnesis"
                minRows={4}
                multiline
                maxRows={10}
                value={doctorAnamnesis}
                onChange={(event) => setDoctorAnamnesis(event.target.value)}
              />
              {(readOnly || isUpdate) && (
                <TextField
                  disabled
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="lastChanged"
                  label="Последен пат изменето од"
                  type="text"
                  name="lastChanged"
                  autoComplete="lastChanged"
                  value={props.location.state.examination.changedBy}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled={readOnly}
                variant="outlined"
                margin="normal"
                fullWidth
                id="nurseAnamnesis"
                label="Сестринска анамнеза"
                type="text"
                name="nurseAnamnesis"
                autoComplete="nurseAnamnesis"
                minRows={4}
                multiline
                maxRows={10}
                value={nurseAnamnesis}
                onChange={(event) => setNurseAnamnesis(event.target.value)}
              />
              {(isUpdate || readOnly) && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justifyContent="space-around">
                    <DatePicker
                      required
                      disabled
                      defaultValue={null}
                      inputVariant="outlined"
                      disableFuture
                      margin="normal"
                      fullWidth
                      id="datePicker"
                      name="date"
                      cancelLabel="Cancel"
                      label="Последен пат изменето на"
                      format="dd-MM-yyyy"
                      value={
                        !props.location.state.examination.updatedAt
                          ? null
                          : new Date(props.location.state.examination.updatedAt)
                      }
                      onChange={() => {}}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              )}
            </Grid>
          </Grid>
          <div className={classes.btnContainer}>
            {!readOnly && (
              <Button
                variant="contained"
                className={classes.submit}
                color="primary"
                onClick={() => {
                  props.history.push(`/patients/${patientId}`);
                }}
              >
                Откажи
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              {isUpdate ? "Промени" : readOnly ? "врати се назад" : "креирај"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
