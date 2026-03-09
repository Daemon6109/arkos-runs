// src/dirList.js
const fs = require('fs').promises;
const path = require('path');

/**
 * Lists the contents of the specified directory.
 * @param {string} directoryPath - The path to the directory to list.
 */
async function listDirectory(directoryPath) {
  try {
    // Read the directory contents
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);
      // Output file name and type (directory or file)
      console.log(`${file} ${stats.isDirectory() ? '(DIR)' : 'FILE'}`);
    }
  } catch (err) {
    // Handle errors reading the directory
    console.error(`Error reading directory ${directoryPath}: ${err.message}`);
  }
}

module.exports = { listDirectory };