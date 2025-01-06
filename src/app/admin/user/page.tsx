import React from "react";
import UserTable from "./UserTable";

function page() {
  return (
    <main className="container mx-auto p-6 bg-white rounded-md">
      <h1 className="text-3xl font-bold mb-8">Thống kê người dùng</h1>
      <UserTable />
    </main>
  );
}

export default page;
