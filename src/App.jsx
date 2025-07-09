// src/App.jsx
import './App.css';
import Home from './components/Home.jsx';
import Temp from './components/Temp.jsx';

function App() {
  return (
    <>
      <Home name="John" age={25} />
      <Temp />
    </>
  );
}

export default App;
