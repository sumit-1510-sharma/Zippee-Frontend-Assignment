export default function Filters({
  searchTerm,
  setSearchTerm,
  selectedHomeworld,
  setSelectedHomeworld,
  homeworlds,
  selectedFilm,
  setSelectedFilm,
  films,
  selectedSpecies,
  setSelectedSpecies,
  speciesList,
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
      />

      <select
        value={selectedHomeworld}
        onChange={(e) => setSelectedHomeworld(e.target.value)}
        className="px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
      >
        <option value="">All Homeworlds</option>
        {homeworlds.map((hw) => (
          <option key={hw}>{hw}</option>
        ))}
      </select>

      <select
        value={selectedFilm}
        onChange={(e) => setSelectedFilm(e.target.value)}
        className="px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
      >
        <option value="">All Films</option>
        {films.map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <select
        value={selectedSpecies}
        onChange={(e) => setSelectedSpecies(e.target.value)}
        className="px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
      >
        <option value="">All Species</option>
        {speciesList.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
