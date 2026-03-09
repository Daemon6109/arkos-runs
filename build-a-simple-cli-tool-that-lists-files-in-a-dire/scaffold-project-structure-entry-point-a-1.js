// bin/dirlist.js
#!/usr/bin/env node
// Entry point for DirList CLI tool
const dirList = require('../src/dirList');

// Execute the directory listing with the provided path or current directory
(async () => {
  await dirList.listDirectory(process.argv[2] || '.');
})();