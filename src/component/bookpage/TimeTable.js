//styles
import styles from './TimeTable.module.css';
//useHook
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
//component
import React from 'react';
import { Checkbox } from 'antd';
import 'antd/dist/antd.min.css';
import dummy from '../../db/booking_data.json';

function TimeTable() {
  const { id } = useParams();
  const [ablebtn, setAblebtn] = useState(true); //예약시간이 아닐 때 상태변경(true일 때 버튼 활성화!)
  const navigate = useNavigate();

  //21:00-08:30까지 예약 버튼 비활성화 함수
  const Now = new Date(); //현재 날짜 및 시간 -> Tue Aug 23 2022 16:33:51 GMT+0900
  const NowHour = Now.getHours();
  const NowMins = Now.getMinutes();

  function pluszero(times) {
    let time = times.toString(); //시간을 숫자에서 문자로 변환
    if (time.length < 2) {
      time = '0' + time; //숫자 앞에 0을 붙여줌
      return time;
    } else {
      return time;
    }
  }
  const nowHour = pluszero(NowHour);
  const nowMins = pluszero(NowMins);
  const nowTime = nowHour + nowMins;
  //console.log(nowTime);

  const startTime = '0830';
  const endTime = '2100';
  useEffect(() => {
    if (startTime > nowTime || endTime < nowTime) {
      setAblebtn(false);
    } else {
      setAblebtn(true);
    }
  }, []); //useEffect써서 한번만 렌더링 해줌
  //console.log(ablebtn);

  //버튼 클릭시 alert 띄어주기
  const BookingConfirm = () => {
    if (startTime > nowTime || endTime < nowTime) {
      alert(
        '예약할 수 없는 시간입니다!\n오전08:30부터 오후21:00까지 예약이 가능합니다.'
      );
      navigate(`/${id}`);
    } else {
      alert('예약이 완료 되었습니다. 마이페이지로 이동합니다 :)');
      navigate(`/mypage/${id}`);
    }
  };
  const times = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  //예약된 시간 추출
  const booking_data = dummy.booking;
  const bookedTimes = [];
  booking_data.map((booking) =>
    bookedTimes.push(booking.time_start, booking.time_end)
  );

  //예약된 시간 적용한 disabledList 생성
  const defaultDisabledList = [];
  times.map((time) =>
    defaultDisabledList.push(bookedTimes.includes(time) ? true : false)
  );
  const [disabledState, setDisabledState] = useState(defaultDisabledList);
  // console.log("disabledState => ", disabledState);

  const [checkedState, setCheckedState] = useState(new Array(12).fill(false));
  //console.log('checkedState below usestate=> ', checkedState);

  // i의 최소값이 0, 최대값은 11이기 때문에 처음 시간과 마지막 시간일때의 예외처리는 반복문에서 자연스럽게 처리됨
  // 클릭한 시간 전꺼, 다음꺼 중 만약 이미 예약이 된것들은 이미 disabled : true인 상태이기 때문에 첫번째 if문에서 예외처리됨
  // 클릭한 시간, 클릭한 시간 전꺼와 다음꺼 제외하고 나머지 중 disabled false인 것들 true로 바꿔줌
  function updateDisabledList(index) {
    //최초 클릭 시 disablesState update
    const disableUpdateList = [...disabledState];
    for (let i = 0; i < times.length; i++) {
      if (i !== index && i !== index + 1 && i !== index - 1) {
        if (disableUpdateList[i] !== true) {
          disableUpdateList[i] = true;
        }
      }
    }
    setDisabledState(disableUpdateList);
  }

  //checkedState length return
  function checkedStateLength() {
    return checkedState.filter((bool) => bool === true).length;
  }

  function getCheckedIndexArray(checkedState) {
    var arr = [];
    var index = checkedState.indexOf(true);
    while (index !== -1) {
      arr.push(index);
      index = checkedState.indexOf(true, index + 1);
    }
    return arr;
  }
  function updatedCheckedState(index) {
    // console.log("cycle => onChange : checkedState  =>",checkedState)
    const updatedCheckedState = checkedState.map((item, id) =>
      id === index ? !item : item
    );
    // console.log("cycle => onChange : updatedCheckedState  =>",updatedCheckedState)
    setCheckedState(updatedCheckedState);
  }

  const onChange = (index) => {
    if (checkedStateLength() === 0) {
      updateDisabledList(index);
      updatedCheckedState(index);
    } else if (checkedStateLength() === 1) {
      updatedCheckedState(index);
      if (checkedState.indexOf(true) === index) {
        //체크해제 + 내일 할일 : 체크 해제했을때 디스에이블드 풀어주기 & array 코드 간결하게 하는법 찾기
        setDisabledState(defaultDisabledList);
      } else {
        //pass
      }
    } else if (checkedStateLength() === 2) {
      if (getCheckedIndexArray(checkedState).includes(index) === false) {
        alert('최대 예약시간은 2시간입니다 !');
      } else {
        updatedCheckedState(index);
      }
    }
  };

  return (
    <div className={styles.timewrap}>
      <h6 className={styles.time}> 시간 선택 </h6>
      <div className={styles.timetable}>
        {times.map((time, index) => (
          <span key={index}>
            {/* {category(index)} */}
            <Checkbox
              onChange={() => onChange(index)}
              checked={checkedState[index]}
              variant='success'
              disabled={disabledState[index]}
              style={{
                margin: '10px',
                color: 'green',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {time}
            </Checkbox>
          </span>
        ))}
      </div>
      <button
        className={ablebtn === true ? styles.bookbtn : styles.bookbtnOff}
        onClick={BookingConfirm}
      >
        예약하기
      </button>
    </div>
  );
}

export default TimeTable;
