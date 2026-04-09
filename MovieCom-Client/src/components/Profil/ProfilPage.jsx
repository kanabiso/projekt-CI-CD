import Header from "../Header/Header"
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import checkToken from "../Auth/checkToken";
import ProfilComment from "./ProfilComment";
import axios from "axios";


function ProfilPage() {
    const [tokenData, setTokenData] = useState({ login: "" })
    const [comments, setComments] = useState([])
    const [posters, setPosters] = useState([])



    useEffect(() => {
        fetchData()
        checkToken
    }, [])

    const fetchData = async () => {
        const token = Cookies.get('JWT')
        if (token) {
            const decodedToken = jwtDecode(token)
            console.log(decodedToken)
            setTokenData(decodedToken)
            try {
                const response = await axios.get(`http://localhost:9000/comments/login/${decodedToken.login}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        } else {
            setTokenData(null)
        }


    }

    const handleCommentDelete = (commentId) => {
        setComments(comments.filter(comment => comment._id !== commentId));
    };




    return (
        <>
            <Header isSearch={false}></Header>
            <div className="px-5 bg-white py-5 grid place-items-center m-auto rounded-md max-w-5xl font-mono  ">
                <div className="md:float-left md:w-fill p-5 ">
                    <img src="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
                        className=" m-auto w-64 h-64 rounded-lg">

                    </img>
                </div>

                <div className=" text-3xl font-bold pt-5">
                    <p>{tokenData.login}</p>
                    <p className="text-lg font-normal mt-3">{tokenData.email}</p>
                    <p className="text-lg font-normal mt-3">Role: {JSON.stringify(tokenData.role)}</p>
                </div>

            </div>

            <div className='p-5'>
                <div className='bg-white max-w-5xl m-auto rounded-md pb-5 '>
                    <p className="text-xl font-bold pt-5">Your Comments</p>
                    {comments.length ?
                        comments.map(comment => {
                            return (
                                <ProfilComment
                                    id={comment._id}
                                    movieId={comment.movieId}
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
        </>

    )
}

export default ProfilPage