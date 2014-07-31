'use strict';

var AWS = require('aws-sdk');
var packageData = require('../package.json');

// expose to the world
module.exports = function(options) {
    return new SESTransport(options);
};

/**
 * <p>Generates a Transport object for Amazon SES with aws-sdk</p>
 *
 * <p>Possible options can be the following:</p>
 *
 * <ul>
 *     <li><b>accessKeyId</b> - AWS access key (optional)</li>
 *     <li><b>secretAccessKey</b> - AWS secret (optional)</li>
 *     <li><b>region</b> - optional region (defaults to <code>'us-east-1'</code>)
 * </ul>
 *
 * @constructor
 * @param {Object} optional config parameter for the AWS SES service
 */
function SESTransport(options) {
    options = options || {};

    var pattern = /(.*)email(.*)\.(.*).amazonaws.com/i,
        result = pattern.exec(options.ServiceUrl);

    this.options = options;
    this.options.accessKeyId = options.accessKeyId || options.AWSAccessKeyID;
    this.options.secretAccessKey = options.secretAccessKey || options.AWSSecretKey;
    this.options.sessionToken = options.sessionToken || options.AWSSecurityToken;
    this.options.apiVersion = '2010-12-01';
    this.options.region = options.region || (result && result[3]) || 'us-east-1';

    this.options.rateLimit = Number(options.rateLimit) || false;
    this.queue = [];
    this.sending = false;

    this.name = 'SES';
    this.version = packageData.version;

    this.ses = new AWS.SES(this.options);
}

/**
 * Appends the message to the queue if rate limiting is used, or passes directly to the sending function
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function to run when the sending is completed
 */
SESTransport.prototype.send = function(mail, callback) {
    // SES strips this header line by itself
    mail.message.keepBcc = true;

    if (this.options.rateLimit) {
        this.queue.push({
            mail: mail,
            callback: callback
        });
        this.processQueue();
    } else {
        this.sendMessage(mail, callback);
    }
};

/**
 * Sends the next message from the queue
 */
SESTransport.prototype.processQueue = function() {
    if (this.sending) {
        return;
    }

    if (!this.queue.length) {
        return;
    }

    this.sending = true;
    var item = this.queue.shift();
    var startTime = Date.now();

    this.sendMessage(item.mail, function() {
        var args = Array.prototype.slice.call(arguments);
        var timeDelta = Date.now() - startTime;

        if (typeof item.callback === 'function') {
            setImmediate(function() {
                item.callback.apply(null, args);
            });
        }

        if (timeDelta >= 1000 / this.options.rateLimit) {
            this.sending = false;
            setImmediate(this.processQueue.bind(this));
        } else {
            setTimeout(function() {
                this.sending = false;
                this.processQueue();
            }.bind(this), Math.ceil(1000 / this.options.rateLimit - timeDelta));
        }
    }.bind(this));
};

/**
 * <p>Compiles a BuildMail message and forwards it to handler that sends it.</p>
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function to run when the sending is completed
 */
SESTransport.prototype.sendMessage = function(mail, callback) {
    this.generateMessage(mail.message.createReadStream(), (function(err, raw) {
        if (err) {
            return typeof callback === 'function' && callback(err);
        }
        this.handleMessage(mail, raw, callback);
    }).bind(this));
};

/**
 * <p>Compiles and sends the request to SES with e-mail data</p>
 *
 * @param {Object} mail Mail object
 * @param {String} raw Compiled raw e-mail as a string
 * @param {Function} callback Callback function to run once the message has been sent
 */
SESTransport.prototype.handleMessage = function(mail, raw, callback) {
    var params = {
        RawMessage: { // required
            Data: new Buffer(raw, 'utf-8') // required
        }
    };
    this.ses.sendRawEmail(params, function(err, data) {
        this.responseHandler(err, mail, data, callback);
    }.bind(this));
};

/**
 * <p>Handles the response for the HTTP request to SES</p>
 *
 * @param {Object} err Error object returned from the request
 * @param {Object} mail Mail object
 * @param {Object} data De-serialized data returned from the request
 * @param {Function} callback Callback function to run on end
 */
SESTransport.prototype.responseHandler = function(err, mail, data, callback) {
    if (err) {
        if (!(err instanceof Error)) {
            err = new Error('Email failed: ' + err);
        }
        return typeof callback === 'function' && callback(err, null);
    }
    return typeof callback === 'function' && callback(null, {
        envelope: mail.data.envelope || mail.message.getEnvelope(),
        messageId: data && data.MessageId && data.MessageId + '@email.amazonses.com'
    });
};

/**
 * <p>Compiles the BuildMail object to a string.</p>
 *
 * <p>SES requires strings as parameter so the message needs to be fully composed as a string.</p>
 *
 * @param {Object} mailStream BuildMail stream
 * @param {Function} callback Callback function to run once the message has been compiled
 */

SESTransport.prototype.generateMessage = function(mailStream, callback) {
    var chunks = [];
    var chunklen = 0;

    mailStream.on('data', function(chunk) {
        chunks.push(chunk);
        chunklen += chunk.length;
    });

    mailStream.on('end', function() {
        callback(null, Buffer.concat(chunks, chunklen).toString());
    });
};