import { useState } from 'react'
import '../MovieCard/movieCard.css'
import { useEffect } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'

function Comment({ id, login, content, rating, onDelete }) {
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const token = Cookies.get('JWT')
        if (token) {
            const decodedToken = jwtDecode(token)
            setUser(decodedToken.login)
            setIsAdmin(decodedToken.role.includes('ROLE_ADMIN'));
        }
    }, [])

    const deleteComment = async () => {
        const token = Cookies.get('JWT')
        try {
            await axios.delete(`http://localhost:9000/comments/${id}`, {        
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                    }
            });
            onDelete(id)
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

    return (
        <div className=' flex'>
            <div className='float-left'>
                <img
                    src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
                    className='max-w-20 rounded-lg border-2 border-app mx-6 mt-6'>
                </img>
                <p className='mt-1'>
                    {login}
                </p>
            </div>
            <div className='text-left w-full float-left p-3 mt-6 border-2 border-app rounded-lg'>
                <p className=''>{content}</p>
                {
                    login == user || isAdmin ?
                        <img
                            onClick={deleteComment}
                            className='relative float-right align-bottom  h-8 w-8 bg-red-400 p-2 rounded-md'
                            src="https://static-00.iconduck.com/assets.00/delete-icon-1864x2048-bp2i0gor.png">
                        </img>
                        :
                        <></>
                }
            </div>


            <div className='bg-app  flex items-center justify-center  rounded-lg mt-6 mr-6 ml-4 w-2/12 text-white font-bold text-3xl'>
                {rating}/10
            </div>
        </div>
    )
}

export default Comment