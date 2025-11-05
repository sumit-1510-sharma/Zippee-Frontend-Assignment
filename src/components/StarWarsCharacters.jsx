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
      Human: "bg-sky-700",
      Droid: "bg-yellow-800",
      Wookiee: "bg-[#454d32]",
      Rodian: "bg-[#45615a]",
      Hutt: "bg-[#625f46]",
      "Yoda's species": "bg-[#55683b]",
      Trandoshan: "bg-[#3b5054]",
      MonCalamari: "bg-[#45626d]",
      Ewok: "bg-[#74624a]",
      Sullustan: "bg-[#494949]",
      Neimodian: "bg-[#374c4c]",
      Gungan: "bg-[#458288]",
      Toydarian: "bg-[#4c5070]",
      Dug: "bg-[#663e47]",
      "Twi'lek": "bg-[#7c587d]",
      Kaleesh: "bg-[#725a68]",
      Kaminoan: "bg-[#485259]",
      Geonosian: "bg-[#808271]",
      Clawdite: "bg-[#50736f]",
      Togruta: "bg-[#635370]",
      Mirialan: "bg-[#647d65]",
      Zabrak: "bg-[#703d41]",
      "Kel Dor": "bg-[#85644b]",
      Chagrian: "bg-[#3a4a63]",
      Quarren: "bg-[#455c5c]",
      Nautolan: "bg-[#36615f]",
      Cerean: "bg-[#868261]",
      Besalisk: "bg-[#4b4b49]",
      Iktotchi: "bg-[#816178]",
      Tholothian: "bg-[#57607c]",
      Vulptereen: "bg-[#675459]",
      Aleena: "bg-[#478080]",
      Lannik: "bg-[#938f5b]",
      Xexto: "bg-[#5c7c76]",
      Skakoan: "bg-[#7badb2]",
      "Togruta (Alt)": "bg-[#766b8a]",
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
      setSearchTerm("");
      setSelectedHomeworld("");
      setSelectedFilm("");
      setSelectedSpecies("");
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

        const nonHumanSpecies = withDetails.flatMap((c) =>
          c.speciesData.map((s) => s.name)
        );
        const hasHuman = withDetails.some(
          (c) => !c.speciesData || c.speciesData.length === 0
        );
        const spSet = new Set(nonHumanSpecies);
        if (hasHuman) {
          spSet.add("Human");
        }

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
