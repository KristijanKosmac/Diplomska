export function saveByteArray(reportName: string, content: Blob | any) {
  let blob = new Blob();
  if (content instanceof Blob) {
    blob = content;
  } else {
    blob = new Blob([content], { type: "application/pdf" });
  }

  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
}