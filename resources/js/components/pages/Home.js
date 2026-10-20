import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PUBLIC_URL } from "../../constants";
import { getProjectList } from "../../services/ProjectService";

function Home({ isLoggedIn, user }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setProjects([]);
      setLoadError("");
      return;
    }

    let isCurrent = true;
    setIsLoading(true);
    getProjectList().then((response) => {
      if (!isCurrent) return;
      if (response && response.success) {
        setProjects(Array.isArray(response.data) ? response.data : []);
        setLoadError("");
      } else {
        setLoadError(response?.message || "Unable to load dashboard data.");
      }
      setIsLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="hero-wrapper my-4">
        <span className="hero-tag">Task Management Platform</span>
        <h1 className="hero-title">
          Organize, Track & <span>Deliver Projects</span>
        </h1>
        <p className="hero-subtitle">
          Sign in to manage your projects, stay on top of tasks, and track your progress in one place.
        </p>
        <div className="hero-actions">
          <Link to={`${PUBLIC_URL}login`} className="btn btn-primary">
            Sign In
          </Link>
          <Link to={`${PUBLIC_URL}register`} className="btn btn-success">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const tasks = projects.flatMap((project) => project.tasks || []);
  const totalTasks = projects.reduce(
    (count, project) => count + Number(project.tasks_count ?? (project.tasks || []).length),
    0
  );
  const completedTasks = tasks.filter((task) => Number(task.status) === 1).length;
  const pendingTasks = Math.max(totalTasks - completedTasks, 0);

  return (
    <div className="dashboard-page py-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <span className="hero-tag">Your Workspace</span>
          <h1 className="dashboard-title">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="text-muted mb-0">Here is a quick overview of your projects and tasks.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to={`${PUBLIC_URL}projects`} className="btn btn-outline-primary">View Projects</Link>
          <Link to={`${PUBLIC_URL}projects/create`} className="btn btn-primary">+ New Project</Link>
        </div>
      </div>

      {loadError && <Alert variant="danger">{loadError}</Alert>}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" aria-label="Loading dashboard" />
        </div>
      ) : (
        <>
          <Row className="g-3 mb-4">
            {[
              { title: "Total Projects", value: projects.length, tone: "indigo" },
              { title: "Total Tasks", value: totalTasks, tone: "blue" },
              { title: "Completed Tasks", value: completedTasks, tone: "green" },
              { title: "Pending Tasks", value: pendingTasks, tone: "amber" },
            ].map((stat) => (
              <Col key={stat.title} xs={12} sm={6} xl={3}>
                <Card className={`dashboard-stat dashboard-stat-${stat.tone} h-100`}>
                  <Card.Body>
                    <div className="dashboard-stat-label">{stat.title}</div>
                    <div className="dashboard-stat-value">{stat.value}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="dashboard-projects">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Recent Projects</span>
              <Link to={`${PUBLIC_URL}projects`} className="small">View all</Link>
            </Card.Header>
            <Card.Body>
              {projects.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No projects yet. Create one to get started.</p>
                  <Link to={`${PUBLIC_URL}projects/create`} className="btn btn-primary">Create your first project</Link>
                </div>
              ) : (
                <div className="dashboard-project-list">
                  {projects.slice(0, 5).map((project) => (
                    <div className="dashboard-project-row" key={project.id}>
                      <div className="min-w-0">
                        <Link className="dashboard-project-name" to={`${PUBLIC_URL}projects/view/${project.id}`}>
                          {project.name}
                        </Link>
                        <div className="text-muted small text-truncate">{project.description}</div>
                      </div>
                      <Badge bg="primary">{project.tasks_count ?? (project.tasks || []).length} tasks</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}

export default Home;
