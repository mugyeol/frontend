export default function useUrl() {

  const url = process.env.REACT_APP_BACK_URL;
  //const url = process.env.REACT_APP_BACK_URL_TEST;
  
  return url;
}
