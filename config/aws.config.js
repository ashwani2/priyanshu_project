// aws-config.js
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1', // Change this to your preferred AWS region
});

const s3 = new AWS.S3();

module.exports = s3;