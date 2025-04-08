import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { TrainingPage } from "./pages/TrainingPage";
import { FormulaParsingCard } from "./components/FormulaParsingCard";

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/formula-editor" element={<FormulaParsingCard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}