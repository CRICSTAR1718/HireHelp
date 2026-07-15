import React from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  label, 
  required = false 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">⭐⭐</span>}
        </label>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-transform hover:scale-110 ${
              value >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs text-gray-500">Rating: {value}/5</span>
      )}
    </div>
  );
};
