Diseact is a JavaScript library for create components/embeds/commands of Discord API using JSX.

# How to use
1- Install the package on your project:
```
npm i diseact
```
2- In your `jsconfig.json` or `tsconfig.json` file, set:
```jsonc
{
	"compilerOptions": {
		"jsxFactory": "Diseact.createElement",
		"jsx": "react"
		// ...
	}
}
```
3- Import Diseact on your jsx/tsx file:
```jsx
import Diseact from 'diseact';

const myEmbed = <embed>
	<title>Hello from Diseact!</title>
</embed>
```
---
# Documentation
## JSX Elements

#### `<modal>`

Creates a modal component.

- Props:
  - `id`: string
  - `title`: string
- Children: `<row>`
#### `<textinput>`

Creates a text input component.

- Props:
  - `id`: string
  - `label`: string (optional)
  - `style`: DJS.TextInputStyle
  - `placeholder`: string (optional)
  - `minLength`: number (optional)
  - `maxLength`: number (optional)
  - `value`: string (optional)
  - `required`: boolean (optional)
- Children: string

#### `<option>`

Creates an option component.

- Props:
  - `value`: string
  - `description`: string (optional)
  - `label`: string (optional)
  - `emoji`: string (optional)
  - `default`: boolean (optional)
- Children: string

#### `<selectmenu>`

Creates a select menu component.

- Props: Refer to `UnionSelectMenu` type.
- Children: string | `<option>`

#### `<row>`

Creates a row component.
- Children: `<button>` | `<selectmenu>` | `<textinput>`

#### `<button>`

Creates a button component.

- Props:
  - `id`: string
  - `disabled`: boolean (optional)
  - `emoji`: string (optional)
  - `label`: string (optional)
  - Variant: Can be of type `DJS.ButtonStyle.Link`, `DJS.ButtonStyle.Danger`, `DJS.ButtonStyle.Primary`, or `DJS.ButtonStyle.Secondary`
- Children: string

#### `<embed>`

Creates an embed component.

- Props:
  - `color`: DJS.ColorResolvable
  - `timestamp`: Date | number
- Children: `<title>` | `<description>` | `<author>` | `<image>` | `<thumbnail>` | `<footer>` | `<field>` | `<fields>`

#### `<title>`

Creates a title component.

- Children: string

#### `<description>`

Creates a description component.

- Children: string

#### `<author>`

Creates an author component.

- Props:
  - `iconURL`: string (optional)
  - `url`: string (optional)
- Children: string

#### `<image>`

Creates an image component.

- Children: URL

#### `<thumbnail>`

Creates a thumbnail component.

- Children: URL

#### `<footer>`

Creates a footer component.

- Props:
  - `iconURL`: string (optional)
- Children: string

#### `<field>`

Creates a field component.

- Props:
  - `name`: string
  - `inline`: boolean (optional)
- Children: string

#### `<fields>`

Creates a fields component.

---
