import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { ModalWindow } from "./Modal";

type AuthModalProps = {
  onClose: () => void;
};

export function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key.trim()) {
      setError("Пожалуйста, введите ключ аутентификации");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await login(key);

      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Произошла ошибка при входе. Пожалуйста, попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWindow
      title="Авторизация"
      onClose={onClose}
      onSubmit={handleSubmit}
      error={error || ""}
      submitButton={
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </button>
      }
    >
      <div className="form-info">
        <FaLock className="lock-icon" />
        <p>
          Авторизация необходима для добавления, редактирования и удаления
          карточек. Если у вас нет ключа доступа, вы все равно можете
          использовать приложение для просмотра и тренировки.
        </p>
      </div>

      <ModalWindow.Group title="Ключ аутентификации">
        <input
          type="password"
          id="auth-key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Введите ключ доступа..."
          className={error ? "error" : ""}
        />
      </ModalWindow.Group>
    </ModalWindow>
  );
}
