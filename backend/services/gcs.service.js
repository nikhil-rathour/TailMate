const { Storage } = require('@google-cloud/storage');
const path = require('path');

// cloude secrets

const credentials = {
  type: process.env.GCS_TYPE,
  project_id: process.env.GCS_PROJECT_ID,
  private_key_id: process.env.GCS_PRIVATE_KEY_ID,
  private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GCS_CLIENT_EMAIL,
  client_id: process.env.GCS_CLIENT_ID,
};
const bucketName = process.env.GCS_BUCKET_NAME || 'tailmate-images';

const storage = new Storage({ credentials });
const bucket = storage.bucket(bucketName);

// Uploads a file buffer to GCS and returns the public URL
async function uploadImage(fileBuffer, fileName, mimetype) {
  try {
    const blob = bucket.file(fileName);
    const stream = blob.createWriteStream({ 
      resumable: false, 
      contentType: mimetype,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('GCS upload error:', err);
        reject(new Error(`Failed to upload file: ${err.message}`));
      });
      stream.on('finish', async () => {
        console.log(`File uploaded successfully: ${fileName}`);
        resolve(getPublicUrl(fileName));
      });
      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error('GCS upload setup error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

function getPublicUrl(fileName) {
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

// Delete an image from GCS
async function deleteImage(fileName) {
  try {
    await bucket.file(fileName).delete();
    console.log(`File deleted successfully: ${fileName}`);
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    // Don't throw error for cleanup operations
  }
}

module.exports = { uploadImage, getPublicUrl, deleteImage }; 