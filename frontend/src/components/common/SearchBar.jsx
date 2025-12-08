import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder, style }) => {
    return (
        <div className="hive-search-container" style={style}>
            <div className="hive-search-wrapper">
                <Search className="hive-search-icon" size={20} />
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="hive-search-input"
                />
            </div>
        </div>
    );
};

export default SearchBar;
