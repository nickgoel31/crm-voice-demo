import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Leads from './pages/Leads';
import Chatbot from './pages/Chatbot';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="*" element={<Navigate to="/leads" replace />} />
        </Routes>
      </Layout>
      <ChatWidget />
    </BrowserRouter>
  );
}

