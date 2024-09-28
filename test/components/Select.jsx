const Diseact = require("diseact");

function Select() {
    const [option, setOption] = Diseact.useState(null);

    const handleSelection = (i) => {
        setOption(i.values[0])
    }

    return <message>
        <embed>
            <title>Options</title>
            <description>{option ? `Selected: ${option}` : 'Nothing'}</description>
        </embed>

        <selectmenu isString max={1} placeholder="Select" onSelect={handleSelection}>
            <option value='cat' label='Cat'>It's a cat</option>
            <option value='dog' label='Dog'>It's a dog</option>
        </selectmenu>
    </message>
}

module.exports = Select