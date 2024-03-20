import DJS from "discord.js";
import { UnionSelectMenu } from ".";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"modal": {
				id: string
				title: string
			},
			"textinput": {
				id: string
				label?: string
				style: DJS.TextInputStyle
				placeholder?: string
				minLength?: number
				maxLength?: number
				value?: string
				required?: boolean
			}
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
				| { variant: DJS.ButtonStyle.Link, url: string }
				| { variant: DJS.ButtonStyle.Danger | DJS.ButtonStyle.Primary | DJS.ButtonStyle.Secondary | DJS.ButtonStyle.Danger }
			)
			"embed": {
				color?: DJS.ColorResolvable
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
