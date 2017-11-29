jest.mock('../../src/Utils/DigitalSignatureService',() =>{
  const verifyRequest = jest.fn();
  return {
    verifyRequest: jest.fn().mockImplementation(verifyRequest),
  }
});

jest.mock('fs', () => {
  const statSync = jest.fn();
  const readFileSync = jest.fn();
  return {
    statSync: jest.fn().mockImplementation(statSync),
    readFileSync: jest.fn().mockImplementation(readFileSync),
  };
});

const requestVerification = require('./../../src/RequestVerification');
const DigitalSignatureService = require('./../../src/Utils/DigitalSignatureService');
const fs = require('fs');

const expectedUid = 'myuid';
const expectedUuid = 'myUuid';
const expectedSig = 'YWJjZGVm';

describe('When verifying the request', () => {

  beforeEach(() => {
    DigitalSignatureService.verifyRequest.mockReset();
  });
  it('the interactions certification is loaded', () => {
    let expectedCert = './ssl/mycert';
    let expectedPublicKey = 'abvfdert1234rfvcde';
    fs.statSync.mockReset();
    fs.readFileSync.mockReset();
    fs.statSync.mockReturnValue(
      {isFile: ()=>{return true;}}
    );
    fs.readFileSync.mockReturnValue(
      expectedPublicKey
    );

    requestVerification.verifyRequest(`{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`,expectedCert,expectedSig);


    expect(fs.readFileSync.mock.calls.length).toBe(1);
    expect(fs.readFileSync.mock.calls[0][0]).toBe(expectedCert);
    expect(fs.readFileSync.mock.calls[0][1]).toBe('utf8');

  });
  it('the verify function is called passing in the signature and public key and contents', () => {
    let expectedCert = './ssl/mycert';
    let expectedPublicKey = 'abvfdert1234rfvcde';
    const expectedContents = `{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`;
    fs.statSync.mockReset();
    fs.readFileSync.mockReset();
    fs.statSync.mockReturnValue(
      {isFile: ()=>{return true;}}
    );
    fs.readFileSync.mockReturnValue(
      expectedPublicKey
    );


    requestVerification.verifyRequest(expectedContents,expectedCert,expectedSig);

    expect(DigitalSignatureService.verifyRequest.mock.calls.length).toBe(1);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][0]).toBe(expectedContents);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][1]).toBe(expectedPublicKey);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][2]).toBe(expectedSig);
  });
  it('then if the cert in config is not a path but the value, it is used', () => {
    let expectedCert = 'abajsbdakjsbd';
    const expectedContents = `{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`;
    fs.statSync.mockReset();
    fs.readFileSync.mockReset();
    fs.statSync.mockReturnValue(
      {isFile: ()=>{return false;}}
    );

    requestVerification.verifyRequest(expectedContents,expectedCert,expectedSig);

    expect(fs.readFileSync.mock.calls.length).toBe(0);

    expect(DigitalSignatureService.verifyRequest.mock.calls.length).toBe(1);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][0]).toBe(expectedContents);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][1]).toBe(expectedCert);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][2]).toBe(expectedSig);
  });
  it('then it should treat cert as cert when file check throws error', () => {
    const expectedCert = 'abcdefg';
    const expectedContents = `{"uuid":"${expectedUuid}","uid":"${expectedUid}"}`;
    fs.statSync.mockReset();
    fs.readFileSync.mockReset();
    fs.statSync = () => { throw new Error(); };

    requestVerification.verifyRequest(expectedContents,expectedCert,expectedSig);

    expect(fs.readFileSync.mock.calls.length).toBe(0);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][0]).toBe(expectedContents);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][1]).toBe(expectedCert);
    expect(DigitalSignatureService.verifyRequest.mock.calls[0][2]).toBe(expectedSig);

  });
});
