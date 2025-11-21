import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMe, User } from "../../../api/AuthApi"; // 로그인한 유저 정보 가져오는 API
import "./AnswerWrite.css";

interface CsDetail {
  id: number;
  username: string;
  branchName: string;
  title: string;
  content: string;
  answerContent?: string;
  status: string;
  csCategory: string;
  createdAt: string;
}

const MyCsListDetail: React.FC = () => {
  const navigate = useNavigate();

  return <div className="title">문의 페이지
  </div>
};

export default MyCsListDetail;
