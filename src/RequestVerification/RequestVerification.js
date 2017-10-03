'use strict';

const fs = require('fs');
const DigitalSignatureService = require('./../Utils/DigitalSignatureService');

let digitalSignatureService;

class RequestVerification {
  constructor() {
    digitalSignatureService = new DigitalSignatureService();
  }

  isFileSync(aPath) {
    try {
      return fs.statSync(aPath).isFile();
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false;
      } else {
        throw e;
      }
    }
  }

  verifyRequest(contents, cert, sig) {

    let publicKey = cert;

    if(this.isFileSync(cert)){
      publicKey = fs.readFileSync(cert, 'utf8');
    }

    const verified = digitalSignatureService.verifyRequest(contents, publicKey, sig);
    return verified;
  }

}
module.exports = RequestVerification;