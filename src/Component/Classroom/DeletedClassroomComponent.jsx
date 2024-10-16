import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { toast } from 'react-toastify';

export default function DeletedClassroomComponent() {
    const [deletedClassroom, setDeletedClassrooms] = useState(null);
    useEffect(() => {
        const fetchDeletedClassrooms = async () => {
            try {
                const response = await axios.get("http://localhost:3000/room/deleted-all");
                
                setDeletedClassrooms(response.data);
            } catch (err) {
                setError(err);
                console.error("Error fetching classrooms:", err);
            }
        };

        fetchDeletedClassrooms();
    }, []);
    const handleRestoreClick = async (itemId) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn phục hồi lớp học này không?");
        if (confirmed) {
            try {
                const response = await axios.put(`http://localhost:3000/room/restore/${itemId}`);
                if (response.data) {
                    toast.success("Phục hồi thành công!");
                    setDeletedClassrooms((prev) => prev.filter(item => item.id !== itemId));
                } else {
                    toast.error("Phục hồi không thành công!");
                }
            } catch (error) {
                console.error("Error restoring classroom:", error);
                toast.error("Đã xảy ra lỗi khi phục hồi lớp học!");
            }
        }
    };
     
    const handleForceDeleteClick = async (itemId) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn lớp học này không?");
        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:3000/room/force-delete/${itemId}`);
                if (response.data) {
                    toast.success("Xóa vĩnh viễn thành công!");
                    setDeletedClassrooms((prev) => prev.filter(item => item.id !== itemId));
                } else {
                    toast.error("Xóa không thành công!");
                }
            } catch (error) {
                console.error("Error deleting classroom:", error);
                toast.error("Đã xảy ra lỗi khi xóa lớp học!");
            }
        }
    };
    return (
        <>
            <Container>
                <Row>
                    <Col>
                    <div className="mt-4">
                        <h3>Các lớp học đã bị xóa:</h3>
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
                                {deletedClassroom == null ? [] : deletedClassroom.map((item, index) => (
                                        <tr key={index} id={item.id}  >
                                            <td>{item.class_name}</td>
                                            <td>{item.MainTeacher.teacher_name}</td>
                                            <td>{item.classroom.classroom_name}</td>
                                            <td>{item.schedules[0]?.schedule_date}</td>
                                            <td>{item.schedules[0]?.shift.teaching_shift}</td>
                                            <td>{item.classroom.type}</td>
                                            <td>{item.course.course_name}</td>
                                            <td><Button onClick={() => handleRestoreClick(item.id)} className='btn btn-warning'>Restore</Button></td>
                                            <td><Button onClick={() => handleForceDeleteClick(item.id)} className='btn btn-danger'> force Delete</Button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}