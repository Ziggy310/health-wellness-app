import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, Thermometer, Moon, Brain, Heart, Sparkles, Star, Activity } from 'lucide-react';

const ProfileStep = ({ data, onDataChange }) => {
  const [formData, setFormData] = useState({
    menopause_stage: '',
    last_period_date: '',
    has_hot_flashes: false,
    has_sleep_issues: false,
    has_mood_changes: false,
    energy_level: 3,
    has_cognitive_issues: false,
    health_conditions: []
  });

  const isInitialized = useRef(false);
  const lastDataRef = useRef(null);

  // Initialize form data from props only once
  useEffect(() => {
    if (!isInitialized.current && data.profile && Object.keys(data.profile).length > 0) {
      setFormData(prev => ({ ...prev, ...data.profile }));
      isInitialized.current = true;
      lastDataRef.current = data.profile;
    }
  }, [data.profile]);

  // Only send data changes up when user actually changes something
  const handleDataChange = useCallback((field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);
    onDataChange('profile', newFormData);
  }, [formData, onDataChange]);

  const handleConditionToggleWithCallback = useCallback((condition) => {
    const newConditions = formData.health_conditions.includes(condition)
      ? formData.health_conditions.filter(c => c !== condition)
      : [...formData.health_conditions, condition];
    
    const newFormData = {
      ...formData,
      health_conditions: newConditions
    };
    setFormData(newFormData);
    onDataChange('profile', newFormData);
  }, [formData, onDataChange]);

  const menopauseStages = [
    { value: 'PREMENOPAUSAL', label: 'Premenopausal', desc: 'Regular periods, early symptoms', color: 'from-emerald-400 to-cyan-400', icon: '🌱' },
    { value: 'PERIMENOPAUSAL', label: 'Perimenopausal', desc: 'Irregular periods, transitioning', color: 'from-amber-400 to-orange-400', icon: '🌅' },
    { value: 'MENOPAUSAL', label: 'Menopausal', desc: 'No periods for 12+ months', color: 'from-rose-400 to-pink-400', icon: '🌸' },
    { value: 'POSTMENOPAUSAL', label: 'Postmenopausal', desc: 'Beyond menopause', color: 'from-violet-400 to-purple-400', icon: '✨' },
    { value: 'UNKNOWN', label: 'Not sure', desc: 'I need help identifying my stage', color: 'from-slate-400 to-gray-400', icon: '🤔' }
  ];

  const commonConditions = [
    { name: 'High Blood Pressure', color: 'bg-red-100 text-red-800 border-red-200' },
    { name: 'Diabetes', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { name: 'Thyroid Issues', color: 'bg-green-100 text-green-800 border-green-200' },
    { name: 'Heart Disease', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { name: 'Osteoporosis', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { name: 'Depression/Anxiety', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { name: 'Other', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  const symptoms = [
    { key: 'has_hot_flashes', label: 'Hot Flashes', desc: 'Sudden heat sensations', icon: Thermometer, color: 'from-red-400 to-pink-400', bgColor: 'bg-red-50' },
    { key: 'has_sleep_issues', label: 'Sleep Issues', desc: 'Trouble sleeping', icon: Moon, color: 'from-indigo-400 to-blue-400', bgColor: 'bg-indigo-50' },
    { key: 'has_mood_changes', label: 'Mood Changes', desc: 'Irritability, anxiety', icon: Heart, color: 'from-purple-400 to-pink-400', bgColor: 'bg-purple-50' },
    { key: 'has_cognitive_issues', label: 'Brain Fog', desc: 'Memory, concentration', icon: Brain, color: 'from-emerald-400 to-teal-400', bgColor: 'bg-emerald-50' }
  ];

  return (
    <div className="space-y-10">
      {/* Beautiful Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-full p-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mt-6 mb-4">
          Your Health Profile
        </h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
          Help us understand your unique menopause journey so we can create the perfect plan for you
        </p>
      </div>

      {/* Menopause Stage - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Where are you in your menopause journey?</h3>
        </div>
        
        <div className="grid gap-4">
          {menopauseStages.map((stage, index) => (
            <div
              key={stage.value}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                formData.menopause_stage === stage.value
                  ? 'ring-4 ring-purple-400 ring-opacity-50 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleDataChange('menopause_stage', stage.value)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stage.color} opacity-10`}></div>
              <div className="relative p-6 bg-white border-2 border-gray-100 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{stage.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={formData.menopause_stage === stage.value}
                        onChange={() => handleDataChange('menopause_stage', stage.value)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500"
                      />
                      <h4 className="text-lg font-semibold text-gray-900">{stage.label}</h4>
                    </div>
                    <p className="text-gray-600 mt-1">{stage.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Period Date - Enhanced */}
      {formData.menopause_stage !== 'POSTMENOPAUSAL' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">When was your last period?</h3>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-xl border-2 border-gray-100 p-4 group-hover:border-pink-200 transition-colors duration-300">
              <input
                type="date"
                value={formData.last_period_date}
                onChange={(e) => handleDataChange('last_period_date', e.target.value)}
                className="w-full text-lg py-3 px-4 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Symptoms - Enhanced Grid */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Which symptoms are you experiencing?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {symptoms.map((symptom, index) => {
            const IconComponent = symptom.icon;
            const isSelected = formData[symptom.key];
            
            return (
              <div
                key={symptom.key}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected ? 'ring-4 ring-purple-400 ring-opacity-50 shadow-2xl' : 'hover:shadow-xl'
                }`}
                onClick={() => handleDataChange(symptom.key, !formData[symptom.key])}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${symptom.color} ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'} transition-opacity duration-300`}></div>
                <div className={`relative p-6 bg-white border-2 ${isSelected ? 'border-purple-300' : 'border-gray-100 group-hover:border-gray-200'} rounded-2xl transition-all duration-300`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${symptom.bgColor} ${isSelected ? 'shadow-lg' : ''} transition-all duration-300`}>
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{symptom.label}</h4>
                      <p className="text-gray-600">{symptom.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Level - Enhanced Slider */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">⚡</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">How would you rate your current energy level?</h3>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Low Energy</span>
            <span className="text-sm font-medium text-gray-600">High Energy</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="5"
              value={formData.energy_level}
              onChange={(e) => handleDataChange('energy_level', parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between mt-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${formData.energy_level >= level ? 'bg-purple-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
                  <span className="text-xs text-gray-500 mt-1">{level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <span className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md">
              <span className="text-2xl mr-2">
                {formData.energy_level <= 2 ? '😴' : formData.energy_level <= 3 ? '😊' : formData.energy_level <= 4 ? '😃' : '🚀'}
              </span>
              <span className="font-semibold text-purple-600">
                Level {formData.energy_level}/5
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Health Conditions - Enhanced Pills */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">🏥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Any existing health conditions?</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonConditions.map((condition, index) => (
            <button
              key={condition.name}
              type="button"
              onClick={() => handleConditionToggleWithCallback(condition.name)}
              className={`group relative overflow-hidden rounded-xl p-4 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                formData.health_conditions.includes(condition.name)
                  ? `${condition.color} shadow-lg ring-2 ring-purple-400 ring-opacity-50`
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative">{condition.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Completion Encouragement */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl p-8 text-white text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
            ))}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Great Progress! 🎉</h3>
        <p className="text-purple-100 text-lg">
          You're building a comprehensive health profile that will help us create the perfect menopause nutrition plan for you.
        </p>
      </div>
    </div>
  );
};

export default ProfileStep;