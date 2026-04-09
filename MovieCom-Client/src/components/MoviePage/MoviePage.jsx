import Header from '../Header/Header'
import { useParams } from 'react-router-dom';
import '../MovieCard/movieCard.css'
import MoviePanel from './MoviePanel';
import CommentsPanel from './CommentsPanel';
import AddComment from './AddComment'
import { useState } from 'react';

function MoviePage() {
    const [hasBenAdded, setHasBenAdded] = useState(1)

    let { id } = useParams();

    return (
        <>
            <Header isSearch={false}></Header>
            <MoviePanel id={id}></MoviePanel>
            <CommentsPanel id={id} hasBenAdded={hasBenAdded}></CommentsPanel>
            <AddComment id={id}  setHasBenAdded={setHasBenAdded}></AddComment>
        </>
    )
}

export default MoviePage