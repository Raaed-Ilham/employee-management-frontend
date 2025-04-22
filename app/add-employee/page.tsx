"use client";
import { useState } from "react";
import styles from "./add-employee.module.css";

export default function AddEmployee() {
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        department: "",
        position: "",
        working_days: "",
        shift: "",
        current_project: "",
        date_joined: "",
        is_active: true,
        daily_task: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        const checked = target.checked;

        setEmployee(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // this functions sends a post request to the url handled by the spring boot 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee),
            });
            const data = await response.json();
            console.log("Employee added:", data);
            alert("Employee added successfully!");
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Error adding employee");
        }
    };

    return (
        //form to input user data, handled by handleSubmit function
        <div className={styles.container}>
            <h1 className={styles.heading}>Add New Employee</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>Name</label>
                <input className={styles.input} name="name" value={employee.name} onChange={handleChange} required />

                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" name="email" value={employee.email} onChange={handleChange} required />

                <label className={styles.label}>Password</label>
                <input className={styles.input} type="password" name="password" value={employee.password} onChange={handleChange} required />

                <label className={styles.label}>Role</label>
                <select className={styles.input} name="role" value={employee.role} onChange={handleChange} required>
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                </select>

                <label className={styles.label}>Department</label>
                <input className={styles.input} name="department" value={employee.department} onChange={handleChange} />

                <label className={styles.label}>Position</label>
                <input className={styles.input} name="position" value={employee.position} onChange={handleChange} />

                <label className={styles.label}>Working Days</label>
                <input className={styles.input} name="working_days" value={employee.working_days} onChange={handleChange} placeholder="e.g. Mon-Fri" />

                <label className={styles.label}>Shift</label>
                <select className={styles.input} name="shift" value={employee.shift} onChange={handleChange}>
                    <option value="">Select shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                </select>

                <label className={styles.label}>Current Project</label>
                <input className={styles.input} name="current_project" value={employee.current_project} onChange={handleChange} />

                <label className={styles.label}>Date Joined</label>
                <input className={styles.input} type="date" name="date_joined" value={employee.date_joined} onChange={handleChange} />

                <label className={styles.label}>Daily Task</label>
                <input className={styles.input} name="daily_task" value={employee.daily_task} onChange={handleChange} placeholder="e.g. Prepare report" />

                <label className={styles.labelCheckbox}>
                    <input type="checkbox" name="is_active" checked={employee.is_active} onChange={handleChange} />
                    Active
                </label>

                <button type="submit" className={styles.button}>Add Employee</button>
            </form>
        </div>
    );
}
