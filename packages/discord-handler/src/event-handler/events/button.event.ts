import { ButtonInteraction, Events } from 'discord.js';
import { TEventMeta } from '../Event';

export default {
  type: Events.InteractionCreate,
  shouldExecuteCallback: (interaction) => interaction.isButton(),
  callback: async (instance, interaction: ButtonInteraction) => {
    const { componentsHandler } = instance;
    if (componentsHandler == null) {
      return;
    }

    // Get Button Component
    const key = interaction.customId;
    const buttonComponent = componentsHandler.buttons.get(key);
    if (buttonComponent == null) {
      return;
    }

    // Call callback and remove
    buttonComponent.meta.callback({
      interaction,
      buttonComponent,
    });
    if (buttonComponent.meta.removeAfterSubmit) {
      componentsHandler.removeButton(key);
    }
  },
} as TEventMeta;
