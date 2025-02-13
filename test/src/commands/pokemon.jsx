import * as Diseact from 'diseact';
import Pokemon from '../components/Pokemon.js';

export default (
    <command name="pokemon" description="Show a pokemon">
        <string name="id" description="Your pokemon name or id" optional />

        {(interaction) => {
            const id = interaction.options.get('id')?.value ?? Math.floor(Math.random() * 1010) + 1;

            Diseact.render(interaction, <Pokemon id={id} />)
        }}
    </command>
)