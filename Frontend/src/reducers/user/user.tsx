import { UserState } from "../../types";
import { UserActionTypes } from "../../constants/index";

const INITIAL_STATE: UserState = {
  profile: {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    EMBG: 0,
    dateOfBirth: "",
    role: "Doctor"
  },
  users: [],
  accessToken: "",
  sessionToken: "",
  filledDetails: null,
  isLoggedIn: false,
  errorMessage: "",
  successMessage: "",
  isLoading: false
};

const userReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case UserActionTypes.SIGN_UP_USER:
      return {
        ...state,
        successMessage: action.payload.successMessage,
        errorMessage: "",
      };
    case UserActionTypes.SIGN_UP_USER_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        successMessage: "",
      };
    case UserActionTypes.SIGN_IN_USER:
      const { profile, accessToken } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        filledDetails:
          !!profile.firstName &&
          !!profile.lastName &&
          !!profile.email &&
          !!profile.EMBG &&
          !!profile.dateOfBirth ,
        accessToken: accessToken,
        profile: profile,
      };
    case UserActionTypes.SIGN_IN_USER_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        successMessage: "",
      };
    case UserActionTypes.SIGN_OUT_USER:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: "",
        errorMessage: "",
        successMessage: "",
        profile: {
          id: "",
          email: "",
          firstName: "",
          lastName: "",
          userAttributes: {},
        },
      };
    case UserActionTypes.SET_LOGGED_IN:
      return { ...state, isLoggedIn: true };
    case UserActionTypes.SET_CURRENT_USER:
      return { ...state, profile: action.payload };
    case UserActionTypes.GET_USER:
      return {
        ...state,
        profile: action.payload.profile,
        filledDetails:
          !!action.payload.profile.firstName &&
          !!action.payload.profile.lastName &&
          !!action.payload.profile.email &&
          !!action.payload.profile.EMBG &&
          !!action.payload.profile.dateOfBirth
      };
    case UserActionTypes.CREATE_USER:
      return {
        ...state,
        successMessage: action.payload.successMessage
      }
    case UserActionTypes.CREATE_USER_FAILED:
      return {
        ...state,
        errorMessage: action.payload.errorMessage
      }
    case UserActionTypes.GET_ALL_USERS_START:
      return {
        ...state,
        isLoading: true
      }
    case UserActionTypes.GET_ALL_USERS:
      return {
        ...state,
        users: action.payload.users,
        isLoading: false
      }
    case UserActionTypes.GET_ALL_USERS_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isLoading: false
      }
    case UserActionTypes.RESET_PASSWORD:
      return {
        ...state,
        successMessage: "Email for reseting password send",
      }
    case UserActionTypes.RESET_PASSWORD_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      }
    case UserActionTypes.RESET_MESSAGES:
      return {
        ...state,
        successMessage: "",
        errorMessage: ""
      }
    case UserActionTypes.DELETE_USER:
      return { 
          ...state,
          successMessage: action.payload.successMessage,
          isLoggedIn: false
      }
    case UserActionTypes.DELETE_USER_FAIL:
      return { 
          ...state,
          errorMessage: action.payload.errorMessage
      }
    case UserActionTypes.UPDATE_DOCTOR_INFO:
      return { 
          ...state,
          successMessage: action.payload.successMessage
      }
    case UserActionTypes.UPDATE_DOCTOR_INFO_FAIL:
      return { 
          ...state,
          errorMessage: action.payload.errorMessage
      }
    case UserActionTypes.CHANGE_PASSWORD:
      return {
        ...state,
        ...action.payload
      }
    case UserActionTypes.CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
};

export default userReducer;
