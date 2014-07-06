'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sesTransport = require('../src/ses-transport');
chai.Assertion.includeStack = true;

function MockBuilder(envelope, message) {
    this.envelope = envelope;
    this.message = new(require('stream').PassThrough)();
    this.message.end(message);
}

MockBuilder.prototype.getEnvelope = function() {
    return this.envelope;
};

MockBuilder.prototype.createReadStream = function() {
    return this.message;
};

describe('SES Transport Tests', function() {
    it('Should expose version number', function() {
        var client = sesTransport();
        expect(client.name).to.exist;
        expect(client.version).to.exist;
    });

    it('Should send message', function(done) {
        var client = sesTransport({
            AWSAccessKeyID: "AWSACCESSKEY",
            AWSSecretKey: "AWS/Secret/key"
        });

        sinon.stub(client.ses, 'sendRawEmail').yields(null, {
            MessageId: 'abc'
        });

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@valid.sender',
                to: 'test@valid.recipient'
            }, 'message')
        }, function(err, data) {
            expect(err).to.not.exist;
            expect(data.messageId).to.equal('abc@email.amazonses.com');
            expect(client.ses.sendRawEmail.args[0][0]).to.deep.equal({
                RawMessage: {
                    Data: new Buffer('message')
                }
            });
            client.ses.sendRawEmail.restore();
            done();
        });
    });
});