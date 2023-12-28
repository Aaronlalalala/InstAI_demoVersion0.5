import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css'; 
import InstAI_icon from '../../image/instai_icon.png';

function ConfirmReq() {
  const [reqData, setReqData] = useState({});
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname');
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(JSON.parse(localStorage.getItem(`confirmed_${id}_${projectname}`)) === true);

  console.log('Initial confirmed value:', confirmed);
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

  useEffect(() => {
    localStorage.setItem(`confirmed_${id}_${projectname}`, confirmed.toString());
    fetchData();
  }, [id, projectname]);

  const handleSaveButtonClick = async () => {
    try {
      const updatedData = {
        Requirement1: {
          question: reqData.Requirement1.question,
          answer: editable ? document.getElementById('editedAnswer1').innerText : reqData.Requirement1.answer,
        },
        Requirement2: {
          question: reqData.Requirement2.question,
          answer: editable ? document.getElementById('editedAnswer2').innerText : reqData.Requirement2.answer,
        },
        ID: id,
        author: '',
        LastUpdated: new Date().toLocaleString(),
      };

      const response = await axios.post(
        `http://localhost:8080/api/upload/requirement/?username=${id}&projectname=${projectname}`,
        { data: updatedData }
      );

      console.log('Data updated successfully:', response.data);

      fetchData();
      setEditable(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleConfirmButtonClick = () => {
    console.log('handleConfirmButtonClick triggered');
    const confirmeState = window.confirm("do you want to change confirm state");
  
    if (confirmeState) {
      if(confirmed){
        console.log("取消確認狀態");
        handleCancelConfirmation();
      }
      else{
        console.log("確認狀態");
        handleConfirmRequirement();
      }
    } else {
      console.log("取消變更");
      return;
    }
  };
  
  const handleCancelConfirmation = () => {
  const userConfirmed = window.confirm('Are you sure you want to cancel the confirmation?');
  if (userConfirmed) {
    localStorage.setItem(`confirmed_${id}_${projectname}`, 'false');
    setConfirmed(false);
  }
};

const handleConfirmRequirement = () => {
  const userConfirmed = window.confirm('Are you sure you want to confirm the requirement?');
  if (userConfirmed) {
    localStorage.setItem(`confirmed_${id}_${projectname}`, 'true');
    setConfirmed(true);
  }
};

  const handleGoBack = () => {
    if (!confirmed) {
      const userConfirmed = window.confirm('You have not confirmed the requirement. Are you sure you want to go back?');
      if (!userConfirmed) {
        return; 
      }
    }

    if (confirmed) {
      window.alert('See your model later');
    }

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
      <button
        onClick={handleConfirmButtonClick}
        style={{ backgroundColor: confirmed ? 'green' : '' }}
      >
        {confirmed ? 'Requirement is already confirmed' : 'Confirm requirement is already'}
      </button>
      <button onClick={() => setEditable(!editable)}>{editable ? 'Cancel Edit' : 'Edit'}</button>
      {editable && <button onClick={handleSaveButtonClick}>Save Edition</button>}
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default ConfirmReq;
