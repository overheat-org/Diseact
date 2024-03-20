import { ButtonStyle, ColorResolvable } from "discord.js";
import { UnionSelectMenu } from ".";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"option": {
				value: string
				description?: string
				label?: string
				emoji?: string
				default?: boolean
			}
			
			"selectmenu": UnionSelectMenu
			"row": {}
			"button": {
				id: string
				disabled?: boolean
				emoji?: string
				label?: string
			} & (
				| { variant: ButtonStyle.Link, url: string }
				| { variant: ButtonStyle.Danger | ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Danger }
			)
			"embed": {
				color?: ColorResolvable
				timestamp?: Date | number
			}
			"title": {}
			"description": {}
			"author": {
				iconURL?: string
				url?: string
			}
			"image": {}
			"thumbnail": {}
			"footer": {
				iconURL?: string
			}
			"field": {
				name: string
				inline?: boolean
			}
			"fields": {}
		}
	}
}
