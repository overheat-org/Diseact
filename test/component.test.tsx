import { test } from 'node:test';
import { Client, StringSelectMenuInteraction, TextChannel } from 'discord.js';
import Diseact from '..';
import 'dotenv/config';

const { TEST_CHANNEL, TOKEN } = process.env;

test("Testing components rendering", (t, done) => {
	const client = new Client({ intents: ['Guilds', 'GuildMessages'] });
	
	client.once('ready', async () => {
		const channel = await client.channels.fetch(TEST_CHANNEL!) as TextChannel;
			
		function Counter() {
			const [count, setCount] = Diseact.useState(0);

			const handleIncrement = () => {
				setCount(c => c + 1);
			}

			const handleDecrement = () => {
				setCount(c => c - 1);
			}

			return <container isMessage>
				<embed>
					<title>Counter</title>
					<description>Count: {count}</description>
				</embed>

				<button
					isSuccess
					id="increment"
					label='+' 
					onClick={handleIncrement} 
				/>

				<button
					isDanger
					id="decrement"
					label='-'
					onClick={handleDecrement}
				/>
			</container>
		}

		Diseact.render(channel, <Counter />)

		function Options() {
			const [option, setOption] = Diseact.useState<string | null>(null);

			const handleSelection = (i: StringSelectMenuInteraction) => {
				setOption(i.values[0])
			}

			return <container isMessage>
				<embed>
					<title>Options</title>
					<description>{option ? `Selected: ${option}`: 'Nothing'}</description>
				</embed>
				
				<selectmenu isString max={1} id='selectmenu' placeholder="Select" onSelect={handleSelection}>
					<option value='cat' label='Cat'>It's a cat</option>
					<option value='dog' label='Dog'>It's a dog</option>
				</selectmenu>
			</container>
		}

		// Diseact.render(channel, <Options />)
	});

	client.login(TOKEN);
})