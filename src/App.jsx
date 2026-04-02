import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import RegisterCancel from './pages/RegisterCancel'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Services from './pages/Services'
import WhyUs from './pages/WhyUs'
import FAQ from './pages/FAQ'
import CommitteeMatch from './pages/CommitteeMatch'
import CommitteeIndividual from './pages/CommitteeIndividual'
import CommitteeAdmin from './pages/CommitteeAdmin'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        <Route path="/register/cancel" element={<RegisterCancel />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/committee-match" element={<CommitteeMatch />} />
        <Route path="/committee-match/individual" element={<CommitteeIndividual />} />
        <Route path="/committee-match/admin" element={<CommitteeAdmin />} />
      </Routes>
      <Footer />
    </>
  )
}
