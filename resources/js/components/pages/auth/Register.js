import React from "react";
import { Card, Button, Spinner, Form, Alert } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PUBLIC_URL } from "../../../constants";
import { registerUser } from "../../../services/AuthService";

class Register extends React.Component {
  state = {
    isLoading: false,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    errors: {},
    errorMessage: "",
    validated: false,
  };

  changeInput = (e) => {
    const { name, value } = e.target;
    const errors = { ...this.state.errors };
    delete errors[name];
    this.setState({
      [name]: value,
      errors,
      errorMessage: "",
    });
  };

  submitForm = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      this.setState({ validated: true });
      return;
    }

    this.setState({ isLoading: true, validated: false, errors: {}, errorMessage: "" });

    const postBody = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };

    const response = await registerUser(postBody);
    if (response && response.success) {
      localStorage.setItem("loginData", JSON.stringify(response));
      window.location.assign(PUBLIC_URL);
    } else {
      this.setState({
        errors: (response && response.errors) || {},
        errorMessage: (response && response.message) || "Registration failed. Please check inputs.",
        isLoading: false,
        validated: false,
      });
      localStorage.setItem("loginData", null);
    }
  };

  render() {
    return (
      <>
        <div className="header-part">
          <div className="float-left">
            <h2>Sign Up</h2>
          </div>
          <div className="clearfix"></div>
        </div>

        <Card>
          <Card.Body>
            {this.state.errorMessage && (
              <Alert
                variant="danger"
                onClose={() => this.setState({ errorMessage: "" })}
                dismissible
              >
                {this.state.errorMessage}
              </Alert>
            )}

            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.submitForm}
            >
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Your Name"
                      value={this.state.name}
                      name="name"
                      onChange={(e) => this.changeInput(e)}
                    />
                    {this.state.errors && this.state.errors.name && (
                      <p className="text-danger">{this.state.errors.name[0]}</p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please give your name
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      placeholder="Enter Email Address"
                      value={this.state.email}
                      name="email"
                      onChange={(e) => this.changeInput(e)}
                    />
                    {this.state.errors && this.state.errors.email && (
                      <p className="text-danger">
                        {this.state.errors.email[0]}
                      </p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please give your valid email address
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Enter Password"
                      value={this.state.password}
                      name="password"
                      onChange={(e) => this.changeInput(e)}
                      minLength={8}
                    />
                    {this.state.errors && this.state.errors.password && (
                      <p className="text-danger">
                        {this.state.errors.password[0]}
                      </p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please give password (minimum 8 characters)
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="password_confirmation" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Enter Confirm Password"
                      value={this.state.password_confirmation}
                      name="password_confirmation"
                      onChange={(e) => this.changeInput(e)}
                      minLength={8}
                    />
                    {this.state.errors &&
                      this.state.errors.password_confirmation && (
                        <p className="text-danger">
                          {this.state.errors.password_confirmation[0]}
                        </p>
                      )}
                    <Form.Control.Feedback type="invalid">
                      Please confirm your password
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                {this.state.isLoading && (
                  <Button variant="success" type="button" disabled>
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>{" "}
                    Signing Up...
                  </Button>
                )}

                {!this.state.isLoading && (
                  <Button variant="success" type="submit">
                    Sign Up
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default withRouter(Register);
