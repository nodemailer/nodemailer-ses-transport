import { Transport } from 'nodemailer';
import * as AWS from 'aws-sdk';

export interface SesTransportOptions {
    ses: AWS.SES;
    rateLimit?: number;
    maxConnections?: number;
}

export function sesTransport(options: SesTransportOptions): Transport
