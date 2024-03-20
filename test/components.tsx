import { ButtonStyle, ChannelType, TextInputStyle } from "discord.js";
import Diseact, { SelectMenuVariant } from "..";

const buttons = <row>
	<button id="btn" variant={ButtonStyle.Primary}>My btn</button>
	<button id="btn2" variant={ButtonStyle.Link} url="https://example.com/">URL</button>
</row>

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

const modal = <modal id="modal" title="My modal">
	<row>
		<textinput id="" style={TextInputStyle.Short} required>Write here: </textinput>
	</row>
</modal>

console.log({ buttons, menus, modal })