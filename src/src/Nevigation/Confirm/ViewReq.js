import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css'; 
import InstAI_icon from '../../image/instai_icon.png';

function ViewReq() {
  const [reqData, setReqData] = useState({});
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname');
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/upload/getrequirement/?username=${id}&projectname=${projectname}`
      );
      const responseData = response.data.content;
      const parsedData = {};
      responseData.forEach(item => {
        const parsedItem = JSON.parse(`{${item}}`);
        Object.assign(parsedData, parsedItem);
      });
      setReqData(parsedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const handleGoBack = () => {
    console.log("已經檢查需求");
    navigate(`/Step?id=${id}&project=${projectname}`);
  };

  return (
    <div className="review-container">
      <div className="main-InstAI-icon">
        <img src={InstAI_icon} className="logo" alt="Your Logo" />
      </div>
      <div className="data-preview">
        <h2>Requirement Preview</h2>
        <div className="questions-answers">
          {reqData.Requirement1 && (
            <div className="question-answer">
              <p>Question 1: {reqData.Requirement1.question}</p>
              <p>
                Answer 1:{' '}
                {editable ? (
                  <span
                    id="editedAnswer1"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: reqData.Requirement1.answer }}
                  ></span>
                ) : (
                  reqData.Requirement1.answer
                )}
              </p>
            </div>
          )}

          {reqData.Requirement2 && (
            <div className="question-answer">
              <p>Question 2: {reqData.Requirement2.question}</p>
              <p>
                Answer 2:{' '}
                {editable ? (
                  <span
                    id="editedAnswer2"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: reqData.Requirement2.answer }}
                  ></span>
                ) : (
                  reqData.Requirement2.answer
                )}
              </p>
            </div>
          )}
        </div>
      </div>

    <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default ViewReq;
