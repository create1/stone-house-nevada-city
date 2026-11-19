import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "data", "events.json");

let writeChain = Promise.resolve();

export function storeFile() {
  return process.env.PLATFORM_DATA_FILE || defaultFile;
}

function queue(task) {
  const run = writeChain.then(task, task);
  writeChain = run.then(
    () => {},
    () => {},
  );
  return run;
}

async function readFileStore(file) {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return { events: Array.isArray(parsed.events) ? parsed.events : [] };
  } catch (error) {
    if (error.code === "ENOENT") return { events: [] };
    throw error;
  }
}

export async function listEvents() {
  const data = await readFileStore(storeFile());
  return data.events;
}

export async function saveEvent(event) {
  return queue(async () => {
    const file = storeFile();
    const data = await readFileStore(file);
    const index = data.events.findIndex((item) => item.id === event.id);
    if (index >= 0) data.events[index] = event;
    else data.events.push(event);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const temp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(temp, JSON.stringify(data, null, 2));
    await fs.rename(temp, file);
    return event;
  });
}
