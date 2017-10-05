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
    sandbox.stub(fs,'statSync').returns({isFile: ()=>{return true;}});
    const mock = sinon.mock(fs);
    let expectedCert = './ssl/interactions.cert';
    mock.expects('readFileSync').once().withArgs(expectedCert, 'utf8').returns('abcdefg');

    requestVerification.verifyRequest(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert,expectedSig);

    mock.verify();
  });
  it('the verify function is called passing in the signature and public key and contents', () => {
    const expectedCertContent = 'abcdefg';
    const mock = sinon.mock(fs);
    let expectedCert = './ssl/interactions.cert';
    mock.expects('readFileSync').once().withArgs(expectedCert, 'utf8').returns(expectedCertContent);
    sandbox.stub(DigitalSignatureService.prototype,'verifyRequest').withArgs(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCertContent,expectedSig).returns(true);
    sandbox.stub(fs,'statSync').returns({isFile: ()=>{return true;}});

    const actual = requestVerification.verifyRequest(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert, expectedSig);

    expect(actual).to.equal(true);
    mock.verify();
  });
  it('then if the cert in config is not a path but the value, it is used', () => {
    let expectedCert = 'abajsbdakjsbd';
     const mock = sinon.mock(fs);

     mock.expects('readFileSync').never();


    sandbox.stub(DigitalSignatureService.prototype,'verifyRequest').withArgs(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert,expectedSig).returns(true);

    requestVerification.verifyRequest(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert, expectedSig);

    mock.verify();
  });
  it('then it should treat cert as cert when file check throws error', () => {
    const expectedCert = 'abcdefg';
    sandbox.stub(fs,'statSync').throws();
    sandbox.stub(DigitalSignatureService.prototype,'verifyRequest').withArgs(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert,expectedSig).returns(false);

    const actual = requestVerification.verifyRequest(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert, expectedSig);

    expect(actual).to.equal(false);
  });
});
