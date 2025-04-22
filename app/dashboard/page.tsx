import Link from "next/link";
import styles from "./dashboard.module.css";

export default function Home() {
    //routes the user to other pages based on the click
    return (
        <div className={styles.page}>

            <main className={styles.main}>
                <h1 className={styles.title}>Employee Management System</h1>
                <p className={styles.subtitle}>Manage and view employee records easily.</p>


                <Link href="/view-employees">
                    <button className={styles.primaryButton}>View employees</button>
                </Link>

                <Link href="/add-employee">
                    <button className={styles.primaryButton}>add employees</button>
                </Link>

            </main>
        </div>
    );
}
