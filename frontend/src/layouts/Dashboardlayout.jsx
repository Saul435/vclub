import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Topbar />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto bg-zinc-950 p-8"
        >
          <Outlet />
        </motion.main>

      </div>

    </div>
  );
}

export default DashboardLayout;