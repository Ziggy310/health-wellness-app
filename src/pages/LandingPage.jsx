import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const LandingPage = ({ onAuthClick }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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
      name: '7-Day Free Trial',
      price: 'FREE',
      period: '7 days',
      features: [
        'Full access to all premium features',
        'Personalized symptom tracking',
        'Detailed health insights',
        'Community participation',
        'Personalized meal planning',
        'Email support',
        'No credit card required',
        'Cancel anytime'
      ],
      bestFor: 'Try all features with no commitment',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      recommended: false
    },
    {
      name: 'Essential',
      price: '$9.99',
      period: 'monthly',
      features: [
        'Daily symptom tracking',
        'Weekly symptom reports',
        'Basic meal recommendations',
        'Community access (read-only)',
        'Limited health insights',
        'Email support (48h response)'
      ],
      bestFor: 'Best for those beginning their menopause journey',
      color: 'bg-gradient-to-r from-purple-400 to-purple-500',
      recommended: false
    },
    {
      name: 'Premium',
      price: '$14.99',
      period: 'monthly',
      features: [
        'Advanced symptom analysis',
        'Personalized meal planning',
        'Detailed nutrient tracking',
        'Full community participation',
        'Comprehensive health reports',
        'Relief tools & resources',
        'Priority email support (24h response)',
        'Personalized wellness tips'
      ],
      bestFor: 'Best for active symptom management and support',
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      recommended: false
    },
    {
      name: 'Annual Plan',
      price: '$149.99',
      period: 'yearly',
      features: [
        'All Premium features',
        'Save over 15% vs monthly',
        'Exclusive monthly webinars',
        'Quarterly consultation with specialist',
        'Custom wellness plans',
        'Priority support',
        'Early access to new features',
        'Ad-free experience'
      ],
      bestFor: 'Best value for long-term support',
      color: 'bg-gradient-to-r from-purple-800 to-purple-900',
      recommended: false
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      {isAuthenticated && (
        <nav className="bg-purple-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold"><span className="text-purple-400">M</span>eno<span className="text-purple-400">+</span></span>
            </div>
            <div>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all transform hover:scale-105"
              >
                <span className="mr-2">Enter App</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}
      {/* Hero Section with semi-transparent background image */}
      <header className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('/assets/images/meno-plus-splash.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3)'
            }}
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
      <section className="py-16 bg-white">
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
            <h2 className="text-3xl font-bold mb-3">Choose Your Perfect Plan</h2>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl overflow-hidden ${selectedPlan === plan ? 'ring-4 ring-purple-300 transform scale-105 transition-all duration-300' : 'hover:transform hover:scale-102 transition-all duration-300'}`}
              >
                <div className={`${plan.color} p-6 text-white relative`}>
                  {plan.recommended && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold py-1 px-4 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-center mt-4">{plan.name}</h3>
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
                    {selectedPlan === plan ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            {selectedPlan ? (
              <div>
                <button 
                  onClick={() => onAuthClick('signup')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 text-lg inline-block"
                >
                  Start 7-Day Free Trial with {selectedPlan.name}
                </button>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p className="text-green-300 text-sm">Your first 7 days are completely free</p>
                </div>
              </div>
            ) : (
              <p className="text-purple-200">Select a plan to continue</p>
            )}
            <p className="mt-4 text-purple-200 text-sm">All plans include a 7-day free trial. Cancel anytime before the trial ends.</p>
          </div>
          
          {/* Satisfaction guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-block border border-purple-400 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-purple-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                <span className="text-purple-300 font-semibold">30-Day Satisfaction Guarantee</span>
              </div>
              <p className="text-sm text-purple-200">If you're not satisfied with our service within the first 30 days after your trial ends, we'll provide a full refund.</p>
            </div>
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
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Left side: Stats & Trust signals */}
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
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-2">15K+</div>
                  <p className="text-sm text-gray-600">active community members</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-2">4.8★</div>
                  <p className="text-sm text-gray-600">average app store rating</p>
                </div>
              </div>
              
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
            
            {/* Right side: Features comparison */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-6 text-center">How We Compare</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-purple-100">
                  <div className="text-gray-400">Feature</div>
                  <div className="font-semibold text-purple-800 text-center">Meno+</div>
                  <div className="text-center text-gray-600">Others</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-purple-100">
                  <div className="text-gray-600">Personalized Tracking</div>
                  <div className="text-center text-green-500">✓</div>
                  <div className="text-center text-gray-400">Limited</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-purple-100">
                  <div className="text-gray-600">AI Recommendations</div>
                  <div className="text-center text-green-500">✓</div>
                  <div className="text-center text-red-400">✗</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pb-4 border-b border-purple-100">
                  <div className="text-gray-600">Supportive Community</div>
                  <div className="text-center text-green-500">✓</div>
                  <div className="text-center text-gray-400">Varies</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600">Expert Resources</div>
                  <div className="text-center text-green-500">✓</div>
                  <div className="text-center text-gray-400">Limited</div>
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
            Join thousands of women who are transforming their menopause experience with personalized support and guidance.
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
              onClick={() => onAuthClick('signup')}
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
          
          <p className="text-gray-600 text-sm max-w-lg mx-auto">Join over 15,000 women who've already started their journey to better menopause management with Meno+</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-purple-300">M</span>
                <span className="text-white">eno</span>
                <span className="text-purple-300">+</span>
              </h3>
              <p className="text-purple-200 mb-4">Your personalized menopause companion</p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Symptom Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Meal Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nutrition Insights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Relief Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Media</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
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
                <a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;