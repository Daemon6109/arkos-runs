import { describe, it, expect } from "bun:test";
import { run } from '../src/cli';
import { parseConfig } from '../src/config';
import { validateOptions } from '../src/validation';
import { displayHelp } from '../src/help';

// Mocking functions for testing
jest.mock('../src/config', () => ({
  parseConfig: jest.fn(),
}));

jest.mock('../src/validation', () => ({
  validateOptions: jest.fn(),
}));

jest.mock('../src/generator', () => ({
  generatePassword: jest.fn(),
}));

jest.mock('../src/help', () => ({
  displayHelp: jest.fn(),
}));

describe('CLI Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display help when help option is provided', async () => {
    const argv = ['--help'];
    parseConfig.mockReturnValue({ help: true });

    await run(argv);

    expect(parseConfig).toHaveBeenCalledWith(argv);
    expect(displayHelp).toHaveBeenCalled();
    expect(validateOptions).not.toHaveBeenCalled();
    expect(generatePassword).not.toHaveBeenCalled();
  });

  it('should display error and help when validation fails', async () => {
    const argv = ['--length', '-1'];
    parseConfig.mockReturnValue({ length: -1 });
    validateOptions.mockReturnValue({ error: 'Invalid length', validOptions: null });

    await run(argv);

    expect(parseConfig).toHaveBeenCalledWith(argv);
    expect(validateOptions).toHaveBeenCalledWith({ length: -1 });
    expect(displayHelp).toHaveBeenCalled();
    expect(generatePassword).not.toHaveBeenCalled();
  });

  it('should generate and display a password when options are valid', async () => {
    const argv = ['--length', '12', '--includeUppercase', '--includeLowercase', '--includeNumbers', '--includeSpecialChars'];
    const mockConfig = {
      length: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
    };
    const mockPassword = 'MockPassword123!';
    parseConfig.mockReturnValue(mockConfig);
    validateOptions.mockReturnValue({ error: null, validOptions: mockConfig });
    generatePassword.mockReturnValue(mockPassword);

    await run(argv);

    expect(parseConfig).toHaveBeenCalledWith(argv);
    expect(validateOptions).toHaveBeenCalledWith(mockConfig);
    expect(generatePassword).toHaveBeenCalledWith(mockConfig);
    expect(console.log).toHaveBeenCalledWith(`Generated Password: ${mockPassword}`);
    expect(displayHelp).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors gracefully', async () => {
    const argv = ['--length', '12'];
    const mockConfig = {
      length: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialChars: true,
    };
    parseConfig.mockReturnValue(mockConfig);
    validateOptions.mockReturnValue({ error: null, validOptions: mockConfig });
    generatePassword.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await run(argv);

    expect(parseConfig).toHaveBeenCalledWith(argv);
    expect(validateOptions).toHaveBeenCalledWith(mockConfig);
    expect(generatePassword).toHaveBeenCalledWith(mockConfig);
    expect(console.error).toHaveBeenCalledWith('An unexpected error occurred: Unexpected error');
    expect(displayHelp).toHaveBeenCalled();
  });
});