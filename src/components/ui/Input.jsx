
import React from 'react';

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded-lg p-2 ${className}`}
      {...props}
    />
  );
};
