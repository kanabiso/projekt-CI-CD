import Input from "../Inputs/Input"
import { useState } from 'react';
import { useAuth } from "../Auth/AuthProvider";
import Header from "../Header/Header";

function LoginPage() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const auth = useAuth()

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.loginAction(login, password);
    };

    return (
        <>
            <Header isSearch={false}></Header>
            <section className="bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:mt-28 lg:py-0">
                    <h1 className="text-xl mb-5 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Login to your account
                    </h1>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-400">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                            <form className="space-y-4 md:space-y-6" method="post" onSubmit={handleSubmit}>
                                <Input
                                    label="Login"
                                    type="text"
                                    id="login"
                                    placeholder="Your Login"
                                    onChange={() => setLogin(event.target.value)}
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    id="password"
                                    placeholder="**********"
                                    onChange={() => setPassword(event.target.value)}
                                />
                                <input type="submit" value='Sign in' className="bg-blue-800 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"></input>
                            </form>


                            <p>
                                {!auth.loginSucces ? <p className="text-white">Login failed</p> : <></>}
                            </p>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-4">Sign up</a>
                            </p>

                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default LoginPage