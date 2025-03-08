import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/about";
import Profile from "./pages/Profile";


function App() {
  return (
    <>
   <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/sign-in" element={<Signin/>} />
      <Route path="/sign-up" element={<SignUp/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
   </Router>
</>
  );
}

export default App;
