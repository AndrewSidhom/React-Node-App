import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Comic from "./components/pages/Comic";
import Error404 from "./components/pages/Error404";
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Comic />} />
        <Route path="comics/:comicId" element={<Comic />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root'))
root.render(<App />);