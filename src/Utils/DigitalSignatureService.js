"use strict";

const crypto = require("crypto");

const verifyRequest = (contents, publicKey, sig) => {
  const cryptoVerify = crypto.createVerify("RSA-SHA256");
  cryptoVerify.write(contents);
  cryptoVerify.end();
  return cryptoVerify.verify(publicKey, sig, "base64");
};

module.exports = {
  verifyRequest,
};
