---
## sidebar_position: 3
---
# Discord Components

You can create Discord components in JSX using **Diseact**.

## Button

```jsx
<button id="my button" onClick={handler} secondary disabled emoji="🫠">
	Button Text
</button>
```

You can choose one of the button types (you must pick one):

* `primary`
* `secondary`
* `success`
* `danger`
* `premium`
* `link`

The first five expect an `onClick` callback, which is triggered when the user clicks the button (receiving the interaction as a parameter).
The `link` type expects a `url` property, which is where the user will be redirected when clicking it.

You don’t need to define the `id` (custom_id); it’s automatically generated if omitted.

---

## Select Menu

```jsx
<selectmenu string max={1} placeholder="Select" onSelect={handler}>
  <option value="cat" label="Cat">It's a cat</option>
  <option value="dog" label="Dog">It's a dog</option>
</selectmenu>
```

On the Discord API, select menus are separated by type, but in **Diseact** you can choose it easily using a property:

* `string`
* `mentionable`
* `role`
* `channel`
* `user`

The `onSelect` callback is called when the user makes a selection, receiving the interaction as a parameter.
You can also use `min` and `max` to control the number of selectable options.

---

## Modal

```jsx
<modal id="feedback" title="Feedback Form" onSubmit={handler}>
  <textinput id="name" label="Your Name" required />
  <textinput id="feedback" label="Your Feedback" paragraph required />
</modal>
```

Modals are popup windows with text fields.
The `onSubmit` callback is triggered when the user submits the modal.
You can include multiple **textinputs** inside.

---

## TextInput

```jsx
<textinput
  id="username"
  label="Username"
  placeholder="Type your username"
  minLength={3}
  maxLength={20}
  required
/>
```

Available properties:

* `id` — field identifier (required)
* `label` — text shown above the field
* `placeholder` — hint text
* `required` — makes the field mandatory
* `paragraph` — turns the input into a multi-line field
* `minLength` / `maxLength` — sets input length limits

---

These components work declaratively, allowing you to build **Discord interfaces** entirely in JSX, with the simplicity and power of **Diseact**.
