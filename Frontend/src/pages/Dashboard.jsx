import gsap from "gsap";

import { useEffect, useMemo, useRef, useState } from "react";

import toast from "react-hot-toast";

import { Link } from "react-router-dom";

import Loader from "../components/Loader";

import Navbar from "../components/Navbar";

import TaskCard from "../components/TaskCard";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const dashboardRef = useRef(null);

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [priorityFilter, setPriorityFilter] = useState("All");

  const [sortBy, setSortBy] = useState("createdAt");

  const [sortOrder, setSortOrder] = useState("desc");

  const getTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");

      setTasks(response.data.tasks || []);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load tasks.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  const inProgressTasks = tasks.filter(

    (task) => task.status === "In Progress",

  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((task) => {
        const title = task.title?.toLowerCase() || "";

        const description = task.description?.toLowerCase() || "";

        return title.includes(searchValue) || description.includes(searchValue);

      });
    }

    if (statusFilter !== "All") {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "All") {

      result = result.filter((task) => task.priority === priorityFilter);

    }

    result.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === "title") {
        valueA = a.title?.toLowerCase() || "";

        valueB = b.title?.toLowerCase() || "";
      } else if (sortBy === "priority") {
        const priorityOrder = {
          Low: 1,
          Medium: 2,
          High: 3,
        };

        valueA = priorityOrder[a.priority] || 0;
        valueB = priorityOrder[b.priority] || 0;
      } else if (sortBy === "dueDate") {
        valueA = new Date(a.dueDate).getTime();

        valueB = new Date(b.dueDate).getTime();
      } else {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".dashboard-title", {
          y: 30,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".stat-card",
          {
            y: 35,
            opacity: 0,
            duration: 0.5,

            stagger: 0.12,
          },
          "-=0.35",
        )
        .from(
          ".filters-section",
          {
            y: 25,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.2",
        )
        .from(
          ".tasks-section",
          {
            y: 25,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.2",
        );
    }, dashboardRef);

    return () => {
      ctx.revert();
    };
  }, [loading]);

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(`/tasks/${taskId}`);

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      toast.success(response.data.message || "Task deleted successfully!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task.";

      setError(message);
      toast.error(message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? response.data.task : task,
        ),
      );

      toast.success("Task status updated!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update task status.";

      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="dashboard-page" ref={dashboardRef}>
      <Navbar />

      <main className="dashboard-container">
        <div className="dashboard-title">
          <div>
            <h2>Dashboard</h2>

            <p>
              Welcome back, {user?.name || "User"}. Manage your tasks from one
              place.
            </p>
          </div>

          <Link to="/tasks/create" className="create-task-button">
            + Create Task
          </Link>
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </section>

        <section className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priority-filter">Priority</label>

            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Sort By</label>

            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Created Date</option>

              <option value="dueDate">Due Date</option>

              <option value="priority">Priority</option>

              <option value="title">Title</option>
            </select>
          </div>

          <button
            type="button"
            className="sort-order-button"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </section>

        {error && <div className="dashboard-error">{error}</div>}

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h3>Your Tasks</h3>

              <p className="results-count">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>
          </div>

          {loading && <Loader text="Loading tasks..." />}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty-state">
              <h3>No tasks yet</h3>

              <p>You haven't created any tasks yet.</p>

              <Link to="/tasks/create">Create your first task</Link>
            </div>
          )}

          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="empty-state">
              <h3>No matching tasks</h3>

              <p>Try changing your search or filters.</p>
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}

                  onDelete={handleDelete}

                  onStatusChange={handleStatusChange}
                />
              ))}
              
            </div>
          )}
        </section>

      </main>

    </div>
  );
};

export default Dashboard;
