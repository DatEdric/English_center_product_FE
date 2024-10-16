import axios from 'axios';
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { toast } from 'react-toastify';


export default function DeletedScheduleComponent() {
    const [deletedSchedule , setDeletedSchedule] = useState(null);
    useEffect(() => {
        const fetchDeletedSchedule = async () => {
            try {
                const response = await axios.get("http://localhost:3000/schedule/deleted-all");
                console.log(response);
                
                setDeletedSchedule(response.data);
            } catch (err) {
                setError(err);
                console.error("Error fetching Schedule:", err);
            }
        };
        fetchDeletedSchedule();
    },[]);
    const handleRestoreClick = async (itemId) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn phục hồi lớp học này không?");
        if (confirmed) {
            try {
                const response = await axios.put(`http://localhost:3000/schedule/restore/${itemId}`);
                if (response.data) {
                    toast.success("Phục hồi thành công!");
                    setDeletedSchedule((prev) => prev.filter(item => item.id !== itemId));
                } else {
                    toast.error("Phục hồi không thành công!");
                }
            } catch (error) {
                console.error("Error restoring schedule daily:", error);
                toast.error("Đã xảy ra lỗi khi phục hồi lịch học!");
            }
        }
    };
    const handleForceDeleteClick = async (itemId) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn lịch học này không?");
        if (confirmed) {
            try {
                const response = await axios.delete(`http://localhost:3000/schedule/force-delete/${itemId}`);
                if (response.data) {
                    toast.success("Xóa vĩnh viễn thành công!");
                    setDeletedSchedule((prev) => prev.filter(item => item.id !== itemId));
                } else {
                    toast.error("Xóa không thành công!");
                }
            } catch (error) {
                console.error("Error deleting schedule daily:", error);
                toast.error("Đã xảy ra lỗi khi xóa lịch học!");
            }
        }
    };
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
                                    <th>Tên phòng học</th>
                                    <th>Ngày</th>
                                    <th>Ca dạy </th>
                                    <th>giáo viên</th>
                                    <th>Tên Lớp</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedSchedule == null ? (<tr><td className='text-center' colSpan="10">Không có lịch học nào bị xóa</td></tr>) : (deletedSchedule.map((item, index) => (
                                        <tr key={index} id={item.schedule_id}>
                                        <td>{item.classroom.classroom_name}</td>
                                        <td>{item.date}</td>
                                        <td>{item.shift.teaching_shift}</td>
                                        <td>{item.class.MainTeacher.teacher_name}</td>
                                        <td>{item.class.class_name}</td>
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