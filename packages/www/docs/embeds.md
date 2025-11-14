---

sidebar_position: 3

---

# Embeds

Diseact lets you create **Discord embeds** in a clean and declarative way using JSX.
This makes your embed structure more readable and easier to maintain than the traditional object syntax.

## Basic Example

```jsx
const embed = (
  <embed color="White" timestamp={new Date()}>
    <author url="https://example.com/" iconURL="https://example.com/avatar.png">
      John
    </author>

    <title>My Embed</title>
    <description>Testing this embed</description>

    <fields>
      <field name="A random field" inline>
        With a random value
      </field>
    </fields>

    <image>https://example.com/image.png</image>
    <thumbnail>https://example.com/thumb.png</thumbnail>

    <footer iconURL="https://example.com/footer.png">Footer text</footer>
  </embed>
);
```

Then send it like any regular embed:

```jsx
channel.send({ embeds: [embed] });
```

---

## Embed Elements

### `<embed />`

The root element.
**Props:**

* `color` — any valid Discord embed color (name or hex).
* `timestamp` — sets the timestamp shown on the footer.

---

### `<author />`

Defines the embed’s author section.
**Props:**

* `url` — clickable link on the author name.
* `iconURL` — small image displayed next to the author.

---

### `<title />`

Sets the embed title.
You can optionally make it clickable by adding the `url` prop.

---

### `<description />`

Defines the main text area of the embed. Supports Markdown.

---

### `<fields />` and `<field />`

Used to organize structured data in the embed.
Each `<field>` has:

* `name` — field title.
* `inline` — whether the field should be displayed side by side.

---

### `<image />` and `<thumbnail />`

Embed media components.
Both accept a single child (the image URL).

---

### `<footer />`

Displays text and an optional icon at the bottom.
**Props:**

* `iconURL` — small image next to the footer text.

---

## Tip

Embeds are fully composable, meaning you can reuse and dynamically generate them:

```jsx
function UserEmbed({ user }) {
  return (
    <embed color="Blurple">
      <author iconURL={user.avatarURL()}>{user.username}</author>
      <description>Joined at {user.joinedAt.toDateString()}</description>
    </embed>
  );
}
```

Diseact handles the JSX-to-Discord conversion for you — just focus on writing clean, declarative UI.