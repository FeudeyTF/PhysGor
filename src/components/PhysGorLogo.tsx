import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function PhysGorLogo() {
  return (
    <motion.div
      className="logo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/">
        <span className="logo-icon">Φ</span>
        <span className="logo-text">ФизГор</span>
      </Link>
    </motion.div>
  );
}
