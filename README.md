# Local Document Form Helper

This is a public demonstration of a browser extension I built for a private employee onboarding workflow. It reads one specific text-based registration PDF, combines it with a small TXT file containing contact details and prepares a form for review.

The original extension works with private company systems. Their selectors, company mappings and credential rules are not part of this repository. The included demo page and employee record are fictional.

## What the demo does

1. Reads a registration PDF locally in the browser.
2. Extracts the employee, address and employment fields expected by the supported layout.
3. Reads a TXT file containing a phone number and email address.
4. Shows the extracted information before anything is changed.
5. Fills the included demonstration form.

The extension never submits the form. The user still reviews every field and decides what to do next.

## Supported document

The parser expects the labels and order used by `demo/sample-registration.pdf`. The matching HTML version is included so the layout can be inspected or printed again if needed.

This is deliberately a layout-specific parser. It does not attempt to understand arbitrary PDFs, and it cannot read scanned documents without a text layer.

## Run the project

```powershell
npm install
npm test
npm run build
```

Then:

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable developer mode.
3. Choose **Load unpacked** and select the generated `dist` folder.
4. Open `demo/index.html` in a browser tab.
5. Select `demo/sample-registration.pdf` and `demo/sample-contact.txt` in the extension.
6. Review the preview and choose **Fill demonstration form**.

## Project structure

- `src/` contains the extension source.
- `demo/` contains the fictional registration record and form.
- `test/` checks the document and contact parsers.
- `scripts/` contains the local build step.

The fictional PDF can be regenerated with `python scripts/create_sample_pdf.py` when ReportLab is available.

## Privacy

Files are processed inside the extension. The demo has no server, analytics or external storage. The selected files and extracted values are kept only while the popup is open.

