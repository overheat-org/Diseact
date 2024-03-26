import Diseact from '../';
import { EmbedBuilder } from 'discord.js';

test("generate embed with JSX", done => {
	const _embed_jsx = (
		<embed color='White'>
			<author url='https://example.com/' iconURL='https://example.com/'>John</author>
			<title>My Embed</title>
			<description>Testing this embed</description>
			<fields>
				<field name="tested" inline>true</field>
			</fields>
			<image>https://example.com/</image>
			<thumbnail>https://example.com/</thumbnail>
			<footer iconURL='https://example.com/'>footer</footer>
		</embed>
	);

	const _embed = new EmbedBuilder()
		.setAuthor({ name: 'John', iconURL: 'https://example.com/', url: 'https://example.com/' })
		.setTitle("My Embed")
		.setDescription("Testing this embed")
		.setFields({ name: 'tested', value: 'true', inline: true })
		.setImage('https://example.com/')
		.setThumbnail('https://example.com/')
		.setFooter({ text: 'footer', iconURL: 'https://example.com/' })
		.setColor('White')

	expect(_embed_jsx).toMatchObject(_embed);
	done()
});