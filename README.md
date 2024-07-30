# Diseact

Diseact is a Javascript library created to easily build components, embeds and commands from the Discord API using JSX.

# Why is it useful?

- In case you're trying to create an embedded interface, using buttons to navigate through each page of the embed.
- Unite your components, embeds and other props in the same context.
- Better organize your commands, and componentize them (separating subcommands in other files).

Use:

```tsx
const modal = (
  <modal id="myModal" title="My Modal">
    <textinput id="favoriteColorInput" style={TextInputStyle.Short}>
      What's your favorite color?
    </textinput>

    <textinput id="hobbiesInput" style={TextInputStyle.Paragraph}>
      What's some of your favorite hobbies?
    </textinput>
  </modal>
);
```

Instead:

```tsx
const modal = new ModalBuilder().setCustomId("myModal").setTitle("My Modal");

const favoriteColorInput = new TextInputBuilder()
  .setCustomId("favoriteColorInput")
  .setLabel("What's your favorite color?")
  .setStyle(TextInputStyle.Short);

const hobbiesInput = new TextInputBuilder()
  .setCustomId("hobbiesInput")
  .setLabel("What's some of your favorite hobbies?")
  .setStyle(TextInputStyle.Paragraph);

const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

modal.addComponents(firstActionRow, secondActionRow);
```

# How to Use:

- Install Diseact on your project:

```
npm i diseact
```

- In your `jsconfig.json` or `tsconfig.json` file, set:

```jsonc
{
  "compilerOptions": {
    "jsxFactory": "Diseact.createElement",
    "jsx": "react"
    // ...
  }
}
```

or use babel:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "diseact"
      }
    ]
  ]
}
```

- Import Diseact on your JSX/TSX file:

```jsx
import Diseact from "diseact";

const myEmbed = (
  <embed>
    <title>Hello from Diseact!</title>
  </embed>
);
```

> If you are using babel with runtime setted to automatic, you don't need to import diseact to use JSX

See the Documentation below:

# Embeds

To start, we can learn about creating an embed.

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

message.send({ embeds: [myEmbed] });
```

# Components

We can make a functional component that returns a message container. And inside our container, we can place embeds, buttons or select menus. You don't need to pass an action row, Diseact organize components in action row by type.

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

Some properties are shown, but we have more.

> ID is optional in every Discord component. If you don't provide an ID, Diseact will generate one and use it.

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

Note: The button has a `onClick` property, expecting a function with an interaction argument, like it:

```js
const handleButton = (interaction) => {
  return "Success! Button has been pressed";
};
```

You can return a `string` or `InteractionReplyOptions`. Diseact will send it back with `interaction.reply`. If you don't insert a return value, the interaction will be replied with a void value to avoid Discord sending errors. Like `<button/>`, `<modal/>` and `<selectmenu/>` have functions in parameters too. `OnSubmit` for modal, and `OnSelect` for select menu. Working the same way as `OnClick`.

# Rendering

To render our component, we can do:

```js
Diseact.render(channel, <MyComponent />);
```

The first parameter in the render function, is a target. This property can be a `TextChannel`, `Message` or `CommandInteraction`. The second parameter is a component to render. Easy peazy!

In the first render, Diseact will use `channel.send`, `message.channel.send` or `interaction.reply` to send the first message. After each render, the message is edited with `message.edit` or `interaction.editReply`.

# Commands

We can use JSX to create Commands:

```jsx
export default (
  <command name="ping">
    {(interaction) => {
      interaction.reply("Pong!");
    }}
  </command>
);
```

You can pass subcommands and groups too:

```jsx
export default (
  <command name="member">
    <subcommand name="ban">
      <user name="target">
      <string name="reason" optional>

      {(interaction) => {
        ...
      }}
    </subcommand>

    <subcommand name="unban">
      <user name="target">

      {(interaction) => {
        ...
      }}
    </subcommand>

    <group name="meta">
      <subcommand name="set">
        ...
      </subcommand>
    </group>
  </command>
)
```

And Define localizations:

```jsx
const localizations = {
  name: { "pt-BR": "Olá" }
}

export default <command localizations={localizations} />
```
## Handling
Hold on, working on now...