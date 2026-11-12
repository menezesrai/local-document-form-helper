export function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readValue(lines, labels) {
  const alternatives = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const pattern = new RegExp(`^(?:${alternatives})\\s*:?\\s*(.+)$`, "i");

  for (const line of lines) {
    const match = normalizeText(line).match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return "";
}

export function parseAddress(value = "") {
  const parts = String(value).split(",").map((part) => part.trim()).filter(Boolean);

  if (parts.length < 6) {
    return {
      street: parts[0] ?? "",
      number: parts[1] ?? "",
      complement: "",
      district: "",
      city: "",
      state: "",
      zipCode: ""
    };
  }

  const zipCode = parts.at(-1) ?? "";
  const state = parts.at(-2) ?? "";
  const city = parts.at(-3) ?? "";
  const district = parts.at(-4) ?? "";
  const street = parts[0] ?? "";
  const number = parts[1] ?? "";
  const complement = parts.slice(2, -4).join(", ");

  return { street, number, complement, district, city, state, zipCode };
}

export function parseRegistrationLines(inputLines = []) {
  const lines = inputLines.map(normalizeText).filter(Boolean);
  const address = parseAddress(readValue(lines, ["Address"]));
  const record = {
    name: readValue(lines, ["Employee", "Name"]),
    cpf: readValue(lines, ["CPF"]),
    birthDate: readValue(lines, ["Birth date"]),
    ...address,
    admissionDate: readValue(lines, ["Admission date"]),
    department: readValue(lines, ["Department"]),
    jobTitle: readValue(lines, ["Job title", "Role"]),
    salary: readValue(lines, ["Salary"])
  };
  const warnings = [];

  for (const [field, label] of [
    ["name", "employee name"],
    ["cpf", "CPF"],
    ["birthDate", "birth date"],
    ["street", "address"],
    ["admissionDate", "admission date"],
    ["jobTitle", "job title"]
  ]) {
    if (!record[field]) warnings.push(`The ${label} was not found in the supported layout.`);
  }

  return { record, warnings };
}

export function parseContactText(input = "") {
  const fields = new Map();

  for (const rawLine of String(input).replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const match = rawLine.trim().match(/^(.+?)\s*:\s*(.+)$/);
    if (match) fields.set(normalizeText(match[1]).toLowerCase(), match[2].trim());
  }

  const record = {
    phone: fields.get("phone") ?? "",
    email: fields.get("email") ?? ""
  };
  const warnings = [];

  if (!record.phone) warnings.push("The phone number was not found in the TXT file.");
  if (!record.email) warnings.push("The email address was not found in the TXT file.");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
    warnings.push("The email address in the TXT file has an unexpected format.");
  }

  return { record, warnings };
}

