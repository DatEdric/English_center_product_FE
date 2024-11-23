import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function TeacherComponent() {
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [scheduleTeachers, setScheduleTeachers] = useState([]);
    const [hasDeletedRecords, setHasDeletedRecords] = useState(false);
    const navigate = useNavigate();

    const flattenData = (Data) => {
        if (!Data || Data.length === 0) {
            return [];
        }
        const flattened = [];
        Data.forEach((schedule) => {
            const scheduleId = schedule.id;
            const scheduleDate = schedule.schedule_date;

            schedule.classes.forEach((cls) => {
                const classId = cls.id;
                const className = cls.class_name;

                cls.Teachers.forEach((teacher) => {
                    const teacherId = teacher.id;
                    const teacherName = teacher.teacher_name;
                    const role = teacher.ClassTeacher.role;

                    cls.shifts.forEach((shift) => {
                        const shiftId = shift.id;
                        const teachingShift = shift.teaching_shift;

                        flattened.push({
                            schedule_id: scheduleId,
                            schedule_date: scheduleDate,
                            class_id: classId,
                            class_name: className,
                            teacher_id: teacherId,
                            teacher_name: teacherName,
                            role: role,
                            shift_id: shiftId,
                            teaching_shift: teachingShift,
                        });
                    });
                });
            });
        });

        return flattened;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:3000/teacher/',
                {
                    date: selectedDate,
                },
            );
            setResponseData(response.data);
        } catch (err) {
            console.error('Error posting data:', err);
            setError(err);
        }
    };

    const handleEditClick = async (id, schedule_date) => {
        navigate(`/teacher/edit/${id}/${schedule_date}`);
    };
    useEffect(() => {
        if (responseData) {
            const flattened = flattenData(responseData);
            setScheduleTeachers(flattened);
        }
    }, [responseData]);
    const handleDeleteClick = async (id, schedule_date) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/teacher/delete/${id}/${schedule_date}`,
            );
            if (response.data.message) {
                toast.success('Xóa thành công!');

                setScheduleTeachers((prevTeachers) =>
                    prevTeachers.filter(
                        (item) =>
                            item.class_id !== id ||
                            item.schedule_date !== schedule_date,
                    ),
                );
                setHasDeletedRecords(scheduleTeachers.length > 1);
            } else {
                toast.error('Xóa không thành công!');
            }
        } catch (err) {
            console.error('Error deleting teacher:', err);
            toast.error('Đã xảy ra lỗi khi xóa lịch!');
        }
    };
    const handleGetDeletedRecord = async () => {
        navigate(`/teacher/deleted-all`);
    };
    useEffect(() => {
        const checkDeletedRecords = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/teacher/deleted-all',
                );
                setHasDeletedRecords(response.data.length > 0);
            } catch (err) {
                console.error('Error fetching deleted records:', err);
            }
        };
        checkDeletedRecords();
    }, []);
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <h1>Danh sách lịch của giáo viên</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="selectDate">
                            <Form.Label>Chọn ngày</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Button
                            className="mt-4"
                            variant="primary"
                            type="submit"
                        >
                            Xem Lịch
                        </Button>
                        {error && (
                            <p className="text-danger mt-2">
                                Error: {error.message}
                            </p>
                        )}
                    </Form>
                    <div className="mt-4">
                        <Button
                            onClick={() => handleGetDeletedRecord()}
                            disabled={!hasDeletedRecords}
                            style={{ float: 'right', margin: '20px' }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                        <h3>Danh sách lịch học:</h3>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Giáo viên chính</th>
                                    <th>tên lớp học</th>
                                    <th>thời gian</th>
                                    <th>role</th>
                                    <th>ca dạy</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduleTeachers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="text-center"
                                        >
                                            Không có record nào để hiển thị
                                        </td>
                                    </tr>
                                ) : (
                                    scheduleTeachers.map((item, index) => (
                                        <tr key={index} id={item.class_id}>
                                            <td>{item.teacher_name}</td>
                                            <td>{item.class_name}</td>
                                            <td>{item.schedule_date}</td>
                                            <td>{item.role}</td>
                                            <td>{item.teaching_shift}</td>
                                            <td className="d-inline-flex ">
                                                <Button
                                                    onClick={() =>
                                                        handleEditClick(
                                                            item.class_id,
                                                            item.schedule_date,
                                                        )
                                                    }
                                                    className="btn btn-warning"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            item.class_id,
                                                            item.schedule_date,
                                                        )
                                                    }
                                                    className="btn btn-danger mx-2"
                                                >
                                                    Delete
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
    );
}
