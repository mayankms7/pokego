"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PokemonType {
  type: {
    name: string;
  }
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  }
}

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  stats: PokemonStat[];
}

export default function Home() {
  const [search, setSearch] = useState("1");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPokemonTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      fire: "bg-orange-100 text-orange-800 border-orange-300",
      water: "bg-blue-100 text-blue-800 border-blue-300",
      grass: "bg-green-100 text-green-800 border-green-300",
      electric: "bg-yellow-100 text-yellow-800 border-yellow-300",
      psychic: "bg-pink-100 text-pink-800 border-pink-300",
      ice: "bg-cyan-100 text-cyan-800 border-cyan-300",
      dragon: "bg-indigo-100 text-indigo-800 border-indigo-300",
      default: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return typeColors[type] || typeColors.default;
  };

  useEffect(() => {
    if (search) {
      setIsLoading(true);
      fetch(`https://pokeapi.co/api/v2/pokemon/${search}`)
        .then((res) => res.json())
        .then((data: Pokemon) => {
          if ('error' in data) {
            setError('Pokemon not found');
            setPokemon(null);
          } else {
            setPokemon(data);
            setError(null);
          }
        })
        .catch((err) => {
          setError("Failed to fetch Pokémon");
          setPokemon(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [search]);

  return (
    <div className="min-h-screen bg-white justify-center w-screen from-white via-blue-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Pokéball Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-100 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-100 rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8 transform transition-all hover:scale-[1.02]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Pokédex
          </h1>
          <p className="text-gray-500 text-lg">Explore Pokémon Wonders</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder="Search Pokémon by name or ID"
            className="w-full text-black px-5 py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all text-lg"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* Pokemon Display */}
        {pokemon && !isLoading && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col items-center">
              {/* Pokemon Name */}
              <h2 className="text-3xl font-bold text-gray-800 mb-4 capitalize">
                {pokemon.name}
              </h2>

              {/* Pokemon Image */}
              <div className="mb-6 p-4 bg-gray-50 rounded-full">
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={250}
                  height={250}
                  className="transition-transform hover:scale-110"
                />
              </div>

              {/* Pokemon Types */}
              <div className="flex space-x-2 mb-6">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${getPokemonTypeColor(
                      type.type.name
                    )}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              {/* Pokemon Stats */}
              <div className="w-full">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                  Base Stats
                </h3>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <div
                      key={stat.stat.name}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-1/3 text-gray-600 capitalize">
                        {stat.stat.name.replace("-", " ")}
                      </div>
                      <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-right text-gray-700">
                        {stat.base_stat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
