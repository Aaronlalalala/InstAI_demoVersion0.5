import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css'; // Import the CSS file
import InstAI_icon from '../../image/instai_icon.png';

function ConfirmReq() {
  const [reqData, setReqData] = useState({});
  const [editable, setEditable] = useState(false);
  const [confirm2Data, setConfirm2Data] = useState(localStorage.getItem('confirmStatusImg') === 'true');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');

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
    fetchData();
  }, [id, projectname]);

  const handleFormDataChange = () => {
    setConfirm2Data((prevData) => {
      const newConfirm2Data = !prevData;
      localStorage.setItem('confirmStatusReq', newConfirm2Data.toString());
      return newConfirm2Data;
    });
    console.log('Button clicked. Confirm is now:', confirm2Data);
  };

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

  return (
    <div className="review-container">
      <div className="main-InstAI-icon">
        <img src={InstAI_icon} className="logo" alt="Your Logo" />
      </div>
      <div className="data-preview">
        <h2>Data Preview</h2>
        <div className="questions-answers">
          {reqData.Requirement1 && (
            <div className="question-answer">
              <p>
                Question 1: {reqData.Requirement1.question}
              </p>
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
              <p>
                Question 2: {reqData.Requirement2.question}
              </p>
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
      <button onClick={handleFormDataChange}>{confirm2Data ? 'confirm' : 'cancel confirm'}</button>
      <button onClick={() => setEditable(!editable)}>{editable ? 'cancel edit' : 'edit'}</button>
      {editable && <button onClick={handleSaveButtonClick}>save edition</button>}
      <NavLink to={`/Step?id=${id}&project=${projectname}`}>
        <button>Go Back</button>
      </NavLink>
    </div>
  );
}

export default ConfirmReq;
