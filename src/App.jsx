import { Route, Routes } from 'react-router-dom';
import LevelPage from './level/LevelPage';

// The whole site is one continuous level; each path starts the run at its checkpoint.
function App() {
  return (
    <Routes>
      <Route path="*" element={<LevelPage />} />
    </Routes>
  );
}

export default App;
