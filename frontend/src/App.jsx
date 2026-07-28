import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import Apply from './pages/Apply'
import Track from './pages/Track'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Footer from './components/footer'

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>
  },
  {
    path: '/services',
    element: <><Navbar /><Services /><Footer /></>
  },
  {
    path: '/apply',
    element: <><Navbar /><Apply /><Footer /></>
  },
  {
    path: '/track',
    element: <><Navbar /><Track /><Footer /></>
  },
  {
    path: '/about',
    element: <><Navbar /><About /><Footer /></>
  },
  {
    path: '/faq',
    element: <><Navbar /><FAQ /><Footer /></>
  },
  {
    path: '/contact',
    element: <><Navbar /><Contact /><Footer /></>
  }
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
