import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import "../styles/task-form.css";

const CreateTask = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setLoading(true);

      await api.post("/tasks", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
      });

      navigate("/dashboard");
      
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-page">
      <div className="task-form-card">

        <div className="task-form-header">
          <div>
            <h1>Create Task</h1>
            <p>Add a new task to your task list.</p>
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
              placeholder="Enter Task Title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what needs to be done..."
              rows="6"
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
            disabled={loading}
          >
            {loading ? "Creating Task..." : "Create Task"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateTask;
