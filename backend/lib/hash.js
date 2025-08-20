import * as crypto from "node:crypto";

export const makeSha256 = () => {
  const hash = crypto.createHash("sha256");
  return { update: (b) => hash.update(b), digest: () => hash.digest("hex") };
};
