"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./project-management.module.css";

type ProgressStatus = 'new' | 'started' | 'in progress' | 'completed' | 'closed';

interface Task {
    task_id: number;
    task_name: string;
    description: string;
    assigned_employee_id: number;
    progress: ProgressStatus;
}

// create interface/object of type task and employee to hold db objects 

interface Employee {
    id: number;
    name: string;
}

//create use states for updating and holding task and employee components

export default function ViewTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [newTask, setNewTask] = useState({
        task_name: '',
        description: '',
        assigned_employee_id: '',
        progress: 'new',
    });

    //useEffect returns clearInt which reruns setInt func with fetchtasks function running every 5 secs
    useEffect(() => {
        // function run every 5 secs to get task data from db

        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/tasks");
                //setTasks method called to rerender display with new data for all tasks
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8080/employees");
                //same as above
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        // run once at the start
        fetchTasks();
        fetchEmployees();

        const intervalId = setInterval(fetchTasks, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const toggleExpand = (taskId: number) => {
        setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };
 
    //run async form event on submit form
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            //post method to send values of newTaskobject and assignedempId to db
            await axios.post("http://localhost:8080/tasks", {
                ...newTask,
                assigned_employee_id: Number(newTask.assigned_employee_id),
            });
            setShowForm(false);
            //setNewTask function called to update NewTask vals
            
            setNewTask({
                task_name: '',
                description: '',
                assigned_employee_id: '',
                progress: 'new',
            });
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // form layout and html written below
    return (
        <div className={`${styles.container} ${showForm ? styles.blurred : ''}`}>
            <h1 className={styles.heading}>Project Tasks</h1>

            <button className={styles.createButton} onClick={() => setShowForm(true)}>+ Create Task</button>

            <div className={styles.taskList}>
                {tasks.length === 0 ? (
                    <p className={styles.emptyText}>No tasks available.</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task.task_id} className={styles.taskCard}>
                            <div
                                className={styles.taskHeader}
                                onClick={() => toggleExpand(task.task_id)}
                            >
                                <strong>{task.task_name}</strong>
                                <span className={`${styles.progress} ${styles[task.progress.replace(/\s/g, "")]}`}>
                                    {task.progress}
                                </span>
                            </div>
                            {expandedTaskId === task.task_id && (
                                <div className={styles.taskDetails}>
                                    <p><strong>Description:</strong> {task.description}</p>
                                    <p><strong>Assigned Employee ID:</strong> {task.assigned_employee_id}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            
            {showForm && (
                <div className={styles.modalOverlay}>
                    <form className={styles.modalForm} onSubmit={handleFormSubmit}>
                        <h2>Create New Task</h2>
                        <input
                            type="text"
                            name="task_name"
                            placeholder="Task Name"
                            value={newTask.task_name}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            rows={3}
                        />
                        <select
                            name="assigned_employee_id"
                            value={newTask.assigned_employee_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} (ID: {emp.id})
                                </option>
                            ))}
                        </select>
                        <select
                            name="progress"
                            value={newTask.progress}
                            onChange={handleInputChange}
                        >
                            <option value="new">New</option>
                            <option value="started">Started</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="closed">Closed</option>
                        </select>
                        <div className={styles.modalActions}>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
