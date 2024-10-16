import React from "react";
import { Col, Container, Dropdown, Nav, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import "../assets/css/dashboard.css";

export default function DashboardComponent() {
    return (
        <>
            <Container fluid className="">
                <Row>
                    <Col md={2} className="aside-bar bg-light aside">
                        <aside>
                            <h4>English Trainning Center</h4>
                            <Nav defaultActiveKey="/" className="flex-column mt-3">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                                        Features
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="classroom">Classroom</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="schedule">Schedule Daily</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="teacher">Teacher Schedule</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Nav.Link href="#pricing">Pricing</Nav.Link>
                                <Nav.Link href="#about">About</Nav.Link>
                            </Nav>
                        </aside>
                    </Col>
                    <Col md={9}>
                        <Container>
                            <Outlet />
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
