import { useAuth } from "../Auth/AuthProvider"

function GuestButtons(props) {
    const auth = useAuth()
    return (
        <div className="flex items-center lg:order-2">
            <a href='/profil' className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-md px-4 lg:px-5 py-2 lg:py-4 border mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Profil ({props.login}) </a>
            <a href="#" onClick={auth.logOut} className="text-gray-800 dark:text-white hover:bg-gray-500 focus:ring-4 focus:ring-gray-300 font-bold rounded-lg text-md px-4 lg:px-5 border py-2 lg:py-4 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log out</a>
        </div>
    )
}

export default GuestButtons