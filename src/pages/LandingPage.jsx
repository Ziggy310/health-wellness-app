import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import AuthModal from '../components/auth/AuthModal';
import heroImage from '../assets/hero.jpg';  



const LandingPage = ({ onAuthClick }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const backgroundImageUrl = '/assets/images/women_background.jpg';
  const { isAuthenticated, isOnboarded } = useAppContext();
  const navigate = useNavigate();

  // Features for the app
  const features = [
    {
      title: 'Personalized Symptom Tracking',
      description: 'Log your symptoms daily and track patterns over time with our intuitive interface',
      icon: '📊'
    },
    {
      title: 'Tailored Meal Plans',
      description: 'Get nutrition recommendations specifically designed to alleviate menopause symptoms',
      icon: '🥗'
    },
    {
      title: 'Health Insights & Analytics',
      description: 'Gain valuable insights into your health with detailed analytics and reports',
      icon: '📈'
    },
    {
      title: 'Supportive Community',
      description: 'Connect with others experiencing similar journeys in our safe, moderated community',
      icon: '👭'
    },
    {
      title: 'Relief Tools & Resources',
      description: 'Access guided meditations, breathing exercises, and educational resources',
      icon: '🧘‍♀️'
    },
    {
      title: 'Personalized Recommendations',
      description: 'Receive AI-powered suggestions tailored to your specific symptoms and needs',
      icon: '🤖'
    },
  ];

  // Subscription plans
  const subscriptionPlans = [


    {
      id: 'premium',
      name: 'Monthly Plan',
      price: '$14.99',
      period: 'monthly',
      features: [
        'Advanced symptom analysis',
        'Personalized meal planning',
        'Detailed nutrient tracking',
        'Full community participation',
        'Comprehensive health reports',
        'Relief tools & resources',
        'Personalized wellness tips'
      ],
      bestFor: 'Best for active symptom management and support',
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      recommended: true,
      hasFreeTrial: true
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      price: '$149.99',
      period: 'yearly',
      features: [
        'All Monthly Plan features',
        'Save over 15% vs monthly',
        'Exclusive monthly webinars',
        'Quarterly consultation with specialist',
        'Custom wellness plans',
        'Priority support',
        'Early access to new features',
        'Ad-free experience'
      ],
      bestFor: 'Best value for long-term support',
      color: 'bg-gradient-to-r from-purple-600 to-purple-800',
      recommended: false,
      hasFreeTrial: true
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Meno+ has completely transformed how I manage my menopause journey. The personalized recommendations have made such a difference!",
      author: "Jennifer R.",
      position: "Using Meno+ for 8 months"
    },
    {
      quote: "The symptom tracking feature helps me communicate better with my doctor. Now I have data to back up what I'm experiencing.",
      author: "Sarah K.",
      position: "Using Meno+ for 6 months"
    },
    {
      quote: "The community support has been invaluable. I no longer feel alone in this journey.",
      author: "Maria L.",
      position: "Using Meno+ for 1 year"
    },
  ];

  // Effect for cycling through testimonials automatically
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(testimonialTimer);
  }, [testimonials.length]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    // Store selected plan for after registration
    localStorage.setItem('selectedPlan', plan.name);
    // Open sign-up modal
    setShowAuthModal(true);
    setAuthMode('signup');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-purple-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold"><span className="text-purple-400">M</span>eno<span className="text-purple-400">+</span></span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/dashboard')} 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all transform hover:scale-105"
              >
                <span className="mr-2">Enter App</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <>
                <button 
                  className="text-purple-300 hover:text-white px-4 py-2 transition-colors"
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                >
                  Login
                </button>
                <button 
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Hero Section with semi-transparent background image */}
      <header className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
 <div
  className="w-full h-full bg-cover bg-center brightness-50"
  style={{ backgroundImage: `url(${heroImage})` }}
></div>
</div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {/* Logo/Brand */}
          <div className="mb-2">
            <h1 className="text-6xl font-bold mb-2">
              <span className="text-purple-600">M</span>
              <span className="text-white">eno</span>
              <span className="text-purple-600">+</span>
            </h1>
            <p className="text-xl text-purple-200">Your personalized menopause companion</p>
          </div>
          
          {/* Enter App button for authenticated users */}
          {isAuthenticated && (
            <div className="mt-6 mb-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center mx-auto"
              >
                <span className="mr-3">Enter App</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="text-white mt-2 text-sm">Continue to your dashboard</p>
            </div>
          )}
          
          {/* Tagline & CTA */}
          <div className="max-w-3xl mx-auto my-6">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Empowering Your Menopause Journey Through Personalized Support
            </h2>
            <p className="text-xl mb-6">
              Navigate your menopause journey with confidence. Track symptoms, discover personalized nutrition plans, and connect with a supportive community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => onAuthClick('signup')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 text-lg"
              >
                Start a free trial
              </button>
              
              <button
                onClick={() => {
                  // Set demo user data
                  localStorage.setItem('onboardingCompleted', 'true');
                  localStorage.setItem('onboardingData', JSON.stringify({
                    profile: {
                      name: 'Demo User',
                      age: '45',
                      menopause_stage: 'perimenopause',
                      energy_level: 'moderate',
                      email: 'demo@example.com'
                    },
                    preferences: {
                      primary_diet: 'balanced',
                      allergies: [],
                      dietaryRestrictions: [],
                      spicePreference: 'medium'
                    },
                    goals: {
                      primary_goals: ['energy', 'mood'],
                      health_focus: 'overall_wellness'
                    }
                  }));
                  localStorage.setItem('userPreferences', JSON.stringify({
                    allergies: [],
                    dietaryRestrictions: [],
                    spicePreference: 'medium',
                    primaryDiet: 'balanced'
                  }));
                  localStorage.setItem('demo_mode', 'true');
                  // Redirect to dashboard
                  window.location.href = '/dashboard';
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 text-lg border-2 border-emerald-400 hover:border-emerald-300"
              >
                🚀 Try Demo
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Featured Video Section */}
      <section className="py-16 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">See How Meno+ Works</h2>
          <p className="text-center text-purple-200 mb-10 max-w-2xl mx-auto">Discover how Meno+ transforms your menopause journey with personalized support and comprehensive tools</p>
          
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center relative">
              {/* Video placeholder with gradient background */}
              <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-600 flex flex-col items-center justify-center p-6">
                {/* Play button with animation */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/20 absolute animate-ping -inset-2"></div>
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center relative z-10 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white fill-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center text-white text-xl font-medium mt-6">
                  Watch: The Meno+ Experience
                </div>
                <p className="text-purple-200 text-center mt-3 max-w-md">
                  See how our comprehensive symptom tracking, personalized recommendations, and supportive community can help you thrive
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 text-purple-300 text-xs">Duration: 3:24</div>
              <div className="absolute top-4 left-4 text-purple-300 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Preview
              </div>
            </div>
          </div>
          
          {/* Video benefits bullets */}
          <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 text-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Real user testimonials</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>App feature walkthrough</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Success stories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="comprehensive-features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-800 mb-3">Comprehensive Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Designed specifically to support you through every stage of menopause</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md border border-purple-100 hover:shadow-lg transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-purple-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-800 mb-3">User Testimonials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hear from women who've transformed their menopause experience with Meno+</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Featured testimonial with animation */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border-l-4 border-purple-600 p-8">
              {/* Large quote marks */}
              <div className="text-8xl text-purple-100 absolute -top-5 left-4 font-serif leading-none">"</div>
              <div className="text-8xl text-purple-100 absolute -bottom-10 right-4 font-serif leading-none rotate-180">"</div>
              
              {/* Current testimonial with fade transition */}
              <div className="relative z-10">
                <p className="text-xl italic text-gray-700 mb-6">
                  {testimonials[currentTestimonial].quote}
                </p>
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                    {testimonials[currentTestimonial].author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-purple-800">{testimonials[currentTestimonial].author}</p>
                    <p className="text-sm text-gray-500">{testimonials[currentTestimonial].position}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial pagination dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${currentTestimonial === index ? 'bg-purple-600 w-6' : 'bg-purple-300'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Add more personal stories CTA */}
            <div className="text-center mt-8">
              <Link 
                to="/community" 
                className="text-purple-700 font-medium hover:text-purple-900 inline-flex items-center"
              >
                Read more stories from our community
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="subscription-plans" className="py-16 bg-gradient-to-b from-purple-800 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">Find the right level of support for your menopause journey with our flexible plans</p>
          </div>
          
          {/* Plan comparison highlights */}
          <div className="flex justify-center mb-10 max-w-5xl mx-auto overflow-x-auto">
            <div className="flex space-x-4">
              <div className="flex items-center px-4 py-2 bg-purple-700/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-purple-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="whitespace-nowrap text-sm">7-day free trial</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-purple-700/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-purple-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="whitespace-nowrap text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-purple-700/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-purple-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="whitespace-nowrap text-sm">No credit card needed</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {subscriptionPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl overflow-hidden ${selectedPlan === plan ? 'ring-4 ring-purple-300 transform scale-105 transition-all duration-300' : 'hover:transform hover:scale-102 transition-all duration-300'}`}
              >
                <div className={`${plan.color} pt-12 pb-6 px-6 text-white relative`}>
                  {plan.hasFreeTrial && (
                    <div className="absolute top-3 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg">
                        7-DAY FREE TRIAL
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-center mt-2">{plan.name}</h3>
                  <div className="text-center my-4">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-center text-sm text-purple-200">{plan.bestFor}</p>
                </div>
                
                <div className="bg-white text-gray-800 p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full mt-8 py-3 rounded-lg font-bold transition-all shadow-md ${selectedPlan === plan 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                  >
                    {selectedPlan === plan ? 'Selected' : 'Start your free trial.'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-purple-200 text-sm">All plans include a 7-day free trial. Cancel anytime before the trial ends.</p>
          </div>
          

        </div>
      </section>

      {/* Why Choose Meno+ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-800 mb-3">Why Choose Meno+</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your comprehensive companion through every stage of menopause</p>
          </div>
          
          {/* Comprehensive Comparison Table */}
          <div className="mb-16 overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-4 text-left font-bold text-gray-900 text-sm">Feature</th>
                  <th className="px-4 py-4 text-center font-bold text-white bg-purple-600 text-sm">Meno+</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Balance</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Flo</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Elektra</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Caria</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Perry</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Olivia</th>
                  <th className="px-4 py-4 text-center font-medium text-gray-700 text-sm">Midday</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Personalized AI Tracking</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Real-time Symptom Alerts</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Wearable Device Integration</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-gray-500 text-xs font-medium">Limited</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">24/7 AI Health Coach</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-gray-500 text-xs font-medium">Limited</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Workplace Wellness Tools</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Predictive Health Insights</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-gray-500 text-xs font-medium">Limited</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-gray-500 text-xs font-medium">Limited</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Medical-Grade Privacy</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Free Basic Plan</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Clinical Validation</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">Community Support</td>
                  <td className="px-4 py-4 text-center bg-purple-50"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-green-600 text-lg">✅</span></td>
                  <td className="px-4 py-4 text-center"><span className="text-red-500 text-lg">❌</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Stats and Testimonial Below Table */}
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Left side: Stats */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-2">93%</div>
                  <p className="text-sm text-gray-600">of users report improved symptom management</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-2">87%</div>
                  <p className="text-sm text-gray-600">feel more in control of their menopause journey</p>
                </div>
              </div>
            </div>
            
            {/* Right side: Testimonial */}
            <div className="border border-purple-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">Recommended by Healthcare Professionals</h3>
              <p className="text-gray-600 mb-4">"Meno+ provides evidence-based support that complements clinical care for women experiencing menopause."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <span className="text-purple-700 font-bold">MD</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dr. Emily Chen</p>
                  <p className="text-sm text-gray-500">OB/GYN, Women's Health Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-purple-100 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-200 opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-purple-200 opacity-60"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-purple-800 mb-6">Begin Your Journey Today</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our community of women who are transforming their menopause experience with personalized support and guidance.
          </p>
          
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">Start Your Free Trial</h3>
                <p className="text-gray-600">No credit card required</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const pricingSection = document.getElementById('subscription-plans');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition duration-300 text-lg block w-full text-center"
            >
              Get Started Now
            </button>
            
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-xs text-gray-500">7-day free trial</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-xs text-gray-500">Cancel anytime</span>
              </div>
            </div>
          </div>
          

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-purple-300">M</span>
                <span className="text-white">eno</span>
                <span className="text-purple-300">+</span>
              </h3>
              <p className="text-purple-200 mb-4">Your personalized menopause companion</p>

            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#comprehensive-features" onClick={(e) => { e.preventDefault(); document.getElementById('comprehensive-features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Symptom Tracking</a></li>
                <li><a href="#comprehensive-features" onClick={(e) => { e.preventDefault(); document.getElementById('comprehensive-features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Meal Planning</a></li>
                <li><a href="#comprehensive-features" onClick={(e) => { e.preventDefault(); document.getElementById('comprehensive-features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Nutrition Insights</a></li>
                <li><a href="#comprehensive-features" onClick={(e) => { e.preventDefault(); document.getElementById('comprehensive-features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Relief Tools</a></li>
                <li><a href="#comprehensive-features" onClick={(e) => { e.preventDefault(); document.getElementById('comprehensive-features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Community Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="mailto:support@menoplus.ai" className="hover:text-white transition-colors">Help Center</a></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="mt-12 pt-8 border-t border-purple-800">
            <div className="max-w-md mx-auto">
              <h4 className="font-bold mb-2 text-center">Stay Updated</h4>
              <p className="text-sm text-purple-200 mb-4 text-center">Get the latest news and updates on menopause management</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-purple-300 mt-2 text-center">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-purple-700 text-center text-purple-300 text-sm">
            <div className="flex flex-col md:flex-row items-center justify-center mb-4">
              <img src="/assets/images/StayhealthyLogoMsSignature_white.png" alt="Stayhealthy, Inc." className="h-10 mr-3 mb-3 md:mb-0" />
              <p className="text-sm">Meno+ is a product of Stayhealthy, Inc.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© {new Date().getFullYear()} Meno+. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">Terms</a>

              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      )}
    </div>
  );
};

export default LandingPage;