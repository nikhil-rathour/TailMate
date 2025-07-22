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
  const blob = bucket.file(fileName);
  const stream = blob.createWriteStream({ resumable: false, contentType: mimetype });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', async () => {
      // Do NOT call makePublic() if uniform bucket-level access is enabled
      resolve(getPublicUrl(fileName));
    });
    stream.end(fileBuffer);
  });
}

function getPublicUrl(fileName) {
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

// Optionally, delete an image from GCS
async function deleteImage(fileName) {
  await bucket.file(fileName).delete();
}

module.exports = { uploadImage, getPublicUrl, deleteImage }; 