# SES transport module for Nodemailer

Applies for Nodemailer v1.x and not for v0.x where transports are built-in.

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
    * **accessKeyId** - *optional* AWS access key.
    * **secretAccessKey** - *optional* AWS secret.
    * **sessionToken** - *optional* session token.
    * **region** - *optional* Specify the region to send the service request to. Default to *us-east-1*
    * **rateLimit** - *optional* Specify the amount of messages that [can be sent in 1 second](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/limits.html). For example if you want to send at most 5 messages in a second, set this value to 5. If you do not set it, rate limiting is not applied and messages are sent out immediatelly.

**Example**

```javascript
var transport = nodemailer.createTransport(sesTransport({
    accessKeyId: "AWSACCESSKEY",
    secretAccessKey: "AWS/Secret/key",
    rateLimit: 1 // do not send more than 1 message in a second
}));
```

## License

**MIT**
