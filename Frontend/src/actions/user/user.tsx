import { doctorAPI, userAPI } from "../../api";
import { UserActionTypes } from "../../constants/index";
import { History } from "history";
import { UserState, Doctor } from "../../types";

export const signUpUser =
  (email: string, password: string, history: History) =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: { successMessage: string } | { errorMessage: string };
    }) => void
  ) => {
    try {
      await userAPI.signUp(email, password);

      dispatch({
        type: UserActionTypes.SIGN_UP_USER,
        payload: {
          successMessage:
            "Before you can sign in, verify your account via the email we've just sent you.",
        },
      });
      history.push("/sign-in");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.SIGN_UP_USER_FAIL,
        payload: {
          errorMessage: error.response.data.message || error.response.data || error ,
        },
      });
    }
  };

export const signInUser =
  (email: string, password: string, history: History) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      const { data } = await userAPI.signIn(email, password);
      let response = data;

      localStorage.setItem("profile", JSON.stringify(response.profile));
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("isLoggedIn", "true");

      await doctorAPI.getDoctor(response.profile.id).then((res ) => {
        response = { ...response, profile: res.data }
        dispatch({
          type: UserActionTypes.SIGN_IN_USER,
          payload: { errorMessage: "", ...response },
        });
        history.push("/patients");
      }).catch(_e => {
        dispatch({
          type: UserActionTypes.SIGN_IN_USER,
          payload: { errorMessage: "", ...response },
        });
        history.push("/profile");
      })
      console.log("sign in response", response);

      // doctorAPI.getDoctor(response.profile.id).catch(e => {
      //   history.push("/profile");
      // })
    } catch (error: any) {
      console.log(error.response.data)
      dispatch({
        type: UserActionTypes.SIGN_IN_USER_FAIL,
        payload: {
          errorMessage: error.response.data.message || error.response.data || error ,
        },
      });
    }
  };

export const signOutUser =
  (history?: History) => async (dispatch: (arg0: { type: string }) => void) => {
    localStorage.removeItem("profile");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("isLoggedIn");

    dispatch({
      type: UserActionTypes.SIGN_OUT_USER,
    });
    history && history.push("/sign-in");
  };

export const setIsLoggedIn =
  () => async (dispatch: (arg0: { type: string }) => void) => {
    dispatch({
      type: UserActionTypes.SET_LOGGED_IN,
    });
  };

export const updateDoctorInfo =
  (doctor: Doctor, history: History) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      const profileId = JSON.parse(localStorage.getItem("profile")!).id;
      await doctorAPI.updateDoctor(profileId, doctor);

      dispatch({
        type: UserActionTypes.UPDATE_DOCTOR_INFO,
        payload: { successMessage: "Successfully updated Infos" },
      });

      getUser();

      history.push("/patients");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.UPDATE_DOCTOR_INFO_FAIL,
        payload: {
          errorMessage: error.response.data.message || error.response.data || error ,
        },
      });
    }
  };

export const setCurrentUser =
  (user: Pick<UserState, "profile">) =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: Pick<UserState, "profile">;
    }) => void
  ) => {
    dispatch({
      type: UserActionTypes.SET_CURRENT_USER,
      payload: user,
    });
  };

export const createUser =
  (email: string, history: History) =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: { successMessage: string } | { errorMessage: string };
    }) => void
  ) => {
    try {
      await userAPI.creatUser(email);

      dispatch({
        type: UserActionTypes.CREATE_USER,
        payload: { successMessage: "Successfully invited user" },
      });

      history.push("/users");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.CREATE_USER_FAILED,
        payload: { errorMessage: error.response.data.message || "Failed to create user" },
      });
    }
  };

export const getUser =
  () =>
  async (
    dispatch: (arg0: { type: string; payload: { profile: Doctor } }) => void
  ) => {
    try {
      const profileId = JSON.parse(localStorage.getItem("profile")!).id;
      const response = await doctorAPI.getDoctor(profileId);

      localStorage.removeItem("profile");
      localStorage.setItem("profile", JSON.stringify(response.data));
      dispatch({
        type: UserActionTypes.GET_USER,
        payload: { profile: { ...response.data } },
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getAllUsers =
  () =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: { users?: Doctor[]; errorMessage?: string };
    }) => void
  ) => {
    dispatch({
      type: UserActionTypes.GET_ALL_USERS_START,
      payload: {},
    });
    const profileId = JSON.parse(localStorage.getItem("profile")!).id;

    try {
      const { data } = await doctorAPI.getAllDoctors();

      const users: Doctor[] = data.filter(
        (user: Doctor) => user.id !== profileId
      );

      dispatch({
        type: UserActionTypes.GET_ALL_USERS,
        payload: { users },
      });
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.GET_ALL_USERS_FAIL,
        payload: { errorMessage: error.response.data.message },
      });
    }
  };

export const resetPassword =
  (email: string, history: History) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      await userAPI.resetPassword(email);

      dispatch({
        type: UserActionTypes.RESET_PASSWORD,
        payload: {},
      });

      history.push("/sign-in");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.RESET_PASSWORD_FAIL,
        payload: { errorMessage: error.response.data.message },
      });
    }
  };

export const changePassword =
  (userId: string, password: string, history: History) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      await userAPI.changePassword(userId, password);

      dispatch({
        type: UserActionTypes.CHANGE_PASSWORD,
        payload: { successMessage: "Password was successfully changed" },
      });

      history.push("/profile");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.CHANGE_PASSWORD_FAIL,
        payload: { errorMessage: error.response.data.message },
      });
    }
  };

export const deleteUser =
  (userId: string) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      await userAPI.deleteUser(userId);

      dispatch({
        type: UserActionTypes.DELETE_USER,
        payload: { successMessage: "Successfully deleted user" },
      });
      signOutUser()
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.DELETE_USER_FAIL,
        payload: { errorMessage: "Something went wrong while deleting user" },
      });
    }
  };

export const resetMessages =
  () => async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    dispatch({
      type: UserActionTypes.RESET_MESSAGES,
      payload: {},
    });
  };
