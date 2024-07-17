# Diseact

Diseact is a JavaScript library for create components/embeds/commands of Discord API using JSX.

# Why is useful?

- In case you trying create a embedded interface, using buttons to navegate for each pages of embed.
- To union your components, embeds and other props in the same context.
- To organize better your commands, and componentize us (separating subcommands in other files).

Use:
```tsx
const modal = <modal id='myModal' title='My Modal'>
	<textinput id='favoriteColorInput' style={TextInputStyle.Short}>
		What's your favorite color?
	</textinput>
	
	<textinput id='hobbiesInput' style={TextInputStyle.Paragraph}>
		What's some of your favorite hobbies?
	</textinput>
</modal>
```
instead:
```tsx
const modal = new ModalBuilder()
	.setCustomId('myModal')
	.setTitle('My Modal');

const favoriteColorInput = new TextInputBuilder()
	.setCustomId('favoriteColorInput')
	.setLabel("What's your favorite color?")
	.setStyle(TextInputStyle.Short);

const hobbiesInput = new TextInputBuilder()
	.setCustomId('hobbiesInput')
	.setLabel("What's some of your favorite hobbies?")
	.setStyle(TextInputStyle.Paragraph);

const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

modal.addComponents(firstActionRow, secondActionRow);
```
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

see the documentation below:

# Embeds

For start, we can learn about create a embed. Downside, is all possibilities you can do using Diseact to create a embed.

```jsx
const myEmbed = (
  <embed color="White" timestamp={new Date()}>
    <author url="https://example.com/" iconURL="https://example.com/">
      John
    </author>
    <title>My Embed</title>
    <description>Testing this embed</description>
    <fields>
      <field name="tested" inline>
        true
      </field>
    </fields>
    <image>https://example.com/</image>
    <thumbnail>https://example.com/</thumbnail>
    <footer iconURL="https://example.com/">footer</footer>
  </embed>
);
```

But we have a problem. JSX Elements need the render function and be involved with a component to works.

### Weird Way to use JSX Elements of Diseact

You can use Diseact parser function to transform JSX Element in Discord Element.

```jsx
const embed = Diseact.parse(
  <embed color="White" timestamp={new Date()}>
    ...
  </embed>
);

// output: [EmbedBuilder]
```

# Components

We can make a functional component returning a message container. And inside of our container, we can place embeds, buttons or selectmenus. You don't need to pass a action row, Diseact organize components in action row by type.

```js
function MyComponent() {
  <container isMessage tts enforceNonce allowedMentions={{}}>
    <embed>
      <title>My Component</title>
    </embed>

    <button isPrimary label="My button" />

    <selectmenu isString max={1} min={1} placeholder="Select anything">
      <option value="cat" label="Cat">
        It's a cat
      </option>
      <option value="dog" label="Dog">
        It's a dog
      </option>
    </selectmenu>
  </container>;
}
```

Some properties are showed, but have more.

> Id is optional in every discord component. If you don't put an id, Diseact will generate a unique id and use as custom id.

# Hooks

Diseact have two hooks, like `useEffect` and `useState`, you can do something like:

```js
function Counter() {
  const [count, setCount] = Diseact.useState(0);

  const handleIncrement = () => {
    setCount((c) => c + 1);
  };

  const handleDecrement = () => {
    setCount((c) => c - 1);
  };

  return (
    <container isMessage>
      <embed>
        <title>Counter</title>
        <description>Count: {count}</description>
      </embed>

      <button
        isSuccess
        id="increment"
        label="Add"
        emoji="➕"
        onClick={handleIncrement}
      />

      <button
        isDanger
        id="decrement"
        label="Reduce"
        emoji="➖"
        onClick={handleDecrement}
      />
    </container>
  );
}
```

Note button have `onClick` property, expecting a function with a interaction argument, like it:

```js
const handleButton = (interaction) => {
  return "Success! Button has been pressed";
};
```

You can return a `string` or `InteractionReplyOptions`. Diseact will send it back with `interaction.reply`. If you not insert a return value, the interaction will be responding with void value, for discord not send an error. Like `<button/>`, `<modal/>` and `<selectmenu/>` have functions in parameters too. `OnSubmit` for modal, and `OnSelect` for selectmenu. Working the same way of `OnClick`.

# Rendering

To render our component we can do:

```js
Diseact.render(channel, <MyComponent />);
```

The first parameter on render function, is a target. This property can be a `TextChannel`, `Message` or `CommandInteraction`. The second parameter, is a component to render. Easy peazy!

In first render, Diseact will use `channel.send`, `message.channel.send` or `interaction.reply` to send the first message. After, for each render, the message is edited with `message.edit` or `interaction.editReply`.
