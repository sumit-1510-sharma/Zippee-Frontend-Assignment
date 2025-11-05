import React, { useEffect, useState, useMemo } from "react";
import Filters from "./Filters.jsx";
import CharacterGrid from "./CharacterGrid.jsx";
import Pagination from "./Pagination.jsx";
import CharacterModal from "./CharacterModal.jsx";

export default function StarWarsCharacters() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHomeworld, setSelectedHomeworld] = useState("");
  const [selectedFilm, setSelectedFilm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");

  const [homeworlds, setHomeworlds] = useState([]);
  const [films, setFilms] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);

  const speciesColors = useMemo(
    () => ({
      Human: "bg-blue-700",
      Droid: "bg-gray-700",
      Wookiee: "bg-amber-700",
      Rodian: "bg-green-700",
      Hutt: "bg-yellow-700",
      "Yoda's species": "bg-lime-700",
      Trandoshan: "bg-green-800",
      MonCalamari: "bg-sky-700",
      Ewok: "bg-orange-700",
      Sullustan: "bg-stone-700",
      Neimodian: "bg-teal-700",
      Gungan: "bg-cyan-700",
      Toydarian: "bg-indigo-700",
      Dug: "bg-red-700",
      "Twi'lek": "bg-fuchsia-700",
      Kaleesh: "bg-rose-700",
      Kaminoan: "bg-slate-700",
      Geonosian: "bg-amber-800",
      Clawdite: "bg-emerald-700",
      Togruta: "bg-purple-700",
      Mirialan: "bg-green-600",
      Zabrak: "bg-red-800",
      "Kel Dor": "bg-orange-800",
      Chagrian: "bg-blue-800",
      Quarren: "bg-teal-800",
      Nautolan: "bg-emerald-800",
      Cerean: "bg-yellow-800",
      Besalisk: "bg-stone-800",
      Iktotchi: "bg-pink-700",
      Tholothian: "bg-indigo-800",
      Vulptereen: "bg-red-600",
      Aleena: "bg-teal-600",
      Lannik: "bg-amber-600",
      Xexto: "bg-emerald-600",
      Skakoan: "bg-cyan-600",
      "Togruta (Alt)": "bg-purple-600",
    }),
    []
  );

  const getSpeciesName = (char) =>
    char.speciesData?.length > 0 ? char.speciesData[0].name : "Human";

  const getCharacterImage = (char, width = 80, height = 80) =>
    `https://picsum.photos/seed/${encodeURIComponent(
      char.name
    )}/${width}/${height}`;

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch character list");
        const data = await res.json();
        setTotalPages(Math.ceil(data.count / 10));

        const withDetails = await Promise.all(
          data.results.map(async (char) => {
            try {
              const homeworldRes = await fetch(char.homeworld);
              if (!homeworldRes.ok)
                throw new Error("Failed to fetch homeworld");
              const homeworld = await homeworldRes.json();

              const filmsData = await Promise.all(
                char.films.map(async (f) => {
                  const filmsRes = await fetch(f);
                  if (!filmsRes.ok) throw new Error("Failed to fetch film");
                  return await filmsRes.json();
                })
              );

              const speciesData = await Promise.all(
                char.species.map(async (s) => {
                  const speciesRes = await fetch(s);
                  if (!speciesRes.ok)
                    throw new Error("Failed to fetch species data");
                  return await speciesRes.json();
                })
              );

              return {
                ...char,
                homeworldDetails: homeworld,
                filmsData,
                speciesData,
                dateAdded: new Date().toISOString(),
              };
            } catch (errInner) {
              throw new Error(
                `Error fetching details for character "${char.name}": ${errInner.message}`
              );
            }
          })
        );

        setCharacters(withDetails);

        const hwSet = new Set(withDetails.map((c) => c.homeworldDetails.name));
        const filmSet = new Set(
          withDetails.flatMap((c) => c.filmsData.map((f) => f.title))
        );
        const spSet = new Set(
          withDetails.flatMap((c) => c.speciesData.map((s) => s.name))
        );

        setHomeworlds([...hwSet]);
        setFilms([...filmSet]);
        setSpeciesList([...spSet]);
      } catch (err) {
        setError(
          err && err.message ? err.message : "An unknown error occurred."
        );
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [page]);

  const filteredCharacters = characters.filter((char) => {
    const matchesSearch = char.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesHomeworld =
      !selectedHomeworld || char.homeworldDetails?.name === selectedHomeworld;
    const matchesFilm =
      !selectedFilm || char.filmsData?.some((f) => f.title === selectedFilm);
    const matchesSpecies =
      !selectedSpecies || getSpeciesName(char) === selectedSpecies;
    return matchesSearch && matchesHomeworld && matchesFilm && matchesSpecies;
  });

  const getSpeciesBg = (species) => speciesColors[species] || "bg-gray-800";

  return (
    <div className="p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-6">
        Star Wars Characters
      </h1>

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedHomeworld={selectedHomeworld}
        setSelectedHomeworld={setSelectedHomeworld}
        homeworlds={homeworlds}
        selectedFilm={selectedFilm}
        setSelectedFilm={setSelectedFilm}
        films={films}
        selectedSpecies={selectedSpecies}
        setSelectedSpecies={setSelectedSpecies}
        speciesList={speciesList}
      />

      {error ? (
        <div className="text-center text-red-500 mb-4">{error}</div>
      ) : loading ? (
        <div className="text-center text-yellow-400">Loading...</div>
      ) : (
        <CharacterGrid
          characters={filteredCharacters}
          getSpeciesName={getSpeciesName}
          getCharacterImage={getCharacterImage}
          getSpeciesBg={getSpeciesBg}
          onSelect={setSelectedCharacter}
        />
      )}

      {!loading && !error && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}

      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          getCharacterImage={getCharacterImage}
          getSpeciesName={getSpeciesName}
        />
      )}
    </div>
  );
}
