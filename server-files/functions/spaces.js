// utils/spaces.js
const AWS = require('aws-sdk');
require('dotenv').config();

// DigitalOcean Spaces config
const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.DO_SPACE_ENDPOINT), // e.g. blr1.digitaloceanspaces.com
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
async function uploadToSpaces(fileBuffer, fileName, mimeType) {
  const params = {
    Bucket: process.env.DO_SPACE_NAME, // Space name
    Key: `uploads/${fileName}`,        // Path inside Space
    Body: fileBuffer,
    ACL: 'public-read',
    ContentType: mimeType,
    ContentDisposition: 'inline',
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

module.exports = { uploadToSpaces };
