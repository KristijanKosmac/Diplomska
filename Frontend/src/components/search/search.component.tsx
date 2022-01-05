import React, { ChangeEvent, KeyboardEvent } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";
import useStyles from "./search.styles";

export default function SearchAppBar({
  handleSearch,
  placeholder,
  width,
  className
}: {
  handleSearch: Function;
  placeholder: string;
  width?: string;
  className?: string;
}) {
  const classes = useStyles();
  const [search, setSearch] = React.useState("");

  const handleKeyUp = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch(search, "name");
    }
  };

  const handleSearchInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch(event.target.value);
    handleSearch(event.target.value, "name");
  };

  const handleDelete = () => {
    setSearch("");
    handleSearch("", "name");
  };

  const customWidth = { width } || "";
  return (
    <div className={`${classes.root} ${className}`} style={customWidth}>
      <div className={classes.search}>
        <InputBase
          placeholder={placeholder}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={handleSearchInput}
          onKeyUp={handleKeyUp}
          value={search}
        />
        <IconButton
          aria-label="delete"
          className={classes.deleteIcon}
          onClick={handleDelete}
        >
          <HighlightOffIcon />
        </IconButton>
      </div>
      <div className={classes.searchIcon}>
        <SearchIcon
          style={{ padding: "0 2px" }}
          onClick={() => handleSearch(search, "name")}
        />
      </div>
    </div>
  );
}
