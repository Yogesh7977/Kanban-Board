import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import taskItemStyle from "../css/taskItem.module.css";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
const TaskItem = ({
  task,
  index,
  status,
  updateTaskOrder,
  deleteTask,
  editTask,
  statusColor,
  isOver,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
  });

  //checking and managing dragItems(Tasks)
  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK",
    item: { id: task.id, index, status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  //checking and managing drop within the column
  const [, dropRef] = useDrop({
    accept: "TASK",
    hover: (draggedItem) => {
      if (draggedItem.index !== index && draggedItem.status === status) {
        updateTaskOrder(draggedItem.index, index, status);
        draggedItem.index = index;
      }
    },
  });

  const handleSave = () => {
    editTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({ title: task.title, description: task.description });
    setIsEditing(false);
  };

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`${taskItemStyle["task-Item"]}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? "lightblue" : statusColor[status],
      }}
    >
      {isEditing ? (
        <div className={`${taskItemStyle.editContainer}`}>
          <input
            className={`${taskItemStyle.editTitle}`}
            type="text"
            style={{
              backgroundColor: isOver ? "lightblue" : statusColor[status],
            }}
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({
                ...editedTask,
                title: e.target.value,
              })
            }
            placeholder="Edit title"
          ></input>

          <textarea
            className={`form-control ${taskItemStyle.editDescription}`}
            style={{
              backgroundColor: isOver ? "lightblue" : statusColor[status],
            }}
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({
                ...editedTask,
                description: e.target.value,
              })
            }
            placeholder="Edit Description"
          ></textarea>

          <div className={`${taskItemStyle.buttons}`}>
            <button style={{
              backgroundColor: isOver ? "lightblue" : statusColor[status],
              fontWeight:"500", color: "green", borderRadius:"7px", border:"2.5px solid green"  
            }} onClick={handleSave}>Save</button>
            <button style={{
              backgroundColor: isOver ? "lightblue" : statusColor[status],
              color: "red", fontWeight:"500", borderRadius:"7px",  border:"2.5px solid red" 
            }} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <button
            className={`${taskItemStyle.editButton1}`}
            onClick={() => setIsEditing(true)}
          >
            <FaEdit />
          </button>
          <button
            className={`${taskItemStyle.deleteButton2}`}
            onClick={() => deleteTask(task.id)}
          >
            <MdDeleteOutline />
          </button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
