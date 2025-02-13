import { useState } from "diseact";

function Counter() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(c => c + 1);
    }

    const handleDecrement = () => {
        setCount(c => c - 1);
    }

    return <message>
        <embed>
            <title>Counter</title>
            <description>Count: {count}</description>
        </embed>

        <button
            success
            label='+'
            onClick={handleIncrement}
        />

        <button
            danger
            label='-'
            onClick={handleDecrement}
        />
    </message>
}

export default Counter;