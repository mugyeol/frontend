import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmptyPage() {
  const id = window.localStorage.getItem("userid");
  const navigate = useNavigate();
  useEffect(() => {
    if (id === null) {
      alert("잘못된 접근입니다.");
      navigate("/");
    } else {
      alert("잘못된 접근입니다.");
      navigate("/main");
    }
  },[id,navigate]);

  return <div></div>;
}
