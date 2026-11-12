const FIELD_NAMES = [
  "name",
  "cpf",
  "birthDate",
  "street",
  "number",
  "complement",
  "district",
  "city",
  "state",
  "zipCode",
  "phone",
  "email",
  "admissionDate",
  "department",
  "jobTitle",
  "salary"
];

function updateControl(control, value) {
  control.value = value ?? "";
  control.dispatchEvent(new Event("input", { bubbles: true }));
  control.dispatchEvent(new Event("change", { bubbles: true }));
  control.dataset.filledByDemo = "true";
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "fill-demonstration-form") return false;

  if (!document.querySelector("[data-document-form-demo]")) {
    sendResponse({
      ok: false,
      message: "Open demo/index.html before using this public demonstration."
    });
    return false;
  }

  const missing = [];
  let filled = 0;

  for (const fieldName of FIELD_NAMES) {
    const control = document.querySelector(`[data-field="${fieldName}"]`);
    if (!control) {
      missing.push(fieldName);
      continue;
    }

    updateControl(control, message.record?.[fieldName] ?? "");
    filled += 1;
  }

  sendResponse({
    ok: true,
    filled,
    missing,
    message: `Prepared ${filled} fields for review. The form was not submitted.`
  });
  return false;
});

