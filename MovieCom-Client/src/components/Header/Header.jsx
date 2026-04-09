import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider"
import GuestButtons from "./GuestButtons"
import LoggedButtons from "./LoggedButtons"
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import checkToken from "../Auth/checkToken";
import logo from './logo.png';

function Header({ search, setSearch, isSearch }, props) {
    const [tokenData, setTokenData] = useState({ login: "" })
    const [test, setTest] = useState("")
    const auth = useAuth()

    function handleChange(event) {
        setSearch(event.target.value)

    }

    useEffect(() => {
        const token = Cookies.get('JWT')
        if (token) {
            const decodedToken = jwtDecode(token)
            console.log(decodedToken)
            setTokenData(decodedToken)
        } else {
            setTokenData(null)
        }
        checkToken()
    }, [])

    return (
        <header className="min-w-96 ... sticky top-0">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="http://localhost:8080" className="flex items-center">
                        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">MovieCom</span>
                    </a>
                    {
                        Cookies.get('JWT') ?
                            <LoggedButtons login={tokenData.login} />
                            :
                            <GuestButtons />
                    }
                    {
                        isSearch ?
                            <form id='search' className="w-4/6 m-auto pb-4 pt-4 sm:w-full md:w-full lg:w-3/5 xs:w-full">
                                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input value={search} onChange={handleChange} type="text" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search movies by title" />
                                </div>
                            </form>
                            :
                            <></>
                    }


                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">

                    </div>
                </div>
            </nav>
        </header>
    )
}


export default Header
