const Diseact = require("diseact");

function Counter() {
    const [count, setCount] = Diseact.useState(0);

    const handleIncrement = () => {
        setCount(c => c + 1);
    }

    const handleDecrement = () => {
        setCount(c => c - 1);
    }

    return <container isMessage>
        <embed>
            <title>Counter</title>
            <description>Count: {count}</description>
        </embed>

        <button
            isSuccess
            label='+'
            onClick={handleIncrement}
        />

        <button
            isDanger
            label='-'
            onClick={handleDecrement}
        />
    </container>
}

module.exports = Counter;