import React, { useState, useEffect } from "react";
import axios from "axios";
import Prompt from "../../Components/Prompt/Prompt2";
import { NavLink, useLocation } from "react-router-dom";
import "./Requirment.css";
import InstAI_icon from "../../image/instai_icon.png";
//import ReviewReq from "../Review/ReviewReq";
//import { useNavigate } from 'react-router-dom';

function Requirement() {
  const [reqData, setReqData] = useState({
    Requirement1: {
      question: "What is the type of location/environment that the AI model will be used?",
      answer: "1561561561566165156",
    },
    Requirement2: {
      question: "天俊好帥 對不對 有柴犬的男人讓人受不了",
      answer: "",
    },
    ID: "",
    author: "",
    LastUpdated: "",
  });
  //const navigate = useNavigate();
  //const [ReqPreviews, setReqPreviews] = useState([]);
  const [linktostep, setlinktostep] = useState(false);
  const [isDataChecked, setIsDataChecked] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const projectname = searchParams.get("projectname");

  // Set initial values for ID, author, and LastUpdated
  useEffect(() => {
    setReqData((prevData) => ({
      ...prevData,
      ID: projectname || "default_id",
      author: id || "default_user_id", 
      LastUpdated: new Date().toLocaleString(),
    }));
  }, [id]);

  const handleFormDataChange = (fieldName, value) => {
    setReqData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    if (fieldName !== "") {
      setlinktostep(true);
    }
    console.log(`Field ${fieldName} updated to:`, value);
  };

  const handleGenerateClick = async () => {
    const answer1Length = reqData.Requirement1.answer.trim().length;
    const answer2Length = reqData.Requirement2.answer.trim().length;
    // 增加字數限制 必須超過100字
    //if (answer1Length < 100 || answer2Length < 100) {
    //  alert("Answers cannot less than 100 characters ! please give detailed description.");
    //} 
   if (answer1Length === 0 || answer2Length === 0) {
      alert("Please answer both questions.");
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to submit?\n\nData to be submitted:\n${JSON.stringify(
          reqData,
          null,
          2
        )}`
      );
      if (confirmed) {
        setIsDataChecked(true);
      }
    }
  };

  const handleSendData = async () => {
    const requestData = {
      method: "POST",
      request: reqData,
      response: {
        message: "傳輸成功",
      },
    };
    try {
      const response = await axios.post(
        `http://localhost:8080/api/upload/requirement/?username=${id}&projectname=${projectname}`,
        requestData
      );
      console.log("server response:", response.data);
      alert("Requirement submitted successfully!");
      // Reset form data
      setReqData({
        Requirement1: {
          question: "What is the type of location/environment that the AI model will be used?",
          answer: "",
        },
        Requirement2: {
          question: "天俊好帥 對不對 有柴犬的男人讓人受不了",
          answer: "",
        },
        ID: "",
        author: "",
        LastUpdated: "",
      });
      setlinktostep(false);
      setIsDataChecked(false);
      //navigate 
      
    } catch (error) {
      console.error("Submission failed:", error);
      if (error.response) {
        alert(`Submission failed, status code: ${error.response.status}`);
      } else {
        alert("Submission failed. Check network connection or try again later.");
      }
    }
  };

  return (
    <div className="requirement-container">
      <div className="requirement-title-grid">
        <div className="requirement-InstAI-icon">
          <img src={InstAI_icon} className="requirement-icon" alt="Your Logo" />
        </div>
      </div>

      <div className="requirement-grid-line"></div>

      <div className="requirement-form">
        <h2>Requirement</h2>
        {/*<h2>Please give detail description ! answer wach question more than 100 characters</h2>*/}
        <h3>Question1</h3>
        <p>What is the type of location/environment that the AI model will be used?</p>
        <div className="prompt">
          <Prompt
            text={reqData.Requirement1.question}
            value={reqData.Requirement1.answer}
            onChange={(value) => handleFormDataChange("Requirement1", { ...reqData.Requirement1, answer: value })}
          />
        </div>

        <h3>Question2</h3>
        <p>天俊好帥 對不對 有柴犬的男人讓人受不了</p>
        <div className="prompt">
          <Prompt
            text={reqData.Requirement2.question}
            value={reqData.Requirement2.answer}
            onChange={(value) => handleFormDataChange("Requirement2", { ...reqData.Requirement2, answer: value })}
          />
        </div>

        <div className="button-group">
          {isDataChecked ? (
            <>
              {linktostep ? (
                <NavLink to={`/Step?id=${id}&project=${projectname}`}>
                  <button onClick={handleSendData} className="submitButton">
                    Submit
                  </button>
                </NavLink>
              ) : (
                <button onClick={handleSendData} className="submitButton">
                  Submit
                </button>
              )}
            </>
          ) : (
            <button onClick={handleGenerateClick} className="submitButton">
              Generate and Check
            </button>
          )}
           
          <br />
          <NavLink to={`/Step?id=${id}&project=${projectname}`}>
            <button className="BackPageButton">Go Back</button>
          </NavLink>
        </div>
        
      </div>
    </div>
  );
}

export default Requirement;
