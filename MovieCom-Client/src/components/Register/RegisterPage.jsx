import axios from 'axios';
import { useEffect, useState } from 'react';
import Input from '../Inputs/Input';
import Header from '../Header/Header';

function RegisterPage() {
    const [login, setLogin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [serverData, setServerData] = useState(null)
    const [errors, setErrors] = useState({
        login: "Login must have min 6 characters",
        email: "Email is incorrect",
        password: "Password must have min 8 characters"
    })

    useEffect(() => {
        if (password.length < 8 || password.length == 0) {
            setErrors({
                ...errors,
                password: "Password must have min 8 characters"
            })
        }
        else {
            setErrors({
                ...errors,
                password: null
            })
        }
    }, [password])

    useEffect(() => {
        const isEmailValid = (email) => {
            return String(email).match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        }

        if (!isEmailValid(email)) {
            setErrors({
                ...errors,
                email: "Email is incorrect"
            })
        } else {
            setErrors({
                ...errors,
                email: null
            })
        }
    }, [email]),

        useEffect(() => {
            if (login.length < 6 || login.length == 0) {
                setErrors({
                    ...errors,
                    login: "Login must have min 6 characters"
                })
            }
            else {
                setErrors({
                    ...errors,
                    login: null
                })
            }
        }, [login])

    const register = (event) => {
        event.preventDefault()
        if (
            errors.email == null &&
            errors.login == null &&
            errors.password == null
        ) {
            axios.post('http://localhost:9000/register', {
                login,
                email,
                password
            })
                .then((response) => {
                    setServerData(response)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    return (
        <>
            <Header isSearch={false}></Header>
            <section className="bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:mt-28 lg:py-0">
                    <h1 className="text-xl mb-5 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Register account
                    </h1>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-400">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                            <form className="space-y-4 md:space-y-6" method='post' onSubmit={register} >
                                <Input
                                    label="Login"
                                    type="text"
                                    id="login"
                                    placeholder="Your Login"
                                    onChange={() => setLogin(event.target.value)}
                                />
                                <Input
                                    label="E-mail"
                                    type="email"
                                    id="email"
                                    placeholder="mail@example.com"
                                    onChange={() => setEmail(event.target.value)}
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    id="password"
                                    placeholder="**********"
                                    onChange={() => setPassword(event.target.value)}
                                />
                                <p className='text-white'>
                                    {errors.login == null ? <></> : <span>{errors.login}<br></br></span>}
                                    {errors.email == null ? <></> : <span>{errors.email}<br></br></span>}
                                    {errors.password == null ? <></> : <span>{errors.password}<br></br></span>}
                                </p>
                                <p>
                                    {serverData ? <p className='text-white font-bold text-lg'>{serverData.data.message}</p> : <></>}
                                </p>
                                <input type="submit" value='Sign in' className="bg-blue-800 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"></input>
                            </form>
                            
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                You have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-4">Login</a>
                            </p>

                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default RegisterPage