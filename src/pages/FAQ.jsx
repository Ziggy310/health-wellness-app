import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openSection, setOpenSection] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const faqSections = [
    {
      title: "Account & Subscription",
      questions: [
        {
          question: "How do I start my free trial?",
          answer: "Simply click 'Get Started' on our landing page, create your account, and you'll automatically get access to a 7-day free trial. No credit card required to start!"
        },
        {
          question: "Can I cancel my subscription at any time?",
          answer: "Yes! You can cancel your subscription at any time from your account settings. If you cancel during your free trial, you won't be charged anything."
        },
        {
          question: "What's the difference between Monthly and Annual plans?",
          answer: "Both plans include all core features. The Annual plan offers additional benefits like exclusive monthly webinars, quarterly specialist consultations, custom wellness plans, and saves you over 15% compared to monthly billing."
        },
        {
          question: "How do I update my payment information?",
          answer: "Go to your account settings and select 'Billing Information' to update your payment method. Changes take effect immediately."
        }
      ]
    },
    {
      title: "Symptom Tracking",
      questions: [
        {
          question: "What symptoms can I track with Meno+?",
          answer: "You can track all menopause-related symptoms including hot flashes, night sweats, mood changes, sleep issues, joint pain, brain fog, irregular periods, and many more. Our comprehensive tracking system covers physical, emotional, and cognitive symptoms."
        },
        {
          question: "How often should I log my symptoms?",
          answer: "We recommend logging symptoms daily for the most accurate patterns. However, you can log them whenever you experience them. The more consistent your tracking, the better insights you'll receive."
        },
        {
          question: "Can I export my symptom data for my doctor?",
          answer: "Absolutely! You can generate detailed reports of your symptom patterns and export them as PDF files to share with your healthcare provider. This helps facilitate better conversations about your menopause journey."
        },
        {
          question: "How does the app analyze my symptom patterns?",
          answer: "Our AI-powered system analyzes your symptom data to identify triggers, patterns, and correlations. It looks at factors like timing, severity, duration, and potential connections to lifestyle factors to provide personalized insights."
        }
      ]
    },
    {
      title: "Meal Planning & Nutrition",
      questions: [
        {
          question: "How are meal plans personalized for menopause?",
          answer: "Our meal plans are specifically designed to address menopause symptoms. They focus on hormone-supporting foods, bone health nutrients, anti-inflammatory ingredients, and foods that help manage hot flashes, mood swings, and other symptoms."
        },
        {
          question: "Can I customize meal plans for dietary restrictions?",
          answer: "Yes! You can set dietary preferences including vegetarian, vegan, gluten-free, dairy-free, and specify food allergies. Our system will create meal plans that respect all your dietary needs while supporting your menopause journey."
        },
        {
          question: "Do you provide grocery lists?",
          answer: "Every meal plan comes with a detailed grocery list organized by store sections to make shopping efficient. You can also modify the list based on what you already have at home."
        },
        {
          question: "How do I track my nutrition intake?",
          answer: "Our nutrition tracker lets you log meals and snacks. It automatically calculates key nutrients important for menopause like calcium, vitamin D, magnesium, and phytoestrogens, showing you how well you're meeting your daily targets."
        }
      ]
    },
    {
      title: "Relief Tools & Resources",
      questions: [
        {
          question: "What relief tools are available in the app?",
          answer: "We offer guided meditations, breathing exercises for hot flashes, sleep stories, gentle yoga routines, stress management techniques, and mindfulness exercises specifically designed for menopause challenges."
        },
        {
          question: "Can I use relief tools offline?",
          answer: "Many of our relief tools can be downloaded for offline use, including guided meditations and breathing exercises. This ensures you can access support even without an internet connection."
        },
        {
          question: "How long are the meditation sessions?",
          answer: "We offer various session lengths from 3-minute quick relief sessions to 30-minute deep relaxation sessions. You can choose based on your available time and current needs."
        },
        {
          question: "Are the exercises suitable for beginners?",
          answer: "Absolutely! All our exercises and techniques are designed to be accessible for all fitness levels. We provide modifications and beginner-friendly options for every activity."
        }
      ]
    },
    {
      title: "Community & Support",
      questions: [
        {
          question: "Is the community safe and moderated?",
          answer: "Yes, our community is professionally moderated 24/7. We maintain strict guidelines to ensure a supportive, respectful environment where women can share experiences safely and receive encouragement."
        },
        {
          question: "Can I remain anonymous in the community?",
          answer: "You can choose your level of privacy. You can use your real name, a username, or remain completely anonymous while still participating in discussions and support groups."
        },
        {
          question: "What types of support groups are available?",
          answer: "We offer various support groups including general menopause support, workplace challenges, relationship impacts, fitness motivation, nutrition support, and condition-specific groups for those dealing with particular symptoms or health concerns."
        },
        {
          question: "How do I report inappropriate content?",
          answer: "Every post and comment has a report button. Our moderation team reviews reports quickly and takes appropriate action to maintain community standards."
        }
      ]
    },
    {
      title: "General App Usage",
      questions: [
        {
          question: "Is my personal health data secure?",
          answer: "Absolutely. We use bank-level encryption and are fully HIPAA compliant. Your data is stored securely and never shared with third parties without your explicit consent. We follow strict privacy protocols to protect your information."
        },
        {
          question: "Can I use Meno+ on multiple devices?",
          answer: "Yes! Your account syncs across all your devices. You can access Meno+ on your phone, tablet, and computer, and all your data will be synchronized in real-time."
        },
        {
          question: "Do you offer customer support?",
          answer: "We provide comprehensive support through multiple channels including email support (support@menoplus.ai), in-app chat, and our extensive knowledge base. Premium subscribers also get priority support."
        },
        {
          question: "How often is the app updated?",
          answer: "We release updates regularly to add new features, improve performance, and incorporate user feedback. The app will notify you when updates are available, and most updates happen automatically."
        }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        {
          question: "What devices and operating systems are supported?",
          answer: "Meno+ works on iOS 12+ and Android 8+, as well as web browsers (Chrome, Safari, Firefox, Edge). We recommend keeping your device updated for the best experience."
        },
        {
          question: "What should I do if the app crashes or freezes?",
          answer: "First, try closing and reopening the app. If issues persist, restart your device. For ongoing problems, contact our support team at support@menoplus.ai with details about your device and the issue."
        },
        {
          question: "How do I backup my data?",
          answer: "Your data is automatically backed up to our secure cloud servers. You can also export your data anytime from the settings menu to create local backups."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login screen and enter your email address. You'll receive a secure link to reset your password. If you don't receive the email, check your spam folder or contact support."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-purple-900 text-white px-6 py-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-purple-400">M</span>eno<span className="text-purple-400">+</span>
            </span>
          </Link>
          <Link 
            to="/" 
            className="text-purple-300 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Find quick answers to common questions about Meno+ and managing your menopause journey
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b border-purple-200 pb-2">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq, questionIndex) => {
                  const isOpen = openSection === `${sectionIndex}-${questionIndex}`;
                  return (
                    <div key={questionIndex} className="bg-white rounded-lg shadow-md">
                      <button
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection(`${sectionIndex}-${questionIndex}`)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUpIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16 bg-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@menoplus.ai"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Email Support
            </a>
            <Link
              to="/"
              className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            We typically respond within 24 hours during business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;