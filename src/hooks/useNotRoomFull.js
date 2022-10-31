const useNotRoomFull = ({ roomid, bookingData }) => {
  // roomFull 함수 설정
  // 현재 시간을 통해 남은 예약 가능 시간 확인
  const Now = new Date()
  const NowHour = Now.getHours()
  const OverHour = NowHour + 1
  const RemainTime = 21 - OverHour

  // 09:00 과 같은 형태 9로 수정해주는 함수
  const TimeToString = (time) => {
    let newTime
    if (time === '09:00') {
      newTime = time.substr(1, 1)
    } else {
      newTime = time.substr(0, 2)
    }
    return newTime
  }

  // room아이디와 현재 시간으로 거른 예약 현황
  const roomState = bookingData.filter(
    (room) =>
      room.roomId === roomid &&
      Number(TimeToString(room.startTime)) >= Number(OverHour)
  )

  //중간에 껴있는 시간 추출
  const middleRoomState = bookingData.filter(
    (room) =>
      room.roomId === roomid &&
      Number(TimeToString(room.startTime)) < Number(OverHour) &&
      Number(TimeToString(room.endTime)) > Number(OverHour)
  )

  // 거른 예약 현황을 대상으로 시간 추출 리스트
  const roomBookingState = roomState.map(
    (room) => TimeToString(room.endTime) - Number(TimeToString(room.startTime))
  )

  //중간에 껴있는 시간의 현재 시간 이후 시간 추출 리스트
  const middleBookingState = middleRoomState.map(
    (room) => Number(TimeToString(room.endTime)) - Number(OverHour)
  )

  // 추출한 시간 합
  const sum = roomBookingState.reduce(function add(sum, currValue) {
    return sum + currValue
  }, 0)

  //중간에 껴있는 시간 합
  const middleSum = middleBookingState.reduce(function add(sum, currValue) {
    return sum + currValue
  }, 0)

  // 전체 추출 시간들의 합과 남은 시간 불린으로 결과값 제출
  return sum + middleSum < RemainTime

  // 함수 테스트
  // return [middleSum, sum, sum + middleSum < RemainTime]
}

export default useNotRoomFull
