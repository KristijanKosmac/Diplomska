import { combineReducers } from 'redux';
import { PatientsState, UserState } from '../types';
import patientsReducer from './patients/patients';
import userReducer from "./user/user"

export default combineReducers({
    user: userReducer,
    patients: patientsReducer
});

export interface GlobalState {
    user: UserState;
    patients: PatientsState;
}