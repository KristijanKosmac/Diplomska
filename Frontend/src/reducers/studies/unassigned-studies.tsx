import { UnassignesStudiesState } from "../../types";
import { UnassignedStudiesActionTypes } from "../../constants/index";

const INITIAL_STATE: UnassignesStudiesState = {
  studies: [],
  isLoading: false,
  errorMessage: "",
  successMessage: "",
};

const unassignedStudiesReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case UnassignedStudiesActionTypes.FETCH_UNASSIGNED_STUDIES_SUCCESS_START:
      return {
        ...state,
        isLoading: true
      };
    case UnassignedStudiesActionTypes.FETCH_UNASSIGNED_STUDIES_SUCCESS:
      return {
        ...state,
        studies: action.payload.studies,
        successMessage: action.payload.successMessage,
        isLoading: false
      };
    case UnassignedStudiesActionTypes.FETCH_UNASSIGNED_STUDIES_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isLoading: false
      }
    default:
      return state;
  }
};

export default unassignedStudiesReducer;
