<div align="center">
  	<img 
		alt="Diseact logo" 
		src="https://raw.githubusercontent.com/overheat-org/diseact/main/assets/logo.svg"
		height="100"
	>
	<h1>Diseact</h1>
	<p>A package to use JSX in discord.js</p>
</div>

```jsx
import { useState } from 'diseact/hooks';

function Counter() {
    const [count, setCount] = useState(0);

    return <message>
        <embed>
            <title>Counter</title>
            <description>Count: {count}</description>
        </embed>
        <button onClick={() => setCount(count + 1)}>Increment</button>
    </message>;
}
```
## Installation
- Requires a module bundler
```
npm i diseact
```
## Why Diseact?
- JSX directly for embeds, buttons, menus and modals
- Hooks (state, context, effect)
- Reusable Functional Components
- Familiar React API 
- Fully integrated to discord.js
## Documentation
Visit https://diseact.vercel.app to get full documentation.
