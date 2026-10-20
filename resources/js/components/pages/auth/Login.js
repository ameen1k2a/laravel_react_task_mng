import React from "react";
import { Card, Button, Badge, Spinner, Form, Alert } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PUBLIC_URL } from "../../../constants";
import { loginUser } from "../../../services/AuthService";

class Login extends React.Component {
  state = {
    isLoading: false,
    email: "",
    password: "",
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
      email: this.state.email,
      password: this.state.password,
    };

    const response = await loginUser(postBody);
    if (response && response.success) {
      localStorage.setItem("loginData", JSON.stringify(response));
      // Reload the home route so the application header picks up the new session.
      window.location.assign(PUBLIC_URL);
    } else {
      this.setState({
        errors: (response && response.errors) || {},
        isLoading: false,
        validated: false,
        errorMessage: (response && response.message) || "Invalid email or password",
      });
      localStorage.setItem("loginData", null);
    }
  };

  render() {
    return (
      <>
        <div className="header-part">
          <div className="float-left">
            <h2>Sign In</h2>
          </div>
          <div className="clearfix"></div>
        </div>

        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.submitForm}
        >
          <div className="row justify-content-center">
            <div className="col-md-8">
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

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Enter Password"
                      value={this.state.password}
                      name="password"
                      onChange={(e) => this.changeInput(e)}
                    />
                    {this.state.errors && this.state.errors.password && (
                      <p className="text-danger">
                        {this.state.errors.password[0]}
                      </p>
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please give password
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-3">
                    {this.state.isLoading && (
                      <Button variant="success" type="button" disabled>
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>{" "}
                        Signing In...
                      </Button>
                    )}

                    {!this.state.isLoading && (
                      <Button variant="success" type="submit">
                        Sign In
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

export default withRouter(Login);
