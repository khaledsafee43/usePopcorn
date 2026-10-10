import { useEffect, useState } from "react";

const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //  `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,

  useEffect(() => {
    async function fetchData() {
      try {
        setIsloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        );
        const data = await res.json();
        console.log(data);

        if (data.Response === "False") {
          throw new Error("Movie not found!");
        }
        setMovies(data.Search);
        setIsloading(false);
      } catch (error) {
        setErrorMessage(error.message);
      }finally {
        setMovies([]);
        setIsloading(false);
      }
    }
    if (query.length >= 3) {
      fetchData();
    }
    return function() {
      setMovies([]);
      setErrorMessage("");
    }
  }, [query]);
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? (
            <h1 className="loader">Loading...</h1>
          ) : (
            <MovieList movies={movies} />
          )}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
