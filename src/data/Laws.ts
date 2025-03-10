import { useState, useEffect } from "react";
import { Difficulty } from "../types/Difficulty";
import { PhysicsCategory } from "../types/PhysicsCategory";
import { PhysicsLaw } from "../types/PhysicsLaw";

export const physicsLaws: PhysicsLaw[] = [];

const API_URL = 'http://localhost:3001/api';

function stringToCategory(category: string): PhysicsCategory {
  switch (category) {
    case "Механика": 
    case "Mechanics": return PhysicsCategory.Mechanics;
    case "Термодинамика": 
    case "Thermodynamics": return PhysicsCategory.Thermodynamics;
    case "Электромагнетизм":
    case "Electromagnetism": return PhysicsCategory.Electromagnetism;
    case "Оптика":
    case "Optics": return PhysicsCategory.Optics;
    default: return PhysicsCategory.Mechanics;
  }
}

function categoryToString(category: PhysicsCategory): string {
  switch (category) {
    case PhysicsCategory.Mechanics: return "Mechanics";
    case PhysicsCategory.Thermodynamics: return "Thermodynamics";
    case PhysicsCategory.Electromagnetism: return "Electromagnetism";
    case PhysicsCategory.Optics: return "Optics";
    default: return "Mechanics";
  }
}

function stringToDifficulty(difficulty: string): Difficulty {
  switch (difficulty) {
    case "Easy":
    case "Легко": return Difficulty.Easy;
    case "Medium":
    case "Средне": return Difficulty.Medium;
    case "Hard":
    case "Сложно": return Difficulty.Hard;
    case "Very Hard": 
    case "Очень сложно": return Difficulty.VeryHard;
    default: return Difficulty.Medium;
  }
}

function difficultyToString(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.Easy: return "Easy";
    case Difficulty.Medium: return "Medium";
    case Difficulty.Hard: return "Hard";
    case Difficulty.VeryHard: return "Very Hard";
    default: return "Medium";
  }
}

export function useLaws() {
  const [laws, setLaws] = useState<PhysicsLaw[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<PhysicsCategory[]>([]);

  const fetchLaws = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/laws`);
      if (!response.ok) {
        throw new Error('Ошибка получения законов физики');
      }
      
      const data = await response.json();
      
      const mappedLaws = data.map((law: any) => ({
        ...law,
        category: stringToCategory(law.category),
        difficulty: stringToDifficulty(law.difficulty)
      }));
      
      setLaws(mappedLaws);
      
      const uniqueCategories = Array.from<PhysicsCategory>(
        new Set(mappedLaws.map((law: PhysicsLaw) => law.category))
      );
      setCategories(uniqueCategories);
      
      physicsLaws.length = 0;
      physicsLaws.push(...mappedLaws);
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading laws:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const deleteLaw = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/laws/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении закона физики');
      }
      
      setLaws(prevLaws => prevLaws.filter(law => law.id !== id));
      
      const index = physicsLaws.findIndex(law => law.id === id);
      if (index !== -1) {
        physicsLaws.splice(index, 1);
      }
      
      return true;
    } catch (err) {
      console.error("Error deleting law:", err);
      setError(err instanceof Error ? err.message : 'Unknown error deleting law');
      return false;
    }
  };
  
  const createLaw = async (law: Omit<PhysicsLaw, 'id'>) => {
    try {
      const lawToSave = {
        ...law,
        category: categoryToString(law.category),
        difficulty: difficultyToString(law.difficulty)
      };
      
      const response = await fetch(`${API_URL}/laws`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lawToSave),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при создании закона физики');
      }
      
      const result = await response.json();
      
      if (result.success) {
        const newLaw = {
          ...law,
          id: result.law.id,
        };
        
        setLaws(prevLaws => [...prevLaws, newLaw]);
        physicsLaws.push(newLaw);
        
        return { success: true, law: newLaw };
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (err) {
      console.error("Error creating law:", err);
      setError(err instanceof Error ? err.message : 'Unknown error creating law');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  const updateLaw = async (id: string, law: Omit<PhysicsLaw, 'id'>) => {
    try {
      const lawToSave = {
        ...law,
        category: categoryToString(law.category),
        difficulty: difficultyToString(law.difficulty)
      };
      
      console.log("Updating law with data:", lawToSave);
      
      const response = await fetch(`${API_URL}/laws/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lawToSave),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при изменении закона физики');
      }
      
      const result = await response.json();
      
      if (result.success) {
        const updatedLaw = {
          ...law,
          id,
        };
        
        setLaws(prevLaws => prevLaws.map(l => l.id === id ? updatedLaw : l));
        
        const index = physicsLaws.findIndex(l => l.id === id);
        if (index !== -1) {
          physicsLaws[index] = updatedLaw;
        }
        
        return { success: true, law: updatedLaw };
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (err) {
      console.error("Error updating law:", err);
      setError(err instanceof Error ? err.message : 'Unknown error updating law');
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  useEffect(() => {
    fetchLaws();
  }, []);

  return { 
    laws, 
    loading, 
    error, 
    categories, 
    deleteLaw, 
    createLaw,
    updateLaw,
    refreshLaws: fetchLaws 
  };
}