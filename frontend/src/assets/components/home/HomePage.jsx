import Home_navbar from './Home_navbar.jsx';
import HeroSection from './HeroSection.jsx';
import VideoSection from './VideoSection.jsx';
import Opening from './opening.jsx';
import AboutUs from './AboutUs.jsx';
import AccompanimentSection from './AccompanimentSection.jsx';
import TeamCarousel from './TeamCarousel.jsx';
import Testimonials from './Testimonials.jsx';
import ContactForm from './ContactForm.jsx';
import Footer from './Footer.jsx';

const HomePage = () => {
  return (
      <div className="relative overflow-hidden w-full h-full bg-[#101010]">
        <Home_navbar />
        <HeroSection />
        <VideoSection />
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