import CharacterCard from "./CharacterCard.jsx";

export default function CharacterGrid({
  characters,
  getSpeciesName,
  getCharacterImage,
  getSpeciesBg,
  onSelect,
}) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((character) => {
          const species = getSpeciesName(character);
          return (
            <CharacterCard
              key={character.name}
              character={character}
              species={species}
              bgClass={getSpeciesBg(species)}
              onSelect={() => onSelect(character)}
              getCharacterImage={getCharacterImage}
            />
          );
        })}
      </div>
    </div>
  );
}
