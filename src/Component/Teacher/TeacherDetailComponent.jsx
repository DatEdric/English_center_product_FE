import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';

export default function TeacherDetailComponent() {
    const { id, schedule_date } = useParams();

    const [formData, setFormData] = useState({
        schedule_id: '',
        classId: '',
        courseId: '',
        mainTeacherId: '',
        classroomId: '',
        date: '',
        className: '',
        courseName: '',
        capacity: '',
        teacherName: '',
        classroomName: '',
        teachingShift: '',
    });
    const [teachersOptions, setTeachersOptions] = useState([]);

    const flattenObject = (obj) => {
        const flattened = {};

        const recurse = (current, property) => {
            if (Object(current) !== current) {
                flattened[property] = current;
            } else if (Array.isArray(current)) {
                current.forEach((item, index) => {
                    recurse(item, `${property}[${index}]`);
                });
                if (current.length === 0) {
                    flattened[property] = [];
                }
            } else {
                Object.keys(current).forEach((key) => {
                    recurse(
                        current[key],
                        property ? `${property}.${key}` : key,
                    );
                });
            }
        };

        recurse(obj, '');
        return flattened;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/teacher/edit/${id}/${schedule_date}`,
                );
                const scheduleData = response.data;
                const flatData = flattenObject(scheduleData);

                setFormData({
                    schedule_id: flatData['id'],
                    classId: flatData['classes[0].ClassSchedule.class_id'],
                    courseId: flatData['classes[0].course.id'],
                    mainTeacherId: flatData['classes[0].Teachers[0].id'],
                    classroomId: flatData['classes[0].classroom.id'],
                    date: flatData['schedule_date'],
                    className: flatData['classes[0].class_name'],
                    courseName: flatData['classes[0].course.course_name'],
                    capacity: '',
                    teacherName:
                        flatData['classes[0].Teachers[0].teacher_name'],
                    classroomName:
                        flatData['classes[0].classroom.classroom_name'],
                    teachingShift:
                        flatData['classes[0].shifts[0].teaching_shift'],
                });

                const options = scheduleData.sameLevelTeachers.map(
                    (teacher) => ({
                        value: teacher.id,
                        label: teacher.name,
                    }),
                );

                if (flatData['classes[0].Teachers[0].teacher_name']) {
                    const newTeacherOption = {
                        value: flatData['classes[0].Teachers[0].id'],
                        label: flatData['classes[0].Teachers[0].teacher_name'],
                    };

                    const teacherExists = options.some(
                        (option) => option.value === newTeacherOption.value,
                    );

                    if (!teacherExists) {
                        options.push(newTeacherOption);
                    }
                }
                setTeachersOptions(options);
            } catch (error) {
                console.error('Error fetching classroom details:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:3000/teacher/update/${id}/${formData.date}`,
                {
                    id: formData.schedule_id,
                    schedule_date: formData.date,
                    class_id: formData.classId,
                    class_name: formData.className,
                    teacher_id: formData.mainTeacherId,
                    teacher_name: formData.teacherName,
                    role: formData.role,
                    shift_id: formData.shiftId,
                    teaching_shift: formData.teachingShift,
                    classroom_id: formData.classroomId,
                    classroom_name: formData.classroomName,
                    course_id: formData.courseId,
                    course_name: formData.courseName,
                },
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

    const handleChange = (selectedOption) => {
        if (selectedOption) {
            const { value, label } = selectedOption;
            setFormData((prevData) => ({
                ...prevData,
                teacherName: label,
                mainTeacherId: value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                teacherName: '',
                mainTeacherId: '',
            }));
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
                        <Select
                            options={teachersOptions}
                            onChange={handleChange}
                            value={
                                teachersOptions.find(
                                    (option) =>
                                        option.value === formData.mainTeacherId,
                                ) || null
                            }
                            isClearable
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
    );
}
