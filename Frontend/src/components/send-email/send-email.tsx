import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import EmailIcon from "@material-ui/icons/Email";
import CustomModal from "../modal/modal.component";
import { SendEmailProps } from "../../types";
import { useEffect, useState } from "react";
import CustomSelect from "../select/select";

export default function SendEmail(props: SendEmailProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState(props.defaultDocument.id);
  const [emails, setEmails] = useState<string[]>([props.email]);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (isOpened) {
      setSelectedDocumentId(props.defaultDocument.id)
      setEmails([props.email!])
    }
  }, [isOpened]);

  return (
    <div
      className={props.className || ""}
      onClick={(event) => event.stopPropagation()}
    >
      <CustomModal
        buttonName={
          <>
            <EmailIcon fontSize="small" style={{ marginRight: "5px" }} />
            Испрати емаил
          </>
        }
        onClick={() => props.onClick(emails, selectedDocumentId)}
        title="Исрати емаил"
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
                  label="Исрати емаил до:"
                  placeholder="додади една или повеќе емаил адреси"
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
              name="Документ"
              onChange={(value) => {
                setSelectedDocumentId(value)
              }}
            />
          </>
        }
        id={"id"}
      />
    </div>
  );
}