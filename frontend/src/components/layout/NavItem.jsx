import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function NavItem({
  to,
  icon: Icon,
  children,
}) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className={`
            flex
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            transition-all
            duration-200
            ${
              isActive
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }
          `}
        >
          <Icon size={20} />

          <span className="font-medium">
            {children}
          </span>

        </motion.div>
      )}
    </NavLink>
  );
}

export default NavItem;