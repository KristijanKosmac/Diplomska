import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import EmailIcon from "@material-ui/icons/Email";
import CustomModal from "../modal/modal.component";
import { SendEmailProps } from "../../types";
import { useEffect, useState } from "react";
import CustomSelect from "../select/select";

export default function SendEmail(props: SendEmailProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState(
    props.defaultDocument.id
  );
  const [emails, setEmails] = useState<string[]>([props.email]);
  const [text, setText] = useState(props.text || "");
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (isOpened) {
      setSelectedDocumentId(props.defaultDocument.id);
      setEmails([props.email!]);
    }
  }, [isOpened]);

  return (
    <div
      className={props.className || ""}
      onClick={(event) => event.stopPropagation()}
    >
      <CustomModal
        id={"id"}
        buttonName={
          <>
            <EmailIcon fontSize="small" style={{ marginRight: "5px" }} />
            Send email
          </>
        }
        onClick={() => props.onClick(emails, selectedDocumentId, text)}
        title="Send Email"
        buttonSize={props.className ? "medium" : "small"}
        isOpened={(value) => setIsOpened(value)}
        content={
          <>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={props.suggestedEmails}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              freeSolo
              defaultValue={[props.email]}
              onChange={(_event, value) => setEmails(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Send email to:"
                  placeholder="Add one or more emails"
                />
              )}
            />
            <CustomSelect
              disabled
              required
              value={selectedDocumentId}
              items={props.documents.map((doc) => {
                return {
                  name: doc.name,
                  id: doc.id,
                };
              })}
              objectParametars={["name"]}
              errorMessage=""
              name="Document"
              onChange={(value) => {
                setSelectedDocumentId(value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="text"
              label="Text"
              type="text"
              name="text"
              autoComplete="text"
              minRows={1}
              maxRows={5}
              multiline 
              autoFocus
              value={text}
              onChange={(value) => setText(value.target.value)}
            />
          </>
        }
      />
    </div>
  );
}
