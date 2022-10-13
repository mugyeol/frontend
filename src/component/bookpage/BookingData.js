//styles
import styles from './BookingData.module.css';
import 'antd/dist/antd.min.css';
import { Checkbox, Tooltip } from 'antd';
//hooks
import useUrl from '../../hooks/useUrl';
import useTimes from '../../hooks/useTimes';
import timePlusMinus from '../../hooks/timePlusMinus';
import checkPast from '../../hooks/checkPast';
import getTimes from '../../hooks/getTimes';
import useTimeAlert from '../../hooks/useTimeAlert';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
//component
import TimeBtnExplain from './TimeBtnExplain';
import { fetchPostJson } from '../../hooks/fetchUrl';

//매니저님 예외처리한 부분
//1) checkBox 예약된거 disable 안하고 그레이 처리 해줌
//2) defaultDisable에서 break 하는 부분 break 안하도록 해줌
//3) bookingConfirm()에서 체크해줄 때 팀원 선택 안해도 되게 해줌

const BookingData = ({ bookingData, userData, namesData, currentRoomData }) => {
    const userName = userData.userName;
    const userClass = userData.classes;
    const roomType = currentRoomData.roomType;
    const floor = currentRoomData.floor;
    const maxTime = currentRoomData.maxTime;
    const times = useTimes();
    const memberNames = namesData.filter(
        (member) => member !== userData.userName
    );

    const [searchedNameState, setSearchedNameState] = useState([]);
    const [bookedState, setBookedState] = useState([]);
    const [pastState, setPastState] = useState([]);
    const [isOfficial, setIsOfficial] = useState([]);
    const [isLoadding, setIsLoading] = useState(false);

    useEffect(() => {
    //console.log("bookingdata useeffect namesData : ", namesData);
    setSearchedNameState(
        namesData.filter((member) => member !== userData.userName)
    );
    // setMemberNames(namesData.filter((member) => member !== userData.userName));
    const bookedTimes = [];
    const officialTimes = [];
    bookingData.map((booking) =>
        bookedTimes.push(...getTimes(booking.startTime, booking.endTime)) &&
        booking.official
        ? officialTimes.push(...getTimes(booking.startTime, booking.endTime))
        : null
    );
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    times.map(
        (time) =>
        arr1.push(checkPast(time)) &&
        arr2.push(bookedTimes.includes(time) ? true : false) &&
        arr3.push(officialTimes.includes(time) ? true : false)
    );
    setPastState(arr1);
    setBookedState(arr2);
    setIsOfficial(arr3);
    //     });
    }, [bookingData, namesData]); //의존성 경고문 없애기 (콜백 방식 알아볼것)

    //-------시간 체크박스------//
    const [indeterminateState, setIndeterminateState] = useState(
    new Array(12).fill(false)
    );
    const [checkedState, setCheckedState] = useState(new Array(12).fill(false));
    const [timeRange, setTimeRange] = useState([]);
    const maxHour = userClass === 0 ? 12 : maxTime;

    const onChangeCheckBox = (index) => {
    const lastIndex = timeRange.length - 1;
    if (timeRange.includes(index)) {
        //timeRange 내에서 시간 선택 event
        //처음 꺼 눌렀을 때 -> 해제
        //마지막꺼 체크 -> 마지막꺼 + 중간껏들도 체크
        //마지막꺼 해제 -> 마지막꺼만 해제
        //timeRange에서 첫시간, 마지막 시간 사이 중간 시간 선택
        //-> 선택인 경우 : 시작~중간 체크 | 해제일 경우 : 중간~끝 해제
        if (timeRange[0] === index) {
        //시작 시간 체크 해제
        setTimeRange([]);
        setIndeterminateState(new Array(12).fill(false));
        setCheckedState(new Array(12).fill(false));
        } else if (timeRange[lastIndex] === index) {
        // timeRange에서 마지막 시간 선택
        const checkedArr = [...checkedState];
        if (checkedArr[index]) {
            checkedArr[index] = false;
        } else {
            for (let i = timeRange[0]; i <= timeRange[lastIndex]; i++) {
            checkedArr[i] = true;
            }
        }
        setCheckedState(checkedArr);
        } else {
        //참고 : timeRange.length >1 경우만 이 조건문으로 들어옴
        //=> 중간 시간 선택
        const checkedArr = [...checkedState];
        if (!checkedArr[index]) {
            for (let i = timeRange[1]; i <= index; i++) {
            checkedArr[i] = true;
            }
        } else {
            for (let i = index; i <= timeRange[lastIndex]; i++) {
            checkedArr[i] = false;
            }
        }
        setCheckedState(checkedArr);
        }
    } else {
        // 최초 시작 시간 선택 or timeRange 외부 시간 선택 [선택한 시간이 시작시간이 됨]
        const checkIdArr = [];
        const indeterminateArr = new Array(12).fill(false);
        for (let i = index; i < index + maxHour; i++) {
        const checkedArr = new Array(12).fill(false);
        checkedArr[index] = true;
        setCheckedState(checkedArr);
        if (userClass !== 0) {
            if (bookedState[i]) break;
        } else {
            if (isOfficial[i]) break;
        }
        checkIdArr.push(i);
        if (i !== index) {
            indeterminateArr[i] = true;
        }
        }
        setTimeRange(checkIdArr);
        setIndeterminateState(indeterminateArr);
    }
    };
    //서버로 보내는 start & endTime get
    function getStartEndTime(checkedState) {
    function getCheckedIndex(checkedState) {
        var arr = [];
        var index = checkedState.indexOf(true);
        while (index !== -1) {
        arr.push(index);
        index = checkedState.indexOf(true, index + 1);
        }
        return arr;
    }
    const object = {
        startTime: times[getCheckedIndex(checkedState)[0]],
        timeLength: getCheckedIndex(checkedState).length,
    };
    return object;
    }

    //--------팀원 검색 기능---------//
    const [selectedNameState, setSelectedNameState] = useState([]);
    const [inputName, setInputName] = useState('');
    //팀원 리스트 모달창
    const [isShowModal, setIsShowModal] = useState(true);
    //useRef사용해서 outside클릭 시 모달창 사라짐
    const closeModal = useRef();

    function onClickModal() {
        setIsShowModal(true);
    }
    function onClickOutside(event) {
    if (closeModal.current && !closeModal.current.contains(event.target)) {
        setIsShowModal(false);
    }
    }
    useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    });

    function onChange(e) {
    setIsShowModal(true);
    setInputName(e.target.value);
    const str = e.target.value;
    let arr = [...memberNames];
    arr = arr.filter((member) => !selectedNameState.includes(member));
    if (arr.filter((member) => member.includes(str)).length > 0) {
        arr = arr.filter((member) => member.includes(str));
    }
    setSearchedNameState(arr);
    }
    function onClickSearched(name) {
    setInputName('');
    setIsShowModal(false);
    // setSearchedNameState([]);

    const arr = [...selectedNameState];
    arr.push(name);
    setSelectedNameState(arr);
    setSearchedNameState(memberNames.filter((member) => !arr.includes(member)));
    }
    function onClickSelected(index) {
    const arr = [...selectedNameState];
    const arr2 = [...searchedNameState];
    arr2.push(arr[index]);
    arr2.sort();
    arr.splice(index, 1);
    setSearchedNameState(arr2);
    setSelectedNameState(arr);
    }
    //팀원 검색 enter event
    function onSubmit(e) {
    e.preventDefault();
    setIsShowModal(false);
    if (searchedNameState.length === 1) {
        //이미 선택할 팀원이 나옴
        setInputName('');
        // setSearchedNameState([]);

        const arr = [...selectedNameState];
        arr.push(searchedNameState[0]);
        setSelectedNameState(arr);
        setSearchedNameState(
        memberNames.filter((member) => !arr.includes(member))
        );
    } else if (searchedNameState.length > 1) {
        //검색 결과 두명 이상 나왔을 때 엔터친 경우
        alert('팀원을 한명씩 선택해 주세요 !');
    } else {
        //검색 안되는 이름 치고 엔터친 경우
        setInputName('');
        // setSearchedNameState([]);
        alert('팀원의 이름을 확인해주세요!');
    }
    }

    //----예약시간에 따른 버튼 비활성화----//
    const navigate = useNavigate();
    //21:00-08:30까지 예약 버튼 비활성화 함수 -> hooks
    const timeAblebtn = useTimeAlert();//[true, ()=>{}]
    //주말 예약 버튼 비활성화
    const [weeklyAblebtn, setWeeklyAblebtn] = useState(false); //주말일 때 상태변경(true일 때 버튼 활성화!)
    const day = ['일', '월', '화', '수', '목', '금', '토'];
    const Now = new Date()
    const NowDay = Now.getDay();
    const weekDay = day[NowDay];

    useEffect(() => {
    if (
        weekDay === '토' ||
        weekDay === '일'
    ) {
        setWeeklyAblebtn(false);
    } else {
        setWeeklyAblebtn(true);
    }
    }, [timeAblebtn, weekDay]);
    console.log(timeAblebtn, weeklyAblebtn);

    //----예약 데이터 보내기----//
    const roomTypeArr = ['meeting', 'nabax'];
    const myUrl = useUrl();
    const { roomId } = useParams();
    function bookingConfirm() {
    if (
        userClass !== 0 &&
        roomType === roomTypeArr[0] &&
        selectedNameState.length < 1 &&
        getStartEndTime(checkedState).timeLength === 0
    ) {
        alert('회의 참여자와 회의 시간을 선택해 주세요');
    } else if (
        roomType === roomTypeArr[0] &&
        userClass !== 0 &&
        selectedNameState.length < 1
    ) {
        alert('회의 참여자를 1명 이상 선택해주세요');
    } else if (getStartEndTime(checkedState).timeLength === 0) {
        alert('시간을 선택해 주세요');
    } else {
        if (!isLoadding) {
        setIsLoading(true);
        const postUrl = `http://${myUrl}/api/booking/conference`;
        const object = {
            classes: userClass,
            roomId: roomId,
            roomType: roomType,
            startTime: getStartEndTime(checkedState).startTime,
            endTime: timePlusMinus(
            getStartEndTime(checkedState).startTime,
            getStartEndTime(checkedState).timeLength
            ),
            teamMate: selectedNameState,
            userName: userName,
        };
        fetchPostJson(postUrl, object, navigate).then((data) => {
            if (data?.message.success) {
            alert(data.message.success);
            setIsLoading(false);
            navigate(`/mypage`);
            } else {
            alert(data?.message.fail);
            setIsLoading(false);
            }
        });
        }
    }
    }

return (
<div>
    <div className={styles.wrap}>
    <h6
        className={
        roomType === roomTypeArr[0]
            ? [styles.meetingUserinfo]
            : [styles.naboxUserinfo]
        }
    >예약자 정보
    </h6>
    <div
        ref={closeModal} //div영역을 벗어나 클릭하면 모달창 사라짐
        className={
        roomType === roomTypeArr[0]
            ? [styles.meetingInfoBox]
            : [styles.naboxInfoBox]
        }
    >
        <p>
        신청자명
        <input
            style={{ fontWeight: 'bold' }}
            className={styles.input}
            type='text'
            name='val'
            placeholder={userName}
            disabled
        />
        </p>
        {/* 팀원 검색 input */}
        {roomType === roomTypeArr[0] ? (
        <div>
            <form onSubmit={onSubmit}>
            <p>
                팀원선택
                <input
                className={styles.input}
                onChange={onChange}
                value={inputName}
                type='text'
                placeholder='팀원을 검색하세요'
                onClick={onClickModal}
                />
            </p>
            </form>
            {isShowModal === true ? (
            <div className={styles.meetingInputList}>
                {searchedNameState.map((item, index) => (
                <button
                    onClick={() => onClickSearched(item)}
                    key={index}
                    className={styles.membersName}
                >
                    {item}
                </button>
                ))}
            </div>
            ) : null}
            <div className={styles.membersBox}>
            {selectedNameState.map((item, index) => (
                <button
                className={styles.selectMembers}
                onClick={() => onClickSelected(index)}
                key={index}
                >
                {`${item} X`}
                </button>
            ))}
            </div>
        </div>
        ) : null}
    </div>
    </div>
    <div>
    <h6 className={styles.time}> 시간 선택 </h6>
    {/* 매니저인 경우만 버튼 안내 */}
    {userClass === 0 ? <TimeBtnExplain /> : null}
    {/* 시간 선택 체크 박스  */}
    <div className={styles.timetable}>
        {times.map((time, index) => (
        <span key={index}>
            <Tooltip
            placement='bottom'
            title={
                userClass !== 0 ||
                floor === 4 ||
                pastState[index] ||
                !bookedState[index]
                ? ''
                : isOfficial[index]
                ? '공식일정예약'
                : '인재예약'
            }
            >
            <Checkbox
                onChange={() => onChangeCheckBox(index)}
                variant='success'
                checked={checkedState[index]}
                disabled={
                pastState[index] || isOfficial[index]
                    ? true
                    : userClass === 0 && floor !== 4
                    ? false
                    : bookedState[index]
                }
                style={
                userClass === 0 && bookedState[index] && floor !== 4
                    ? {
                        margin: '10px',
                        color: 'pink',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }
                    : checkedState[index] || indeterminateState[index]
                    ? {
                        margin: '10px',
                        color: '#3695f5',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }
                    : {
                        margin: '10px',
                        color: 'green',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }
                }
            >
                {time}
            </Checkbox>
            </Tooltip>
        </span>
        ))}
    </div>
    <button
        className={(timeAblebtn === false || weeklyAblebtn === false) ? styles.bookbtnOff : styles.bookbtn}
        onClick={bookingConfirm}
        disabled={(timeAblebtn === false || weeklyAblebtn === false) ? true : false }
    >
        예약하기
    </button>
    </div>
</div>
);
};

export default BookingData;