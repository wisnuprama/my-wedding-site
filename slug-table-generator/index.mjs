import slugTable from "./table.json" assert { type: "json" };
import fs from "fs";
import path from "path";

function slugTableGenerator() {
  return JSON.stringify(slugTable);
}

function main() {
  fs.writeFileSync(
    path.join(process.cwd(), "slug-table-generator", "table.minified.json"),
    slugTableGenerator(),
  );
}

main();
