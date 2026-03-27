import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
import CvPage from './pages/CvPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route path="/about.html" element={<AboutPage />} />
        <Route path="/projects.html" element={<ProjectsPage />} />
        <Route path="/cv.html" element={<CvPage />} />
      </Route>
    </Routes>
  );
}

export default App;
