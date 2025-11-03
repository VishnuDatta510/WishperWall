import React from 'react'
import {Route , Routes} from "react-router"
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NoteDetailPage from './pages/NoteDetailPage'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <div className='min-h-screen bg-base-200'>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage/>} />
        <Route path="/note/:id" element={<NoteDetailPage/>} />
      </Routes>
    </div>
  )
}

export default App;

