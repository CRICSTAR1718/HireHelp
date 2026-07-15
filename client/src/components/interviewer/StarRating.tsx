import React from 'react';
import { Star } from 'lucide-react';

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
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Star
              className={`w-6 h-6 ${
                value >= star 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-slate-300'
              }`}
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs font-medium text-slate-500">Rating: {value}/5</span>
      )}
    </div>
  );
};
