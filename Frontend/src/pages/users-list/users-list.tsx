import { FormEvent, useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import {
  Paper,
  TableCell,
  CircularProgress,
  TextField,
} from "@material-ui/core";

import { UserColumn, Doctor } from "../../types";

import Search from "../../components/search/search.component";
import CustomTable from "../../components/table/table";

import useStyles from "./users-list.styles";
import { GlobalState } from "../../reducers";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getAllUsers, resetMessages } from "../../actions";
import CustomModal from "../../components/modal/modal.component";
import CreateUserValidation from "../../utils/validations/create-user-validation";
import { getValue } from "../../utils/getValue";

const UsersListPage = (props: RouteComponentProps) => {
  const [searchedUsers, setSearchedUsers] = useState<Doctor[]>([]);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });
  const { isLoading, successMessage, errorMessage, users } = useSelector(
    (state: GlobalState) => state.user
  );

  const classes = useStyles();
  const dispatch = useDispatch();

  const columns: UserColumn[] = [
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "email", label: "Email" },
    { id: "institution", label: "Institution" },
    { id: "dateOfBirth", label: "Date of Birth" },
    { id: "city", label: "City" }   
  ];

  useEffect(() => {
    setSearchedUsers(users);
  }, [users]);

  const fetch = async () => {
    dispatch(getAllUsers());
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessages());
    }, 4000);
  }, [errorMessage, successMessage]);

  const handleSearchUsers = (search: string) => {
    search = search.toLowerCase().trim();
    if (search === "") {
      setSearchedUsers(users);
    } else {
      setSearchedUsers(
        users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(search) ||
            user.lastName.toLowerCase().includes(search) ||
            user.institution!.toString().toLocaleLowerCase().includes(search)
        )
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // event.preventDefault();

    const { errors, valid } = CreateUserValidation({ email });
    setErrors(errors);

    valid && dispatch(createUser(email, props.history));
  };

  const mapElements = (user: Doctor) => {
    const elements = columns.map((column) => {
      let value = user[column.id] || "/";

      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={classes.bodyCell}
          style={{
            wordBreak: "break-word",
            minWidth: column.minWidth,
            width: column.width,
          }}
        >
          {getValue(column.id, value)}
        </TableCell>
      );
    });

    elements.push(<TableCell
      key={"last"}
      align={"right"}
      className={classes.bodyCell}
    >
    </TableCell>)

    return [...elements];
  };

  return (
    <div className={classes.mainContainer}>
      {successMessage && (
        <div className="successMessage" style={{ margin: "0 auto 20px" }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="errorMessage" style={{ margin: "0 auto 20px" }}>
          {errorMessage}
        </div>
      )}
      <h1>All Users</h1>
      <div className={classes.btnContainer}>
        <CustomModal
          id={"id"}
          buttonName="Add user"
          buttonSize="medium"
          onClick={handleSubmit}
          title="Send Email"
          content={
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              type="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(value) => setEmail(value.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          }
        />
        <Search
          handleSearch={handleSearchUsers}
          placeholder="search by first name, last name or institution"
        />
      </div>
      {!isLoading ? (
        <Paper className={classes.root} elevation={3}>
          {searchedUsers.length === 0 ? (
            <h2 className={classes.noUsers}>There are no users!</h2>
          ) : (
            <CustomTable
              columns={columns}
              rows={searchedUsers.map((user) => {
                return {
                  elements: mapElements(user),
                };
              })}
            />
          )}
        </Paper>
      ) : (
        <CircularProgress size={60} style={{ marginTop: "32px" }} />
      )}
    </div>
  );
};

export default withRouter(UsersListPage);
