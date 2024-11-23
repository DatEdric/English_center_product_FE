import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormComponent from '../FormComponent';

export default function ClassroomDetailComponent() {
    const navigate = useNavigate();
    const { id, date } = useParams();
    const [classroomOptions, setClassroomOptions] = useState(null);
    const [timeOptions, setTimeOptions] = useState(null);
    const [teacherOptions, setTeacherOptions] = useState(null);
    const [formData, setFormData] = useState({
        className: '',
        courseName: '',
        classroomName: '',
        capacity: 0,
        roomType: '',
        status: '',
        teacher_name: '',
        teacherRole: '',
        teacherLevel: '',
        scheduleDate: '',
        teachingShift: '',
    });
    const [isEditable, setIsEditable] = useState(false);
    const handleEditClick = () => {
        setIsEditable(true);
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/room/detail-classroom/${id}/${date}`,
                );
                setTimeOptions(response.data.Shifts[0].schedule_shift);
                setClassroomOptions(response.data.Classrooms);
                setTeacherOptions(response.data.sameLevelTeachers);
                setFormData({
                    className: response.data.room.class_name,
                    courseName: response.data.room.course.course_name,
                    classroomName: response.data.room.classroom.classroom_name,
                    capacity: response.data.room.classroom.capacity,
                    roomType: response.data.room.classroom.type,
                    status: response.data.room.classroom.status,
                    teacher_name: response.data.room.Teachers.map(
                        (teacher) => teacher,
                    ),
                    teacherRole: response.data.room.Teachers.map(
                        (teacher) => teacher,
                    ),
                    teacherLevel: response.data.room.Teachers[0].levels[0]
                        ? response.data.room.Teachers[0].levels[0].level_name
                        : 'chưa được phân cấp độ',
                    scheduleDate: response.data.room.schedules
                        .map((schedule) => schedule.schedule_date)
                        .join(', '),
                    teachingShift: response.data.room.shifts.map(
                        (shift) => shift,
                    ),
                });
            } catch (error) {
                console.error('Error fetching classroom details:', error);
            }
        };

        fetchData();
    }, [id, date]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const formatData = () => {
        return {
            capacity: formData.capacity,
            className: formData.className,
            classroomName: formData.classroomName,
            courseName: formData.courseName,
            roomType: formData.roomType,
            scheduleDate: formData.scheduleDate,
            status: formData.status,
            teacherLevel: formData.teacherLevel,
            teacherRole: formData.teacherRole.map((teacher) => ({
                ClassTeacher: {
                    role: teacher.ClassTeacher.role,
                    id: teacher.id,
                    levels: teacher.levels || [],
                },
                teacher_name: teacher.teacher_name,
            })),
            teachingShift: formData.teachingShift.map((shift) => ({
                id: shift.id,
                teaching_shift: shift.teaching_shift,
            })),
        };
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formattedData = formatData();  
            const response = await axios.put(
                `http://localhost:3000/room/update/${id}/${date}`,
                formattedData,
            );
            if (response.data) {
                toast.success('Cập nhật thành công!');
            } else {
                toast.error('Cập nhật không thành công!');
            }
        } catch (error) {
            console.error('Error updating classroom details:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật lớp học!');
        }
    };
    const handleDeleteClick = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/room/delete/${id}/${date}`,
            );
            console.log(response.data.message);
            
            if (response.data.message === 'Soft delete completed successfully') {
                toast.success('Xóa thành công , bạn sẽ được chuyển hướng về trang trước!');
                setTimeout(() => {
                navigate('/classroom');
                }, 6000)
            } else {
                toast.error('Xóa không thành công!');
            }
        } catch (err) {
            console.error('Error deleting classroom:', err);
            toast.error('Đã xảy ra lỗi khi xóa lớp học!');
        }
    };

    return (
        <Container>
            <h1>Thông tin chi tiết phòng học ID số: {id}</h1>
            <Row className="w-100">
                <Col>
                    <Button
                        className="m-2"
                        variant="warning"
                        onClick={handleEditClick}
                        disabled={isEditable}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        onClick={() => handleDeleteClick()}
                        className="btn btn-danger m-2"
                    >
                        Xóa phòng học
                    </Button>
                </Col>
            </Row>
            <Row>
                {formData ? (
                    <Form onSubmit={handleUpdate}>
                        <Form.Group controlId="formClassName">
                            <Form.Label>Tên lớp học:</Form.Label>
                            <Form.Control
                                type="text"
                                name="className"
                                value={formData.className}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCourseName">
                            <Form.Label>Tên khóa học:</Form.Label>
                            <Form.Control
                                type="text"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <FormComponent
                                    initialData={formData}
                                    optionsData={classroomOptions}
                                    optionSelect="name"
                                    fieldName="classroomName"
                                    label="Phòng học"
                                    readOnly={!isEditable}
                                    handleChange={(fieldName, value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [fieldName]: value,
                                        }))
                                    }
                                />
                            </Col>
                            <Col>
                                <Form.Group controlId="formCapacity">
                                    <Form.Label>Capacity:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        readOnly={!isEditable}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formRoomType">
                                    <Form.Label>Loại phòng học:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roomType"
                                        value={formData.roomType}
                                        onChange={handleChange}
                                        readOnly={!isEditable}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formStatus">
                                    <Form.Label>Trạng thái:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={formData.status}
                                        onChange={(e) => handleChange(e)}
                                        readOnly={!isEditable}
                                    >
                                        <option value="1">Hoạt động</option>{' '}
                                        <option value="0">
                                            Không hoạt động
                                        </option>{' '}
                                    </Form.Control>
                                </Form.Group>
                                <FormComponent
                                    initialData={formData}
                                    optionsData={teacherOptions}
                                    optionSelect="teacher_name"
                                    fieldName="teacher_name"
                                    label="Giáo viên"
                                    readOnly={!isEditable}
                                    handleChange={(fieldName, value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [fieldName]: value,
                                        }))
                                    }
                                />
                                <Form.Group controlId="formTeacherLevel">
                                    <Form.Label>Cấp độ:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="teacherLevel"
                                        value={formData.teacherLevel}
                                        onChange={handleChange}
                                        readOnly={!isEditable}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formScheduleDate">
                                    <Form.Label>Lịch theo ngày:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="scheduleDate"
                                        value={formData.scheduleDate}
                                        onChange={handleChange}
                                        readOnly={!isEditable}
                                    />
                                </Form.Group>
                                {formData.teacherRole
                                    ? formData.teacherRole.map((teacher) => (
                                          <Form.Group controlId="formRole">
                                              <Form.Label>Vai trò:</Form.Label>
                                              <Form.Control
                                                  type="text"
                                                  name="teacherRole"
                                                  value={
                                                      teacher.ClassTeacher.role
                                                  }
                                                  onChange={handleChange}
                                                  readOnly={!isEditable}
                                              />
                                          </Form.Group>
                                      ))
                                    : []}

                                <FormComponent
                                    initialData={formData}
                                    optionsData={timeOptions}
                                    optionSelect="teaching_shift"
                                    fieldName="teachingShift"
                                    label="Ca dạy"
                                    readOnly={!isEditable}
                                    handleChange={(fieldName, value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [fieldName]: value,
                                        }))
                                    }
                                />
                            </Col>
                        </Row>

                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                            disabled={!isEditable}
                        >
                            Cập nhật
                        </Button>
                    </Form>
                ) : (
                    <p>Loading...</p>
                )}
            </Row>
        </Container>
    );
}
