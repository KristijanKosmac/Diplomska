import React, { useEffect } from "react";
import { Modal, Button } from "@material-ui/core";
import useStyles from "./modal.styles";
import { ModalProps } from "../../types";

export default function CustomModal({
  buttonName,
  onClick,
  title,
  content,
  id,
  buttonSize,
  disabled,
  isOpened
}: ModalProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    isOpened && isOpened(open);
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title" className={classes.title}>
        {title}
        <Button
          variant="outlined"
          className={classes.btn}
          onClick={handleClose}
        >
          X
        </Button>
      </h2>
      <div id="simple-modal-description" className={classes.description}>
        <div>
          <h3>{content}</h3>
        </div>
        {onClick && (
          <div className={classes.btnWrap}>
            <Button
              variant="outlined"
              className={classes.confirmBtn}
              onClick={() => {
                onClick(id);
                handleClose();
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              className={classes.cancelBtn}
              onClick={handleClose}
            >
              No
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        size={buttonSize || "small"}
        onClick={handleOpen}
        disabled={disabled}
      >
        {buttonName}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {body}
      </Modal>
    </div>
  );
}
