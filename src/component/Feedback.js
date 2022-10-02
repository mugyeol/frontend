//styles
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
//hooks
import { useEffect, useState, useRef } from 'react';
import useUrl from '../hooks/useUrl';
import { fetchGet, fetchPostJson } from '../hooks/fetchUrl';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const myUrl = useUrl();
  const navigate = useNavigate();
  const feedbackRef = useRef(null); //input 화면 빈 값 처리

  //--useState 상태관리--//
  //GET : feedback data
  const [feedbackDatas, setFeedbackDatas] = useState([]);
  //GET : userRole data | userRole이 DEV인 경우 : 개발자들은 삭제기능 없애고 전체 데이터 읽어옴
  const [userRole, setUserRole] = useState('');
  //input값
  const [feedbacks, setFeedbacks] = useState('');
  console.log('feedbacks 초기값:', feedbacks);

  //input값 가져오는 첫번째 방법 1) useState 사용
  const onMouseOutContent = (e) => {
    setFeedbacks(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault(); //form의 전제 새로고침 기능 막음
    const arr = [...feedbackDatas];
    console.log('feedbacks 입력 값:', feedbacks);

    //feadback POST
    const postUrl = `http://${myUrl}/api/feedback`;
    if (feedbacks === '') {
      alert('내용을 입력해 주세요!');
    } else {
      const object = {
        content: feedbacks,
      };
      fetchPostJson(postUrl, object, navigate).then((data) => {
        if (data.message) {
          alert('피드백이 등록되었습니다, 감사합니다 :)');
          arr.push(feedbacks);
          setFeedbackDatas(arr);
          setFeedbacks(''); //빈 값 상태 변경 됨
          feedbackRef.current.value = ''; //input 화면도 빈 값 처리하기 위해 사용
        }
      });
    }
  };

  //feedback GET
  const url = `http://${myUrl}/api/feedback`;
  useEffect(() => {
    fetchGet(url, navigate).then((data) => {
      setFeedbackDatas(data?.feedbackData);
      setUserRole(data?.userRole);
    });
  }, [url, navigate]);
  console.log(feedbackDatas);
  //console.log(userRole);

  //Delete feedback POST
  const deleteFeedback = (deleteItem, index) => {
    const arr = [...feedbackDatas];
    //console.log('feedbackDatasArr:', arr);
    const postUrl = `http://${myUrl}/api/feedback/deletion`;
    const object = {
      content: deleteItem,
    };
    fetchPostJson(postUrl, object, navigate).then((data) => {
      //console.log(data.message);
      alert(data.message);
      //복제한 배열에서 삭제한 데이터 제거 후 state를 새로고침
      arr.splice(index, 1);
      setFeedbackDatas(arr);
    });
  };

  return (
    <Container style={{ marginTop: '60px' }}>
      <div>
        <Form>
          <p style={{ fontWeight: 'bold' }}>아래에 작성해 주세요!</p>
          <InputGroup style={{ marginTop: '10px' }}>
            <InputGroup.Text>피드백</InputGroup.Text>
            <Form.Control
              placeholder='최대 300글자 수 입력 가능'
              as='textarea'
              aria-label='With textarea'
              maxLength='300'
              onChange={(e) => {
                onMouseOutContent(e);
              }}
              ref={feedbackRef}
            />
          </InputGroup>
          <Button
            style={{
              display: 'block',
              margin: '30px auto',
              fontSize: '15px',
            }}
            variant='primary'
            type='submit'
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Form>
      </div>
      <div>
        <p style={{ marginTop: '50px', fontWeight: 'bold' }}>문의 사항</p>
        <hr />
        {feedbackDatas.map((item, index) => (
          <Card key={index} style={{ marginTop: '20px' }}>
            <Card.Body style={{ position: 'relative' }}>
              {item}
              {userRole === 'DEV'
                ? null
                : [
                    <button
                      key={index}
                      onClick={() => {
                        deleteFeedback(item, index);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '-10px',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: 'none',
                      }}
                    >
                      X
                    </button>,
                  ]}
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Feedback;

/*
//input값 가져오는 첫번째 방법 2) useRef() 사용
//styles
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
//hooks
import { useEffect, useRef, useState } from 'react';
import useUrl from '../hooks/useUrl';
import { fetchGet, fetchPostJson } from '../hooks/fetchUrl';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const myUrl = useUrl();
  const feedbackRef = useRef(null);

  const onSubmit = (event) => {
    event.preventDefault();

    //feadback POST
    const postUrl = `http://${myUrl}/api/feedback`;
    const object = {
      content: feedbackRef.current.value,
    };
    fetchPostJson(postUrl, object, navigate).then((data) => {
      //console.log(data);
      if (data.message) {
        alert('피드백이 등록되었습니다, 감사합니다 :)');

        feedbackRef.current.value = ''; //제출하고 나면 빈값으로 변경
      }
    });
  };

  //feedback GET
  const [feedbackDatas, setFeedbackDatas] = useState([]);
  //userRole이 DEV인 경우 -> 개발자들은 삭제기능 없애고 전체 데이터 읽어옴
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();
  const url = `http://${myUrl}/api/feedback`;
  useEffect(() => {
    fetchGet(url, navigate).then((data) => {
      setFeedbackDatas(data.feedbackData);
      setUserRole(data.userRole);
    });
  }, [url, navigate]);
  console.log(feedbackDatas);
  console.log(userRole);

  //Delete feedback POST
  const deleteFeedback = (deleteItem, index) => {
    const arr = [...feedbackDatas];
    //console.log('feedbackDatasArr:', arr);

    const postUrl = `http://${myUrl}/api/feedback/deletion`;
    const object = {
      content: deleteItem,
    };
    fetchPostJson(postUrl, object, navigate).then((data) => {
      console.log(data.message);
      alert(data.message);
      //복제한 배열에서 삭제한 데이터 제거 후 state를 새로고침
      arr.splice(index, 1);
      setFeedbackDatas(arr);
    });
  };

  return (
    <Container style={{ marginTop: '60px' }}>
      <div>
        <Form onSubmit={onSubmit}>
          <p style={{ fontWeight: 'bold' }}>아래에 작성해 주세요!</p>
          <InputGroup style={{ marginTop: '10px' }}>
            <InputGroup.Text>피드백</InputGroup.Text>
            <Form.Control
              placeholder='최대 300글자 수 입력 가능'
              as='textarea'
              aria-label='With textarea'
              ref={feedbackRef}
              maxLength='300'
            />
          </InputGroup>
          <Button
            style={{
              display: 'block',
              margin: '30px auto',
              fontSize: '15px',
            }}
            variant='primary'
            type='submit'
          >
            Submit
          </Button>
        </Form>
      </div>
      <div>
        <p style={{ marginTop: '50px', fontWeight: 'bold' }}>문의 사항</p>
        <hr />
        {feedbackDatas.map((item, index) => (
          <Card key={index} style={{ marginTop: '20px' }}>
            <Card.Body style={{ position: 'relative' }}>
              {item}
              {userRole === 'DEV'
                ? null
                : [
                    <button
                      key={index}
                      onClick={() => {
                        deleteFeedback(item, index);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '-10px',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: 'none',
                      }}
                    >
                      X
                    </button>,
                  ]}
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Feedback;
*/
