import { MenuItem, Menu, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { DropdownMenuActionsProps } from "../../types";

const DropdownMenuActions = (props: DropdownMenuActionsProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(e) => handleClick(e)}
      >
        <MoreVertIcon></MoreVertIcon>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClick={(event) => {
          event.stopPropagation();
          handleClose();
        }}
      >
        {props.items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={(event) => {
              event.stopPropagation();
              handleClose();
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default DropdownMenuActions;
