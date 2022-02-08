import { doctorAPI, getUserManagementAPI } from "../../api";
import { UserActionTypes } from "../../constants/index";
import { History } from "history";
import { UserState, User, Doctor } from "../../types";
import { signUp, signIn } from "../../firebase/index";

export const signUpUser =
  (email: string, password: string, history: History) =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: { successMessage: string } | { errorMessage: string };
    }) => void
  ) => {
    try {
      signUp(email, password);

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
          errorMessage: error,
        },
      });
    }
  };

export const signInUser =
  (email: string, password: string, history: History) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      const response = await signIn(email, password);
      console.log("sign in response", response);

      localStorage.setItem("profile", JSON.stringify(response.profile));
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("isLoggedIn", "true");

      dispatch({
        type: UserActionTypes.SIGN_IN_USER,
        payload: { errorMessage: "", ...response },
      });

      const exists = await doctorAPI.getDoctor(response.profile.id);
      if (exists) {
        history.push("/patients");
      } else {
        history.push("/profile");
      }
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.SIGN_IN_USER_FAIL,
        payload: {
          errorMessage: error || error.response.data.message,
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
          errorMessage: error || error.response.data.message,
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
  (username: string, groupName: string, history: History) =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: { successMessage: string } | { errorMessage: string };
    }) => void
  ) => {
    try {
      await getUserManagementAPI().adminCreateUser({
        username,
        groupName,
      });

      dispatch({
        type: UserActionTypes.CREATE_USER,
        payload: { successMessage: "Successfully created user" },
      });

      history.push("/users");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.CREATE_USER_FAILED,
        payload: { errorMessage: "Failed to create user" },
      });
    }
  };

export const getUser =
  () =>
  async (
    dispatch: (arg0: { type: string; payload: { profile: Doctor } }) => void
  ) => {
    const profileId = JSON.parse(localStorage.getItem("profile")!).id;
    const response = await doctorAPI.getDoctor(profileId);

    localStorage.removeItem("profile");
    localStorage.setItem("profile", JSON.stringify(response.data));
    dispatch({
      type: UserActionTypes.GET_USER,
      payload: { profile: { ...response.data } },
    });
  };

export const getAllUsers =
  () =>
  async (
    dispatch: (arg0: {
      type: string;
      payload: { users?: User[]; errorMessage?: string };
    }) => void
  ) => {
    dispatch({
      type: UserActionTypes.GET_ALL_USERS_START,
      payload: {},
    });
    const profileId = JSON.parse(localStorage.getItem("profile")!).id;

    try {
      // const { data } = await getUserManagementAPI().getAllUsers();
      const usersData = [{}] as any[];

      const users: User[] = usersData
        .map((user) => {
          const { email, role, institution } = JSON.parse(
            user.userAttributes.toString()
          );
          return {
            ...user,
            firstName: user.firstName!,
            lastName: user.lastName!,
            email: email || "",
            role: role || "",
            institution: institution || "",
          };
        })
        .filter((user) => user.id !== profileId);

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
  (
    sessionToken: string,
    newPassword: string,
    username: string,
    history: History
  ) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      const response = await getUserManagementAPI().setPassword({
        sessionToken,
        newPassword,
        username,
      });

      dispatch({
        type: UserActionTypes.RESET_PASSWORD,
        payload: { ...response.data },
      });

      history.push("/sign-in");
    } catch (error: any) {
      dispatch({
        type: UserActionTypes.RESET_PASSWORD_FAIL,
        payload: { errorMessage: error.response.data.message },
      });
    }
  };

export const deleteUser =
  (userId: string) =>
  async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      await getUserManagementAPI().deleteUser(userId);

      dispatch({
        type: UserActionTypes.DELETE_USER,
        payload: { successMessage: "Successfully deleted user" },
      });
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
