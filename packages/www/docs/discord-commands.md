---

## sidebar_position: 6

---

# Discord Commands

With **Diseact**, you can declaratively define **commands**, **subcommands**, and **subcommand groups** using JSX — keeping your code structured, readable, and React-like.

Every command, subcommand, or group is itself a **component** that can use hooks and return either a **string** or an **interaction element**.

## Basic Command

```jsx
<command name="ping">
  {() => {
    return (
      <interaction ephemeral>
        pong!
      </interaction>
    );
  }}
</command>
```

Each command’s logic is defined inside its **children** (a function component).
You **cannot use** `reply()` directly — Diseact automatically manages replies.
If you want to send extra messages after the first response, use **`followUp()`**.

---

## Subcommands

```jsx
<command name="animal" description="Animal commands">
  <subcommand name="cat" description="Sends a cat picture">
    {() => <interaction>🐱 Meow!</interaction>}
  </subcommand>

  <subcommand name="dog" description="Sends a dog picture">
    {() => <interaction>🐶 Woof!</interaction>}
  </subcommand>
</command>
```

Each `<subcommand>` works as its own component, capable of using hooks and returning interactions or text.

---

## Subcommand Groups

```jsx
<command name="admin" description="Admin tools">
  <group name="user" description="User management">
    <subcommand name="ban" description="Ban a user">
      {() => <interaction>User banned.</interaction>}
    </subcommand>

    <subcommand name="kick" description="Kick a user">
      {() => <interaction>User kicked.</interaction>}
    </subcommand>
  </group>
</command>
```

Subcommand groups (`<group>`) are containers for related subcommands, allowing deeper nesting and cleaner organization.

---

## Command Props

### **Common Props** (`CommandBased`)

| Prop            | Type                    | Description                                |
| --------------- | ----------------------- | ------------------------------------------ |
| `name`          | `string`                | Command name (required)                    |
| `description`   | `string`                | Shown in the Discord command list          |
| `localizations` | `{ name, description }` | Localized versions of name and description |
| `children`      | Function or JSX         | Handler function or nested structure       |

---

### **Command Props** (`Command`)

| Prop        | Type            | Description                       |
| ----------- | --------------- | --------------------------------- |
| `nsfw`      | `boolean`       | Marks command as NSFW             |
| `ephemeral` | `boolean`       | Makes default responses ephemeral |
| `children`  | Function or JSX | Can be a component or subcommands |

---

### **SubCommand Props** (`SubCommand`)

Same as `Command`, but used inside a command or a group.

---

### **SubCommandGroup Props** (`SubCommandGroup`)

| Prop          | Type                    | Description                        |
| ------------- | ----------------------- | ---------------------------------- |
| `name`        | `string`                | Group name                         |
| `description` | `string`                | Group description                  |
| `children`    | `<subcommand>` elements | Subcommands contained in the group |

---

## Options

Options define input parameters for your commands.

```jsx
<command name="say" description="Make the bot repeat your message">
  <string name="text" description="Message to repeat" required />
  {({ options }) => (
    <interaction>{options.getString("text")}</interaction>
  )}
</command>
```

### Available Option Types

| Type              | Description                       |
| ----------------- | --------------------------------- |
| `<string />`      | Text input, supports autocomplete |
| `<number />`      | Decimal number                    |
| `<integer />`     | Whole number                      |
| `<boolean />`     | True/false                        |
| `<channel />`     | Channel selector                  |
| `<user />`        | User selector                     |
| `<role />`        | Role selector                     |
| `<mentionable />` | User or role                      |
| `<attachment />`  | File upload                       |

### Option Props (`OptionBased`)

| Prop           | Type                       | Description                    |
| -------------- | -------------------------- | ------------------------------ |
| `name`         | `string`                   | Option name                    |
| `description`  | `string`                   | Description shown in Discord   |
| `optional`     | `boolean`                  | Makes the option optional      |
| `min` / `max`  | `number`                   | Range limits (numbers/strings) |
| `autocomplete` | `(interaction) => unknown` | Autocomplete handler           |

---

Diseact commands behave like **React components** — they can use hooks, manage state, and return JSX representing **Discord interactions**, creating a natural development experience for slash commands.
