import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Create.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import InstAI_icon from '../../image/instai_icon.png';

function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({
    projectName: "",
    devices: [],
  });

  const handleFormDataChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    console.log(`Field ${fieldName} updated to:`, value);
  };

  const addProject = async () => {
    if (formData.projectName.trim() === "") {
      alert("請輸入專案名稱");
    } else {
      console.log("Form submitted:", formData);
      try {
        const response = await axios.post(
          `http://localhost:8080/api/project/addproject?username=${id}`,
          { projectName: formData.projectName.trim() }
        );
        alert(response.data);
        handleFormDataChange("projectName", "");
        console.log(response);

        // 導航回去
        navigate(`/Project?id=${id}&type=1`);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    }
  };

  const enterSolve = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 避免預設跳轉
      await addProject(); // non-blocking statement
    }
  };

  return (
    <div className="create-page">
      <div className="create-title-grid">
        <div className="create-InstAI-icon">
          <img className="create-icon" src={InstAI_icon} alt="instai" />
        </div>
        <div className="create-projectPage">
          <NavLink to={`/Project?id=${id}&type=1`} className="projectPageLink">
            <button className="projectPageButton">返回專案頁面</button>
          </NavLink>
        </div>
      </div>

      <div className="create-grid-line"></div>

      <div className="create-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <h1 className="create-title">Create Projects</h1>
          </div>
          <div className="createProjectName">
            <label>專案名稱：</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={(e) => handleFormDataChange("projectName", e.target.value)}
              onKeyDown={enterSolve}
            />
          </div>

          <button className="createButton" type="button" onClick={addProject}>
            新增專案
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create;
