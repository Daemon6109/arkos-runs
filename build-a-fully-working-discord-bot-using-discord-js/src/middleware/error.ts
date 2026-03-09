// src/middleware/error.ts

/**
 * Error handling middleware for command execution.
 * @param commandFunction - The command function to execute.
 * @param interaction - The interaction object.
 * @returns A promise that resolves to the result of the command function.
 */
export async function errorMiddleware<T>(
  commandFunction: (interaction: T) => Promise<void>,
  interaction: T
): Promise<void> {
  try {
    await commandFunction(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}