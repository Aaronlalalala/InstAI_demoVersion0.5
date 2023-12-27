import React, { useState, useEffect } from "react";
import "./Project.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

import InstAI_icon from '../../image/instai_icon.png'

function Project() {
  const location = useLocation();
  const userid = location.state;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);


  console.log(searchParams)
  console.log(id)
  console.log(type)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/project/getproject/?username=${type ? id : userid}`);
        setProjectList(response.data);
      } catch (error) {
        console.error(error);
        console.error("文件讀取失敗");
      }
    };

    fetchData();
  }, []);

  const handleDeleteProject = async (index) => {
    const confirmDelete = window.confirm("確定要刪除專案?");
    if (!confirmDelete) {
      return;
    }

    const updatedProjects = [...projectList];
    const deletedProject = updatedProjects.splice(index, 1)[0];
    setProjectList(updatedProjects);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/project/deleteproject?username=${type ? id : userid}`,
        { projectName: deletedProject.trim() }
      );
      alert(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleLogout = () => {
    //setShowLogoutPrompt(true);
    const confirmlogout = window.confirm("確定要登出嗎？");
    if (!confirmlogout) {
      return;
    }
    navigate("/"); // Redirect to the home page
  };

  const handleConfirmLogout = () => {
    setShowLogoutPrompt(false);
    navigate("/"); // Redirect to the home page
  };

  const handleCancelLogout = () => {
    setShowLogoutPrompt(false);
  };

  const filteredProjects = projectList.filter(project =>
    project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

  
    <div className="project-page">

        <div className="project-title-grid">

          <div className="project-InstAI-icon">
            <img  className="project-icon" src={InstAI_icon} alt="instai"  />
          </div>

          <div className="project-logoutButton"> 
            <button className="logoutButton" onClick={handleLogout}>登出</button>
          </div>
         
        </div>

        <div className="project-grid-line"></div>
  
        <div className="project-first-grid">
         
          <h1 className="project-title" >Projects</h1>
            
          <div className="project-searchBar">
          <input 
            className="search-bar"
            type="text"
            placeholder="搜尋專案"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="project-addButton">
            <NavLink to={`/CreatePage?id=${type ? id : userid}`}>
              <button className="add-project-button">新增專案</button>
            </NavLink>
          </div>
      
        </div>
        {/* <button>設置</button> */}

        <div className="project-list">
          {filteredProjects.map((projectName, index) => (

        
              <div className="project" key={index}>
                <div className="project-list-grid">

                  <h2 className="project-Name">{projectName}</h2>
              
                  <NavLink className="projectNavLink" to={`/Step?id=${type ? id : userid}&project=${projectName}`}>
                    <p className="project-Detial" >{projectName}的詳細訊息</p>
                    </NavLink>
      
                  <div className="project-Delete">
                    <button className="deleteButton" onClick={() => handleDeleteProject(index)}>刪除專案</button>
                  </div>
              </div>
              
            </div>
        
          
          ))}
        </div>
       
        {/* Logout Prompt */}
        {showLogoutPrompt && (
          <div className="logout-prompt">
            <p>確定要登出嗎？</p>
            <button onClick={handleConfirmLogout}>確定</button>
            <button onClick={handleCancelLogout}>取消</button>
          </div>
        )}
      </div>
  );
}

export default Project;