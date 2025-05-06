import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import memberService from '../../../service/memberService';
import './popup.css'; // For modal
import './import-members.css'; // New file for general styling
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImportMembersPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      XLSX.read(data, { type: 'buffer' });
      setSelectedFile(file);
      setShowPopup(false);
      setSuccessMessage(''); 
    } catch (err) {
      console.warn('Password-protected or unreadable Excel file:', err);
      setSelectedFile(null);
      setShowPopup(true);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedFile) {
      toast.error('Please select an Excel file.');
      return;
    }

    const owner = localStorage.getItem('owner');
    if (!owner) {
      toast.error('Gym owner not found.');
      return;
    }

    const parsedOwner = JSON.parse(owner);
    const formData = new FormData();
    formData.append('excelFile', selectedFile);
    formData.append('ownerId', new Blob([JSON.stringify(parsedOwner.id)], { type: 'application/json' }));
    formData.append('name', new Blob([JSON.stringify(parsedOwner.fullName)], { type: 'application/json' }));
    formData.append('mobileNumber', new Blob([JSON.stringify(parsedOwner.mobileNumber)], { type: 'application/json' }));

    try {
      const response = await memberService.importMembers(formData);
      // toast.success('Excel file sent successfully.');
      console.log('Response:', response.data);
      if (response.data === "Email sent successfully."){
        setSuccessMessage('✅ Excel uploaded successfully. Data will reflect within 1 day.');
        setSelectedFile(null);
      }else{
        toast.error('Failed to send file. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to send file. Please try again.');
    }
  };

  return (
    <div className="import-container">
      <h1 className="page-title">Send Members Excel File</h1>

      <div className="card">
        <div className="card-content">
          <label htmlFor="excelUpload" className="input-label">Upload Excel File:</label>
          <input
            type="file"
            id="excelUpload"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="file-input"
          />

          <button
            onClick={handleSendEmail}
            disabled={!selectedFile}
            className="submit-button"
          >
            Upload Excel File
          </button>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Password Protected File</h2>
            <p>Please upload an Excel file that is <strong>not password protected</strong>.</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default ImportMembersPage;
