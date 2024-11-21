import "./App.css";
import { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    } else {
      fetchTasksFromAPI();
    }
    sendLocalStorageDataToBackend();
  }, []);

  const sendLocalStorageDataToBackend = async () => {
    const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
  
    if (tasksFromLocalStorage && Array.isArray(tasksFromLocalStorage)) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/tasks/bulk', tasksFromLocalStorage, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Tasks sent to backend successfully', response.data);
      } catch (error) {
        console.error('Error sending tasks to backend', error);
      }
    } else {
      console.log("No tasks found in local storage");
    }
  };
  

  const fetchTasksFromAPI = () => {
    axios.get("http://127.0.0.1:5000/tasks").then((response) => {
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);
      localStorage.setItem("tasks", JSON.stringify(fetchedTasks));
    }
  )
  .catch((error)=>{
    console.error("Error fetching tasks", error)
  });
  }

  // Function to add a new task
  const addTasks = (newTask) => {
    console.log(newTask)
    axios.post("http://127.0.0.1:5000/tasks", newTask, {headers: {
      'Content-Type': 'application/json'
    }})
    .then((response) => {
      console.log(response.data);
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks, newTask];
        localStorage.setItem("tasks", JSON.stringify(newTasks));
        return newTasks;
      });
    })
    .catch((error) => {
      console.error("Error adding task", error.response ? error.response.data : error);
    })
  };

  // Specifically for if user want to add task in Same Column
  const updateTaskOrder = (draggedIndex, TargetIndex, status) => {
    const filteredTasks = tasks.filter((task) => task.status === status);
    const otherTasks = tasks.filter((task) => task.status !== status);

    const [draggedTask] = filteredTasks.splice(draggedIndex, 1);
    
    filteredTasks.splice(TargetIndex, 0, draggedTask);

    const updatedTasks = [...filteredTasks, ...otherTasks];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  const deleteTask = (taskId) => {
    axios.delete(`http://127.0.0.1:5000/tasks/${taskId}`)
    .then(()=>{
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    })
    .catch((error)=>{
      console.error("Error deleting task", error.response ? error.response.data : error)
    })
    
  };

  // This will only update task Status using id
  const updateTaskStatus = (taskId, newStatus) => {
    axios.put(`http://127.0.0.1:5000/tasks/${taskId}`,{status: newStatus})
    .then(()=>{
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    })
    .catch((error)=>{
      console.error("Error updating task status", error.response ? error.response.data : error)
    })
  };

  // only for edit specific tasks
  const editTask = (taskId, updatedTask) => {
    axios.put(`http://127.0.0.1:5000/tasks/${taskId}`, updatedTask, {headers:{ 'Content-Type': 'application/json'}})
    .then(()=>{
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }).catch((error)=>{
      console.error("Error updating task", error.response ? error.response.data : error)
    })

    
  };

  return (
    <>
      <TaskInput addTasks={addTasks} />
      <DndProvider backend={HTML5Backend}>
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          updateTaskStatus={updateTaskStatus}
          updateTaskOrder={updateTaskOrder}
          editTask={editTask}
        />
      </DndProvider>
    </>
  );
}

export default App;
