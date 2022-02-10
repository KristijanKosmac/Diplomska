import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Button, Paper, TableCell, CircularProgress } from "@material-ui/core";

import { UserColumn, User } from "../../types";

import CustomModal from "../../components/modal/modal.component";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import Search from "../../components/search/search.component";
import CustomTable from "../../components/table/table";

import useStyles from "./users-list.styles";
import { GlobalState } from "../../reducers";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, resetMessages } from "../../actions";

const UsersListPage = (props: RouteComponentProps) => {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

  const { isLoading, successMessage, errorMessage } = useSelector((state: GlobalState) => state.user);

  const classes = useStyles();
  const dispatch = useDispatch();

  const columns: UserColumn[] = [
    { id: "firstName", label: "Име" },
    { id: "lastName", label: "Презиме" },
    { id: "email", label: "Емаил" },
    { id: "role", label: "Улога" },
    { id: "institution", label: "Институција" },
  ];

  // useEffect(() => {
  //   setSearchedUsers(users);
  // }, [users]);

  const fetch = async () => {
    dispatch(getAllUsers())
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessages())
    }, 4000);
  }, [errorMessage, successMessage]);

  const handleDelete = async (id: string) => {
    dispatch(deleteUser(id))
    // try {
    //   await getUserManagementAPI().deleteUser(id);
    //   setSuccessMessage("Successfully deleted user");
    //   fetch()
    // } catch (e: any) {
    //   setErrorMessage(e.response);
    // }
  };

  const handleSearchUsers = (search: string) => {
    search = search.toLowerCase().trim();
    // if (search === "") {
    //   setSearchedUsers(users);
    // } else {
    //   // setSearchedUsers(
    //   //   // users.filter(
    //   //   //   (user) =>
    //   //   //     user.role.toString().toLocaleLowerCase().includes(search) ||
    //   //   //     user.firstName.toLowerCase().includes(search) ||
    //   //   //     user.lastName.toLowerCase().includes(search)
    //   //   // )
    //   // );
    // }
  };

  const mapElements = (user: User) => {
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
          {value}
        </TableCell>
      );
    });

    const dropDownMenuActions = (
      <TableCell
        align="right"
        style={{
          minWidth: "5%",
          width: "5%",
        }}
      >
        <DropdownMenuActions
          items={[
            <Button
              variant="outlined"
              color="primary"
              className={classes.btn}
              size="small"
              onClick={(event) => {
                props.history.push({
                  pathname: "/users/edit",
                  state: {
                    data: user,
                  },
                });
                event.stopPropagation();
              }}
            >
              Промени
            </Button>,
            <CustomModal
              buttonName="Избриши"
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                // event.stopPropagation();
                handleDelete(user.id);
              }}
              title="Избриши Корисник"
              content={`Дали сте сигурни дека сакате да го избришете корисникот ${user["firstName"]} ${user["lastName"]}?`}
              id={user["id"]!}
            />,
          ]}
        />
      </TableCell>
    );

    return [...elements, dropDownMenuActions];
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
      <h1>Сите Корисници</h1>
      <div className={classes.btnContainer}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.btn}
          onClick={() => props.history.push("/users/add")}
        >
          Додади Корисник
        </Button>
        <Search
          handleSearch={handleSearchUsers}
          placeholder="пребарувај по име, презиме и улога"
        />
      </div>
      {!isLoading ? (
        <Paper className={classes.root} elevation={3}>
          {searchedUsers.length === 0 ? (
            <h2 className={classes.noUsers}>Нема пронајдени корисници!</h2>
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
