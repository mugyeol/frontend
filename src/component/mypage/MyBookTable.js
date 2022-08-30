import styles from './MyBookTable.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MyBookTable() {
  const { id } = useParams();
  //----서버데이터 불러오기----//
  const [myBookingList, setMyBookingList] = useState([]);
  const url = `http://192.168.5.127:8080/api/user/mypage?userId=${id}`;
  useEffect(() => {
    fetch(url, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        setMyBookingList(data.myBookingDetailDataList);
      });
  }, [url]);
  //console.log(myBookingList);

  //useId랑 applicantUserId랑 같을 때 값 출력하기
  const Cancel = (bid) => {
    console.log(bid);
    const postUrl = `http://192.168.5.127:8080/api/booking/cancellation`;
    fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: bid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className={styles.wrap}>
      <table id={styles.bookingBox} className='table caption-top'>
        <thead>
          <tr>
            <th scope='col'>공간</th>
            <th scope='col'>시간</th>
            <th scope='col'>신청자</th>
            <th scope='col'>팀원</th>
            <th scope='col'>예약수정</th>
          </tr>
        </thead>
        <tbody>
          {myBookingList.map((item, index) => (
            <tr key={index}>
              <td>{item.roomName}</td>
              <td>
                {item.startTime}-{item.endTime}
              </td>
              <td>{item.applicant.userName}</td>
              <td>{item.participants}</td>
              <td>
                <button
                  key={index}
                  className={styles.cancel}
                  onClick={() => Cancel(item.bookingId)}
                  disabled={item.applicant.userId === id ? false : true}
                >
                  취소하기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default MyBookTable;
