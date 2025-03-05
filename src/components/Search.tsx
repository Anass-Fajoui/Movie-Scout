

interface Props {
    setSearchTerm: (n: string) => void;
    // setMovies: (a : any[]) => void;
    setPage : (a : number) => void;
    searchTerm: string;
}
const Search = ({ searchTerm, setSearchTerm, setPage}: Props) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search" />
                <input
                    type="text"
                    placeholder="Search through thousands of movie"
                    value={searchTerm}
                    onChange={(e) => {
                        setPage(1);
                        setSearchTerm(e.target.value);
                    }}
                />
            </div>
        </div>
    );
};

export default Search;
