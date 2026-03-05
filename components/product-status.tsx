import React from 'react';

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'available':
            return 'bg-jax-lime/10 text-jax-lime border-jax-lime/30';
        case 'low-stock':
            return 'bg-jax-orange/10 text-jax-orange border-jax-orange/30';
        case 'sold-out':
            return 'bg-jax-red-orange/10 text-jax-red-orange border-jax-red-orange/30';
        case 'pre-order':
            return 'bg-jax-teal/10 text-jax-teal border-jax-teal/30';
        case 'vaulted':
            return 'bg-jax-midnight text-jax-cream border-jax-midnight';
        default:
            return 'bg-gray-100 text-gray-500 border-gray-200';
    }
};

export default function ProdutStatus({ status }: { status: string }) {
    if (!status) return null;

    const displayLabel = status.replace('-', ' ').toUpperCase();

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${getStatusStyles(status)}`}>
            {displayLabel}
        </span>
    );
}