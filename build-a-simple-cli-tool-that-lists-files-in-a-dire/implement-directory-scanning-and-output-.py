import os
import sys

def main():
    # Determine directory path from command line arguments
    if len(sys.argv) < 2:
        path = '.'  # Default to current directory
    else:
        path = sys.argv[1]

    try:
        # Scan the directory and process entries
        with os.scandir(path) as entries:
            for entry in entries:
                if entry.is_file():
                    # Get file size in bytes
                    file_size = entry.stat().st_size
                    print(f"File: {entry.name} (Size: {file_size} bytes)")
                elif entry.is_dir():
                    print(f"Directory: {entry.name}/")
                else:
                    # Handle other entry types (e.g., symlinks)
                    print(f"Other: {entry.name}")
    except FileNotFoundError:
        print(f"Error: The directory '{path}' does not exist.")
    except PermissionError:
        print(f"Error: Permission denied to access '{path}'.")
    except NotADirectoryError:
        print(f"Error: '{path}' is not a directory.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()