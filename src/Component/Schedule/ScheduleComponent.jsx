import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import '../../assets/css/uploadFile.css';

export default function ScheduleComponent() {
  
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);

    const readExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validExtensions = ['.xlsx', '.xls'];
            const fileExtension = selectedFile.name.slice(-5).toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
                return;
            }
            setFile(selectedFile);
            readExcelFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warning('Vui lòng chọn file trước!');
            return;
        }

        const formData = new FormData();
        formData.append('schedule', file);
        try {
            const response = await axios.post(
                'http://localhost:3000/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            toast.success('File đã được upload thành công!');
        } catch (error) {
            console.error('Lỗi khi upload file:', error);
            toast.error('Đã xảy ra lỗi khi upload file.');
        }
    };
    const jsonValue = data.slice(1);
    return (
        <Container >

                                <div className="upload-container">
                                    <h2>Upload Schedule</h2>
                                    <label htmlFor="file-upload" className="custom-file-upload">
                    <FaFileExcel /> Chọn File Excel
                </label>
                                    <input
                                    id="file-upload"
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button onClick={handleUpload}>
                                        Upload
                                    </Button>
                                    {data.length > 0 && (
                                        <table
                                            border="1"
                                            className="table-excel"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Thời gian</th>
                                                    <th>Tên khóa học</th>
                                                    <th>Tên lớp</th>
                                                    <th>CM chính</th>
                                                    <th>CM Phụ</th>
                                                    <th>Học viên trong lớp</th>
                                                    <th>Ngày bắt đầu</th>
                                                    <th>Ngày kết thúc</th>
                                                    <th>Phòng học</th>
                                                    <th>Ngày bắt đầu</th>
                                                    <th>Ngày kết thúc</th>
                                                    <th>Phòng học</th>
                                                    {Object.entries(
                                                        data[0],
                                                    ).map(([key, value]) => (
                                                        <th key={key}>
                                                            {key}

                                                            <th>{value}</th>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jsonValue.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {row['Thời gian']}
                                                        </td>
                                                        <td>
                                                            {
                                                                row[
                                                                    'Tên khóa học'
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {row['Tên lớp']}
                                                        </td>
                                                        <td>
                                                            {row['CM chính']}
                                                        </td>
                                                        <td>{row['CM Phụ']}</td>
                                                        <td>
                                                            {
                                                                row[
                                                                    'Học viên trong lớp'
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                row[
                                                                    'Ngày bắt đầu'
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                row[
                                                                    'Ngày kết thúc'
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {row['Phòng học']}
                                                        </td>
                                                        <td>
                                                            {
                                                                row[
                                                                    'Ngày bắt đầu'
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                row[
                                                                    'Ngày kết thúc'
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {row['Phòng học']}
                                                        </td>
                                                        {Object.keys(
                                                            data[0],
                                                        ).map((key) => (
                                                            <td key={key}>
                                                                {Object.keys(
                                                                    row,
                                                                ).includes(key)
                                                                    ? row[key]
                                                                    : ''}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
        </Container>
    );
}

