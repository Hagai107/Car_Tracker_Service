
import React from 'react';

export const Checkbox = ({ checked, onCheckedChange, className }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      className={`rounded border-gray-300 ${className}`}
    />
  );
};
