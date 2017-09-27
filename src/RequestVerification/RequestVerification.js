'use strict';

const fs = require('fs');
const DigitalSignatureService = require('./../Utils/DigitalSignatureService');

let digitalSignatureService;

class RequestVerification {
  constructor() {
    digitalSignatureService = new DigitalSignatureService();
  }

  verifyRequest(contents, cert, sig) {

    const publicKey = fs.readFileSync(cert, 'utf8');
    const verified = digitalSignatureService.verifyRequest(contents, publicKey, sig);
    return verified;
  }
}
module.exports = RequestVerification;