import { Client, ColorResolvable, TextChannel } from 'discord.js';
import Diseact, { useEffect } from '../';
import 'dotenv/config';

const { TEST_CHANNEL, TOKEN } = process.env;

test("Testing components rendering", done => {
	const client = new Client({ intents: ['Guilds', 'GuildMessages'] });
	
	client.once('ready', async () => {
		const channel = await client.channels.fetch(TEST_CHANNEL!) as TextChannel;

		// it("Class Component", done => {
			class MyComponent extends Diseact.Component {
				state = {
					name: '',
					color: 'White'
				}
	
				didMount() {
					setTimeout(() => this.setState({ ...this.state, name: "Nexus" }), 2500);
					setTimeout(() => this.setState({ ...this.state, color: "Red" }), 5000);
				}

				didUpdate(prevProps, prevState): void {
					if(this.state.color === "Red") {
						done();
					}
				}
	
				render() {
					return <opts isMessage>
						<embed color={this.state.color as ColorResolvable}>
							<title>hello {this.state.name}</title>
							<description>How r u?</description>
							<footer>Footer</footer>
						</embed>
					</opts>
				}
			}
			
			Diseact.render(channel, <MyComponent />);
		// }, 1000 * 20);

		// it("Functional Component", done => {
			// function MyComponent() {
			// 	const [name, setName] = Diseact.useState('');
			// 	const [color, setColor] = Diseact.useState('White');

			// 	useEffect(() => {
			// 		setTimeout(() => setName("Nexus"), 2500);
			// 		setTimeout(() => setColor("Red"), 5000);
			// 	}, [])

			// 	useEffect(() => {
			// 		if(color == 'Red') done();
			// 	}, [color])

			// 	return <opts isMessage>
			// 		<embed color={color}>
			// 			<title>hello {name}</title>
			// 			<description>How r u?</description>
			// 			<footer>Footer</footer>
			// 		</embed>
			// 	</opts>
			// }

			// Diseact.render(channel, <MyComponent />)
		// },  1000 * 20);
	});

	client.login(TOKEN);
}, 1000 * 30)