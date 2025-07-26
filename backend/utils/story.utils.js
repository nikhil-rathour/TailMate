const { deleteImage } = require('../services/gcs.service');

/**
 * Extract filename from GCS URL
 * @param {string} url - The GCS URL
 * @returns {string} - The filename
 */
const extractFilenameFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Extract filename from GCS URL format: https://storage.googleapis.com/bucket-name/filename
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return null;
  }
};

/**
 * Delete media file from GCS if it exists
 * @param {string} mediaUrl - The media URL to delete
 */
const deleteMediaFile = async (mediaUrl) => {
  if (!mediaUrl) return;
  
  try {
    const filename = extractFilenameFromUrl(mediaUrl);
    if (filename) {
      await deleteImage(filename);
      console.log(`Deleted media file: ${filename}`);
    }
  } catch (error) {
    console.error('Error deleting media file:', error);
    // Don't throw error as this is cleanup operation
  }
};

module.exports = {
  extractFilenameFromUrl,
  deleteMediaFile
};