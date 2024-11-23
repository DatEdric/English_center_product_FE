import React from 'react';
import { Col, Container, Dropdown, Nav, Row } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import '../assets/css/dashboard.css';

export default function DashboardComponent() {
    return (
        <>
            <Container fluid className="">
                <Row>
                    <Col md={2} className="aside-bar bg-light aside">
                        <aside>
                            <h4>English Training Center</h4>
                            <Nav
                                defaultActiveKey="/"
                                className="flex-column mt-3"
                            >
                                <Nav.Link href="/">Trang chủ</Nav.Link>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="link"
                                        id="dropdown-basic"
                                    >
                                        Phòng và lịch 
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="classroom">
                                            Phòng học
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            as={Link}
                                            to="upload-schedule"
                                        >
                                            Cập nhật lịch 
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="teacher">
                                            Lịch dạy 
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Nav.Link href="#pricing">Thông tin</Nav.Link>
                                <Nav.Link href="#about">Học sinh</Nav.Link>
                            </Nav>
                        </aside>
                    </Col>
                    <Col md={10}>
                            <Outlet />

                    </Col>
                </Row>
            </Container>
        </>
    );
}
