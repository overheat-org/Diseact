import { useState } from 'diseact';

function ImageGeneration() {
    const [option, setOption] = useState('square');

    const handleSelection = (i) => {
        setOption(i.values[0]);
    }

    return <message>
        <canvas context='2d' height={200} width={400}>
            {option == 'square'
                ? <rectangle x={200} y={100} height={20} width={20} />
                : <circle x={200} y={100} radius={20} />
            }
        </canvas>

        <selectmenu string max={1} placeholder="Select" onSelect={handleSelection}>
            <option value='square'>Square</option>
            <option value='circle'>Circle</option>
        </selectmenu>
    </message>
}

export default ImageGeneration;