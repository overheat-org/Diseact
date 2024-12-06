import { useState, useEffect } from "diseact";
import { jsx as _jsx, jsxs as _jsxs } from "diseact/jsx-runtime";
function Pokemon({
  id
}) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()).then(d => void (setPokemon(d), setLoading(false))).catch(e => void (setError(e), setLoading(false)));
  }, [id]);
  return _jsx("interaction", {
    children: loading ? _jsx("embed", {
      children: _jsx("title", {
        children: "Carregando..."
      })
    }) : pokemon ? _jsxs("embed", {
      children: [_jsx("title", {
        children: pokemon.name
      }), _jsx("image", {
        children: pokemon.sprites.front_default
      })]
    }) : _jsxs("embed", {
      children: [_jsx("title", {
        children: "An error ocurred"
      }), _jsx("description", {
        children: JSON.stringify(error)
      })]
    })
  });
}
export default Pokemon;