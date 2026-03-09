import { describe, it, expect } from "bun:test";
import { ping, help, roll, avatar } from "../src/commands";

describe("Command Handlers", () => {
  describe("ping", () => {
    it("should return 'Pong!'", () => {
      const interaction = {
        reply: jest.fn(),
      };

      ping(interaction as any);

      expect(interaction.reply).toHaveBeenCalledWith({ content: 'Pong!' });
    });
  });

  describe("help", () => {
    it("should return a list of commands", () => {
      const interaction = {
        reply: jest.fn(),
      };

      help(interaction as any);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: "Available commands: /ping, /help, /roll, /avatar",
      });
    });
  });

  describe("roll", () => {
    it("should return a number between 1 and 6", () => {
      const interaction = {
        reply: jest.fn(),
      };

      roll(interaction as any);

      const replyContent = interaction.reply.mock.calls[0][0].content;
      const number = parseInt(replyContent.split(" ")[1]);

      expect(number).toBeGreaterThanOrEqual(1);
      expect(number).toBeLessThanOrEqual(6);
    });
  });

  describe("avatar", () => {
    it("should return a user's avatar URL", () => {
      const interaction = {
        user: {
          displayAvatarURL: jest.fn().mockReturnValue("avatar_url_here"),
        },
        reply: jest.fn(),
      };

      avatar(interaction as any);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: "Your avatar: avatar_url_here",
      });
    });
  });
});