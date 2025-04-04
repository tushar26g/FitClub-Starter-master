import './App.css';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router } from "react-router-dom";
import Home from '../src/components/Home/Home'

function App() {
  return (
    <Router>
    <div className="App">
         <Home />
         <Footer />
    </div>
    </Router>
  );
}

export default App;
