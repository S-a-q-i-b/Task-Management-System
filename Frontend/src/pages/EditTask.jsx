import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "../styles/task-form.css";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getTask = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/tasks/${id}`);

      const task = response.data.task;

      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load task.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Task description is required.");
      return;
    }

    if (!formData.dueDate) {
      setError("Due date is required.");
      return;
    }

    try {
      setSaving(true);

      console.log("Updating task:", id);
      console.log("Data:", formData);

      const response = await api.put(`/tasks/${id}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
      });

      console.log("Update response:", response.data);

      navigate("/dashboard");
    } catch (error) {
      console.error("Update error:", error);

      setError(error.response?.data?.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="task-form-page">
        <div className="task-form-card">
          
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="task-form-page">
        <div className="task-form-card">
          <div className="task-form-error">{error}</div>

          <Link to="/dashboard" className="back-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="task-form-page">
      <div className="task-form-card">
        <div className="task-form-header">
          <div>
            <h1>Edit Task</h1>

            <p>Update your task details.</p>
          </div>

          <Link to="/dashboard" className="back-button">
            Back
          </Link>
        </div>

        {error && <div className="task-form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"

              rows="6"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>

                <option value="Medium">Medium</option>
                <option value="High">High</option>

              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>

            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="submit-task-button"
            disabled={saving}
          >
            {saving ? "Updating Task..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
