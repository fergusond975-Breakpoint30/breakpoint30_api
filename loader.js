import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load JSON safely
function loadJSON(fileName) {
  try {
    const filePath = path.join(__dirname, "data", fileName);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load", fileName, err.message);
    return [];
  }
}

// Load all datasets
export function loadAllStops() {
  const nationwide = loadJSON("nationwide.json");
  const loves = loadJSON("loves.json");
  const pilotfj = loadJSON("pilotfj.json");
  const tapetro = loadJSON("tapetro.json");
  const independents = loadJSON("independents.json");
  const restareas = loadJSON("restareas.json");

  return [
    ...nationwide,
    ...loves,
    ...pilotfj,
    ...tapetro,
    ...independents,
    ...restareas
  ];
}
