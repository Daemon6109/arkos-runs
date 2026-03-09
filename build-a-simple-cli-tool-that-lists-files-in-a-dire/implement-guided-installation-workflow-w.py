import shutil
import subprocess
import sys

def detect_package_manager():
    """
    Detects the installed package manager from a predefined list.
    Returns the name of the detected package manager or None if none is found.
    """
    # Order of preference: yarn > pnpm > npm > bun
    package_managers = ['yarn', 'pnpm', 'npm', 'bun']
    for pm in package_managers:
        if shutil.which(pm) is not None:
            return pm
    return None

def install_dependencies(pm):
    """
    Installs project dependencies using the specified package manager.
    Raises an exception if the installation fails.
    """
    try:
        if pm == 'npm':
            subprocess.run(['npm', 'install'], check=True)
        elif pm == 'yarn':
            subprocess.run(['yarn', 'install'], check=True)
        elif pm == 'pnpm':
            subprocess.run(['pnpm', 'install'], check=True)
        elif pm == 'bun':
            subprocess.run(['bun', 'install'], check=True)
        else:
            raise ValueError(f"Unsupported package manager: {pm}")
        print(f"Successfully installed dependencies using {pm}.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install dependencies with {pm}: {e}")
        sys.exit(1)

def main():
    """
    Main function to execute the guided installation workflow.
    """
    print("Welcome to DirList installation wizard.")
    print("Detecting package manager...")

    pm = detect_package_manager()

    if pm:
        print(f"Detected package manager: {pm}")
        while True:
            confirmation = input(f"Proceed with installation using {pm}? (y/n): ").lower()
            if confirmation == 'y':
                print(f"Installing dependencies with {pm}...")
                install_dependencies(pm)
                print("Installation completed successfully.")
                break
            elif confirmation == 'n':
                print("Installation cancelled by user.")
                break
            else:
                print("Invalid input. Please enter 'y' or 'n'.")
    else:
        print("No supported package manager found.")
        print("Please install one of the following: npm, yarn, pnpm, or bun.")
        sys.exit(1)

if __name__ == "__main__":
    main()