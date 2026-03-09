import { Client, Events, GatewayIntentBits } from 'discord.js';

export const ready = (client: Client) => {
  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });
};