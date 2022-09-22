import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getAuth } from './hooks/authModule';
import './App.module.css';
import Login from './component/login/Login';
import Header from './component/header/Header';
import EmptyPage from './component/EmptyPage';
import MainTemplate from './component/main/MainTemplate';
import ReservationState from './component/reservation/ReservationState';
import BookPage from './component/bookpage/BookPage';
import MyPage from './component/mypage/MyPage';
import AdminMain from './component/adminPages/AdminMain';
import ClassesFloor from './component/adminPages/classesFloor/ClassesFloor';
import Room from './component/adminPages/room/Room';
import IndividualMain from './component/adminPages/individual/IndividualMain';
import FileUpload from './component/adminPages/fileUpload/FileUpload';

function App() {
  let location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      location.pathname !== "/" &&
      location.pathname !== "/admin" &&
      getAuth().auth === null 
    ) {
      console.log("App.js 예외처리 1");
      navigate("/");
    } else if (location.pathname === "/" && getAuth().auth !== null) {
      console.log("App.js 예외처리 2");
      navigate("/main");
    } else if (location.pathname === "/admin" && getAuth().auth !== null) {
      console.log("App.js 예외처리 3");
      navigate("/admin/fileupload");

    } else {
      console.log('App.js 예외처리 else');
    }
  }, [location.pathname, navigate]);

  console.log('node env', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log = function no_console() {};
    console.warn = function no_console() {};
  }
  const pathArr = [
    "/",
    "/admin",
    "/admin/floor",
    "/admin/fileupload",
    "/admin/room",
    "/admin/individual",
  ];

  return (
    <div>
      {!pathArr.includes(location.pathname) ? <Header /> : null}
      {location.pathname.includes("admin/") ? <AdminMain /> : null}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainTemplate />} />
        <Route path="/state" element={<ReservationState />} />
        <Route path="/booking/:roomId" element={<BookPage />} />
        <Route path="/mypage" element={<MyPage />} />

        <Route path="/admin" element={<Login />} />
        <Route path="/admin/fileupload" element={<FileUpload />} />
        <Route path="/admin/floor" element={<ClassesFloor />} />
        <Route path="/admin/room" element={<Room />} />
        <Route path="/admin/individual" element={<IndividualMain />} />
        <Route path="*" element={<EmptyPage />} />
        {/* <Route path='/feedback' element={<Feedback />} /> */}
      </Routes>
    </div>
  );
}

export default App;
