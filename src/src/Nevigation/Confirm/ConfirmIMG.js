import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import './ConfirmIMG.css';
import InstAI_icon from '../../image/instai_icon.png';

function ConfirmImg() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagePreviews2, setImagePreviews2] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');

  const [confirm1Data, setConfirm1Data] = useState(localStorage.getItem('confirmStatusImg') === 'true');
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  const handleFormDataChange = () => {
    setConfirm1Data((prevData) => {
      const newConfirm1Data = !prevData;
      localStorage.setItem('confirmStatusImg', newConfirm1Data.toString());
      return newConfirm1Data;
    });
    console.log('Button clicked. Confirm is now:', confirm1Data);
  };

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

  // const handleFileSelect = async (event) => {
  //   const files = event.target.files;
  //   const fileArray = Array.from(files);

  //   const allowedFileTypes = ['image/jpeg', 'image/png'];
  //   const filteredFiles = fileArray.filter((file) =>
  //     allowedFileTypes.includes(file.type)
  //   );

  //   setSelectedFiles(filteredFiles);

  //   try {
  //     const previews = filteredFiles.map((file) => URL.createObjectURL(file));
  //     setImagePreviews2([...imagePreviews2, ...previews]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
  
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const filteredFiles = fileArray.filter((file) =>
      allowedFileTypes.includes(file.type)
    );
  
    // Concatenate the new files with the existing ones
    setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
  
    try {
      const previews = filteredFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews2((prevPreviews) => [...prevPreviews, ...previews]);
    } catch (error) {
      console.error('Error:', error);
    }
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
        <NavLink to={`/Step?id=${id}&project=${projectname}`}>
          <button className='goback'>Go Back</button>
        </NavLink>
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
            {/* {preview.startsWith('/uploads') ? (
              // External URL
              <img
              src={`http://localhost:8080${preview}`}
                alt={`image ${index}`}
                style={{ width: '128px', height: '128px' }}
                loading="lazy"
              />
            ) : (
              // Local preview
              <img
                src={preview}
                alt={`image ${index}`}
                style={{ width: '128px', height: '128px' }}
                loading="lazy"
              />
            )} */}
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
      <button onClick={handleUpload}>Change</button>
      <button onClick={handleFormDataChange}>{confirm1Data ? '確認' : '取消確認'}</button>
    </div>
  );
}

export default ConfirmImg;
