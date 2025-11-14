---
sidebar_position: 5
---
# Hooks
Hooks are special functions that let you "hook into" Diseact features. They allow you to use state and other React features without writing a class.

## useState
The `useState` hook lets you add state to your functional components. Here's an example:

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

In this example, we define a `Counter` component that uses the `useState` hook to manage a `count` state variable. The `setCount` function is used to update the state when the button is clicked.

## useEffect
The `useEffect` hook lets you perform side effects in your components. It is similar to lifecycle methods in class components. Here's an example:

```jsx
import { useState, useEffect } from 'diseact/hooks';

function Timer() {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds(prevSeconds => prevSeconds + 1);
		}, 1000);

		return () => clearInterval(interval); // Cleanup on unmount
	}, []); // Empty dependency array means this effect runs once on mount

	return <message>
		<embed>
			<title>Timer</title>
			<description>Seconds: {seconds}</description>
		</embed>
	</message>;
}
```

In this example, we define a `Timer` component that uses the `useEffect` hook to set up an interval that increments the `seconds` state every second. The cleanup function clears the interval when the component is unmounted.

## Custom Hooks

You can also create your own custom hooks to encapsulate reusable logic. Here's an example of a custom hook that manages a toggle state:

```jsx
import { useState } from 'diseact/hooks';

function useToggle(initialValue = false) {
	const [value, setValue] = useState(initialValue);
	const toggle = () => setValue(v => !v);
	return [value, toggle];
}

function ToggleComponent() {
	const [isToggled, toggle] = useToggle();

	return <message>
		<embed>
			<title>Toggle</title>
			<description>{isToggled ? 'ON' : 'OFF'}</description>
		</embed>
		<button onClick={toggle}>Toggle</button>
	</message>;
}
```