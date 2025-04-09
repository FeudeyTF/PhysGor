import { FaGithub } from "react-icons/fa";
import { PhysGorLogo } from "./PhysGorLogo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <PhysGorLogo />
        <div className="footer-content">
          <div className="footer-section">
            <h4>Информация</h4>
            <p>
              Современная интерактивная коллекция карточек по физике для
              учеников Школы им. А.М. Горчакова.
            </p>
          </div>

          <div className="footer-section">
            <h4>Ссылки</h4>
            <ul>
              <li>
                <a href="#about">О Нас</a>
              </li>
              <li>
                <a href="#contact">Контакты</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Связаться</h4>
            <div className="social-icons">
              <a
                href="https://github.com/FeudeyTF/PhysGor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} <b>ФизГор</b>. Создано <b>Яном Морданенко</b>{" "}
            <i>(7-й набор)</i>. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
