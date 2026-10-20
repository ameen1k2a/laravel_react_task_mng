import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PUBLIC_URL } from "../../constants";

const Header = (props) => {
  const logout = () => {
    localStorage.removeItem("loginData");
    window.location.href = PUBLIC_URL + "login";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Link to={`${PUBLIC_URL}`} className="d-flex align-items-center text-decoration-none">
          <Navbar.Brand className="mb-0">Task Management</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mr-auto align-items-lg-center">
            <Link to={`${PUBLIC_URL}`}>
              <Nav.Item className="text-white mr-2 me-2">Home</Nav.Item>
            </Link>
            {props.authData.isLoggedIn && (
              <Link to={`${PUBLIC_URL}projects`}>
                <Nav.Item className="text-white mr-2 me-2">Projects</Nav.Item>
              </Link>
            )}
            {!props.authData.isLoggedIn && (
              <>
                <Link to={`${PUBLIC_URL}login`}>
                  <Nav.Item className="text-white mr-2 me-2">Sign In</Nav.Item>
                </Link>
                <Link to={`${PUBLIC_URL}register`}>
                  <Nav.Item className="text-white mr-2 me-2">Sign Up</Nav.Item>
                </Link>
              </>
            )}
          </Nav>
          <Nav className="ms-auto ml-auto align-items-lg-center">
            {props.authData.isLoggedIn && (
              <>
                <span className="text-light mr-3 me-3 font-weight-bold">
                  Welcome, {props.authData.user ? props.authData.user.name : "User"}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
