import {join} from 'path';

import * as s3 from 's3';

const output = join(__dirname, '..', 'output');

const client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION
  }
});
const uploader = client.uploadDir({
  localDir: output,
  deleteRemoved: true,
  s3Params: {
    Bucket: process.env.S3_BUCKET,
    Prefix: ''
  }
});
uploader.on('error', err => {
  console.error('unable to sync');
  console.error(err.stack);
  process.exitCode = 1;
});
uploader.on('end', () => {
  console.log('done uploading website');
});
