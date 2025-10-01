import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/NotFoundPage.scss";

export function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <div className="physics-joke">
        <p className="joke-text">
          Похоже, эта страница <strong>квантово туннелировала</strong> за
          пределы нашей наблюдаемой вселенной!
        </p>
        <div className="physics-illustration">
          <div className="potential-barrier"></div>
          <div className="particle"></div>
          <div className="probability-wave"></div>
        </div>
      </div>
      <p className="not-found-subtitle">
        Согласно принципу неопределенности, мы не можем быть на 100% уверены,
        что этой страницы не существует...
      </p>
      <Link to="/" className="home-button">
        Вернуться в известное состояние
      </Link>
    </div>
  );
}
