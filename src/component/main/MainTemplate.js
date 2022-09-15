import SecondFloor from './secondFloorComponents/SecondFloor';
import ThirdFloor from './thirdFloorComponents/ThirdFloor';
import FourthFloor from './fourthFloorComponents/FourthFloor';
import styles from './MainTemplate.module.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import useUrl from '../../hooks/useUrl';
import { fetchGet } from '../../hooks/fetchUrl';
import { reAuthExpired, refreshToken, sendAuth } from '../../hooks/authModule';


const MainTemplate = () => {

  const myUrl = useUrl();

  const [userClasses, setUserClasses] = useState('');
  const [maxClasses, setMaxClasses] = useState('');

  const url = `http://${myUrl}/api/user/data`;
  const location = useLocation()
  useEffect(() => {
    
    // fetchGet(url,location)
    fetch(url, {
      method: 'GET',
      headers: sendAuth(),
    })
      .then((res) =>{
          refreshToken(res.headers.get('Authorization'))
          return res.json()
      } )  
        .then((res) => res.json())
        .then((data) => {
          if(data.message==="success"){
            setUserClasses(data.userData.classes);
            setMaxClasses(data.maxClasses);
          }else{
            reAuthExpired()
          }
        });
  }, [ url, location]);
  return (
    <div>
      <div className={styles.floorContainer}>
        {/* classes 활용 */}
        {userClasses === 0 ? (
          [
            <SecondFloor key='2' className={styles.secondFloor} />,
            <ThirdFloor key='3' className={styles.thirdFloor} />,
            <FourthFloor key='4' className={styles.fourthFloor} />,
          ]
        ) : userClasses === maxClasses ? (
          <ThirdFloor key='3' className={styles.thirdFloor} />
        ) : (
          <SecondFloor key='2' className={styles.secondFloor} />
        )}
      </div>
    </div>
  );
};

export default MainTemplate;
