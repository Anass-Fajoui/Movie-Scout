import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movies, setMovies] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    useEffect(() => {
        const categoryAPI = `${API_URL}/genre/movie/list?language=en`;
        fetch(categoryAPI, API_OPTIONS)
            .then((res) => res.json())
            .then((data) => setCategories(data.genres))
            .catch((err) => console.log(err.message));
    }, []);
    useEffect(() => {
        setLoading(true);
        const endpoint = debouncedSearchTerm
            ? `${API_URL}/search/movie?query=${encodeURIComponent(
                  debouncedSearchTerm
              )}&with_genres=${selectedCategory}`
            : `${API_URL}/discover/movie?sort_by=popularity.desc&with_genres=${selectedCategory}`;
        fetch(endpoint, API_OPTIONS)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.Response === "False") {
                    setErrorMessage("Failed to fetch movies");
                    setMovies([]);
                    return;
                }
                setMovies(data.results);
                console.log(data.results);
            })
            .catch((err) => setErrorMessage(err.message))
            .finally(() => setLoading(false));
    }, [debouncedSearchTerm, selectedCategory]);
    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span>
                        You'll Enjoy Without the Hassle
                    </h1>
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </header>

                <section className="all-movies">
                    <h2 className="mt-[40px]">All Movies</h2>
                    <select
                        name="category"
                        id=""
                        className="text-white bg-purple-900 p-3 rounded-md"
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                        }}
                    >
                        <option value="">Select Genre</option>
                        {categories.map((c: any) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {Loading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movies.map((movie: any) => (
                                <MovieCard movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

export default App;
