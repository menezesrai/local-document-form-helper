import { build } from "esbuild";
import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "src");
const output = resolve(root, "dist");

await mkdir(output, { recursive: true });

await build({
  entryPoints: [resolve(source, "popup.js")],
  outfile: resolve(output, "popup.js"),
  bundle: true,
  format: "esm",
  target: "chrome120"
});

await build({
  entryPoints: [resolve(source, "content.js")],
  outfile: resolve(output, "content.js"),
  bundle: true,
  format: "iife",
  target: "chrome120"
});

await Promise.all([
  copyFile(resolve(source, "manifest.json"), resolve(output, "manifest.json")),
  copyFile(resolve(source, "popup.html"), resolve(output, "popup.html")),
  copyFile(resolve(source, "popup.css"), resolve(output, "popup.css")),
  copyFile(
    resolve(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"),
    resolve(output, "pdf.worker.min.mjs")
  )
]);

console.log(`Extension built in ${output}`);

