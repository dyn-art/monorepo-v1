import { Events, InteractionType, ModalSubmitInteraction } from 'discord.js';
import { TEventMeta } from '../Event';

export default {
  type: Events.InteractionCreate,
  shouldExecuteCallback: (interaction) =>
    interaction.type === InteractionType.ModalSubmit,
  callback: async (instance, interaction: ModalSubmitInteraction) => {
    const { componentsHandler } = instance;
    if (componentsHandler == null) {
      return;
    }

    // Get Modal Component
    const modalComponent = componentsHandler?.modals.get(interaction.customId);
    if (modalComponent == null) {
      return;
    }

    // Call callback
    modalComponent.meta.callback({
      interaction,
      modalComponent: modalComponent as any,
    });
  },
} as TEventMeta;
