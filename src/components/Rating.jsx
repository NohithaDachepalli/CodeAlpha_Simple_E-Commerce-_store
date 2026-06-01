import { Star } from 'lucide-react';

const Rating = ({ value = 0, count = 0 }) => (
  <div className="flex items-center gap-1 text-sm text-amber-500">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={16} fill={star <= Math.round(value) ? 'currentColor' : 'none'} />
    ))}
    <span className="ml-1 text-slate-500 dark:text-slate-400">({count})</span>
  </div>
);

export default Rating;
