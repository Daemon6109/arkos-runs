import { Collection } from 'discord.js';
import { Command } from './types';

/**
 * CommandRegistry class to manage and register commands.
 */
export class CommandRegistry {
  private commands: Collection<string, Command>;

  constructor() {
    this.commands = new Collection();
  }

  /**
   * Registers a command.
   * @param command - The command to register.
   */
  registerCommand(command: Command): void {
    if (this.commands.has(command.name)) {
      throw new Error(`Command with name "${command.name}" already exists.`);
    }
    this.commands.set(command.name, command);
  }

  /**
   * Gets a command by its name.
   * @param name - The name of the command.
   * @returns The command if found, otherwise undefined.
   */
  getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  /**
   * Gets all registered commands.
   * @returns An array of all registered commands.
   */
  getAllCommands(): Command[] {
    return this.commands.array();
  }
}

/**
 * Creates and returns a new CommandRegistry instance.
 * @returns A new CommandRegistry instance.
 */
export function createCommandCollection(): CommandRegistry {
  return new CommandRegistry();
}