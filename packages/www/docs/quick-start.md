---
sidebar_position: 1
---

# Quick Start

Welcome to Diseact Documentation. A package to allow you use JSX syntax to create Discord Components and control states with hooks in `discord.js`.

## Why you should to use
- In case you're trying to create an embedded interface, using buttons to navigate through each page of the embed.
- Unite your components, embeds and other props in the same context.
- Better organize your commands, and componentize them (separating subcommands in other files).

## Differences between Diseact and React
- You don't need a lot of native hooks
- Diseact is focused in multiple renders
  - For each command interaction, one render is called
  - You can also use `render` function to render messages without a interaction
- You can use async and await perfectly
  - The rendering process of Diseact is async, you can use async in components without any error
  - We're using the new `async_hooks` package of Node to track each component and apply hooks events