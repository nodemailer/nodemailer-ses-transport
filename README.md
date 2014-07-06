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

  * **accessKeyId** - *optional* AWS access key.
  * **secretAccessKey** - *optional* AWS secret.
  * **sessionToken** - *optional* session token.
  * **region** - *optional* Specify the region to send the service request to. Default to *us-east-1*

**Example**

```javascript
var transport = nodemailer.createTransport(sesTransport({
    AWSAccessKeyID: "AWSACCESSKEY",
    AWSSecretKey: "AWS/Secret/key"
}));
```

## License

**MIT**
