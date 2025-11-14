import { jsx } from '@jsx-oh/discord/jsx-runtime';
import { useState, useEffect } from '@jsx-oh/discord/hooks';

var ping = jsx("command", { name: "ping", children: jsx("subcommand", { name: "discord", children: function (i) {
            var _a = useState(''), state = _a[0], setState = _a[1];
            useEffect(function () {
                setTimeout(function () {
                    console.log('CHANGING STATE NOW');
                    setState('!');
                }, 1000);
            }, []);
            return "Pong".concat(state);
        } }) });

export { ping as default };
