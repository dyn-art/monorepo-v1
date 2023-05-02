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
    const key = interaction.customId;
    const modalComponent = componentsHandler.modals.get(key);
    if (modalComponent == null) {
      return;
    }

    // Call callback and remove
    modalComponent.meta.callback({
      interaction,
      modalComponent,
    });
    if (modalComponent.meta.removeAfterSubmit) {
      componentsHandler.removeModal(key);
    }
  },
} as TEventMeta;
