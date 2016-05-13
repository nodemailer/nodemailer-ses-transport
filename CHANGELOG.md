# Changelog

## v1.3.1 2016-05-13

  * Added error handler for broken message generator

## v1.3.0 2016-02-18

  * Replaces jshint with eslint
  * Fix behavior of set option `rateLimit` (yamayo)

## v1.3.0 2015-06-11

Added options `ses` to allow using an existing AWS SES object instead of creating a new one with credentials.

## v1.2.0 2014-09-16

Added option `httpOptions` that maps to the object in underlying AWS.SES constructor. See options [here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html).

## v1.1.0 2014-07-31

Added option `rateLimit` for rate limiting sent messages

## v1.0.0 2014-07-30

Changed aws-sdk versioning from fixed versions to use the caret ^ modifier.

Changed the version scheme to use proper semver instead of 0.x.
