import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import memberService from '../../../service/memberService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './popup.css';
import './import-members.css';
import { useTheme } from '../../../context/ThemeContext';

const ImportMembersPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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
      if (response.data === "Email sent successfully.") {
        setSuccessMessage('✅ Excel uploaded successfully. Data will reflect within 1 day.');
        setSelectedFile(null);
      } else {
        toast.error('Failed to send file. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to send file. Please try again.');
    }
  };

  return (
   <div
      className="import-container"
      style={{
        background: isDarkMode
          ? '#121212'
          : 'var(--pageBackground)',  // your defined CSS variable
        color: isDarkMode ? '#f5f5f5' : '#222',
        transition: 'all 0.3s ease'
      }}
    >
      <h1 className="page-title">{isDarkMode ? '🌙 ' : '☀️ '}Send Members Excel File</h1>

      <div 
        className="card"
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <div className="card-content">
          <label 
            htmlFor="excelUpload" 
            className="input-label"
            style={{
              color: isDarkMode ? '#fff' : '#333',   // white in dark mode, dark grey in light mode
              fontWeight: 600
            }}
          >
            Upload Excel File:
          </label>

          <input
            type="file"
            id="excelUpload"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="file-input"
            style={{
              backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
              color: isDarkMode ? '#f5f5f5' : '#222',
              border: `1px solid ${isDarkMode ? '#444' : '#ccc'}`
            }}
          />

          <button
            onClick={handleSendEmail}
            disabled={!selectedFile}
            className="submit-button"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(90deg, #ff7a18, #af002d 70%)' 
                : '#f97316',
              color: '#fff'
            }}
          >
            Upload Excel File
          </button>

          {successMessage && (
            <div 
              className="success-message"
              style={{
                backgroundColor: isDarkMode ? '#004d40' : '#e6ffed',
                color: isDarkMode ? '#80cbc4' : '#127b3f',
                border: `1px solid ${isDarkMode ? '#00796b' : '#a1e6b3'}`
              }}
            >
              {successMessage}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="modal-overlay">
          <div 
            className="modal-box"
            style={{
              backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
              color: isDarkMode ? '#f5f5f5' : '#222'
            }}
          >
            <h2>Password Protected File</h2>
            <p>Please upload an Excel file that is <strong>not password protected</strong>.</p>
            <button 
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: isDarkMode ? '#444' : '#f97316',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default ImportMembersPage;
