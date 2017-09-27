const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const RequestVerification = require('../../src/RequestVerification/RequestVerification');
const DigitalSignatureService = require('../../src/Utils/DigitalSignatureService');

const expectedUid = 'myuid';
const expectedUuid = 'myUuid';
const expectedSig = 'YWJjZGVm';

describe('When verifying the request', () => {
  let sandbox;
  let requestVerification;

  beforeEach(() => {
    requestVerification = new RequestVerification();
    sandbox = sinon.sandbox.create();
  });
  afterEach(function(){
    sandbox.restore();
  });
  it('the interactions certification is loaded', () => {
    sandbox.stub(DigitalSignatureService.prototype,'verifyRequest').returns(true);
    const mock = sinon.mock(fs);
    let expectedCert = './ssl/interactions.cert';
    mock.expects('readFileSync').once().withArgs(expectedCert, 'utf8').returns('abcdefg');

    requestVerification.verifyRequest(req,expectedCert,expectedSig);

    mock.verify();
  });
  it('the verify function is called passing in the signature and public key and contents', () => {
    const expectedCertContent = 'abcdefg';
    const mock = sinon.mock(fs);
    let expectedCert = './ssl/interactions.cert';
    mock.expects('readFileSync').once().withArgs(expectedCert, 'utf8').returns(expectedCertContent);
    sandbox.stub(DigitalSignatureService.prototype,'verifyRequest').withArgs(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCertContent,expectedSig).returns(true);

    const actual = requestVerification.verifyRequest(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert, expectedSig);

    expect(actual).to.equal(true);
    mock.verify();
  });
});
