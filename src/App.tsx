import './App.css'
import { Navbar } from './components/Navbar/Navbar'
import { Route, Routes } from "react-router-dom"
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer"
import { Record } from "./components/Record/Record"

function App() {

  
  return (
    <div>
      <Navbar />  
      <Routes>
        <Route path="/" element={<VideoPlayer />} />
        <Route path="/practice" element={<VideoPlayer />} />
        <Route path="/record" element={<Record />} />
      </Routes>
    </div>
  )
}

export default App
