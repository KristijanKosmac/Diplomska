import { UnassignedStudiesActionTypes } from "../../constants/index";
import { Study, UnassignedStudiesPayload } from "../../types";
import { getPetBackendAPI } from "../../api";
import moment from "moment";

export const getAllUnassignedStudies =
    () =>
        async (
            dispatch: (arg0: { type: string; payload: UnassignedStudiesPayload }) => void
        ) => {
            dispatch({
                type: UnassignedStudiesActionTypes.FETCH_UNASSIGNED_STUDIES_SUCCESS_START,
                payload: {}
            });

            try {
                const { data } = await getPetBackendAPI().getAllUnassignedStudies();
                const studiesData = data as unknown as Study[];

                const studies = studiesData.sort((a, b) =>
                    moment((a as any).mainDicomTags.studyDate) < moment((b as any).mainDicomTags.studyDate) ? 1 : -1
                );

                dispatch({
                    type: UnassignedStudiesActionTypes.FETCH_UNASSIGNED_STUDIES_SUCCESS,
                    payload: {
                        successMessage: "",
                        studies: studies.map((study) => {
                            return {
                                ...study,
                                ...(study as any).mainDicomTags,
                                ...(study as any).patientMainDicomTags,
                            };
                        }),
                    },
                });
            } catch (error: any) {
                dispatch({
                    type: UnassignedStudiesActionTypes.FETCH_UNASSIGNED_STUDIES_FAIL,
                    payload: {
                        errorMessage: "Something went wrong, failed to get unassigned studies",
                    },
                });
            }
        };