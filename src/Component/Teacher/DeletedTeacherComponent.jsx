import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DeletedTeacherComponent() {
    const [deletedTeacher, setDeletedTeacher] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchDeletedTeacher = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/teacher/deleted-all',
                );

                setDeletedTeacher(response.data);
            } catch (err) {
                setError(err);
                console.error('Error fetching Schedule:', err);
            }
        };
        fetchDeletedTeacher();
    }, []);
    const handleRestoreClick = async (class_id, date) => {
        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn phục hồi lớp học này không?',
        );
        if (confirmed) {
            try {
                const response = await axios.put(
                    `http://localhost:3000/teacher/restore/${class_id}/${date}`,
                );
                if (response.data) {
                    toast.success('Phục hồi thành công!');
                    setDeletedTeacher((prev) =>
                        prev.filter((item) => item.id !== class_id),
                    );
                } else {
                    toast.error('Phục hồi không thành công!');
                }
            } catch (error) {
                console.error('Error restoring teacher schedule:', error);
                toast.error('Đã xảy ra lỗi khi phục hồi lớp học!');
            }
        }
    };
    const handleForceDeleteClick = async (class_id, date) => {
        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn xóa vĩnh viễn lớp học này không?',
        );
        if (confirmed) {
            try {
                const response = await axios.delete(
                    `http://localhost:3000/teacher/force-delete/${class_id}/${date}`,
                );
                if (response.data) {
                    toast.success('Xóa vĩnh viễn thành công!');
                    setDeletedSchedule((prev) =>
                        prev.filter((item) => item.id !== id),
                    );
                } else {
                    toast.error('Xóa không thành công!');
                }
            } catch (error) {
                console.error('Error deleting teacher schedule:', error);
                toast.error('Đã xảy ra lỗi khi xóa lớp học!');
            }
        }
    };
    const handleBackTeacherComponent = async () => {
        navigate(`/teacher/`);
    };
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div className="mt-4">
                            <h3 className="mb-3">Các lịch học đã bị xóa:</h3>
                            <Button
                                className="my-2"
                                onClick={() => {
                                    handleBackTeacherComponent();
                                }}
                            >
                                Quay lại
                            </Button>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Giáo viên chính</th>
                                        <th>tên lớp học</th>
                                        <th>thời gian</th>
                                        <th>role</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deletedTeacher.length === 0 ? (
                                        <tr>
                                            <td
                                                className="text-center"
                                                colSpan="10"
                                            >
                                                Không có lịch của giáo viên nào
                                                bị xóa
                                            </td>
                                        </tr>
                                    ) : (
                                        deletedTeacher.map((item, index) => (
                                            <tr key={index} id={item.id}>
                                                <td>
                                                    {
                                                        item.Teachers[0]
                                                            .teacher_name
                                                    }
                                                </td>
                                                <td>{item.class_name}</td>
                                                <td>
                                                    {
                                                        item.schedules[0]
                                                            .schedule_date
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        item.Teachers[0]
                                                            .ClassTeacher.role
                                                    }
                                                </td>
                                                <td>
                                                    <Button
                                                        onClick={() =>
                                                            handleRestoreClick(
                                                                item.id,
                                                                item
                                                                    .schedules[0]
                                                                    .schedule_date,
                                                            )
                                                        }
                                                        className="btn btn-warning"
                                                    >
                                                        Restore
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button
                                                        onClick={() =>
                                                            handleForceDeleteClick(
                                                                item.id,
                                                                item
                                                                    .schedules[0]
                                                                    .schedule_date,
                                                            )
                                                        }
                                                        className="btn btn-danger"
                                                    >
                                                        Force Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
