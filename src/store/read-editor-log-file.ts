import {BuildEntry} from "./BuildEntry";
import {logEntries, mergeSize} from "./index";

const logStartWord = "Used Assets and files from the Resources folder, sorted by uncompressed size:";

export async function readEditorLogFile(file: Blob) {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  const newEntries = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line !== logStartWord) {
      continue;
    }

    for (let j = i + 1; j < lines.length; j++) {
      line = lines[j].trim();
      if (line.startsWith("---")) {
        break;
      }

      const entry = readBuildEntry(line);
      if (entry !== undefined) {
        newEntries.push(entry);
      }
    }

    break;
  }

  if (newEntries.length === 0) {
    return;
  }

  mergeSize.value = 0.01;
  logEntries.value = newEntries;
}

function readBuildEntry(line: string) {
  try
  {
    const firstSpaceIndex = line.indexOf(' ');
    const size = line.substring(0, firstSpaceIndex);
    const unit = line.substring(firstSpaceIndex + 1, firstSpaceIndex + 3);
    let megabytes = parseFloat(size);
    switch (unit)
    {
      case "kb":
        megabytes /= 1000;
        break;
    }

    if (megabytes === undefined || isNaN(megabytes)) {
      return undefined;
    }

    const path = line.substring(line.indexOf("% ") + 2);
    return new BuildEntry(readPath(path), megabytes);
  }
  catch
  {
    return undefined;
  }
}

function readPath(path: string) {
  const atlasStartWord = "Built-in Texture2D: ";
  if (!path.startsWith(atlasStartWord)) {
    return path;
  }

  return path.replace("Built-in Texture2D: ", "Atlases/") + ".png";
}