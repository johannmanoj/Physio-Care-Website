const AWS = require('aws-sdk');
require('dotenv').config();

// DigitalOcean Spaces config
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.DO_SPACE_ENDPOINT),
  accessKeyId: process.env.DO_SPACE_KEY,
  secretAccessKey: process.env.DO_SPACE_SECRET,
});

/**
 * Upload a file buffer to DigitalOcean Spaces
 * @param {Buffer} fileBuffer - The file buffer
 * @param {String} fileName - Name to save in Spaces
 * @param {String} mimeType - File MIME type
 * @returns {Promise<String>} - Public URL of uploaded file
 */

async function uploadToSpaces(fileBuffer, fileName, mimeType, type) {
  var file_path = `files/common/${fileName}`

  type == "invoices" && (file_path = `files/invoice/${fileName}`)
  type == "medical_files" && (file_path = `files/medical_files/${fileName}`)

  const params = {
    Bucket: process.env.DO_SPACE_NAME,
    Key: file_path,
    Body: fileBuffer,
    ACL: 'public-read',
    ContentType: mimeType,
    ContentDisposition: 'inline',
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

module.exports = { uploadToSpaces };
