import { Transport } from 'nodemailer';
import * as AWS from 'aws-sdk';

declare namespace sesTransport {
  interface SesTransportOptions {
    ses: AWS.SES;
    rateLimit?: number;
    maxConnections?: number;
  }
}

declare function sesTransport(options: sesTransport.SesTransportOptions): Transport

export = sesTransport;
