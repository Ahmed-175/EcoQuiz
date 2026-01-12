import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false,
    onClick
}) => {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={`
        bg-white rounded-2xl border border-gray-200 
        ${hover ? 'hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        transition-all duration-300
        ${paddingStyles[padding]}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
