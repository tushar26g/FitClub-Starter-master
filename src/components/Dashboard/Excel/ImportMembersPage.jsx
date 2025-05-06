import React, { useState } from 'react';
import memberService from '../../../service/memberService';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImportMembersPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSuccessMessage('');
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
    const parsedOwner = JSON.parse(localStorage.getItem('owner'));
const formData = new FormData();

formData.append('excelFile', selectedFile);
formData.append('ownerId', new Blob([JSON.stringify(parsedOwner.id)], { type: 'application/json' }));
formData.append('name', new Blob([JSON.stringify(parsedOwner.fullName)], { type: 'application/json' }));

    try {
      const res = await memberService.importMembers(formData);
      toast.success('Excel file sent successfully.');
      setSuccessMessage('✅ Your Excel file was uploaded successfully. Your data will be reflected within 1 day.');
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to send file. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Send Members Excel File via Email</h1>

      <Card className="bg-white shadow-lg rounded-2xl p-4">
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Label htmlFor="excelUpload">Upload Excel File:</Label>
            <Input
              type="file"
              id="excelUpload"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </div>

          <Button className="mt-4 w-full" onClick={handleSendEmail} disabled={!selectedFile}>
            Send Excel File
          </Button>

          {successMessage && (
            <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-md shadow-sm border border-green-300">
              {successMessage}
            </div>
          )}
        </CardContent>
      </Card>

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
