import { useState } from "@jsx-oh/discord/hooks";

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

        <row>
            <button
                id="counter-plus"
                success
                label='+'
                onClick={handleIncrement}
            />

            <button
                id="counter-minus"
                danger
                label='-'
                onClick={handleDecrement}
            />
        </row>
    </message>
}

export default Counter;
