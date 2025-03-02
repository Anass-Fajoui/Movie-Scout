

interface Props {
    setSearchTerm: (n: string) => void;
    searchTerm: string;
}
const Search = ({ searchTerm, setSearchTerm }: Props) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search" />
                <input
                    type="text"
                    placeholder="Search through thousands of movie"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value);console.log(e.target.value)}}
                />
            </div>
        </div>
    );
};

export default Search;
