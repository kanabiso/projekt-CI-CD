import './movieCard.css'

function Movie(props) {
    const path = "/movie/" + props.id
    
    return (
        <div className="p-10 grid place-items-center font-mono ">
            <a href={path}>
                <div className="xs:min-w-96 p-5 bg-white rounded-md shadow-lg max-w-2xl min-h-440px">
                    <div className="lg:flex  leading-none " >
                        <div className="flex-none ">
                            <img
                                src={props.poster}
                                alt="pic"
                                className="xs:m-auto  h-70 w-56 rounded-md shadow-2xl "
                            />
                        </div>
                        <div className="flex-col text-gray-800 ">
                            <p className="pt-4 text-2xl font-bold">{props.title} ({props.year})</p>
                            <hr className="w-11/12 h-2px mx-auto  border-0 rounded md:my-5 dark:bg-gray-700" data-content=""></hr>
                            <div className="text-md flex justify-between px-4 my-2">
                                <span className="font-bold"> {props.runtime} min | {props.genres}</span>
                                <span className="font-bold"></span>
                            </div>
                            <p className="hidden md:block px-4 my-4 text-justify text-sm "> {props.plot} </p>

                            <p className=" flex text-md px-4 mt-8">
                                Rating: {props.rating}
                                <span className="font-bold px-2">|</span>
                                Votes: {props.votes}
                            </p>

                        </div>
                    </div>
                </div>
            </a>
        </div >
    )
}

export default Movie