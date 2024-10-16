import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';


export default function ScheduleDetailComponent() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        schedule_id: '',
        classId: '',
        courseId: '',
        mainTeacherId: '',
        subTeacherId: '',
        classroomId: '',
        shiftId: '',
        className: '',
        date: '',
        attendance: '',
        courseName: '',
        capacity: '',
        teacherName: '',
        classroomName: '',
        teachingShift: '',
        subTeacherName: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/schedule/edit/${id}`);
                const scheduleData = response.data;
                setFormData({
                    schedule_id: scheduleData.schedule_id,
                    classId: scheduleData.class.id,
                    courseId: scheduleData.class.course.id,
                    mainTeacherId: scheduleData.class.MainTeacher.id,
                    subTeacherId: scheduleData.class.SubTeacher.id,
                    classroomId: scheduleData.classroom.id,
                    shiftId: scheduleData.shift.id,
                    date: scheduleData.date,
                    attendance: scheduleData.attendance,
                    className: scheduleData.class.class_name,
                    courseName: scheduleData.class.course.course_name,
                    capacity: scheduleData.classroom.capacity,
                    teacherName: scheduleData.class.MainTeacher.teacher_name,
                    subTeacherName: scheduleData.class.SubTeacher.teacher_name,
                    classroomName: scheduleData.classroom.classroom_name,
                    teachingShift: scheduleData.shift.teaching_shift,
                });
            } catch (error) {
                console.error("Error fetching classroom details:", error);
            }
        }
        fetchData();
    },[id]);
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
            const response = await axios.put(`http://localhost:3000/schedule/update/${id}`, {
                schedule_id: formData.schedule_id,
                date: formData.date,
                attendance: formData.attendance,
                shift: {
                    id: formData.shiftId,
                    teaching_shift: formData.teachingShift
                },
                class: {
                    id: formData.classId,
                    class_name: formData.className,
                    MainTeacher: { id: formData.mainTeacherId, teacher_name: formData.teacherName },
                    SubTeacher: { id: formData.subTeacherId, teacher_name: formData.subTeacherName },
                    course: { id: formData.courseId, course_name: formData.courseName }
                },
                classroom: {
                    id: formData.classroomId,
                    classroom_name: formData.classroomName,
                    capacity: formData.capacity
                }
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
           <h1>Chi tiết lịch cho ID: {id}</h1>
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
                            name="date"
                            value={formData.date}
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
                    <Form.Group controlId="formAttendance">
                        <Form.Label>Diểm danh:</Form.Label>
                        <Form.Control
                            type="text"
                            name="classroomName"
                            value={formData.attendance}
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
                        <Form.Label>Công suất phòng:</Form.Label>
                        <Form.Control
                            type="text"
                            name="capacity"
                            value={formData.capacity}
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