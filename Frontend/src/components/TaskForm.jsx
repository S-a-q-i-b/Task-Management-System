import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const TaskForm = ({
  initialData,
  onSubmit,
  loading = false,
  error = "",
  submitText = "Create Task",
  loadingText = "Creating Task...",
  title = "Create Task",
  subtitle = "Add a new task to your task list.",
}) => {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "Medium",
        status: initialData.status || "Pending",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".task-form-header", {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".form-group", {
        y: 20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".submit-task-button", {
        y: 15,
        opacity: 0,
        duration: 0.45,
        delay: 0.5,
        ease: "power3.out",
      });
    }, formRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  const handleButtonEnter = () => {
    if (loading) return;

    gsap.to(".submit-task-button", {
      y: -2,
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = () => {
    gsap.to(".submit-task-button", {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div className="task-form-page" ref={formRef}>
      <div className="task-form-card">
        <div className="task-form-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
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
              placeholder="e.g. Learn React Hooks"
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
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
          >
            {loading ? loadingText : submitText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
