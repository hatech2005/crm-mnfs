import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { setupRootUser } from "../setupRoot";
import styles from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1>MINH NHẬT</h1>
          <p>Hệ Thống Quản Lý Phong Thủy</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="admin"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button 
              onClick={async () => {
                const success = await setupRootUser();
                if (success) toast.success("Đã tạo tài khoản root thành công!");
                else toast.error("Tạo tài khoản root thất bại!");
              }}
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
            >
              [Dev] Khởi tạo tài khoản Root
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
