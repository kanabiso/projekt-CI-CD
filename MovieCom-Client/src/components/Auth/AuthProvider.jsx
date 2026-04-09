import { useContext, createContext } from "react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loginSucces, setLoginSucces] = useState(true);
    const navigate = useNavigate();

    const loginAction = async (login, password) => {
        await axios.post('http://localhost:9000/login', {
            login,
            password
        }, { withCredentials: true })
            .then(response => {
                if (response.data.success) {
                    setUser(response.data.login)
                    setLoginSucces(true)
                    Cookies.set("JWT", response.data.token)
                    navigate("/");
                    console.log(response)
                } else {
                    setLoginSucces(false)
                }

            })
            .catch(err => {
                setLoginSucces(false)
                console.log(err)
            })
    }

    const logOut = async () => {
        setUser(null);
        Cookies.set("JWT", "")

        // nie działa nie wiem czemu
        // await axios.post('http://localhost:9000/logout', { withCredentials: true })
        // .then(res => {
        //     console.log(res)
        // })
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, loginSucces, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};