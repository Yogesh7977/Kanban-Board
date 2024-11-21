import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import taskinputStyle from "../css/taskinput.module.css";

const TaskInput = ({ addTasks }) => {
  const [newTask, setNewTask] = useState({
    id: uuid(),
    title: "",
    description: "",
    status: "ToDo",
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (newTask.title.trim() !== "" && newTask.description.trim() !== "") {
      addTasks(newTask);
      setNewTask({ id: uuid(), title: "", description: "", status: "ToDo" });
    }
  };

  const onChangeHandler = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  return (
    <>
      <header>
        <div className={`${taskinputStyle.headContainer}`}>
          <h3>KANBAN BOARD</h3>
        </div>
      </header>
      <main>
        <div className="container">
          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label"
                style={{ fontWeight: "bold" }}
              >
                Title
              </label>
              <input
                type="text"
                style={{border:"1px solid"}}
                required
                className="form-control"
                id="title"
                placeholder="Enter task title"
                name="title"
                value={newTask.title}
                onChange={onChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
                style={{fontWeight:"bold"}}
              >
                Description
              </label>
              <textarea
                required
                className="form-control"
                style={{border:"1px solid"}}
                id="description"
                rows="3"
                name="description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={onChangeHandler}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default TaskInput;
