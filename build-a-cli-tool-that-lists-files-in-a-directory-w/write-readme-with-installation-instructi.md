# DirView  
A CLI tool for scanning directories and displaying file system information with customizable flags and output formatting.

---

## Quick Start  
1. **Install**  
   ```bash
   npm install -g dirview
   ```

2. **Scan a directory**  
   ```bash
   dirview scan /path/to/dir
   ```
   Output example:  
   ```
   NAME        SIZE     MODIFIED              TYPE
   README.md   1.2 KB   2023-10-05 10:00:00  File
   data/       10 MB    2023-10-05 09:30:00  Folder
   ```

---

## Installation  
Install globally via npm:  
```bash
npm install -g dirview
```

---

## Usage  
### Commands  
- `dirview scan <path>`: Scan a directory and display files/folders.  
- `dirview help`: Show help menu.  

### Flags  
| Flag         | Description                          | Default |
|--------------|--------------------------------------|---------|
| `--format`   | Set output format (e.g., `table`, `json`) | `table` |
| `--sort`     | Sort by `name`, `size`, or `date`    | `name`  |
| `--recursive`| Include subdirectories               | `false` |

Example:  
```bash
dirview scan /home/user/docs --format=json --sort=size
```

---

## Error Guidance  
| Error                          | Description                                                                 | Solution                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `Unknown flag: --<flag>`      | Invalid or unsupported CLI flag.                                            | Check `dirview help` for valid flags.                                   |
| `No such file or directory`   | Provided path does not exist.                                               | Verify the directory path.                                               |
| `Permission denied`           | Insufficient permissions to access the directory.                           | Run with elevated privileges (e.g., `sudo`).                            |
| `Invalid format: <format>`    | Unsupported output format specified.                                        | Use `table` or `json`.                                                   |
| `No files found`              | The scanned directory contains no files or folders matching filters.       | Check the path or adjust filters.                                        |

---

## Contributing  
1. Fork the repo.  
2. Create a feature branch.  
3. Submit a PR with tests and docs.  

---  
*For advanced usage, refer to the unit tests for internal function details.*