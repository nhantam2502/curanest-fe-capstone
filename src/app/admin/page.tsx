import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";

const AdminPage = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/auth/signIn?role=admin");
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcomeBox}>
        <h1 style={styles.title}>Chào mừng trở lại!</h1>
        <p style={styles.message}>
          Rất vui được gặp lại bạn. Hãy bắt đầu ngày mới tràn đầy năng lượng!
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "84vh",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
  },
  welcomeBox: {
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    animation: "fadeIn 1.5s ease-in-out",
  },
  message: {
    fontSize: "1.2rem",
    lineHeight: "1.5",
  },
};

export default AdminPage;
