import test from "node:test";
import assert from "node:assert/strict";
import { parseAddress, parseContactText, parseRegistrationLines } from "../src/parser.js";

test("parses the fictional registration layout", () => {
  const result = parseRegistrationLines([
    "Employee: Marina Souza",
    "CPF: 123.456.789-09",
    "Birth date: 14/03/1994",
    "Address: Rua das Flores, 120, Apt 31, Vila Nova, Santos, SP, 11000-000",
    "Admission date: 05/10/2026",
    "Department: Store operations",
    "Job title: Sales assistant",
    "Salary: R$ 2,350.00"
  ]);

  assert.equal(result.record.name, "Marina Souza");
  assert.equal(result.record.city, "Santos");
  assert.equal(result.record.jobTitle, "Sales assistant");
  assert.deepEqual(result.warnings, []);
});

test("separates an address with an optional complement", () => {
  assert.deepEqual(
    parseAddress("Rua das Flores, 120, Apt 31, Vila Nova, Santos, SP, 11000-000"),
    {
      street: "Rua das Flores",
      number: "120",
      complement: "Apt 31",
      district: "Vila Nova",
      city: "Santos",
      state: "SP",
      zipCode: "11000-000"
    }
  );
});

test("reads the contact TXT without sending it anywhere", () => {
  const result = parseContactText("Phone: +55 13 98888-4421\nEmail: marina.souza@example.com");

  assert.equal(result.record.phone, "+55 13 98888-4421");
  assert.equal(result.record.email, "marina.souza@example.com");
  assert.deepEqual(result.warnings, []);
});

test("reports fields missing from an unsupported document", () => {
  const result = parseRegistrationLines(["A different PDF layout"]);

  assert.ok(result.warnings.length >= 6);
  assert.equal(result.record.name, "");
});
