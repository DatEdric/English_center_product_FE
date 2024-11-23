import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Tab,
    Table,
    Tabs,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ClassroomComponent() {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        classroom_id: null,
        dates: [],
    });
    const [selectedDateInModal, setSelectedDateInModal] = useState('');
    const [show, setShow] = useState(false);
    const [key, setKey] = useState('byDate');
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [dataByDate, setDataByDate] = useState([]);
    const [dataByClassroom, setDataByClassroom] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const [classroomResponse, classResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/room/classroom-name`),
                ]);
                setClassrooms(classroomResponse.data);
            } catch (err) {
                setError(err);
                console.error('Error fetching classrooms:', err);
            }
        };

        fetchClassrooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let payload = {};
            let endpoint = '';

            if (key === 'byDate') {
                if (!selectedDate) {
                    toast.error('Vui lòng chọn ngày!');
                    return;
                }
                payload = { date: selectedDate };
                endpoint = 'http://localhost:3000/room/info-classroom';
            } else if (key === 'byClassroom') {
                if (!selectedClassroom) {
                    toast.error('Vui lòng chọn phòng!');
                    return;
                }
                payload = { classroom_name: selectedClassroom };
                endpoint = 'http://localhost:3000/room/info-classroom';
            }

            const response = await axios.post(endpoint, payload);
            const result = response.data.result;

            if (key === 'byDate') {
                setDataByDate(result);
            } else if (key === 'byClassroom') {
                setDataByClassroom(result);
            }
        } catch (err) {
            console.error('Error fetching data for selected filters:', err);
            setError(err);
        }
    };

    const handleDetailClick = (classroom_id, date) => {
        navigate(`/classroom/edit/${classroom_id}/${date}`);
    };

    const handleModalSubmit = () => {
        if (!selectedDateInModal) {
            toast.error('Vui lòng chọn ngày!');
            return;
        }

        navigate(
            `/classroom/edit/${modalData.classroom_id}/${selectedDateInModal}`,
        );
        setShowModal(false);
    };
    const chooseDateClick = (classroom_id, dates) => {
        setModalData({ classroom_id, dates });
        setShowModal(true);
    };
    const handleGetDeletedRecord = () => {
        navigate(`/classroom/deleted-all`);
    };
    useEffect(() => {
        setSelectedDate('');
        setSelectedClassroom('');
    }, [key]);

    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <h1>Tìm kiếm các lớp học đang hoạt động</h1>

                    <Tabs
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="byDate" title="Tìm theo ngày">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="searchByDate">
                                    <Form.Label>Chọn ngày</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Button className="mt-3" type="submit">
                                    Tìm kiếm
                                </Button>
                            </Form>
                        </Tab>

                        <Tab eventKey="byClassroom" title="Tìm theo phòng">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="searchByClassroom">
                                    <Form.Label>Chọn phòng</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedClassroom}
                                        onChange={(e) =>
                                            setSelectedClassroom(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            -- Chọn phòng học --
                                        </option>
                                        {classrooms.map((option, index) => (
                                            <option
                                                key={index}
                                                value={option.classroom_name}
                                            >
                                                {option.classroom_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button className="mt-3" type="submit">
                                    Tìm kiếm
                                </Button>
                            </Form>
                        </Tab>
                    </Tabs>
                    <div className="mt-4">
                        <Button
                            onClick={handleGetDeletedRecord}
                            style={{ float: 'right', margin: '20px' }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                        <h3>Kết quả tìm kiếm:</h3>
                        {key === 'byDate' && (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Ngày </th>
                                        <th>Lớp học</th>
                                        <th>phòng học</th>
                                        <th>giáo viên</th>
                                        <th>Ca dạy</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataByDate.length !== 0 ? (
                                        dataByDate?.map((item, index) => (
                                            <tr key={index} id={item.id}>
                                                <td>
                                                    {item.schedules.map(
                                                        (i) => i.schedule_date,
                                                    )}
                                                </td>
                                                <td>{item.class_name}</td>
                                                <td>
                                                    {
                                                        item.classroom
                                                            .classroom_name
                                                    }
                                                </td>
                                                <td>
                                                    {item.Teachers.map(
                                                        (teacher) =>
                                                            teacher.teacher_name,
                                                    ).join(' - ')}
                                                </td>
                                                <td>
                                                    {item.shifts.map(
                                                        (shift) =>
                                                            shift.teaching_shift,
                                                    )}
                                                </td>
                                                <td>
                                                    <Button
                                                        onClick={() =>
                                                            handleDetailClick(
                                                                item.classroom
                                                                    .id,
                                                                item.schedules.map(
                                                                    (i) =>
                                                                        i.schedule_date,
                                                                ),
                                                            )
                                                        }
                                                        className="btn btn-warning"
                                                    >
                                                        chi tiết
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="text-center"
                                            >
                                                Không có record nào để hiển thị
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                        {key === 'byClassroom' && (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Phòng học</th>
                                        <th>Lớp học</th>
                                        <th>Giáo viên</th>
                                        <th>Ngày</th>
                                        <th>Ca dạy</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataByClassroom.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item.classroom.classroom_name}
                                            </td>
                                            <td>{item.class_name}</td>
                                            <td>
                                                {item.Teachers.map(
                                                    (teacher) =>
                                                        teacher.teacher_name,
                                                ).join(' - ')}
                                            </td>
                                            <td>
                                                {item.schedules
                                                    .map(
                                                        (schedule) =>
                                                            schedule.schedule_date,
                                                    )
                                                    .join(', ')}
                                            </td>
                                            <td>
                                                {item.shifts
                                                    .map(
                                                        (shift) =>
                                                            shift.teaching_shift,
                                                    )
                                                    .join(', ')}
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() =>
                                                        chooseDateClick(
                                                            item.classroom.id,
                                                            item.schedules.map(
                                                                (i) =>
                                                                    i.schedule_date,
                                                            ),
                                                        )
                                                    }
                                                    className="btn btn-warning"
                                                >
                                                    chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn ngày</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Chọn ngày:</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedDateInModal}
                            onChange={(e) =>
                                setSelectedDateInModal(e.target.value)
                            }
                        >
                            <option value="">-- Chọn ngày --</option>
                            {modalData.dates.map((date, index) => (
                                <option key={index} value={date}>
                                    {date}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleModalSubmit}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
