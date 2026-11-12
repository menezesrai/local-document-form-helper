import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf.worker.min.mjs");

function groupItemsIntoLines(items) {
  const rows = [];
  const tolerance = 2.5;

  for (const item of items) {
    if (!item.str?.trim()) continue;

    const x = item.transform?.[4] ?? 0;
    const y = item.transform?.[5] ?? 0;
    let row = rows.find((candidate) => Math.abs(candidate.y - y) <= tolerance);

    if (!row) {
      row = { y, items: [] };
      rows.push(row);
    }

    row.items.push({ x, text: item.str.trim() });
  }

  return rows
    .sort((a, b) => b.y - a.y)
    .map((row) => row.items
      .sort((a, b) => a.x - b.x)
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim())
    .filter(Boolean);
}

export async function extractPdfLines(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await getDocument({ data: bytes }).promise;
  const lines = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    lines.push(...groupItemsIntoLines(content.items));
  }

  return lines;
}

