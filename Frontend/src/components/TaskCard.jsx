import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const cardRef = useRef(null);



  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 30,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
      );
    }, card);

    return () => {
      ctx.revert();
    };
  }, []);



  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className="task-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >


      <div className="task-card-top">
        <div>
          <h3>{task.title}</h3>

          <p>{task.description}</p>
        </div>

        <span className={`priority priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>



      <div className="task-card-bottom">
        <div className="status-control">
          <label htmlFor={`status-${task._id}`}>Status:</label>

          <select
            id={`status-${task._id}`}
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            <option value="Pending">Pending</option>

            <option value="In Progress">In Progress</option>

            <option value="Completed">Completed</option>
          </select>
        </div>

        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>



      <div className="task-actions">
        <Link to={`/tasks/edit/${task._id}`}>Edit</Link>

        <button type="button" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
