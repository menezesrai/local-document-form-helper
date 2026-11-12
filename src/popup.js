import { extractPdfLines } from "./pdf-reader.js";
import { parseContactText, parseRegistrationLines } from "./parser.js";

const pdfInput = document.querySelector("#pdf-file");
const txtInput = document.querySelector("#txt-file");
const status = document.querySelector("#status");
const preview = document.querySelector("#preview");
const previewFields = document.querySelector("#preview-fields");
const fillButton = document.querySelector("#fill-form");

let currentRecord = null;

const PREVIEW_FIELDS = [
  ["name", "Employee"],
  ["cpf", "CPF"],
  ["birthDate", "Birth date"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["city", "City"],
  ["jobTitle", "Job title"],
  ["admissionDate", "Admission"]
];

function setStatus(message, kind = "default") {
  status.textContent = message;
  status.className = `notice${kind === "default" ? "" : ` ${kind}`}`;
}

function renderPreview(record) {
  previewFields.replaceChildren();

  for (const [field, label] of PREVIEW_FIELDS) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const value = document.createElement("dd");
    term.textContent = label;
    value.textContent = record[field] || "Not found";
    row.append(term, value);
    previewFields.append(row);
  }

  preview.classList.remove("hidden");
}

async function prepareRecord() {
  const pdf = pdfInput.files?.[0];
  const txt = txtInput.files?.[0];

  currentRecord = null;
  fillButton.disabled = true;
  preview.classList.add("hidden");

  if (!pdf || !txt) {
    setStatus("Select both files to review the extracted values.");
    return;
  }

  try {
    setStatus("Reading the files locally...");
    const [lines, contactText] = await Promise.all([extractPdfLines(pdf), txt.text()]);
    const registration = parseRegistrationLines(lines);
    const contact = parseContactText(contactText);
    currentRecord = { ...registration.record, ...contact.record };
    const warnings = [...registration.warnings, ...contact.warnings];

    renderPreview(currentRecord);
    fillButton.disabled = false;

    if (warnings.length) setStatus(warnings.join(" "), "warning");
    else setStatus("The values are ready for review.");
  } catch (error) {
    setStatus(`The files could not be read: ${error.message}`, "error");
  }
}

async function fillDemonstrationForm() {
  if (!currentRecord) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab was found.");

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "fill-demonstration-form",
      record: currentRecord
    });

    setStatus(response?.message ?? "The demonstration form was prepared.", response?.ok ? "default" : "error");
  } catch (error) {
    setStatus(`The form could not be prepared: ${error.message}`, "error");
  }
}

pdfInput.addEventListener("change", prepareRecord);
txtInput.addEventListener("change", prepareRecord);
fillButton.addEventListener("click", fillDemonstrationForm);

