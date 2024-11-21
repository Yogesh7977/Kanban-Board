import React from "react";
import taskListStyle from "../css/taskList.module.css";
import TaskColumn from "./TaskColumn";
const TaskList = ({ tasks, deleteTask, updateTaskStatus, updateTaskOrder, editTask }) => {
  const taskStatus = ["ToDo", "InProgress", "Done"];
  return (
    <>
      <div
        className={`container ${taskListStyle["task-ListContainer"]}`}
      >
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            updateTaskStatus={updateTaskStatus}
            updateTaskOrder={updateTaskOrder}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </div>
    </>
  );
};

export default TaskList;
