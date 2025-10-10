
import React from 'react';
import '../styles/SearchBar.css';

function SearchBar({ value, onChange }) {
  return (
    <input 
      type="text" 
      className="search-bar" 
      placeholder="Search..." 
      value={value} 
      onChange={onChange} 
    />
  );
}

export default SearchBar;