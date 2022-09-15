import './App.module.css';
import Login from './component/login/Login';
import { Route, Routes, useLocation } from 'react-router-dom';
import EmptyPage from './component/EmptyPage';
import Header from './component/header/Header';
import MainTemplate from './component/main/MainTemplate';
import ReservationState from './component/reservation/ReservationState';
import BookPage from './component/bookpage/BookPage';
import MyPage from './component/mypage/MyPage';
import Logout from './component/logout/Logout';
import Admin from './component/adminpage/Admin';
// import Feedback from './component/Feedback';

function App() {
  let location = useLocation();
  console.log('node env', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log = function no_console() {};
    console.warn = function no_console() {};
  }

  return (
    <div>
      {location.pathname !== '/' ? <Header /> : null}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/main' element={<MainTemplate />} />
        <Route path='/state' element={<ReservationState />} />
        <Route path='/booking/:roomId' element={<BookPage />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='*' element={<EmptyPage />} />
        {/* <Route path='/feedback' element={<Feedback />} /> */}
      </Routes>
    </div>
  );
}

export default App;
