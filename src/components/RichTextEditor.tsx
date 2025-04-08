import { useEffect, useRef, useState } from "react";
import "../styles/components/RichTextEditor.scss";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  className = "",
  rows = 4
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isEditorFocused) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isEditorFocused]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command: string, value: string = "") => {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    editorRef.current?.focus();

    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    document.execCommand(command, false, value);
    
    handleEditorChange();
    
    editorRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      document.execCommand('insertLineBreak', false, '');
      e.preventDefault();
    }
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="rich-text-toolbar">
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            formatText("bold");
          }}
          className="toolbar-button"
          title="Полужирный (Ctrl+B)"
          onMouseDown={(e) => e.preventDefault()}
        >
          <strong>Ж</strong>
        </button>
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            formatText("italic");
          }}
          className="toolbar-button"
          title="Курсив (Ctrl+I)"
          onMouseDown={(e) => e.preventDefault()}
        >
          <em>К</em>
        </button>
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            formatText("underline");
          }}
          className="toolbar-button"
          title="Подчеркнутый (Ctrl+U)"
          onMouseDown={(e) => e.preventDefault()}
        >
          <u>Ч</u>
        </button>
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            formatText("strikeThrough");
          }}
          className="toolbar-button"
          title="Зачеркнутый"
          onMouseDown={(e) => e.preventDefault()}
        >
          <s>З</s>
        </button>
        <span className="toolbar-divider">|</span>
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            formatText("insertOrderedList");
          }}
          className="toolbar-button"
          title="Нумерованный список"
          onMouseDown={(e) => e.preventDefault()}
        >
          1.
        </button>
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            formatText("insertUnorderedList");
          }}
          className="toolbar-button"
          title="Маркированный список"
          onMouseDown={(e) => e.preventDefault()}
        >
          •
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        onInput={handleEditorChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        onKeyDown={handleKeyDown}
        style={{ minHeight: `${rows * 1.5}em` }}
        data-placeholder={placeholder}
      />
    </div>
  );
}