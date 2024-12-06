import { useState, useEffect } from "diseact";

function Pokemon({ id }) {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(r => r.json())
            .then(d => void (setPokemon(d), setLoading(false)))
            .catch(e => void (setError(e), setLoading(false)));
    }, [id]);

    return <interaction>
        {loading
            ? (
                <embed>
                    <title>Carregando...</title>
                </embed>
            )
            : pokemon 
                ? (
                    <embed>
                        <title>{pokemon.name}</title>
                        <image>{pokemon.sprites.front_default}</image>
                    </embed>
                )
                : (
                    <embed>
                        <title>An error ocurred</title>
                        <description>{JSON.stringify(error)}</description> 
                    </embed>
                )
        }
    </interaction> 
}

export default Pokemon;