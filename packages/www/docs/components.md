---
sidebar_position: 4
---
# Components

Just like React, Diseact provides components to help you build your UI.

## Basic Component

A component is a function that returns JSX. Here's an example of a simple component:

```jsx
function MyComponent() {
    return <message>
        <embed>
            <title>Hello, Diseact!</title>
        </embed>
    </message>;
}
```
You can use `interaction` component to handle interactions instead message:
```jsx
function MyInteraction() {
    return <interaction ephemeral>
        <embed>
            <title>A random interaction response</title>
        </embed>
    </interaction>
}
```
## Render Component

To render a component, you can use the `render` function from Diseact. Here's how to render the `MyComponent` we defined earlier:

```jsx
Diseact.render(channel, <MyComponent />);
```
The first parameter in the render function, is a target. This property can be a `TextChannel`, `Message` or `ChatInputCommandInteraction`. The second parameter is a component to render.

:::info
In the first render, Diseact will use `channel.send`, `message.channel.send` or `interaction.reply` to send the first message. After each render, the message is edited with `message.edit` or `interaction.editReply`.
:::

The difference between use jsx directly and use a component with renderization is that with a component, you can use hooks to manage state and lifecycle methods. You'll learn more about hooks in the next section.