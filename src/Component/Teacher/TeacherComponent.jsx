import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function TeacherComponent () {
    // const [teacher, setTeacher] = (null);
    const [selectedDate, setSelectedDate] = useState("");
    const [error, setError] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchSchedules = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:3000/teacher/");
    //             setSchedules(response.data.result || []);
    //         } catch (err) {
    //             setError(err);
    //             console.error("Error fetching schedules:", err);
    //         }
    //     };

    //     fetchSchedules();
    // }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/teacher/", {
                date: selectedDate,
            });
            setResponseData(response.data);
        } catch (err) {
            console.error("Error posting data:", err);
            setError(err);
        }
    };
console.log(responseData);

    const handleEditClick = async (id) => {
        navigate(`/teacher/edit/${id}`);
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:3000/teacher/delete/${id}`);
            if (response.data[0] === 1) {
                toast.success("Xóa thành công!");

                setResponseData(prevData => prevData.filter(item => item.id !== id));
            } else {
                toast.error("Xóa không thành công!");
            }
        } catch (err) {
            console.error("Error deleting teacher:", err);
            toast.error("Đã xảy ra lỗi khi xóa lịch!");
        }
    };
    const handleGetDeletedRecord = async () => {
        navigate(`/teacher/deleted-all`)
     };
     
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <h1>Danh sách lịch của giáo viên</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="selectDate">
                            <Form.Label>Chọn ngày</Form.Label>
                            <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                        </Form.Group>
                        <Button className="mt-4" variant="primary" type="submit">
                            Xem Lịch
                        </Button>
                        {error && <p className="text-danger mt-2">Error: {error.message}</p>}
                    </Form>
                    <div className="mt-4">
                    <Button onClick={() => handleGetDeletedRecord()}  style={{float: 'right', margin:'20px'}}><i className="fa-solid fa-trash-can"></i></Button>
                        <h3>Danh sách lịch học:</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Giáo viên chính</th>
                                    <th>Giáo viên phụ</th>
                                    <th>tên lớp học</th>
                                    <th>Tên khóa học</th>
                                    <th>ngày bắt đầu</th>
                                    <th>ngày kết thúc</th>
                                    <th>Ngày dạy</th>
                                    <th>Tên phòng học</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {responseData == null
                                    ? []
                                    : responseData.map((item, index) => (
                                          <tr key={index} id={item.id}>
                                              <td>{item.MainTeacher.teacher_name}</td>
                                              <td>{item.SubTeacher.teacher_name}</td>
                                              <td>{item.class_name}</td>
                                              <td>{item.course.course_name}</td>
                                              <td>{item.start_date}</td>
                                              <td>{item.end_date}</td>
                                              <td>{item.schedules[0].schedule_date}</td>
                                              <td>{item.classroom.classroom_name}</td>
                                              <td>
                                                  <Button onClick={() => handleEditClick(item.id)} className="btn btn-warning">
                                                      Edit
                                                  </Button>
                                              </td>
                                              <td>
                                                  <Button onClick={() => handleDeleteClick(item.id)} className="btn btn-danger">
                                                      Delete
                                                  </Button>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}