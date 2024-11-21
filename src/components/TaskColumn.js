import React from "react";
import taskColumnStyle from "../css/taskColumnStyle.module.css";
import TaskItem from "./TaskItem";
import { useDrop } from "react-dnd";
const TaskColumn = ({ status, tasks, updateTaskStatus, updateTaskOrder, deleteTask, editTask }) => {
  const statusColor = {
    ToDo: "#f8d7da",
    InProgress: "#fff3cd",
    Done: "#d4edda"
  };

  //checking and managing drop area
  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    drop: (item) => updateTaskStatus(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      className={`container ${taskColumnStyle.taskColumn}`}
      ref={dropRef}
      style={{ backgroundColor: isOver ? "lightblue" : statusColor[status] }}
    >
      <h3>{status}</h3>
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          status={status}
          updateTaskOrder={updateTaskOrder}
          deleteTask={deleteTask}
          editTask={editTask}
          statusColor={statusColor}
          isOver={isOver}
        />
      ))}
    </div>
  );
};

export default TaskColumn;
