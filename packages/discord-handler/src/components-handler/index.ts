// TODO:
// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isModalSubmit()) return;
// 	if (interaction.customId === 'myModal') {
// 		await interaction.reply({ content: 'Your submission was received successfully!' });
// 	}
// });

import ComponentsHandler from './ComponentsHandler';
import CommandType from './ComponentType';

export * from './component-types';
export * from './component-types/BaseComponent';
export * from './ComponentsHandler';
export * from './ComponentType';
export { ComponentsHandler, CommandType };
