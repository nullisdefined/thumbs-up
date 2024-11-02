import ThumbnailGenerator from "./components/ThumbnailGenerator";
import { Footer } from "./components/Footer";
import "./styles/fonts.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ThumbnailGenerator />
      <Footer />
    </div>
  );
}

export default App;
