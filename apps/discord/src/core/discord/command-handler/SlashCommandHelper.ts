import {
  ApplicationCommandManager,
  ApplicationCommandOption,
  Client,
  GuildApplicationCommandManager,
} from 'discord.js';

export default class SlashCommandHelper {
  private _client: Client;

  constructor(client: Client) {
    this._client = client;
  }

  public async getCommands(): Promise<ApplicationCommandManager | null>;
  public async getCommands(
    guildId: string
  ): Promise<GuildApplicationCommandManager | null>;
  public async getCommands(
    guildId?: string
  ): Promise<ApplicationCommandManager | GuildApplicationCommandManager | null>;
  public async getCommands(guildId?: string) {
    let commands;

    if (guildId != null) {
      const guild = await this._client.guilds.fetch(guildId);
      commands = guild.commands;
    } else {
      commands = this._client.application?.commands ?? null;
    }

    if (commands != null) {
      await commands.fetch();
    }

    return commands;
  }

  private areOptionsDifferent(
    options: ApplicationCommandOption[],
    existingOptions: ApplicationCommandOption[]
  ): boolean {
    if (options.length !== existingOptions.length) return true;

    return options.some((option, index) => {
      const existing = existingOptions[index];
      return (
        option.name !== existing.name ||
        option.type !== existing.type ||
        option.description !== existing.description
      );
    });
  }

  public async create(
    name: string,
    description: string,
    options: ApplicationCommandOption[],
    guildId?: string
  ) {
    const commands = await this.getCommands(guildId);
    if (commands == null) {
      console.error(
        `Failed to create slash command with name '${name}'! Could not find commands for guild ${guildId} or application.`
      );
      return;
    }

    // Find already existing/registered Command with the same name
    const existingCommand = commands.cache.find(
      (command) => command.name === name
    );

    // Update existing Command
    if (existingCommand != null) {
      const { description: existingDescription, options: existingOptions } =
        existingCommand;
      if (
        description !== existingDescription ||
        this.areOptionsDifferent(options, existingOptions)
      ) {
        console.info(`Updating existing SlashCommand with the name '${name}'.`);
        await commands.edit(existingCommand.id, {
          description,
          options,
        });
      }
      return;
    }

    // Create new Command
    console.info(`Create new SlashCommand with the name '${name}'.`);
    await commands.create({
      name,
      description,
      options,
    });
  }

  public async delete(name: string, guildId?: string): Promise<boolean> {
    const commands = await this.getCommands(guildId);
    if (commands == null) return false;

    const existingCommand = commands.cache.find((cmd) => cmd.name === name);
    if (existingCommand == null) return false;

    await existingCommand.delete();
    return true;
  }
}
