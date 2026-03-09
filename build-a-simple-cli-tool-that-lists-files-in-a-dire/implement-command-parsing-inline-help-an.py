import os
import readline
import sys

# Define available commands and their help information
commands = {
    'list': {
        'description': 'List directory contents',
        'args': ['path'],
        'help': 'Usage: list [path]\nLists the contents of the specified directory.'
    },
    'help': {
        'description': 'Display help information',
        'args': ['command'],
        'help': 'Usage: help [command]\nDisplays help for the specified command.'
    },
    'exit': {
        'description': 'Exit the application',
        'args': [],
        'help': 'Usage: exit\nExits the DirList application.'
    }
}

def complete(text, state):
    """Tab completion function for readline."""
    if state == 0:
        matches = []
        tokens = text.split()
        
        # Handle command completion
        if not tokens:
            for cmd in commands:
                if cmd.startswith(text):
                    matches.append(cmd)
        else:
            first_token = tokens[0]
            if first_token.startswith(text):
                if first_token in commands:
                    # Handle argument completion
                    args = commands[first_token]['args']
                    if len(args) > 0:
                        if len(tokens) > 1:
                            arg_part = tokens[1]
                            try:
                                # Check if the path exists
                                if os.path.isdir(arg_part):
                                    # Suggest subdirectories
                                    for name in os.listdir(arg_part):
                                        if os.path.isdir(os.path.join(arg_part, name)):
                                            matches.append(os.path.join(arg_part, name))
                                else:
                                    # Suggest directories in current working directory
                                    for name in os.listdir():
                                        if os.path.isdir(name) and name.startswith(arg_part):
                                            matches.append(name)
                            except PermissionError:
                                pass
                        else:
                            # No argument yet, suggest directories in current working directory
                            for name in os.listdir():
                                if os.path.isdir(name) and name.startswith(text):
                                    matches.append(name)
                else:
                    # First token is not a valid command, suggest commands
                    for cmd in commands:
                        if cmd.startswith(text):
                            matches.append(cmd)
            else:
                # First token is not a partial match, suggest commands
                for cmd in commands:
                    if cmd.startswith(text):
                        matches.append(cmd)
        
        # Return the next match or None
        if state < len(matches):
            return matches[state]
        else:
            return None
    else:
        return None

# Set up readline for tab completion
readline.set_completer(complete)
readline.parse_and_bind("tab: complete")

def main():
    """Main loop for the DirList application."""
    print("Welcome to DirList. Type 'help' for a list of commands.")
    while True:
        try:
            line = input("DirList> ")
        except KeyboardInterrupt:
            print("\nUse 'exit' to quit.")
            continue
        if not line:
            continue
        tokens = line.split()
        if not tokens:
            continue
        cmd = tokens[0]

        if cmd == 'help':
            if len(tokens) == 1:
                print("Available commands:")
                for c in commands:
                    print(f"  {c}: {commands[c]['description']}")
            elif len(tokens) == 2:
                arg = tokens[1]
                if arg in commands:
                    print(commands[arg]['help'])
                else:
                    print(f"Unknown command: {arg}")
            else:
                print("Usage: help [command]")
        elif cmd == 'exit':
            print("Exiting DirList. Goodbye!")
            break
        elif cmd == 'list':
            if len(tokens) == 1:
                try:
                    for name in os.listdir():
                        print(name)
                except PermissionError:
                    print("Permission denied.")
            elif len(tokens) == 2:
                path = tokens[1]
                try:
                    for name in os.listdir(path):
                        print(name)
                except FileNotFoundError:
                    print(f"Directory not found: {path}")
                except PermissionError:
                    print(f"Permission denied: {path}")
            else:
                print("Usage: list [path]")
        else:
            print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()