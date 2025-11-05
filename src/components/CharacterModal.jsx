export default function CharacterModal({
    character,
    onClose,
    getCharacterImage,
    getSpeciesName,
  }) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        onClick={onClose}
      >
        <div
          className="bg-gray-900 border-gray-700 border rounded-xl p-8 mx-2 sm:mx-0 max-w-md w-full relative shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-yellow-400 text-2xl font-bold hover:text-yellow-200 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
  
          <div className="flex flex-col items-center mb-4">
            <img
              src={getCharacterImage(character, 96, 96)}
              alt={character.name}
              className="w-24 h-24 object-contain bg-white p-px rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold text-yellow-300 mb-2 text-center">
              {character.name}
            </h2>
            <div className="text-sm mt-1 text-gray-200 italic">
              {getSpeciesName(character)}
            </div>
          </div>
  
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-bold text-gray-300">Height:</span>{" "}
              {(character.height / 100).toFixed(2)} m
            </li>
            <li>
              <span className="font-bold text-gray-300">Mass:</span>{" "}
              {character.mass} kg
            </li>
            <li>
              <span className="font-bold text-gray-300">Date Added:</span>{" "}
              {new Date(character.dateAdded).toLocaleDateString("en-GB")}
            </li>
            <li>
              <span className="font-bold text-gray-300">Films:</span>{" "}
              {character.filmsData.length}
            </li>
            <li>
              <span className="font-bold text-gray-300">Birth Year:</span>{" "}
              {character.birth_year}
            </li>
            <li>
              <span className="font-bold text-gray-300">Homeworld:</span>{" "}
              {character.homeworldDetails.name} (
              {character.homeworldDetails.terrain},{" "}
              {character.homeworldDetails.climate}) - Population:{" "}
              {character.homeworldDetails.population}
            </li>
          </ul>
        </div>
      </div>
    );
  }
  