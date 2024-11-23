import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function DeletedClassroomComponent() {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        classroom_id: null,
        dates: [],
        action: '',
    });
    const [selectedDateInModal, setSelectedDateInModal] = useState('');
    const [deletedClassroom, setDeletedClassrooms] = useState(null);

    useEffect(() => {
        const fetchDeletedClassrooms = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/room/deleted-all',
                );
                setDeletedClassrooms(response.data);
            } catch (err) {
                console.error('Error fetching classrooms:', err);
            }
        };

        fetchDeletedClassrooms();
    }, []);

    const handleRestoreClick = async (itemId, date) => {
        if (!date) {
            toast.error('Vui lòng chọn ngày!');
            return;
        }

        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn phục hồi lớp học này không?',
        );
        if (confirmed) {
            try {
                const response = await axios.put(
                    `http://localhost:3000/room/restore/${itemId}/${date}`,
                );
                if (response.data) {
                    toast.success('Phục hồi thành công!');
                    fetchDeletedClassrooms();
                } else {
                    toast.error('Phục hồi không thành công!');
                }
            } catch (error) {
                console.error('Error restoring classroom:', error);
                toast.error('Đã xảy ra lỗi khi phục hồi lớp học!');
            }
        }
    };

    const handleForceDeleteClick = async (itemId, date) => {
        if (!date) {
            toast.error('Vui lòng chọn ngày!');
            return;
        }

        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn xóa vĩnh viễn lớp học này không?',
        );
        if (confirmed) {
            try {
                const response = await axios.delete(
                    `http://localhost:3000/room/force-delete/${itemId}/${date}`,
                );
                if (response.data) {
                    toast.success('Xóa vĩnh viễn thành công!');
                    fetchDeletedClassrooms();
                } else {
                    toast.error('Xóa không thành công!');
                }
            } catch (error) {
                console.error('Error deleting classroom:', error);
                toast.error('Đã xảy ra lỗi khi xóa lớp học!');
            }
        }
    };

    const handleModalSubmit = () => {
        if (!selectedDateInModal) {
            toast.error('Vui lòng chọn ngày!');
            return;
        }

        if (modalData.action === 'restore') {
            handleRestoreClick(modalData.classroom_id, selectedDateInModal);
        } else if (modalData.action === 'delete') {
            handleForceDeleteClick(modalData.classroom_id, selectedDateInModal);
        }

        setShowModal(false);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <div className="mt-4">
                        <h3>Các lớp học đã bị xóa:</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Phòng học</th>
                                    <th>Lớp học</th>
                                    <th>Giáo viên</th>
                                    <th>Ngày</th>
                                    <th>Ca dạy</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedClassroom == null
                                    ? []
                                    : deletedClassroom.map((item, index) => (
                                          <tr key={index} id={item.id}>
                                              <td>
                                                  {
                                                      item.classroom
                                                          .classroom_name
                                                  }
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
                                                      .join(' - ')}
                                              </td>
                                                <td>
                                                    {item.shifts.map(
                                                        (shift) =>
                                                            shift.teaching_shift,
                                                    )}
                                                </td>
                                              <td>
                                                  <Button
                                                      onClick={() => {
                                                          setModalData({
                                                              classroom_id: item.classroom.id,
                                                              dates: item.schedules.map(schedule => schedule.schedule_date),
                                                              action: 'restore',
                                                          });
                                                          setShowModal(true);
                                                      }}
                                                      className="btn btn-warning h4"
                                                  >
                                                      Khôi Phục
                                                  </Button>
                                              </td>
                                              <td>
                                                  <Button
                                                      onClick={() => {
                                                          setModalData({
                                                              classroom_id: item.classroom.id,
                                                              dates: item.schedules.map(schedule => schedule.schedule_date),
                                                              action: 'delete',
                                                          });
                                                          setShowModal(true);
                                                      }}
                                                      className="btn btn-danger h4"
                                                  >
                                                      Xóa vĩnh viễn
                                                  </Button>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </Table>
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
