import { combineReducers } from 'redux';
import { PatientsState, UnassignesStudiesState, UserState } from '../types';
import patientsReducer from './patients/patients';
import userReducer from "./user/user"
import unassignedStudiesReducer from "./studies/unassigned-studies"

export default combineReducers({
    user: userReducer,
    patients: patientsReducer,
    unassignedStudies: unassignedStudiesReducer
});

export interface GlobalState {
    user: UserState;
    patients: PatientsState;
    unassignedStudies: UnassignesStudiesState
}