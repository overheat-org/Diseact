import { useEffect, useState } from '@jsx-oh/discord/hooks';

export default <command name="ping">
    <subcommand name="discord">
        {i => {
            const [state, setState] = useState('');

            useEffect(() => {
                setTimeout(() => {
                    console.log('CHANGING STATE NOW')
                    setState('!')
                }, 1000)
            }, []);

            return `Pong${state}`;
        }}
    </subcommand>
</command>
