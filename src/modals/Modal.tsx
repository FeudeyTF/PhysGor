import { motion } from "framer-motion";
import React from "react";
import { FaTimes } from "react-icons/fa";

type ModalWindowProps = {
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  submitButton?: React.ReactNode;
  error?: string;
  onSubmit?: (event: React.FormEvent) => void;
};

type ModalWindowGroupProps = {
  children?: React.ReactNode;
  title: string;
  error?: string;
};

type ModalWindowRowProps = {
  children?: React.ReactNode;
};

export function ModalWindow(props: ModalWindowProps) {
  const { onClose, title, children, onSubmit, error, submitButton } = props;

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-form"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="form-header">
          <h2>{title}</h2>
          <button
            className="close-button"
            onClick={onClose}
            title="Закрыть форму"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          {children}
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>
            {submitButton}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ModalWindowRow(props: ModalWindowRowProps) {
  const { children } = props;
  return <div className="form-row">{children}</div>;
}

function ModalWindowGroup(props: ModalWindowGroupProps) {
  const { children, title, error } = props;

  return (
    <div className="form-group">
      <label htmlFor="name">{title}:</label>
      {children}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

ModalWindow.Group = ModalWindowGroup;
ModalWindow.Row = ModalWindowRow;