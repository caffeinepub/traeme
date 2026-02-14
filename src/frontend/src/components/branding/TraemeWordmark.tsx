import { ASSETS } from '../../constants/assets';

interface TraemeWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function TraemeWordmark({ size = 'md', className = '' }: TraemeWordmarkProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={ASSETS.logo} alt="Traeme Logo" className={sizeClasses[size]} />
      <span className="font-lobster text-primary" style={{ fontSize: size === 'sm' ? '1.5rem' : size === 'md' ? '2rem' : size === 'lg' ? '2.5rem' : '3rem' }}>
        Traeme
      </span>
    </div>
  );
}
