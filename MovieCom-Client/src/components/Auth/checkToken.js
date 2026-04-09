import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const checkToken = () => {
    const token = Cookies.get('JWT')
    if (token) {
        const decodedToken = jwtDecode(token)
        if (Date.now() >= decodedToken.exp*1000) {
            //axios.post('http://localhost:9000/logout',{ withCredentials: true })
            Cookies.set("JWT", "")
        }
    }
}

export default checkToken