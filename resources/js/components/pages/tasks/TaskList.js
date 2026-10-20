import React from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { updateTask, deleteTask } from "../../../services/TaskService";

class TaskList extends React.Component {
  state = {
    editingTaskId: null,
    editName: "",
    editDescription: "",
    isSaving: false,
    editError: "",
  };

  startEditing = (task) => {
    this.setState({
      editingTaskId: task.id,
      editName: task.name || "",
      editDescription: task.description || "",
      editError: "",
    });
  };

  cancelEditing = () => {
    this.setState({ editingTaskId: null, editError: "" });
  };

  saveTask = async (task) => {
    const name = this.state.editName.trim();
    if (!name) {
      this.setState({ editError: "Task title is required." });
      return;
    }

    this.setState({ isSaving: true, editError: "" });
    const response = await updateTask(task.id, {
      name,
      description: this.state.editDescription,
      project_id: task.project_id,
    });

    if (response && response.success) {
      this.setState({
        editingTaskId: null,
        isSaving: false,
        editError: "",
      });
      this.props.onEditTask();
      return;
    }

    this.setState({
      isSaving: false,
      editError: (response && response.message) || "Unable to save task changes.",
    });
  };

  toggleCompleteStatus = async (item) => {
    const updatedTask = {
      ...item,
      status: Number(item.status) === 0 ? 1 : 0,
    };
    const response = await updateTask(item.id, updatedTask);
    if (response.success) {
      this.props.onEditTask();
    } else {
      alert(response.message || "Unable to update task status.");
    }
  };

  deleteTask = async (id) => {
    const response = await deleteTask(id);
    if (response.success) {
      this.props.onEditTask();
    } else {
      alert("Sorry !! Something went wrong !!");
    }
  };

  render() {
    return (
      <>
        {this.props.taskList.map((task) => (
          <Card key={task.id} className="mt-2 mb-2">
            <Card.Body>
              {this.state.editingTaskId === task.id ? (
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.saveTask(task);
                  }}
                >
                  {this.state.editError && (
                    <Alert variant="danger">{this.state.editError}</Alert>
                  )}
                  <Form.Group className="mb-3" controlId={`task-name-${task.id}`}>
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                      required
                      maxLength={255}
                      value={this.state.editName}
                      onChange={(event) => this.setState({ editName: event.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId={`task-description-${task.id}`}>
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={this.state.editDescription}
                      onChange={(event) => this.setState({ editDescription: event.target.value })}
                    />
                  </Form.Group>
                  <div className="task-actions d-flex justify-content-end gap-2 flex-wrap">
                    <Button type="button" variant="secondary" size="sm" onClick={this.cancelEditing}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" disabled={this.state.isSaving}>
                      {this.state.isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div className="task-summary">
                      <p className="mb-0">
                        {Number(task.status) === 1 ? (
                          <del className="text-success"><strong>{task.name}</strong></del>
                        ) : (
                          <strong>{task.name}</strong>
                        )}
                      </p>
                      {this.props.isDetailsView && task.description && (
                        <Card.Text className="mt-2 mb-0">{task.description}</Card.Text>
                      )}
                    </div>
                    <div className="task-actions d-flex justify-content-end gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant={Number(task.status) === 1 ? "info" : "success"}
                        size="sm"
                        onClick={() => this.toggleCompleteStatus(task)}
                      >
                        {Number(task.status) === 0 ? "✓ Mark Complete" : "Mark Pending"}
                      </Button>
                      <Button type="button" variant="primary" size="sm" onClick={() => this.startEditing(task)}>
                        Edit
                      </Button>
                      <Button type="button" variant="danger" size="sm" onClick={() => this.deleteTask(task.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        ))}
      </>
    );
  }
}

export default TaskList;
