import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Diseact, { SelectMenuVariant } from "../";

test('generate button with JSX', done => {
	const _buttons_jsx = (
		<row>
			<button id="btn" variant={ButtonStyle.Primary}>My btn</button>
			<button variant={ButtonStyle.Link} url="https://example.com/">URL</button>
		</row>
	);

	const _buttons = (
		new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId('btn')
				.setStyle(ButtonStyle.Primary)
				.setLabel('My btn'),
			
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setURL('https://example.com/')
				.setLabel('URL')
		)
	);

	expect(_buttons_jsx).toMatchObject(_buttons);
	done();
})

test('generate menu with JSX', done => {
	// TODO: Finish this
	const menus = <row>
		<selectmenu variant={SelectMenuVariant.String} id="selectmenu" placeholder="Select">
			<option value="one" default>One</option>
			<option value="two">Two</option>
		</selectmenu>

		<selectmenu 
			variant={SelectMenuVariant.User} 
			id="selectmenu2" 
			placeholder="Select User" 
			max={3}
			defaultUsers={[]}
		/>

		<selectmenu
			variant={SelectMenuVariant.Channel}
			id="selectmenu3"
			placeholder="Select Channel"
			min={2}
			defaultChannel={[]}
			channelTypes={[ChannelType.AnnouncementThread, ChannelType.GuildText]}
		/>
	</row>
})

// test('generate modal with JSX', done => {
// 	// TODO: Test not passing
// 	const _modal_jsx = <modal id="modal" title="My modal">
// 		<row>
// 			<textinput id="myText" style={TextInputStyle.Short} required>Write here: </textinput>
// 		</row>
// 	</modal>

// 	const _modal = new ModalBuilder()
// 		.setCustomId('modal')
// 		.setTitle('My modal')
// 		.addComponents(
// 			new ActionRowBuilder<TextInputBuilder>().addComponents(
// 				new TextInputBuilder()
// 					.setCustomId('myText')
// 					.setStyle(TextInputStyle.Short)
// 					.setLabel('Write here:')
// 					.setRequired(true)
// 			)
// 		);

// 	expect(_modal_jsx).toMatchObject(_modal);
// 	done();
// })