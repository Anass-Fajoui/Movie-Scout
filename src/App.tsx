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
    const [movies, setMovies] = useState<any[]>([]);
    const [Loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);

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
            : `${API_URL}/discover/movie?sort_by=popularity.desc&with_genres=${selectedCategory}&page=${page}`;
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
                setMovies((prev) => {
                    console.log(prev)
                    return [...prev, ...data.results]});    
                
                // console.log(data.results);
            })
            .catch((err) => setErrorMessage(err.message))
            .finally(() => setLoading(false));
    }, [debouncedSearchTerm, selectedCategory, page]);
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
                        setMovies={setMovies}
                        setPage={setPage}
                    />
                </header>

                <section className="all-movies">
                    <h2 className="mt-[40px]">All Movies</h2>
                    <select
                        name="category"
                        id=""
                        className="text-white bg-purple-900 p-3 rounded-md"
                        onChange={(e) => {
                            setMovies([]);
                            setSelectedCategory(e.target.value);
                            setPage(1);
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
                            {movies.map((movie: any) => {
                                // I added this little filtering here because the api doesn't offer by default filtering by category when searching for a movie
                                if (
                                    selectedCategory === "" ||
                                    movie.genre_ids.includes(
                                        parseInt(selectedCategory)
                                    )
                                ) {
                                    return <MovieCard movie={movie} />;
                                } else {
                                    return;
                                }
                            })}
                        </ul>
                    )}
                    {movies.length === 0 && !Loading && (
                        <p className="text-white text-2xl font-bold m-5 text-center">
                            No Movie Found
                        </p>
                    )}
                    {movies.length >= 20 && (
                        <div className="mx-auto w-fit">
                            <button
                                className="text-white bg-purple-800 p-3 rounded-md text-lg hover:bg-purple-600 cursor-pointer"
                                onClick={() => setPage((page) => page + 1)}
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default App;
