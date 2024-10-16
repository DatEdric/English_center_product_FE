import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ClassroomDetailComponent() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        className: '',
        teacherName: '',
        classroomName: '',
        scheduleDate: '',
        teachingShift: '',
        roomType: '',
        courseName: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/room/edit/${id}`);
                setFormData({
                    className: response.data.class_name,
                    teacherName: response.data.MainTeacher.teacher_name,
                    classroomName: response.data.classroom.classroom_name,
                    scheduleDate: response.data.schedules[0]?.schedule_date,
                    teachingShift: response.data.schedules[0]?.shift.teaching_shift,
                    roomType: response.data.classroom.type,
                    courseName: response.data.course.course_name
                });

            } catch (error) {
                console.error("Error fetching classroom details:", error);
            }
        };

        fetchData();
    }, [id]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/room/update/${id}`, {
                class_name: formData.className,
                MainTeacher: { teacher_name: formData.teacherName },
                classroom: { classroom_name: formData.classroomName, type: formData.roomType },
                schedules: [{ schedule_date: formData.scheduleDate, shift: { teaching_shift: formData.teachingShift } }],
                course: { course_name: formData.courseName }
            });
            if (response.data) {
                toast.success("Cập nhật thành công!");
            } else {
                toast.error("Cập nhật không thành công!");
            }
        } catch (error) {
            console.error("Error updating classroom details:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật lớp học!");
        }
    };
     return (
        <>
        <h1>Classroom Details for ID: {id}</h1>
        {formData ? (
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="formClassName">
                        <Form.Label>Tên lớp học:</Form.Label>
                        <Form.Control
                            type="text"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTeacherName">
                        <Form.Label>Tên giáo viên chính:</Form.Label>
                        <Form.Control
                            type="text"
                            name="teacherName"
                            value={formData.teacherName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formClassroomName">
                        <Form.Label>Tên phòng học:</Form.Label>
                        <Form.Control
                            type="text"
                            name="classroomName"
                            value={formData.classroomName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formScheduleDate">
                        <Form.Label>Lịch theo ngày:</Form.Label>
                        <Form.Control
                            type="date"
                            name="scheduleDate"
                            value={formData.scheduleDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTeachingShift">
                        <Form.Label>Ca dạy:</Form.Label>
                        <Form.Control
                            type="text"
                            name="teachingShift"
                            value={formData.teachingShift}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formRoomType">
                        <Form.Label>Loại phòng:</Form.Label>
                        <Form.Control
                            type="text"
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCourseName">
                        <Form.Label>Tên khóa học:</Form.Label>
                        <Form.Control
                            type="text"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Cập nhật
                    </Button>
                </Form>
            ) : (
                <p>Loading...</p>
            )}
        </>
     )
}