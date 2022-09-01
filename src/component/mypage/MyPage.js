//styles
import styles from './MyPage.module.css';
import { Container } from 'react-bootstrap';
//MyPage - component
import MyBookTable from './MyBookTable';
import MyBookTableEmpty from './MyBookTableEmpty';
//hooks
import useUrl from '../../hooks/useUrl';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function MyPage() {
  const id = window.localStorage.getItem("userid")
  const navigate = useNavigate()
  const myUrl = useUrl();

  //----로그인 시 userName 데이터 가져오기----//
  const [bookingCount, setBookingCount] = useState([]);
  const [userName, setUserName] = useState('');
  const url = `http://${myUrl}/api/user/mypage?userId=${id}`;
  useEffect(() => {
    if(id===null){
      alert("로그인 후 사용 가능합니다.")
      navigate(`/login`)
    }else{
    fetch(url, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.userData.userName);
        setBookingCount(data.myBookingDetailDataList);
      });
    }
  }, [url],navigate);
  //onsole.log(bookingCount);

  return (
    <Container className={styles.container}>
      <h6 className={styles.userInfo}>
        탐나는인재 <span className={styles.user_name}>{userName}</span>
        님의 예약 현황
      </h6>
      {Array.isArray(bookingCount) && bookingCount.length === 0 ? (
        <MyBookTableEmpty />
      ) : (
        <MyBookTable />
      )}
    </Container>
  );
}

export default MyPage;
