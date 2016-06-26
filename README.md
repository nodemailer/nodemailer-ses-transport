# SES transport module for Nodemailer

Applies for [Nodemailer](http://www.nodemailer.com/) v1+ and not for v0.x where transports are built-in.

## Warning about AWS tokens

It has been reported that keys that have special symbols in it (ie. slash /) probably do not work and return signature errors. To overcome this, try to generate keys with only letters and numbers.

## Usage

Install with npm

    npm install nodemailer-ses-transport

Require to your script

```javascript
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
```

Create a Nodemailer transport object

```javascript
var transporter = nodemailer.createTransport(sesTransport(options))
```

Where

  * **options** defines connection data
    * **ses** - instantiated AWS SES object. If not provided then one is generated automatically using the other options
    * **accessKeyId** - *optional* AWS access key. Not used if `options.ses` is set.
    * **secretAccessKey** - *optional* AWS secret. Not used if `options.ses` is set.
    * **sessionToken** - *optional* session token. Not used if `options.ses` is set.
    * **region** - *optional* Specify the region to send the service request to. Defaults to *us-east-1*. Not used if `options.ses` is set.
    * **httpOptions** - A set of options to pass to the low-level AWS HTTP request. See options in the [AWS-SES docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html). Not used if `options.ses` is set.
    * **rateLimit** - *optional* Specify the amount of messages that [can be sent in 1 second](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/limits.html). For example if you want to send at most 5 messages in a second, set this value to 5. If you do not set it, rate limiting is not applied and messages are sent out immediately.
    * **maxConnections** - *optional* Specify the maximum number of messages to be "in-flight" at any one point in time. Useful for preventing suffocation of an internet connection when sending lots of messages.

### Examples

**Example 1.** Use AWS credentials to set up the sender

```javascript
var transport = nodemailer.createTransport(sesTransport({
    accessKeyId: "AWSACCESSKEY",
    secretAccessKey: "AWS/Secret/key",
    rateLimit: 5 // do not send more than 5 messages in a second
}));
```

**Example 2.** Use already existing AWS SES object instance

```javascript
var ses = new AWS.SES({accessKeyId:....});
var transport = nodemailer.createTransport(sesTransport({
    ses: ses
}));
```

## License

**MIT**
