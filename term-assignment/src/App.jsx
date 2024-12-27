import { Route, Routes } from "react-router-dom";
import  { Home } from "./Home";
import EventPage from "./EventPage";
import AddEvent from "./AddEvent";

function App() {
  return (
    <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route exact path="/event/:id" element={<EventPage />}/>
        <Route exact path="/add" element={<AddEvent/>} />
    </Routes>
  )
}

export default App
