import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './components/FormPage';
import Result from './components/Result';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  </Router>
  )
}

export default App;
