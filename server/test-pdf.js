import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseObj = require("pdf-parse");

console.log(pdfParseObj.default);
console.log(typeof pdfParseObj.default);
