"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./view-employees.module.css";

interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
    working_days: string;
    shift: string;
    current_project: string;
    date_joined: string;
    is_active: boolean;
}

export default function ViewEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedShift, setSelectedShift] = useState("");

    //get method to receive the employees from the sql tbl

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8080/employees");
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        let filtered = employees;

        if (selectedDepartment) {
            filtered = filtered.filter(emp => emp.department === selectedDepartment);
        }

        if (selectedShift) {
            filtered = filtered.filter(emp => emp.shift === selectedShift);
        }

        setFilteredEmployees(filtered);
    }, [selectedDepartment, selectedShift, employees]);

    const uniqueDepartments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    const uniqueShifts = [...new Set(employees.map(emp => emp.shift).filter(Boolean))];

    //filter function to filter using options
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Employees Directory</h1>

            <div className={styles.filters}>
                <select
                    className={styles.select}
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))}
                </select>

                <select
                    className={styles.select}
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                >
                    <option value="">All Shifts</option>
                    {uniqueShifts.map(shift => (
                        <option key={shift} value={shift}>{shift}</option>
                    ))}
                </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Working Days</th>
                            <th>Shift</th>
                            <th>Current Project</th>
                            <th>Date Joined</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.working_days}</td>
                                    <td>{emp.shift}</td>
                                    <td>{emp.current_project}</td>
                                    <td>{emp.date_joined}</td>
                                    <td className={emp.is_active ? styles.active : styles.inactive}>
                                        {emp.is_active ? "Active" : "Inactive"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className={styles.emptyText}>No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
