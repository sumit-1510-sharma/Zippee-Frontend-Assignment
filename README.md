Star Wars Explorer

A responsive React + Vite web app that lets you explore Star Wars characters using the SWAPI API.
It includes pagination, dynamic visuals, detailed modals, and extra features like searching, filtering, and mock authentication.



✨ How to Run the Project

1. Clone the Repository
    git clone https://github.com/sumit-1510-sharma/Zippee-Frontend-Assignment.git

2. Navigate to the Project Directory
    cd Zippee-Frontend-Assignment

3. Install Dependencies
    npm install

4. Run the Development Server
    npm run dev

5. Open in Browser
    Visit the URL shown in your terminal (usually http://localhost:5173).

OR

1. Just go to the deployed link (vercel) to see the website working
    link: 


✨ What I Implemented
Core Features

1. Star Wars Characters Data — fetched dynamically from SWAPI API.
2. Pagination — displays 10 characters per page, matching the API’s pagination structure.
3. Loading & Error Handling — clear states for fetching and API errors.
4. Dynamic Images — each character displays a random but consistent image from Picsum Photos.
5. Distinct Background Colors — card colors change based on species.
6. Detailed Modal — clicking a card opens a modal showing more info (including formatted Homeworld details).
7. Responsive Design — optimized for all screen sizes.

Bonus Features

1. Search — supports partial name matching.
2. Filters — filter characters by Homeworld, Film, or Species.
3. Combined Search & Filters — works together for refined results (within the current page).
4. Mock Authentication — implemented using a mock JWT token system.

✨ Trade-offs & Design Choices

Trade-off: Combined search and filtering currently apply only to characters on the current page because the app doesn’t store all data from every page in local state.
Possible Solution: Fetch and cache all pages’ data once (or implement server-side filtering) to enable global filtering and search.
