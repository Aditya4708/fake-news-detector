const fs = require("fs");
const pdfParse = require("pdf-parse");

async function test() {
    try {
        console.log(typeof pdfParse);
        const dummyPdf = Buffer.from("%PDF-1.4\n%EOF");
        const data = await pdfParse(dummyPdf);
        console.log(data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}
test();
