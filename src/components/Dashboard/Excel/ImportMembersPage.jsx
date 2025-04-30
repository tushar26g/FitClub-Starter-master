import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import memberService from '../../../service/memberService'; // ✅ Corrected
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer

const defaultDtoFields = {
  name: 'Name',
  mobileNumber: 'Mobile Number',
  email: 'Email',
  dob: 'Date of Birth',
  gender: 'Gender',
  packageName: 'Package',
  joiningDate: 'Joining Date',
  membershipEndDate: 'Membership End Date',
  paymentStatus: 'Payment Status',
  paymentMethod: 'Payment Method',
  amountPaid: 'Amount Paid',
  height: 'Height',
  weight: 'Weight'
};

const ImportMembersPage = () => {
  const [excelData, setExcelData] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [error, setError] = useState(null); // Track error state

  const convertExcelDate = (value) => {
    // Excel serial date number
    if (typeof value === 'number') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed || parsed.d === 0 || parsed.m === 0 || parsed.y === 0) return '';
      const date = new Date(parsed.y, parsed.m - 1, parsed.d);
      return date.toISOString().split('T')[0]; // returns 'yyyy-MM-dd'
    }
  
    // Handle string dates like "01-04-2024" or "01/04/2024"
    if (typeof value === 'string') {
      const parts = value.split(/[-\/]/);
      if (parts.length === 3) {
        let [part1, part2, part3] = parts.map(p => p.padStart(2, '0'));
  
        if (part1.length === 4) {
          // Format: yyyy-mm-dd
          const date = new Date(`${part1}-${part2}-${part3}`);
          return isNaN(date) ? '' : date.toISOString().split('T')[0];
        } else {
          // Format: dd-mm-yyyy
          const y = part3.length === 4 ? part3 : '20' + part3;
          const date = new Date(`${y}-${part2}-${part1}`);
          return isNaN(date) ? '' : date.toISOString().split('T')[0];
        }
      }
    }
  
    return '';
  };
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return; // No file selected

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
    
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
    
        const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // read as raw array of rows
    
        // Find first row that is mostly strings → likely header
        let headerRowIndex = allRows.findIndex((row) => {
          return row.filter((cell) => typeof cell === 'string').length >= row.length / 2;
        });
    
        if (headerRowIndex === -1) throw new Error('No valid header row found in Excel.');
    
        const headers = allRows[headerRowIndex];
        const dataRows = allRows.slice(headerRowIndex + 1);
    
        const formatted = dataRows.map((row) =>
          headers.reduce((acc, header, i) => {
            acc[header] = row[i] ?? '';
            return acc;
          }, {})
        );
    
        setExcelData(formatted);
    
        // Auto-generate field mapping
        const columns = Object.keys(formatted[0] || {});
        const autoMapping = {};
        Object.keys(defaultDtoFields).forEach((dtoKey) => {
          const match = columns.find(
            (col) =>
              col.toLowerCase().replace(/\s/g, '') ===
              defaultDtoFields[dtoKey].toLowerCase().replace(/\s/g, '')
          );
          if (match) autoMapping[dtoKey] = match;
        });
    
        setFieldMapping(autoMapping);
        setError(null);
      } catch (err) {
        console.error('Excel Read Error:', err);
        toast.error(err.message || 'Failed to read Excel file.');
        setExcelData([]);
        setFieldMapping({});
      }
    };    

    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (!excelData.length) return toast.error('No data to import');
  
    const formattedData = excelData.map((row) => {
      const dto = {};
      Object.keys(fieldMapping).forEach((dtoKey) => {
        const rawValue = row[fieldMapping[dtoKey]] || '';
        if (['dob', 'joiningDate', 'membershipEndDate'].includes(dtoKey)) {
          dto[dtoKey] = convertExcelDate(rawValue);
        } else {
          dto[dtoKey] = rawValue;
        }
      });
      return dto;
    });
  
    const filteredData = formattedData.filter(
      (dto) => dto.name?.trim() || dto.mobileNumber?.trim()
    );

    try {
      const res = await memberService.importMembers(filteredData);
      const importedCount = res?.data?.data?.imported?.length || 0;
      const failedCount = res?.data?.data?.failed?.length || 0;
  
      toast.success(`${res.data.message}. Success: ${importedCount}, Failed: ${failedCount}`);
  
      if (res?.data?.data?.failed?.length) {
        console.error('Failed Rows:', res.data.data.failed);
      }
    } catch (error) {
      console.error('Import Error:', error);
      toast.error('Import failed. Check console for details.');
    }
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Import Members from Excel</h1>

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

          {/* Show error message if a password-protected file is selected */}
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          {excelData.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Map Excel Columns to Member Fields:</h2>
              {Object.keys(defaultDtoFields).map((dtoKey) => (
                <div key={dtoKey} className="flex items-center gap-4">
                  <Label className="w-40">{defaultDtoFields[dtoKey]}</Label>
                  <select
                    value={fieldMapping[dtoKey] || ''}
                    onChange={(e) =>
                      setFieldMapping((prev) => ({ ...prev, [dtoKey]: e.target.value }))
                    }
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option value="">-- Select Column --</option>
                    {excelData.length > 0 &&
                      Object.keys(excelData[0]).map((col, idx) => (
                        <option key={idx} value={col}>
                          {col}
                        </option>
                      ))}
                  </select>
                </div>
              ))}

              <Button className="mt-6 w-full" onClick={handleImport}>
                Import Members
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Toast container for toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ImportMembersPage;
