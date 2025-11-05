export default function CharacterCard({
    character,
    species,
    bgClass,
    onSelect,
    getCharacterImage,
  }) {
    return (
      <div
        onClick={onSelect}
        className={`cursor-pointer ${bgClass} border border-gray-700 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-yellow-400/20 transition-all`}
      >
        <img
          src={getCharacterImage(character, 96, 96)}
          alt={character.name}
          className="w-24 h-24 object-contain bg-white rounded-full p-px mx-auto mb-2"
        />
        <h3 className="text-lg font-semibold text-white">{character.name}</h3>
        <p className="text-sm text-gray-200 italic">{species}</p>
      </div>
    );
  }
  