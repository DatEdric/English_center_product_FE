import axios from 'axios';
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { toast } from 'react-toastify';

export default function DeletedTeacherComponent () {
    const [deletedTeacher ,setDeletedTeacher] = useState(null);
    useEffect(() => {
        const fetchDeletedTeacher = async () => {
            try {
                const response = await axios.get("http://localhost:3000/teacher/deleted-all");
                
                setDeletedTeacher(response.data);
            } catch (err) {
                setError(err);
                console.error("Error fetching Schedule:", err);
            }
        };
        fetchDeletedTeacher();
    },[]);
    const handleRestoreClick = async (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn phục hồi lớp học này không?");
        if (confirmed) {
            try {
                const response = await axios.put(`http://localhost:3000/teacher/restore/${id}`);
                if (response.data) {
                    toast.success("Phục hồi thành công!");
                    setDeletedTeacher((prev) => prev.filter(item => item.id !== id));
                } else {
                    toast.error("Phục hồi không thành công!");
                }
            } catch (error) {
                console.error("Error restoring teacher schedule:", error);
                toast.error("Đã xảy ra lỗi khi phục hồi lớp học!");
            }
        }
    };
    const handleForceDeleteClick = async (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn lớp học này không?");
        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:3000/teacher/force-delete/${id}`);
                if (response.data) {
                    toast.success("Xóa vĩnh viễn thành công!");
                    setDeletedSchedule((prev) => prev.filter(item => item.id !== id));
                } else {
                    toast.error("Xóa không thành công!");
                }
            } catch (error) {
                console.error("Error deleting teacher schedule:", error);
                toast.error("Đã xảy ra lỗi khi xóa lớp học!");
            }
        }
    };
    console.log(deletedTeacher);
    
    return (
        <>
         <Container>
                <Row>
                    <Col>
                    <div className="mt-4">
                        <h3>Các lịch học đã bị xóa:</h3>
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
                                {(deletedTeacher == null) ?(<tr><td className='text-center' colSpan="10">Không có lịch của giáo viên nào bị xóa</td></tr>) : ( deletedTeacher.map((item, index) => (
                                        <tr key={index} id={item.schedule_id}>
                                              <td>{item.MainTeacher.teacher_name}</td>
                                              <td>{item.SubTeacher.teacher_name}</td>
                                              <td>{item.class_name}</td>
                                              <td>{item.course.course_name}</td>
                                              <td>{item.start_date}</td>
                                              <td>{item.end_date}</td>
                                              <td>{item.schedules[0].schedule_date}</td>
                                              <td>{item.classroom.classroom_name}</td>
                                        <td><Button onClick={() => handleRestoreClick(item.id)} className='btn btn-warning'>Restore</Button></td>
                                        <td><Button onClick={() => handleForceDeleteClick(item.id)} className='btn btn-danger'> force Delete</Button></td>
                                        </tr>
                                    )))
                                    
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