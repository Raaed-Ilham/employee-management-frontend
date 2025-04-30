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

export default function ViewTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/tasks");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    const toggleExpand = (taskId: number) => {
        setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Project Tasks</h1>
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
        </div>
    );
}
