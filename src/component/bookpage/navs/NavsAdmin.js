//styles
import styles from './Navs.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
//hooks
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UseUrl from '../../../hooks/useUrl';

function NavsAdmin() {
  const { roomId } = useParams();
  const { id } = useParams();
  const myUrl = UseUrl();
  //----/api/booking----//
  //미팅룸 데이터 추출
  const [roomData, setRoomData] = useState([]);
  //console.log(roomData);
  //2층 룸리스트 추출 -> 미팅룸리스트 개인자습룸리스트 추출
  const floor2 = roomData.filter((room) => room.floor === 2);
  //console.log(floor2);
  const floor2Meeting = floor2.filter((room) => room.roomType === 'meeting');
  //console.log(floor2Meeting);
  const floor2Nabox = floor2.filter((room) => room.roomType === 'nabox');
  //console.log(floor2Nabox);
  //3층 룸리스트 추출 -> 미팅룸리스트, 개인자습룸리스트 추출
  const floor3 = roomData.filter((room) => room.floor === 3);
  //console.log(floor3);
  const floor3Meeting = floor3.filter((room) => room.roomType === 'meeting');
  //console.log(floor3Meeting);
  const floor3Nabox = floor3.filter((room) => room.roomType === 'nabox');
  //console.log(floor3Nabox);

  const url = `http://${myUrl}/api/booking/room-data?floor=0&roomId=${roomId}`;
  useEffect(() => {
    fetch(url, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        setRoomData(data.roomData);
      });
  }, [url]);

  return (
    <div className={styles.wrap}>
      <Dropdown className={styles.box}>
        <Dropdown.Toggle
          className={styles.toggle}
          variant=''
          id='dropdown-basic'
        >
          2층 예약실
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {floor2Meeting.map((item, index) => (
            <Dropdown.Item href={`/booking/${item.roomId}/${id}`} key={index}>
              {item.roomName}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          {floor2Nabox.map((item, index) => (
            <Dropdown.Item href={`/booking/${item.roomId}/${id}`} key={index}>
              {item.roomName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown className={styles.box}>
        <Dropdown.Toggle
          className={styles.toggle}
          variant=''
          id='dropdown-basic'
        >
          3층 예약실
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {floor3Meeting.map((item, index) => (
            <Dropdown.Item href={`/booking/${item.roomId}/${id}`} key={index}>
              {item.roomName}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          {floor3Nabox.map((item, index) => (
            <Dropdown.Item href={`/booking/${item.roomId}/${id}`} key={index}>
              {item.roomName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default NavsAdmin;
