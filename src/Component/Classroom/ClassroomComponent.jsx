import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ClassroomComponent() {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [error, setError] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await axios.get("http://localhost:3000/room/");
                setClassrooms(response.data.result || []);
            } catch (err) {
                setError(err);
                console.error("Error fetching classrooms:", err);
            }
        };

        fetchClassrooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/room/", {
                classroomName: selectedClassroom,
                scheduleDate: selectedDate,
            });
            setResponseData(response.data);
        } catch (err) {
            console.error("Error posting data:", err);
            setError(err);
        }
    };

    const handleEditClick = async (classId) => {
        navigate(`/classroom/edit/${classId}`)
    };
    const handleDeleteClick = async (classId) => {
        try {
            const response = await axios.patch(`http://localhost:3000/room/delete/${classId}`);
            if (response.data[0] === 1) {
                toast.success("Xóa thành công!");
                setResponseData((prevData) => prevData.filter(item => item.id !== classId));
            } else {
                toast.error("Xóa không thành công!");
            }
        } catch (err) {
            console.error("Error fetching classroom details:", err);
            toast.error("Đã xảy ra lỗi khi xóa lớp học!");
        }
    };
     const handleGetDeletedRecord = async () => {
        navigate(`/classroom/deleted-all`)
     };
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <h1>Danh sách các lớp học đang hoạt động</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="selectClassroom">
                            <Form.Label>Select a Classroom</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedClassroom}
                                onChange={(e) => setSelectedClassroom(e.target.value)}
                            >
                                <option value="">-- Select a Classroom --</option>
                                {classrooms.map((option, index) => (
                                    <option key={index} value={option.classroom_name}>
                                        {option.classroom_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="selectDate">
                            <Form.Label>Select a Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="mt-4" variant="primary" type="submit">
                            Submit
                        </Button>
                        {error && <p className="text-danger mt-2">Error: {error.message}</p>}
                    </Form>
                    <div className="mt-4">
                        <Button onClick={() => handleGetDeletedRecord()}  style={{float: 'right', margin:'20px'}}><i className="fa-solid fa-trash-can"></i></Button>
                        <h3>Response from Server:</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Tên lớp học</th>
                                    <th>Tên giáo viên chính</th>
                                    <th>Tên phòng học</th>
                                    <th>Lịch theo ngày</th>
                                    <th>Ca dạy học </th>
                                    <th>Loại phòng</th>
                                    <th>Tên khóa học</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {responseData == null ? [] : responseData.map((item, index) => (
                                        <tr key={index} id={item.id}  >
                                            <td>{item.class_name}</td>
                                            <td>{item.MainTeacher.teacher_name}</td>
                                            <td>{item.classroom.classroom_name}</td>
                                            <td>{item.schedules[0]?.schedule_date}</td>
                                            <td>{item.schedules[0]?.shift.teaching_shift}</td>
                                            <td>{item.classroom.type}</td>
                                            <td>{item.course.course_name}</td>
                                            <td><Button onClick={() => handleEditClick(item.id)} className='btn btn-warning'>Edit</Button></td>
                                            <td><Button onClick={() => handleDeleteClick(item.id)} className='btn btn-danger'>Delete</Button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}