const fs = require("fs");
const digitalSignatureService = require("./../Utils/DigitalSignatureService");

const isFileSync = (aPath) => {
  try {
    return fs.statSync(aPath).isFile();
  } catch (e) {
    return false;
  }
};

const verifyRequest = (contents, cert, sig) => {
  let publicKey = cert;

  if (isFileSync(cert)) {
    publicKey = fs.readFileSync(cert, "utf8");
  }

  const verified = digitalSignatureService.verifyRequest(
    contents,
    publicKey,
    sig,
  );
  return verified;
};

module.exports = {
  verifyRequest,
};
