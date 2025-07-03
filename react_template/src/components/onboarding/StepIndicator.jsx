import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, onStepClick, isStepComplete }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = isStepComplete ? isStepComplete(index) : false;
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                    isPast || isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : isCurrent
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg ring-4 ring-purple-200'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => onStepClick && onStepClick(index)}
                >
                  {isPast || isCompleted ? (
                    <Check size={18} className="animate-pulse" />
                  ) : (
                    <span className="text-lg">{stepNumber}</span>
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`mt-3 text-sm font-medium text-center max-w-20 ${
                    isCurrent
                      ? 'text-purple-700 font-semibold'
                      : isPast || isCompleted
                      ? 'text-green-700 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex items-center mx-4 mt-6">
                  <div
                    className={`w-16 h-1 rounded-full transition-all duration-500 ${
                      isPast || isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;