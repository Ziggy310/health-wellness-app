import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Target, Heart, Moon, Brain, Scale, TrendingUp, Sparkles, Star, Zap, Trophy, CheckCircle } from 'lucide-react';

const GoalsStep = ({ data, onDataChange }) => {
  const [formData, setFormData] = useState({
    primary_goals: [],
    secondary_goals: [],
    target_date: '',
    improve_sleep: false,
    reduce_hot_flashes: false,
    stabilize_mood: false,
    improve_cognition: false,
    maintain_weight: false,
    lose_weight: false
  });

  const isInitialized = useRef(false);

  // Initialize form data from props only once
  useEffect(() => {
    if (!isInitialized.current && data.goals && Object.keys(data.goals).length > 0) {
      setFormData(prev => ({ ...prev, ...data.goals }));
      isInitialized.current = true;
    }
  }, [data.goals]);

  // Direct state change handlers that update parent immediately
  const handleDataChange = useCallback((field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);
    onDataChange('goals', newFormData);
  }, [formData, onDataChange]);

  const handleArrayToggleWithCallback = useCallback((field, item) => {
    const newArray = formData[field].includes(item)
      ? formData[field].filter(i => i !== item)
      : [...formData[field], item];
    
    const newFormData = {
      ...formData,
      [field]: newArray
    };
    setFormData(newFormData);
    onDataChange('goals', newFormData);
  }, [formData, onDataChange]);

  const handleWeightGoalChange = useCallback((maintainWeight, loseWeight) => {
    const newFormData = {
      ...formData,
      maintain_weight: maintainWeight,
      lose_weight: loseWeight
    };
    setFormData(newFormData);
    onDataChange('goals', newFormData);
  }, [formData, onDataChange]);

  const primaryGoals = [
    { 
      id: 'manage_symptoms', 
      label: 'Manage Menopause Symptoms', 
      desc: 'Reduce hot flashes, improve sleep, stabilize mood',
      icon: Heart,
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50',
      emoji: '💝'
    },
    { 
      id: 'maintain_health', 
      label: 'Maintain Overall Health', 
      desc: 'Support bone health, heart health, and energy',
      icon: TrendingUp,
      color: 'from-emerald-400 to-green-500',
      bgColor: 'bg-emerald-50',
      emoji: '📈'
    },
    { 
      id: 'weight_management', 
      label: 'Weight Management', 
      desc: 'Maintain or achieve healthy weight',
      icon: Scale,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      emoji: '⚖️'
    },
    { 
      id: 'improve_energy', 
      label: 'Boost Energy & Vitality', 
      desc: 'Feel more energetic and vibrant',
      icon: Zap,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      emoji: '⚡'
    },
    { 
      id: 'mental_clarity', 
      label: 'Enhance Mental Clarity', 
      desc: 'Improve focus, memory, and cognitive function',
      icon: Brain,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      emoji: '🧠'
    },
    { 
      id: 'better_sleep', 
      label: 'Better Sleep Quality', 
      desc: 'Achieve restful, consistent sleep',
      icon: Moon,
      color: 'from-indigo-400 to-blue-500',
      bgColor: 'bg-indigo-50',
      emoji: '🌙'
    }
  ];

  const secondaryGoals = [
    { name: 'Learn about menopause nutrition', emoji: '📚', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { name: 'Discover new healthy recipes', emoji: '👩‍🍳', color: 'bg-green-100 text-green-800 border-green-300' },
    { name: 'Build sustainable eating habits', emoji: '🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { name: 'Reduce inflammation', emoji: '🔥', color: 'bg-red-100 text-red-800 border-red-300' },
    { name: 'Support digestive health', emoji: '🫧', color: 'bg-teal-100 text-teal-800 border-teal-300' },
    { name: 'Improve skin health', emoji: '✨', color: 'bg-pink-100 text-pink-800 border-pink-300' },
    { name: 'Enhance mood naturally', emoji: '😊', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { name: 'Increase physical activity', emoji: '🏃‍♀️', color: 'bg-orange-100 text-orange-800 border-orange-300' }
  ];

  const timeframes = [
    { value: '1_month', label: '1 Month', desc: 'Quick improvements', icon: '🚀', color: 'from-red-400 to-pink-400' },
    { value: '3_months', label: '3 Months', desc: 'Sustainable changes', icon: '🎯', color: 'from-blue-400 to-cyan-400' },
    { value: '6_months', label: '6 Months', desc: 'Long-term transformation', icon: '🌟', color: 'from-purple-400 to-pink-400' },
    { value: '1_year', label: '1+ Years', desc: 'Lifelong journey', icon: '🏆', color: 'from-emerald-400 to-teal-400' }
  ];

  const symptoms = [
    { key: 'reduce_hot_flashes', label: 'Reduce Hot Flashes', icon: Heart, color: 'from-red-400 to-pink-400', emoji: '🔥' },
    { key: 'improve_sleep', label: 'Improve Sleep Quality', icon: Moon, color: 'from-indigo-400 to-blue-400', emoji: '😴' },
    { key: 'stabilize_mood', label: 'Stabilize Mood', icon: Heart, color: 'from-purple-400 to-pink-400', emoji: '😌' },
    { key: 'improve_cognition', label: 'Enhance Mental Clarity', icon: Brain, color: 'from-emerald-400 to-teal-400', emoji: '🧠' }
  ];

  return (
    <div className="space-y-12">
      {/* Beautiful Header */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-full p-4 shadow-lg">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mt-6 mb-4">
          Your Health Goals
        </h2>
        <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
          Let's define what success looks like for your unique menopause journey and create a roadmap to get there
        </p>
      </div>

      {/* Primary Goals - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">What are your main health goals? (Select up to 3)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {primaryGoals.map((goal, index) => {
            const IconComponent = goal.icon;
            const isSelected = formData.primary_goals.includes(goal.id);
            const canSelect = formData.primary_goals.length < 3 || isSelected;
            
            return (
              <div
                key={goal.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? 'ring-4 ring-purple-400 ring-opacity-50 shadow-2xl' 
                    : canSelect 
                      ? 'hover:shadow-xl' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (canSelect) {
                    handleArrayToggleWithCallback('primary_goals', goal.id);
                  }
                }}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} ${isSelected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'} transition-opacity duration-300`}></div>
                <div className={`relative p-6 bg-white border-2 ${isSelected ? 'border-purple-300' : 'border-gray-100 group-hover:border-gray-200'} rounded-2xl transition-all duration-300`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${goal.bgColor} ${isSelected ? 'shadow-lg' : ''} transition-all duration-300`}>
                      <div className="text-3xl mb-2">{goal.emoji}</div>
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{goal.label}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{goal.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            formData.primary_goals.length === 3 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {formData.primary_goals.length}/3 goals selected
          </span>
        </div>
      </div>

      {/* Specific Symptom Goals - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Which specific symptoms would you like to focus on?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {symptoms.map((symptom, index) => {
            const IconComponent = symptom.icon;
            const isSelected = formData[symptom.key];
            
            return (
              <label
                key={symptom.key}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected ? 'ring-4 ring-pink-400 ring-opacity-50 shadow-xl' : 'hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${symptom.color} ${isSelected ? 'opacity-15' : 'opacity-0 group-hover:opacity-10'} transition-opacity duration-300`}></div>
                <div className={`relative flex items-center p-6 bg-white border-2 ${isSelected ? 'border-pink-300' : 'border-gray-100 group-hover:border-gray-200'} rounded-2xl transition-all duration-300`}>
                  <input
                    type="checkbox"
                    checked={formData[symptom.key]}
                    onChange={(e) => handleDataChange(symptom.key, e.target.checked)}
                    className="w-5 h-5 mr-4 text-pink-600 focus:ring-pink-500 border-2 border-gray-300"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{symptom.emoji}</div>
                    <div>
                      <span className="text-lg font-semibold text-gray-900">{symptom.label}</span>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Weight Goals - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Weight management goals?</h3>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
          <div className="space-y-4">
            {[
              { key: 'maintain', label: 'Maintain current weight', desc: 'Focus on overall health', emoji: '⚖️', check: formData.maintain_weight },
              { key: 'lose', label: 'Achieve healthy weight loss', desc: 'Gradual and sustainable', emoji: '📉', check: formData.lose_weight },
              { key: 'none', label: 'Not a priority right now', desc: 'Focus on other goals first', emoji: '🤷‍♀️', check: !formData.maintain_weight && !formData.lose_weight }
            ].map((option, index) => (
              <label
                key={option.key}
                className="group flex items-center p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <input
                  type="radio"
                  name="weight_goal"
                  checked={option.check}
                  onChange={() => {
                    if (option.key === 'maintain') handleWeightGoalChange(true, false);
                    else if (option.key === 'lose') handleWeightGoalChange(false, true);
                    else handleWeightGoalChange(false, false);
                  }}
                  className="w-5 h-5 mr-4 text-blue-600 focus:ring-blue-500 border-2 border-gray-300"
                />
                <div className="text-3xl mr-4">{option.emoji}</div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Goals - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">What else would you like to achieve? (Optional)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {secondaryGoals.map((goal, index) => (
            <button
              key={goal.name}
              type="button"
              onClick={() => handleArrayToggleWithCallback('secondary_goals', goal.name)}
              className={`group relative overflow-hidden rounded-xl p-4 text-sm font-medium text-left transition-all duration-300 transform hover:scale-[1.02] ${
                formData.secondary_goals.includes(goal.name)
                  ? `${goal.color} shadow-lg ring-2 ring-green-400 ring-opacity-50`
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <span className="text-2xl">{goal.emoji}</span>
                <span>{goal.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">⏰</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">What's your ideal timeframe for seeing results?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeframes.map((timeframe, index) => (
            <div
              key={timeframe.value}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                formData.target_date === timeframe.value
                  ? 'ring-4 ring-indigo-400 ring-opacity-50 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleDataChange('target_date', timeframe.value)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${timeframe.color} opacity-10`}></div>
              <div className={`relative p-6 bg-white border-2 ${formData.target_date === timeframe.value ? 'border-indigo-300' : 'border-gray-100'} rounded-2xl transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl p-2 bg-indigo-50 rounded-full">
                    {timeframe.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={formData.target_date === timeframe.value}
                        onChange={() => handleDataChange('target_date', timeframe.value)}
                        className="w-5 h-5 text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500"
                      />
                      <h4 className="text-lg font-semibold text-gray-900">{timeframe.label}</h4>
                    </div>
                    <p className="text-gray-600 mt-1">{timeframe.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl p-8 text-white text-center shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur opacity-30 animate-pulse"></div>
              <div className="relative bg-white bg-opacity-20 rounded-full p-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4">🎉 You're Almost Ready! 🎉</h3>
          <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Amazing! Based on your personalized goals and preferences, we're going to create a meal plan that's perfectly tailored to support your menopause journey. Get ready to feel your absolute best!
          </p>
          <div className="flex justify-center space-x-4">
            {['🌟', '💪', '✨'].map((emoji, i) => (
              <div key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsStep;