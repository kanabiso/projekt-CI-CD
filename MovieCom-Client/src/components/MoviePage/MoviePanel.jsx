import { useEffect, useState } from 'react'
import '../MovieCard/movieCard.css'
import axios from 'axios';
import checkToken from '../Auth/checkToken';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function MoviePanel({ id }) {
    const [movie, setMovie] = useState(null)
    const [isForm, setIsForm] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [runtime, setRuntime] = useState('');
    const [geners, setGeners] = useState([]);
    const [fullplot, setFullplot] = useState('');
    const [released, setReleased] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [rating, setRating] = useState('');
    const [votes, setVotes] = useState('');
    const [directors, setDirectors] = useState([]);
    const [cast, setCast] = useState([]);
    const [writers, setWriters] = useState([]);

    useEffect(() => {
        const token = Cookies.get('JWT')
        if (token) {
            const decodedToken = jwtDecode(token)
            setIsAdmin(decodedToken.role.includes('ROLE_ADMIN'));
        }
        fetchData()
        checkToken
    }, [])

    useEffect(() => {
        fetchData()
        checkToken
    }, [isForm])

    const fetchData = async () => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:9000/movies/id/${id}`)

            let movie = response.data
            setMovie(movie)
            setTitle(movie.title || '');
            setYear(movie.year || '');
            setRuntime(movie.runtime || '');
            setGeners(JSON.stringify(movie.genres) || []);
            setFullplot(movie.fullplot || '');
            setReleased(JSON.stringify(movie.released) || null);
            setLanguages(JSON.stringify(movie.languages) || []);
            setCountries(JSON.stringify(movie.countries) || []);
            setRating(movie.imdb.rating || '');
            setVotes(movie.imdb.votes || '');
            setDirectors(JSON.stringify(movie.directors) || []);
            setCast(JSON.stringify(movie.cast) || []);
            setWriters(JSON.stringify(movie.writers) || []);
            // console.log(response)
        }

        fetchData()
    }

    const update = async () => {
        const token = Cookies.get('JWT')
    
        let toUpdate = {
            title: title,
            year: year,
            runtime: runtime,
            geners: JSON.parse(geners),
            fullplot: fullplot,
            released: JSON.parse(released),
            languages: JSON.parse(languages),
            countries: JSON.parse(countries),
            "imdb.rating": rating,
            "imdb.votes": votes,
            directors: JSON.parse(directors),
            cast: JSON.parse(cast),
            writers: JSON.parse(writers)
        }
        console.log("ssss")
        console.log(toUpdate)
        console.log("ssss")
        try {
            const response = await axios.put(`http://localhost:9000/movies/${id}`,
                {
                    // filter: { _id: id },
                    movieDTO: toUpdate,
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log(response)
            setIsForm(false)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    return (
        <>
            {movie && !isForm ?
                <div className="px-5 pt-5 grid place-items-center font-mono ">
                    <div className="xs:min-w-96 bg-white rounded-md shadow-lg max-w-5xl min-h-460">
                        <div className="lg:flex px-4 leading-none " >
                            <div className="flex-none mt-5 ">
                                <img
                                    src={movie.poster}
                                    alt="pic"
                                    className="xs:m-auto h-70 w-56 rounded-md   shadow-lg "
                                />
                            </div>
                            <div className="flex-col px-4 pb-9 text-gray-800 ">
                                <p className="pt-4 text-2xl font-bold">{movie.title} ({movie.year})</p>
                                <hr className="w-11/12 h-2px mx-auto  border-0 rounded md:my-5 dark:bg-gray-700" data-content=""></hr>
                                <div className="text-md flex justify-between  my-2">
                                    <span className="font-bold"> {movie.runtime} min | {movie.genres.join(", ")}</span>
                                    <span className="font-bold"></span>
                                </div>
                                <p className="  my-4 text-justify text-sm "> {movie.fullplot ? movie.fullplot : movie.plot} </p>

                                <div className="text-left  text-md  my-8">
                                    <span className='block '>Released: {movie.released.substring(0, 10)}</span>
                                    <span className='block'>Languages: {movie.languages.join(", ")}</span>
                                    <span className='block'>Countries: {movie.countries.join(", ")}</span>
                                </div>

                                <p className=" flex text-md  my-8">
                                    Rating: {JSON.stringify(movie.imdb.rating)}
                                    <span className="font-bold px-2">|</span>
                                    Votes: {JSON.stringify(movie.imdb.votes)}
                                </p>

                                <div className='text-left'>
                                    <h3 className='font-bold text-lg'>Directors</h3>
                                    {movie.directors.length ? movie.directors.join(", ") : <p>no data</p>}
                                </div>

                                <div className='text-left mt-5'>
                                    <h3 className='font-bold text-lg'>Cast</h3>
                                    {movie.cast.length ? movie.cast.join(", ") : <p>no data</p>}
                                </div>

                                <div className='text-left mt-5'>
                                    <h3 className='font-bold text-lg'>Writers</h3>
                                    {movie.writers.length ? movie.writers.join(", ") : <p>no data</p>}
                                </div>
                                {isAdmin ?
                                    <img
                                        onClick={() => setIsForm(true)}
                                        className='max-w-10 bg-gray-300 rounded-lg float-right xs:mb-3 lg:m-0'
                                        src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png"
                                    ></img>
                                    :
                                    <></>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                :
                <></>
            }
            {
                movie && isForm ?
                    <div className="bg-white max-w-5xl m-auto rounded-md pb-5 font-mono ">
                        <div className=" rounded-md  min-h-460">
                            <div className="lg:flex px-4 leading-none " >
                                <div className="flex-none mt-5 ">
                                    <img
                                        src={movie.poster}
                                        alt="pic"
                                        className="xs:m-auto h-70 w-56 rounded-md   shadow-lg "
                                    />
                                </div>
                                <div className="flex-col px-4 pb-9 w-full text-gray-800 ">
                                    <form>
                                        <input id='title' type='text' className="pt-4 text-2xl font-bold w-3/5" onChange={() => setTitle(event.target.value)} value={title}></input>

                                        <input id='year' type='text' className="pt-4 text-2xl w-2/12 font-bold text-center" onChange={() => setYear(event.target.value)} value={year}></input>
                                        <hr className="w-11/12 h-2px mx-auto  border-0 rounded md:my-5 dark:bg-gray-700" data-content=""></hr>
                                        <div className="text-md   my-2">
                                            min: <input id='runtime' type='text' className="font-bold w-16" onChange={() => setRuntime(event.target.value)} value={runtime}></input>
                                            geners: <input id='geners' type='text' className="font-bold" onChange={() => setGeners(event.target.value)} value={geners}></input>
                                        </div>
                                        <textarea id='fullplot' className="w-full min-h-36  my-4 text-justify text-sm " onChange={() => setFullplot(event.target.value)} value={movie.fullplot ? movie.fullplot : movie.plot}>  </textarea>

                                        <div className="text-left  text-md  my-8">
                                            Released: <input id='released' type='text' className='' onChange={() => setReleased(event.target.value)} value={released.substring(0, 10)}></input><br></br>
                                            Languages: <input id='languages' type='text' className='' onChange={() => setLanguages(event.target.value)} value={languages}></input><br></br>
                                            Countries: <input id='countries' type='text' className='' onChange={() => setCountries(event.target.value)} value={countries}></input>
                                        </div>

                                        <p className=" flex text-md  my-8">
                                            Rating:  <input id='rating' type='text' className='w-10' onChange={() => setRating(event.target.value)} value={rating}></input>
                                            Votes:  <input id='votes' type='text' className='w-10' onChange={() => setVotes(event.target.value)} value={votes}></input>
                                        </p>

                                        <div className='text-left'>
                                            <h3 className='font-bold text-lg'>Directors</h3>
                                            <input id='directors' type='text' className='w-full' onChange={() => setDirectors(event.target.value)} value={directors}></input>
                                        </div>

                                        <div className='text-left mt-5'>
                                            <h3 className='font-bold text-lg'>Cast</h3>
                                            <input id='cast' type='text' className='w-full' onChange={() => setCast(event.target.value)} value={cast}></input>
                                        </div>

                                        <div className='text-left mt-5'>
                                            <h3 className='font-bold text-lg'>Writers</h3>
                                            <input id='writers' type='text' className='w-full' onChange={() => setWriters(event.target.value)} value={writers}></input>
                                        </div>
                                        {
                                            isAdmin && isForm ?
                                                <>
                                                    <img
                                                        onClick={update}
                                                        className='max-w-10 bg-green-300 rounded-lg float-right p-1 ml-2 xs:mb-3 lg:mb-0'
                                                        src="https://static-00.iconduck.com/assets.00/confirm-icon-512x512-z1hmhk5b.png"
                                                    ></img>
                                                    <img
                                                        onClick={() => setIsForm(false)}
                                                        className='max-w-10 bg-red-300 rounded-lg float-right p-1 xs:mb-3 lg:mb-0'
                                                        src="https://cdn-icons-png.flaticon.com/512/5073/5073941.png"
                                                    ></img>
                                                </>
                                                :
                                                <></>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default MoviePanel