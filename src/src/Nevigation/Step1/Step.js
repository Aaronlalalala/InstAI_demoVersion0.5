import React, { useState , useEffect } from 'react';
import './Step.css';
import InstAI_icon from "../../image/instai_icon.png";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';


function Step() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userid = searchParams.get('id');
  const projectname = searchParams.get('project');
  const modelLink = `/Model?id=${userid}&projectname=${projectname}`;
  const [upload, setUpload] = useState(
    JSON.parse(localStorage.getItem(`firstPage_${userid}_${projectname}`) || 'false')
  );
  const [requirement, setRequirement] = useState(
    JSON.parse(localStorage.getItem(`secondPage_${userid}_${projectname}`) || 'false')
  );
  const [confirm1Data, setConfirm1Data] = useState(
    JSON.parse(localStorage.getItem(`confirmStatusImg_${userid}_${projectname}`) || 'false')
  );
  const [confirm2Data, setConfirm2Data] = useState(
    JSON.parse(localStorage.getItem(`confirmStatusReq_${userid}_${projectname}`) || 'false')
  );
  
  useEffect(() => {
    localStorage.setItem(`firstPage_${userid}_${projectname}`, upload.toString());
    localStorage.setItem(`secondPage_${userid}_${projectname}`, requirement.toString());
    localStorage.setItem(`confirmStatusImg_${userid}_${projectname}`, confirm1Data.toString());
    localStorage.setItem(`confirmStatusReq_${userid}_${projectname}`, confirm2Data.toString());
  }, [upload, requirement, confirm1Data, confirm2Data]); 

  /*const response =  來自後端回傳的檢查 可能使用axios 當這個頁面被點及進入時 後端會回傳說相對應的data以及req資料夾是否是空的 如果都是有一定資料量的話 回傳true */
  const navigate = useNavigate();
  // console.log("第一個按鈕:" ,upload , "第二個按鈕 ", requirement) ;
  const circleNo1ClassName = upload ? 'circleNo1-active' : 'circleNo1';
  const circleNo2ClassName = requirement ? 'circleNo2-active' : 'circleNo2';
  const circleNo3ClassName = confirm1Data ? 'circleNo3-active' : 'circleNo3';
  const circleNo4ClassName = confirm2Data ? 'circleNo4-active' : 'circleNo4';
  console.log('circleNo1ClassName:', circleNo1ClassName);
  console.log('circleNo2ClassName:', circleNo2ClassName);
  console.log('circleNo3ClassName:', circleNo3ClassName);
  console.log('circleNo4ClassName:', circleNo4ClassName);
  //-----------------------------------------------------//
  const Green1 = () => {
    console.log("upload 被點擊");
    const userConfirm = window.confirm("上傳資料");
    if (userConfirm) {
      if (!upload) {
          setUpload((prevData) => {
          const newUpload = !prevData;
          localStorage.setItem(`firstPage_${userid}_${projectname}`, newUpload.toString());
          return newUpload;
        });
        console.log("upload:",upload);
        navigate(`/Download2?id=${userid}&projectname=${projectname}`);
      }
    }
  };
  
  const Green2 = () => {
    console.log("第二個按鈕被點擊");
    const userConfirm=window.confirm("填寫需求");
    if (userConfirm) {
      if (!requirement) {
        setRequirement((prevData) => {
          const newRequirement = !prevData;
          localStorage.setItem(`secondPage_${userid}_${projectname}`, newRequirement.toString());
          return newRequirement;
        });
      }
      console.log("Fill out the form : ",requirement);
      navigate(`/Requirment?id=${userid}&projectname=${projectname}`);
    }
  };
  const handleFormDataChange = () => {
    const userConfirm=window.confirm("圖片檢查");
    if(userConfirm){
      if(confirm1Data){
        console.log("不須1212");
        navigate(`/ConfirmImg?id=${userid}&projectname=${projectname}`);
      }
      else{
        setConfirm1Data((prevData) => {
          const newConfirm1Data = !prevData;
          localStorage.setItem(`confirmStatusImg_${userid}_${projectname}`, newConfirm1Data.toString());
          return newConfirm1Data;
        });
      }
      console.log('Button clicked. Confirm is now:', confirm1Data);
      navigate(`/ConfirmImg?id=${userid}&projectname=${projectname}`);
    }
  };

  const handleForm2DataChange = () => {
    const userConfirm=window.confirm("x眼派對!!!");
    if(userConfirm){
      if(confirm2Data){
        console.log("不須變更");
        navigate(`/ConfirmReq?id=${userid}&projectname=${projectname}`);
      }
      else{
        setConfirm2Data((prevData) => {
          const newConfirm2Data = !prevData;
          localStorage.setItem(`confirmStatusReq_${userid}_${projectname}`, newConfirm2Data.toString());
          return newConfirm2Data;
        });
      }
    }
    console.log('Button clicked. Confirm is now:', confirm2Data);
    navigate(`/ConfirmReq?id=${userid}&projectname=${projectname}`);
  };

  const navigateLogic=()=>{
    const userConfirm=window.confirm("彥君的魔法世界");
    if(userConfirm ){
    if (confirm1Data  && confirm2Data ){  
      navigate(modelLink);
    }
    else{
      window.confirm("步驟錯誤");
      console.log("error reading");
    }
  }
   else{
    console.log("使用者說no! ");
    return;
   }
  }
  return (
    <div className="app">
        <div className='main-title-grid'>
          <div className='main-InstAI-icon'>
            <img src={InstAI_icon} className='logo' alt="Your Logo" />
          </div>
          <div className='main-allProject'>
              <div className="allProjects">
                <div style={{ fontWeight: "bold" }}>All Projects</div>
              </div>
          </div>
        </div>
        <div className="create-projectPage">
          <NavLink to={`/Project?id=${userid}&type=1`} className="projectPageLink">
            <button className="projectPageButton">返回專案頁面</button>
          </NavLink>
        </div>
        <div className="main-grid-line"></div>
        <h1 className='main-projectTitle'>
        Traffic cone 
        </h1>
      <nav className="secondNav">
        <ul>
          <li>Steps</li>
          <li>1.Upload & confirm  data</li>
          <li>2.Provide and confirm your model training requirements</li>
          <li>3.Train your AI model</li>
          <li>4.Download AI model</li>
        </ul>
      </nav>
      <div className='background'></div>
        <div className="stepRectangle"></div>
      <div className="circles">
        <div className={circleNo1ClassName} ></div>
        <div className={circleNo2ClassName}></div>
        <div className={circleNo3ClassName}></div>
        <div className={circleNo4ClassName}></div>
      </div>
      <div className="frame1">
        <ul>
          <li className='listTitle'>Upload training data</li>
          <li>Upload the image data you wish to use to train your style model</li> {/*第一個要追蹤的進度 如果使用者點進這個navlink之後 並且這個navlink被上傳的資料不為空 則顯示進度1完成 */}
        </ul>
        <button className="upload-buttonNo1" onClick={Green1} disabled={upload}>
              Upload
        </button>

      </div>

      <div className="frameNo2 ">
        <ul>
          <li className='listTitle'>Provide your training requirements</li> {/*第二個要追蹤的進度 如果使用者點進這個navlink之後 並且這個navlink上傳的資料不為空 則顯示進度2完成 */}
          <li>Tell us your specific needs for AI model training</li>
        </ul>

          <button className="upload-buttonNo2" onClick={Green2} disabled={requirement} >
            Fill out the form
            </button>
      </div>

      <div className="frameNo3">
      <ul>
          <li className='listTitle'>Training your AI model</li>
          <li>You haven't submitted data yet</li>
        </ul>
        <button className="upload-buttonNo3" onClick={handleFormDataChange}>Check data</button>
       <button className="upload-buttonNo4" onClick={handleForm2DataChange}>Check requirements</button>
      </div>

      <div className="frameNo4">
      <ul>
          <li className='listTitle'>Download AI model</li>
          <li>No model available for download</li>
        </ul>
        <button onClick={navigateLogic} className="upload-buttonNo5">start training</button>
      </div>
    
    </div>
  );
}

export default Step;