function GuestButtons() {
    return (
        <div className="flex items-center lg:order-2">
            <a href='/login' className="text-white hover:bg-gray-50   font-bold rounded-lg text-md px-4 lg:px-5 py-2 lg:py-4 border mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</a>
            <a href="/register" className=" text-white hover:bg-blue- font-bold rounded-lg text-md px-4 lg:px-5 py-2 lg:py-4 border mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Register</a>
        </div>
    )
}

export default GuestButtons