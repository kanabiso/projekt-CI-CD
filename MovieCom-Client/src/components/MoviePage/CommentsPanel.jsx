import { useEffect, useState } from 'react'
import '../MovieCard/movieCard.css'
import Comment from './Comment';
import axios from 'axios';
import checkToken from '../Auth/checkToken';


function CommentsPanel({ id, hasBenAdded }) {
    const [comments, setComments] = useState([])

    useEffect(() => {
        fetchData()
        checkToken
    }, [hasBenAdded])

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/comments/movieID/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    const handleCommentDelete = (commentId) => {
        setComments(comments.filter(comment => comment._id !== commentId));
    };

    return (
        <div className='p-5'>
            <div className='bg-white max-w-5xl m-auto rounded-md pb-5 '>
                {comments.length ?
                    comments.map(comment => {
                        return (
                            <Comment
                                id={comment._id}
                                login={comment.user}
                                content={comment.content}
                                rating={comment.rating}
                                onDelete={handleCommentDelete}
                            />
                        )
                    })
                    :
                    <p className='font-bold text-lg pt-5'>No comments </p>
                }

            </div>
        </div>
    )
}

export default CommentsPanel