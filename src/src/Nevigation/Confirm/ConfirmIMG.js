import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink,  useNavigate ,useLocation } from 'react-router-dom';
import './ConfirmIMG.css';
import InstAI_icon from '../../image/instai_icon.png';

function ConfirmImg() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagePreviews2, setImagePreviews2] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');
  const [confirmed, setConfirmed] = useState(localStorage.getItem('confirmed') === 'true' || false);
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log("現在狀態",confirmed);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/upload/download?username=${id}&projectname=${projectname}`);
      console.log(response.data.images);
      setImagePreviews(response.data.images);
    } catch (error) {
      console.error('Error fetching image previews:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id, projectname]);

  const handleDeleteImage = async (index) => {
    const confirmDelete = window.confirm('確定要刪除圖片?');
    if (!confirmDelete) {
      return;
    }
    const updatedPreviews = [...imagePreviews];
    const deletedImage = updatedPreviews.splice(index, 1)[0];

    setImagePreviews(updatedPreviews);
    try {
      await axios.post(`http://localhost:8080/api/upload/deleteimg?username=${id}&projectname=${projectname}`, { filename: deletedImage });
      alert('Delete success');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleDeletepreviewImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews2];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews2(updatedPreviews);
  };
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
  
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
  
    try {
      const previews = filteredFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews2((prevPreviews) => [...prevPreviews, ...previews]);
    } catch (error) {
      console.error('Error:', error);
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
      localStorage.setItem('confirmed', 'false');
      setConfirmed(false);
    }
  };
  
  const handleConfirmRequirement = () => {
    const userConfirmed = window.confirm('Are you sure you want to confirm the requirement?');
    if (userConfirmed) {
      localStorage.setItem('confirmed', 'true');
      setConfirmed(true);
    }
  };

  const handleGoBack = () => {
    if (!confirmed) {
      const userConfirmed = window.confirm('You have not confirmed the requirement. Are you sure you want to go back?');
      if (!userConfirmed) {
        return; // Do not proceed if the user cancels
      }
    }

    if (confirmed) {
      window.alert('See your model later');
    }

    navigate(`/Step?id=${id}&project=${projectname}`);
  };
  const handleUpload = async () => {
    const confirmUpload = window.confirm('確定要新增圖片?');
    if (!confirmUpload) {
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; ++i) {
      formData.append('file', selectedFiles[i]);
    }
    console.log(selectedFiles.length);
    try {
      const response = await axios.post(`http://localhost:8080/api/upload/upload?username=${id}&projectname=${projectname}`, formData);
      console.log(response.data);
      alert('Upload success');
      setSelectedFiles([]);
      setImagePreviews2([]);
      fetchData();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Upload failed');
    }
  };

  return (
    <div className="review-container">
      <div className="main-InstAI-icon">
        <img src={InstAI_icon} className="logo" alt="Your Logo" />
      </div>
      <div>
      </div>
      <h2>Image Preview</h2>
      <div className="image-previews">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="image-preview">
            <img
              src={`http://localhost:8080${preview}`}
              alt={`image ${index}`}
              style={{ width: '128px', height: '128px' }}
              loading="lazy"
            />
            <button className="delete-button" onClick={() => handleDeleteImage(index)}>
              刪除
            </button>
          </div>
        ))}
        {imagePreviews2.map((preview, index) => (
        <div key={index} className="image-preview">
          <img
              src={preview}
              alt={`image ${index}`}
              style={{ width: '128px', height: '128px' }}
              loading="lazy"
            />
          <button className="delete-button" onClick={() => handleDeletepreviewImage(index)}>
              刪除
          </button>
        </div>
        ))}
      </div>
      <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} />
      <button
        onClick={handleConfirmButtonClick}
        style={{ backgroundColor: confirmed ? 'green' : '' }}
        disabled={confirmed}
      >
        {confirmed ? 'Requirement is already confirmed' : 'Confirm requirement is already'}
      </button>
      <button onClick={handleUpload}>Change</button>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default ConfirmImg;
