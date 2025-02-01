import Home_navbar from './Home_components/Home_navbar.jsx';
import HeroSection from './Home_components/HeroSection.jsx';
import Opening from './Home_components/opening.jsx';
import AboutUs from './Home_components/AboutUs.jsx';
import AccompanimentSection from './Home_components/AccompanimentSection.jsx';
import TeamCarousel from './Home_components/TeamCarousel.jsx';
import Testimonials from './Home_components/Testimonials.jsx';
import ContactForm from './Home_components/ContactForm.jsx';
import Footer from './Home_components/Footer.jsx';

const HomePage = () => {
  return (
    <div className="bg-[#101010] w-full h-full">
      <Home_navbar />
      <HeroSection />
      <Opening/>
      <AboutUs />
      <AccompanimentSection />
      <TeamCarousel />
      <Testimonials />
      <ContactForm
        emailServiceId={import.meta.env.VITE_EMAILJS_SERVICE}
        emailTemplateId={import.meta.env.VITE_EMAILJS_TEMPLATE}
        emailPublicKey={import.meta.env.VITE_EMAILJS_PUBLIC_KEY}
      />
      <Footer />
    </div>
  );
};

export default HomePage;