import { Header } from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Header />
      <HomePage />
    </div>
  );
}
