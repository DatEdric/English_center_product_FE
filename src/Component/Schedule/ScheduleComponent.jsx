import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function ScheduleComponent() {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [error, setError] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get("http://localhost:3000/schedule/");
                setSchedules(response.data.result || []);
            } catch (err) {
                setError(err);
                console.error("Error fetching schedules:", err);
            }
        };

        fetchSchedules();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/schedule/", {
                date: selectedDate,
            });
            setResponseData(response.data);
        } catch (err) {
            console.error("Error posting data:", err);
            setError(err);
        }
    };

    const handleEditClick = async (scheduleId) => {
        navigate(`/schedule/edit/${scheduleId}`);
    };

    const handleDeleteClick = async (scheduleId) => {
        try {
            const response = await axios.patch(`http://localhost:3000/schedule/delete/${scheduleId}`);
            if (response.data[0] === 1) {
                toast.success("Xóa thành công!");

                setResponseData(prevData => prevData.filter(item => item.schedule_id !== scheduleId));
            } else {
                toast.error("Xóa không thành công!");
            }
        } catch (err) {
            console.error("Error deleting schedule:", err);
            toast.error("Đã xảy ra lỗi khi xóa lịch!");
        }
    };
    const handleGetDeletedRecord = async () => {
        navigate(`/schedule/deleted-all`)
     };
     
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <h1>Danh sách lịch học</h1>
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
                                    <th>Tên phòng học</th>
                                    <th>Ngày</th>
                                    <th>Ca dạy</th>
                                    <th>Giáo viên</th>
                                    <th>Tên Lớp</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {responseData == null
                                    ? []
                                    : responseData.map((item, index) => (
                                          <tr key={index} id={item.schedule_id}>
                                              <td>{item.classroom.classroom_name}</td>
                                              <td>{item.date}</td>
                                              <td>{item.shift.teaching_shift}</td>
                                              <td>{item.class.MainTeacher.teacher_name}</td>
                                              <td>{item.class.class_name}</td>
                                              <td>
                                                  <Button onClick={() => handleEditClick(item.schedule_id)} className="btn btn-warning">
                                                      Edit
                                                  </Button>
                                              </td>
                                              <td>
                                                  <Button onClick={() => handleDeleteClick(item.schedule_id)} className="btn btn-danger">
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
    );
}
