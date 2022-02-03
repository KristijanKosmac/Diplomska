import { Doctor } from "../../types";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import UserForm from "../../components/user-form/user-form.component";
import { useEffect } from "react";
import { GlobalState } from "../../reducers";
import { useDispatch, useSelector } from "react-redux";
import { getUser, resetMessages, updateDoctorInfo } from "../../actions";


export default function Profile(props: RouteComponentProps<{}, StaticContext>) {
  const { errorMessage, successMessage, profile } = useSelector(
    (state: GlobalState) => state.user
  );

  const dispatch = useDispatch();

  console.log(profile)

  useEffect(() => {
    dispatch(getUser())
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessages())
    }, 3000);
  }, [errorMessage, successMessage]);

  const handleSubmit = async (doctor: Doctor) => {
    dispatch(updateDoctorInfo(doctor, props.history))
  };

  return (
    <UserForm
      errorMessage={errorMessage}
      successMessage={successMessage}
      isUpdate={true}
      onSubmit={handleSubmit}
      title="My Profile"
      doctor={profile}
    />
  );
}
