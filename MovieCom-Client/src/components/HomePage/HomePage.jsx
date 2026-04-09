import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Movie from '../MovieCard/MovieCard';
import '../../App.css'
import Header from '../Header/Header';
import InfiniteScroll from "react-infinite-scroll-component";
import checkToken from '../Auth/checkToken';

function HomePage() {
    const [allMovies, setAllMovies] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(1);
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchData()
        checkToken()
    }, [])

    useEffect(() => {
        fetchData()
        checkToken()
    }, [search])

    const fetchData = async () => {
        try {
            // const response = await axios.get(`http://localhost:9000/movies/limit/?limit=6&skip=0&title=${search}`);
            const response = await axios.get(`http://localhost:9000/movies/limit?title=${search}&pageNumber=0&pageSize=6`);
            console.log(allMovies)
            setAllMovies(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setAllMovies([]);
        }
    }

    const fetchMoreData = () => {
        axios.get(`http://localhost:9000/movies/limit?title=${search}&pageNumber=${index}&pageSize=6`)
        // axios.get(`http://localhost:9000/movies/limit/?limit=6&skip=${index}&title=${search}`)
            .then((res) => {
                setAllMovies((prevItems) => [...prevItems, ...res.data]);

                res.data.length > 0 ? setHasMore(true) : setHasMore(false);
            })
            .catch((err) => console.log(err));
        setIndex((prevIndex) => prevIndex + 6);
    };

    return (
        <>
            <Header search={search} setSearch={setSearch} isSearch={true}></Header>
            <div >
                <InfiniteScroll
                    dataLength={allMovies.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                >
                    {allMovies.length > 0 ?
                        <>
                            <div href="/" id='main' className="grid  md:grid-cols-2 gap-1 p-1 max-w-7xl  ">
                                {allMovies.map((movie) => {
                                    return (
                                        <Movie
                                            id={movie._id}
                                            title={movie.title}
                                            poster={movie.poster}    
                                            genres={movie.genres ? movie.genres.join(', ') : 'Brak informacji o gatunku'}
                                            plot={movie.plot}
                                            rating={movie.imdb?.rating}
                                            votes={movie.imdb?.votes}
                                            year={movie.year}
                                            runtime={movie.runtime}
                                        ></Movie>
                                    )
                                })}
                            </div>
                        </>
                        :
                        <p className='w-full text-center text-lg text-white font-bold'>Brak filmow w bazie</p>
                    }

                </InfiniteScroll>
            </div>
        </>
    )
}

export default HomePage