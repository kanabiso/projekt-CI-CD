import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import AuthProvider from './components/Auth/AuthProvider';
import PrivateRoute from './components/Auth/PrivateRoute';
import ProfilPage from './components/Profil/ProfilPage'
import MoviePage from './components/MoviePage/MoviePage';


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/movie/:id' element={<MoviePage />}></Route>
          <Route element={<PrivateRoute />}>
            <Route path='/profil' element={<ProfilPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
