import { useEffect, useRef, useState, useCallback, KeyboardEvent } from "react";
import "../styles/components/RichTextEditor.scss";
import { FormulaParser, parseFormula } from "./FormulaParser";

type ContentNodeType = "text" | "formula";

interface BaseContentNode {
  id: string;
  type: ContentNodeType;
}

interface TextNode extends BaseContentNode {
  type: "text";
  content: string;
}

interface FormulaNode extends BaseContentNode {
  type: "formula";
  formula: string;
}

type ContentNode = TextNode | FormulaNode;

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
};

export function RichTextEditor(props: RichTextEditorProps) {
  const { value, onChange, placeholder = "", className = "", rows = 4 } = props;
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [formula, setFormula] = useState("");
  const [editingFormulaId, setEditingFormulaId] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(-1);
  const [content, setContent] = useState<ContentNode[]>([]);
  const [draggedFormulaIndex, setDraggedFormulaIndex] = useState<number | null>(null);

  const parseContentFromHTML = useCallback((html: string): ContentNode[] => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    const result: ContentNode[] = [];
    
    const parseNode = (node: Node): ContentNode[] => {
      const nodes: ContentNode[] = [];
      
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        nodes.push({
          id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "text",
          content: node.textContent
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        if (element.classList.contains("formula-wrapper")) {
          const formulaId = element.getAttribute("data-id") || `formula-${Date.now()}`;
          const formulaText = element.getAttribute("data-formula") || "";
          
          nodes.push({
            id: formulaId,
            type: "formula",
            formula: formulaText
          });
        } else {
          element.childNodes.forEach(childNode => {
            nodes.push(...parseNode(childNode));
          });
        }
      }
      
      return nodes;
    };
    
    tempDiv.childNodes.forEach(node => {
      result.push(...parseNode(node));
    });
    
    return result;
  }, []);
  
  const generateHTML = useCallback((nodes: ContentNode[]): string => {
    return nodes.map(node => {
      if (node.type === "text") {
        return node.content;
      } else {
        return `<span class="formula-wrapper" data-id="${node.id}" data-formula="${node.formula}" contenteditable="false" draggable="true"><span class="formula-display">${parseFormula(node.formula)}</span></span>`;
      }
    }).join("");
  }, []);

  const handleEditorChange = useCallback(() => {
    if (editorRef.current) {
      const newContentNodes = parseContentFromHTML(editorRef.current.innerHTML);
      setContent(newContentNodes);
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, parseContentFromHTML]);

  const initFormulaEventHandlers = useCallback(() => {
    if (!editorRef.current) return;
    
    const formulas = editorRef.current.querySelectorAll('.formula-wrapper');
    formulas.forEach(formula => {
      formula.setAttribute('draggable', 'true');
    });
  }, []);

  useEffect(() => {
    if (editorRef.current && !isEditorFocused) {
      const newContent = parseContentFromHTML(value);
      setContent(newContent);
      editorRef.current.innerHTML = value;
      initFormulaEventHandlers();
    }
  }, [value, isEditorFocused, parseContentFromHTML, initFormulaEventHandlers]);

  const handleFormulaElementClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const formulaWrapper = target.closest('.formula-wrapper') as HTMLElement;
    
    if (formulaWrapper) {
      event.preventDefault();
      event.stopPropagation();
      
      const formulaId = formulaWrapper.getAttribute('data-id');
      const formulaText = formulaWrapper.getAttribute('data-formula');
      
      if (formulaId && formulaText) {
        setEditingFormulaId(formulaId);
        setFormula(formulaText);
        setShowFormulaModal(true);
      }
    }
  }, []);

  const handleFormulaElementDragStart = useCallback((event: DragEvent) => {
    const target = event.target as Node;
    
    if (target.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    
    const htmlTarget = target as HTMLElement;
    const formulaWrapper = htmlTarget.closest('.formula-wrapper') as HTMLElement;
    
    if (formulaWrapper) {
      const formulaId = formulaWrapper.getAttribute('data-id');
      
      if (formulaId) {
        const index = content.findIndex(node => 
          node.type === 'formula' && node.id === formulaId
        );
        
        if (index >= 0) {
          setDraggedFormulaIndex(index);
          event.dataTransfer?.setData("text/plain", formulaId);
          
          formulaWrapper.classList.add('dragging');
          
          setTimeout(() => {
            formulaWrapper.classList.remove('dragging');
          }, 0);
        }
      }
    }
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    const handleClick = (e: MouseEvent) => handleFormulaElementClick(e);
  
    const handleDragStart = (e: DragEvent) => handleFormulaElementDragStart(e);
    
    editor.addEventListener('click', handleClick);
    editor.addEventListener('dragstart', handleDragStart);
    
    return () => {
      editor.removeEventListener('click', handleClick);
      editor.removeEventListener('dragstart', handleDragStart);
    };
  }, [handleFormulaElementClick, handleFormulaElementDragStart]);

  useEffect(() => {
    initFormulaEventHandlers();
  }, [content, initFormulaEventHandlers]);

  const handleEditorDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleEditorDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    if (draggedFormulaIndex === null || !editorRef.current) return;
    
    try {
      const draggedFormula = content[draggedFormulaIndex] as FormulaNode;
      
      const dropRange = document.caretRangeFromPoint(event.clientX, event.clientY);
      if (!dropRange || !editorRef.current.contains(dropRange.commonAncestorContainer)) {
        console.error("Не удалось определить точку сброса");
        return;
      }
      
      const formulaElement = document.createElement('span');
      formulaElement.className = 'formula-wrapper';
      formulaElement.setAttribute('data-id', draggedFormula.id);
      formulaElement.setAttribute('data-formula', draggedFormula.formula);
      formulaElement.setAttribute('contenteditable', 'false');
      formulaElement.setAttribute('draggable', 'true');
      
      const formulaDisplay = document.createElement('span');
      formulaDisplay.className = 'formula-display';
      formulaDisplay.innerHTML = parseFormula(draggedFormula.formula);
      formulaElement.appendChild(formulaDisplay);
      
      const oldFormulaElement = editorRef.current.querySelector(`.formula-wrapper[data-id="${draggedFormula.id}"]`);
      if (oldFormulaElement) {
        oldFormulaElement.remove();
      }
      
      dropRange.insertNode(formulaElement);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStartAfter(formulaElement);
        newRange.collapse(true);
        selection.addRange(newRange);
      }
      
      if (editorRef.current) {
        const newContentNodes = parseContentFromHTML(editorRef.current.innerHTML);
        setContent(newContentNodes);
        onChange(editorRef.current.innerHTML);
      }
      
      initFormulaEventHandlers();
      
      setDraggedFormulaIndex(null);
    } catch (error) {
      console.error("Ошибка при перетаскивании формулы:", error);
      setDraggedFormulaIndex(null);
    }
  }, [draggedFormulaIndex, content, onChange, parseContentFromHTML, initFormulaEventHandlers]);

  const handleDragEnd = useCallback(() => {
    setDraggedFormulaIndex(null);
    
    if (editorRef.current) {
      const elements = editorRef.current.querySelectorAll(".drag-over");
      elements.forEach((el) => el.classList.remove("drag-over"));
    }
  }, []);

  const handleSelectionChange = useCallback(() => {
    if (isEditorFocused && document.activeElement === editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current?.contains(range.commonAncestorContainer)) {
          let pos = 0;
          const nodes = editorRef.current.childNodes;
          
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.contains(range.commonAncestorContainer)) {
              if (node.nodeType === Node.TEXT_NODE) {
                pos += range.startOffset;
              } else {
                pos += node.textContent?.length || 0;
              }
              break;
            }
            pos += node.textContent?.length || 0;
          }
          
          setCursorPosition(pos);
        }
      }
    }
  }, [isEditorFocused]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const formatText = useCallback((command: string, value: string = "") => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleEditorChange();
  }, [handleEditorChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        let pos = 0;
        const nodes = editorRef.current.childNodes;
        
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.contains(range.commonAncestorContainer)) {
            if (node.nodeType === Node.TEXT_NODE) {
              pos += range.startOffset;
            }
            break;
          }
          pos += node.textContent?.length || 0;
        }
        
        setCursorPosition(pos);
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  }, []);

  const insertFormula = useCallback(() => {
    if (!formula.trim()) {
      if (editingFormulaId) {
        const newContent = content.filter(node => 
          !(node.type === "formula" && node.id === editingFormulaId)
        );
        
        setContent(newContent);
        
        if (editorRef.current) {
          editorRef.current.innerHTML = generateHTML(newContent);
          initFormulaEventHandlers();
          onChange(editorRef.current.innerHTML);
        }
        
        setEditingFormulaId(null);
      }
      
      setShowFormulaModal(false);
      return;
    }

    if (editingFormulaId) {
      const newContent = content.map(node => {
        if (node.type === "formula" && node.id === editingFormulaId) {
          return {
            ...node,
            formula: formula
          };
        }
        return node;
      });
      
      setContent(newContent);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = generateHTML(newContent);
        initFormulaEventHandlers();
      }
      
      setEditingFormulaId(null);
    } else {
      const formulaId = `formula-${Date.now()}`;
      const formulaNode: FormulaNode = {
        id: formulaId,
        type: "formula",
        formula: formula
      };
      
      if (cursorPosition >= 0) {
        let currentPos = 0;
        
        for (let i = 0; i < content.length; i++) {
          const node = content[i];
          const nodeLength = node.type === "text" ? node.content.length : 1;
          
          if (currentPos <= cursorPosition && currentPos + nodeLength >= cursorPosition) {
            if (node.type === "text") {
              const beforeText = node.content.substring(0, cursorPosition - currentPos);
              const afterText = node.content.substring(cursorPosition - currentPos);
              
              const newContent = [...content];
              
              newContent.splice(i, 1);
              
              if (beforeText) {
                newContent.splice(i, 0, {
                  id: `text-${Date.now()}-1`,
                  type: "text",
                  content: beforeText
                });
                i++;
              }
              
              newContent.splice(i, 0, formulaNode);
              
              if (afterText) {
                newContent.splice(i + 1, 0, {
                  id: `text-${Date.now()}-2`,
                  type: "text",
                  content: afterText
                });
              }
              
              setContent(newContent);
              
              if (editorRef.current) {
                editorRef.current.innerHTML = generateHTML(newContent);
                initFormulaEventHandlers();
              }
              
              break;
            } else {
              const newContent = [...content];
              newContent.splice(i + 1, 0, formulaNode);
              setContent(newContent);
              
              if (editorRef.current) {
                editorRef.current.innerHTML = generateHTML(newContent);
                initFormulaEventHandlers();
              }
              
              break;
            }
          }
          
          currentPos += nodeLength;
        }
      } else {
        const newContent = [...content, formulaNode];
        setContent(newContent);
        
        if (editorRef.current) {
          editorRef.current.innerHTML = generateHTML(newContent);
          initFormulaEventHandlers();
        }
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    
    setShowFormulaModal(false);
    setFormula("");
  }, [formula, editingFormulaId, content, cursorPosition, generateHTML, onChange, initFormulaEventHandlers]);

  const openFormulaModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        let pos = 0;
        const nodes = editorRef.current.childNodes;
        
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.contains(range.commonAncestorContainer)) {
            if (node.nodeType === Node.TEXT_NODE) {
              pos += range.startOffset;
            }
            break;
          }
          pos += node.textContent?.length || 0;
        }
        
        setCursorPosition(pos);
      }
    }
    
    setEditingFormulaId(null);
    setFormula("");
    setShowFormulaModal(true);
  }, []);

  useEffect(() => {
    document.addEventListener("dragend", handleDragEnd);
    return () => {
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [handleDragEnd]);

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
        <span className="toolbar-divider">|</span>
        <button
          type="button"
          onClick={openFormulaModal}
          className="toolbar-button formula-button"
          title="Вставить формулу"
          onMouseDown={(e) => e.preventDefault()}
        >
          ƒ(x)
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
        onClick={handleSelectionChange}
        onDragOver={handleEditorDragOver}
        onDrop={handleEditorDrop}
        style={{ minHeight: `${rows * 1.5}em` }}
        data-placeholder={placeholder}
      />

      {showFormulaModal && (
        <div
          className="formula-modal-overlay"
          onClick={() => setShowFormulaModal(false)}
        >
          <div className="formula-modal" onClick={(e) => e.stopPropagation()}>
            <div className="formula-modal-header">
              {editingFormulaId ? "Редактировать формулу" : "Вставить формулу"}
            </div>
            <div className="formula-modal-body">
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Введите формулу (например: E=mc^2)"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    insertFormula();
                  } else if (e.key === "Escape") {
                    setShowFormulaModal(false);
                  }
                }}
              />
              {formula && (
                <div className="formula-preview">
                  <div className="preview-label">Предпросмотр:</div>
                  <FormulaParser
                    formula={formula}
                    className="formula-preview-content"
                  />
                </div>
              )}
            </div>
            <div className="formula-modal-footer">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="cancel-button"
              >
                Отмена
              </button>
              <button onClick={insertFormula} className="insert-button">
                {editingFormulaId ? "Сохранить" : "Вставить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
