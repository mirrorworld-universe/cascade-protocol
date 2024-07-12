import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";
import * as glob from "glob";

/**
 * Compute the hash of a directory by hashing the content of all files in the directory
 * @param dir
 * @returns
 */
export const computeDirectoryHash = (dir: string) => {
  const files = glob.sync("**/*", { cwd: dir, nodir: true });

  const fileHashes = files.map((f) => {
    const fileContent = fs.readFileSync(path.join(dir, f), "utf-8");
    var hash = crypto.createHash("sha256").update(fileContent).digest("hex");
    return hash;
  });

  const dirHash = crypto
    .createHash("sha256")
    .update(fileHashes.join())
    .digest("hex");

  return dirHash;
};
