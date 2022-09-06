import React from 'react'
import { useState, useEffect } from 'react'
import styles from './SecondFloorMeetingRoomState.module.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Poplay from '../Poplay'
import { Link } from 'react-router-dom'
import {
  // EmojiSmileFill,
  ArrowRightCircleFill,
  // Calendar2CheckFill,
} from 'react-bootstrap-icons'
import useUrl from '../../../hooks/useUrl'

const SecondFloorMeetingRoomState = () => {
  // API 2층 회의실 가져오기
  const [bookingData, setBookingData] = useState([])
  const [roomData, setRoomData] = useState([])

  const [SinyangID, setSinYangID] = useState('')
  const [SinyangName, setSinYangName] = useState('')

  const userClasses = window.localStorage.getItem('class')

  const myUrl = useUrl()
  const url = `http://${myUrl}/api/booking/details-booking?floor=2`
  useEffect(() => {
    fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setBookingData(data.BookingData)
        setRoomData(data.RoomData)
        setSinYangID(
          data.RoomData.filter((rooms) => rooms.roomId === 207)[0].roomId
        )
        setSinYangName(
          data.RoomData.filter((rooms) => rooms.roomName === '신양')[0].roomName
        )
      })
  }, [url, myUrl])

  const SecondMeetingRoominfo = roomData.filter(
    (rooms) => rooms.roomType === 'meeting' && rooms.roomName !== '신양'
  )

  // 타임 리스트 돌리기
  let timeList = []
  for (let i = 9; i <= 20; i++) {
    timeList.push(i + '시')
  }

  // 09:00 형태 9로 숫자만 뽑아주는 함수
  const TimeToString = (time) => {
    let newTime
    if (time === '09:00') {
      newTime = time.substr(1, 1)
    } else {
      newTime = time.substr(0, 2)
    }
    return newTime
  }

  // 9시 형태 9로 숫자만 뽑아주는 함수
  const onlyTime = (time) => {
    let newTime
    if (time === '9시') {
      newTime = time.substr(0, 1)
    } else {
      newTime = time.substr(0, 2)
    }
    return newTime
  }

  // 시간당 룸의 예약 데이터 불러오는 함수
  const TimeAndRoomFilter = (Time, Room) => {
    let timedata = bookingData.filter(
      (room) =>
        room.roomId === Room && TimeToString(room.startTime) === onlyTime(Time)
    )
    return timedata
  }

  // 시간당 룸의 예약이 있는지 없는지 함수
  const IsThisTimeRoombooked = (Time, Room) => {
    const IsTrue = TimeAndRoomFilter(Time, Room).length !== 0
    return IsTrue
  }

  // 예약 시간 함수
  const bookingLength = (startTime, endTime) => {
    let length = Number(TimeToString(endTime)) - Number(TimeToString(startTime))
    return length
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered" id={styles.table}>
        <thead className="table-light" id={styles.thead}>
          <tr id={styles.theadTr}>
            <th className="table-primary" id={styles.time}></th>

            {/* 룸 값 불러오기 */}
            {SecondMeetingRoominfo.map((room) => (
              <th key={room.roomId} className="table-primary" id={styles.text}>
                <Link to={`/booking/${room.roomId}`}>
                  <ArrowRightCircleFill />
                  {room.roomName}
                </Link>
              </th>
            ))}
            {userClasses === '0' ? (
              <th key={SinyangName} className="table-primary" id={styles.text}>
                <Link to={`/booking/${SinyangID}`}>
                  <ArrowRightCircleFill />
                  {SinyangName}
                </Link>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody id={styles.tbody}>
          {/* 시간을 맵으로 돌려 전체 상태값 전달 */}
          {timeList.map((time) => (
            <tr key={time} id={styles.tbodyTr}>
              <th className={styles.time}>{time}</th>
              {/* 룸을 맵으로 돌려 하나의 시간에 상태값 전달 */}
              {SecondMeetingRoominfo.map((room) => (
                <th key={room.roomId} className={styles.roomstate}>
                  {IsThisTimeRoombooked(time, room.roomId) ? (
                    <OverlayTrigger
                      trigger="click"
                      key={TimeAndRoomFilter(time, room.roomId)[0].bookingId}
                      placement="top"
                      overlay={
                        <Popover id="popover-positioned-top">
                          <Popover.Body>
                            <Poplay
                              userName={
                                TimeAndRoomFilter(time, room.roomId)[0]
                                  .applicant.userName
                              }
                              startTime={
                                TimeAndRoomFilter(time, room.roomId)[0]
                                  .startTime
                              }
                              endTime={
                                TimeAndRoomFilter(time, room.roomId)[0].endTime
                              }
                              roomName={
                                TimeAndRoomFilter(time, room.roomId)[0].roomName
                              }
                              participants={
                                TimeAndRoomFilter(time, room.roomId)[0]
                                  .participants
                              }
                            />
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <button
                        style={{
                          height: `${
                            bookingLength(
                              TimeAndRoomFilter(time, room.roomId)[0].startTime,
                              TimeAndRoomFilter(time, room.roomId)[0].endTime
                            ) * 35.8
                          }px`,
                        }}
                        className={styles.bookingTime}
                        id={
                          TimeAndRoomFilter(time, room.roomId)[0].official
                            ? [styles.Manager]
                            : null
                        }
                        variant="secondary"
                      >
                        {TimeAndRoomFilter(time, room.roomId)[0].official
                          ? [<p key={1}>공식</p>]
                          : [
                              <p key={2}>
                                {
                                  TimeAndRoomFilter(time, room.roomId)[0]
                                    .applicant.userName
                                }
                              </p>,
                            ]}
                      </button>
                    </OverlayTrigger>
                  ) : null}
                </th>
              ))}

              {/* 신양 */}
              {userClasses === '0' ? (
                <th key={0} className={styles.roomstate}>
                  {IsThisTimeRoombooked(time, SinyangID) ? (
                    <OverlayTrigger
                      trigger="click"
                      key={TimeAndRoomFilter(time, SinyangID)[0].bookingId}
                      placement="top"
                      overlay={
                        <Popover id="popover-positioned-top">
                          <Popover.Body>
                            <Poplay
                              userName={
                                TimeAndRoomFilter(time, SinyangID)[0].applicant
                                  .userName
                              }
                              startTime={
                                TimeAndRoomFilter(time, SinyangID)[0].startTime
                              }
                              endTime={
                                TimeAndRoomFilter(time, SinyangID)[0].endTime
                              }
                              roomName={
                                TimeAndRoomFilter(time, SinyangID)[0].roomName
                              }
                              participants={
                                TimeAndRoomFilter(time, SinyangID)[0]
                                  .participants
                              }
                            />
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <button
                        style={{
                          height: `${
                            bookingLength(
                              TimeAndRoomFilter(time, SinyangID)[0].startTime,
                              TimeAndRoomFilter(time, SinyangID)[0].endTime
                            ) * 35.8
                          }px`,
                        }}
                        className={styles.bookingTime}
                        id={
                          TimeAndRoomFilter(time, SinyangID)[0].official
                            ? [styles.Manager]
                            : null
                        }
                        variant="secondary"
                      >
                        <p>
                          {
                            TimeAndRoomFilter(time, SinyangID)[0].applicant
                              .userName
                          }
                        </p>
                      </button>
                    </OverlayTrigger>
                  ) : null}
                </th>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SecondFloorMeetingRoomState
