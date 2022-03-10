import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Paper, CircularProgress, Grid, TextField } from "@material-ui/core";

import { FolderComponentProps } from "../../types";
import { patientAPI } from "../../api/index";
import CustomModal from "../../components/modal/modal.component";
import DropdownMenuActions from "../../components/dropdownMenuActions/dropdownMenuActions";
import Search from "../../components/search/search.component";

import useStyles from "./folders-list.styles";
import folderIcon from "../../assets/folder.png";

const FoldersListPage = (props: FolderComponentProps) => {
  const [folders, setFolders] = useState<string[]>([]);
  const [searchedFolders, setSearchedFolders] = useState<string[]>([]);
  const [newFolderName, setNewFoderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    setSearchedFolders(folders);
  }, [folders]);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const { data } = await patientAPI.getAllFolders(props.patientId);
      setFolders(data);
    } catch (error: any) {
      setIsLoading(false);
      error.response.data.code !== 404 && setErrorMessage("Something went wrong while getting folders");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);
  }, [errorMessage, successMessage]);

  const createFolder = async () => {
    try {
      await patientAPI.createFolder(props.patientId, newFolderName);
      fetch();
    } catch (error: any) {
      setErrorMessage("Something went wrong while creating folder");
    }
    setSuccessMessage("Successfully created folder");
  };

  const handleDelete = async (folderName: string) => {
    try {
      await patientAPI.deleteFolder(props.patientId, folderName);
      fetch();
    } catch (error: any) {
      setErrorMessage("Something went wrong while deleting folder");
    }
    setSuccessMessage("Successfully deleted folder: " + folderName);
  };

  const handleChangeFolderName = async (folderName: string) => {
    try {
      await patientAPI.renameFolder(props.patientId, folderName, newFolderName);
      fetch();
      setNewFoderName("");
    } catch (error: any) {
      setErrorMessage("Something went wrong while changing folder name");
    }
    setSuccessMessage("Successfully changed folder name");
  };

  const handleSearchFolders = (search: string) => {
    search = search.toLowerCase().trim();
    if (search === "") {
      setSearchedFolders(folders);
    } else {
      setSearchedFolders(folders.filter((folder) => folder.includes(search)));
    }
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
      <h1>All Folders</h1>
      <div className={classes.btnContainer}>
        <CustomModal
          buttonName="Create"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            // event.stopPropagation();
            createFolder();
          }}
          title="Create Folder Name"
          content={
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="text"
              label="Folder Name"
              type="text"
              name="Folder Name"
              autoComplete="text"
              autoFocus
              value={newFolderName}
              onChange={(value) => setNewFoderName(value.target.value)}
            />
          }
          id={newFolderName}
        />
        ,
        <Search
          handleSearch={handleSearchFolders}
          placeholder="search by first name, last name or institution"
        />
      </div>
      {!isLoading ? (
        <Paper className={classes.root} elevation={3}>
          {searchedFolders.length === 0 ? (
            <h2 className={classes.noUsers}>There are no folders!</h2>
          ) : (
            <Grid container spacing={2}>
              {searchedFolders.map((folder, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  className={classes.folder}
                  onClick={() => {
                    props.onClick(folder);
                  }}
                >
                  <div>
                    <img src={folderIcon} alt="folderIcon" />
                    <DropdownMenuActions
                      items={[
                        <CustomModal
                          buttonName="Edit"
                          onClick={(
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ) => {
                            handleChangeFolderName(folder);
                          }}
                          title="Edit Folder Name"
                          content={
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              id="text"
                              label="Folder Name"
                              type="text"
                              name="Folder Name"
                              autoComplete="text"
                              autoFocus
                              defaultValue={folder}
                              value={newFolderName || folder}
                              onChange={(value) =>
                                setNewFoderName(value.target.value)
                              }
                            />
                          }
                          id={folder}
                        />,
                        <CustomModal
                          buttonName="Delete"
                          onClick={(
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ) => {
                            handleDelete(folder);
                          }}
                          title="Delete Folder"
                          content={`Are you sure you want to delete folder: ${folder}?`}
                          id={folder}
                        />,
                      ]}
                    />
                  </div>
                  <div>{folder}</div>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      ) : (
        <CircularProgress size={60} style={{ marginTop: "32px" }} />
      )}
    </div>
  );
};

export default withRouter(FoldersListPage);
