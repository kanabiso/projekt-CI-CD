import { useState } from 'react'
import '../MovieCard/movieCard.css'
import axios from 'axios'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function CommentsPanel({ setHasBenAdded, id }) {
    const [content, setComments] = useState(null)
    const [rating, setRating] = useState(null)
    const [serverResponse, setserverResponse] = useState(null)

    const handleSubmit = async () => {
        event.preventDefault()
        const movieId = id
        const createdAt = new Date()
        const token = Cookies.get('JWT')
        const decodedToken = jwtDecode(token)
        const user = decodedToken.login
      
        if (  (rating > 0 && rating < 11)) { //TODO sprzwdzic czy liczba
            const response = await axios.post('http://localhost:9000/comments', {
                movieId,
                user,
                createdAt,
                content,
                rating
            }, { withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                    }
             })
            if (response.status == 201) {
                setserverResponse(response.data.message)
                document.getElementById("addCommentForm").reset();
                setHasBenAdded(prevCount => prevCount + 1)
            } else {
                setserverResponse("We can't add your comment")
            }
        } else {
            setserverResponse("Rating must be in the range of 1-10")
        }
    }

    return (
        <div className='px-5 mb-10'>
            <div className='bg-white max-w-5xl m-auto rounded-md   '>
                {
                    Cookies.get('JWT') ?
                        <form onSubmit={handleSubmit} id="addCommentForm">
                            <div className=' flex pb-5'>
                                <div className='float-left'>
                                    <img src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
                                        className='max-w-20 rounded-lg border-2 border-app mx-6 mt-6'>
                                    </img>
                                    <p className='mt-1'>
                                        You
                                    </p>
                                </div>
                                <textarea onChange={() => setComments(event.target.value)} className='text-top w-full  p-3 mt-6 border-2 border-app rounded-lg' placeholder='Write a comment'>

                                </textarea>
                                <div className='bg-app block  rounded-lg mt-6 mr-2 ml-4 w-2/12 text-white font-bold text-2xl'>
                                    <p className='mt-2'>Rating</p>
                                    <input onChange={() => setRating(event.target.value)} list="ratings" name="rating" id="rating" className='text-2xl p-1 text-center text-black w-3/4 mt-2 rounded-lg' />
                                    <datalist id="ratings" className='w-full'>
                                        <option value="1" />
                                        <option value="2" />
                                        <option value="3" />
                                        <option value="4" />
                                        <option value="5" />
                                        <option value="6" />
                                        <option value="7" />
                                        <option value="8" />
                                        <option value="9" />
                                        <option value="10" />
                                    </datalist>

                                </div>
                                <input type='submit' value="Add" className='bg-green-900 xs:text-sm md:text-2xl flex items-center justify-center  rounded-lg mt-6 mr-6  w-2/12 text-white font-bold text-3xl'></input>
                            </div>
                            {
                                serverResponse ? <p className='pb-5 text-lg font-bold'>{serverResponse}</p> : <></>
                            }

                        </form>
                        :
                        <p className='font-bold text-lg p-5'>To add comment you must
                            <a href="/login" className='bg-app text-white p-2 rounded-lg ml-3'>LOGIN</a>
                        </p>
                }

            </div>
        </div>
    )
}

export default CommentsPanel