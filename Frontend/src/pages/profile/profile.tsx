import { User } from "../../types";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import UserForm from "../../components/user-form/user-form.component";
import { useEffect, useState } from "react";
import { GlobalState } from "../../reducers";
import { useDispatch, useSelector } from "react-redux";
import { getUserManagementAPI } from "../../api";
import { getUser } from "../../actions";

export default function Profile(props: RouteComponentProps<{}, StaticContext>) {
  const { errorMessage, successMessage, profile } = useSelector(
    (state: GlobalState) => state.user
  );
  const [error, setError] = useState(errorMessage);
  const [success, setSuccess] = useState(successMessage);
  const [user] = useState<User>({
    ...profile,
    role: profile.userAttributes["role"],
    institution: profile.userAttributes["institution"],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setSuccess("")
      setError("")
    }, 3000);
  }, [errorMessage, successMessage]);
  
  const handleSubmit = async (value: User) => {
    try {
      const req = {
        role: value.role,
        institution: value.institution,
        email: value.email
      };

      if (
        user.firstName !== value.firstName ||
        user.lastName !== value.lastName
      ) {
        await Promise.all([
          getUserManagementAPI().updateUserAttributes({
            userAttributes: req,
            userId: user.id
          }),
          getUserManagementAPI().updateUserDetails({
            firstName: value.firstName,
            lastName: value.lastName,
          }),
        ]);
      } else {
        await getUserManagementAPI().updateUserAttributes({
          userAttributes: req,
          userId: user.id
        });
      }

      setSuccess("Успешно променети податоците за корисничкиот профил");
      dispatch(getUser())
      props.history.push({
        pathname: "/patients",
        state: {
          successMessage: "Успешно променети податоците за корисничкиот профил"
        }
      });
    } catch (error: any) {
      setError(error.reponse.data.message);
    }
  };

  return (
    <UserForm
      errorMessage={error}
      successMessage={success}
      isUpdate={true}
      onSubmit={handleSubmit}
      title="Мој Профил"
      user={user}
    />
  );
}
