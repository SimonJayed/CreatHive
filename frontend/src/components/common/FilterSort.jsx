import React, { useState, useRef, useEffect } from 'react';
import { Hexagon, ChevronDown, X, Filter, ArrowUpDown } from 'lucide-react';
import '../../styles/FilterSort.css';

const FilterSort = ({
    type = 'artwork', // 'artwork' | 'blog'
    sortOptions = [],
    activeSort,
    onSortChange,
    filterOptions = [], // Array of { id, name } for tags
    activeFilters = [],
    onFilterChange,
    onClear,
    showFilter = true
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleFilter = (id) => {
        if (activeFilters.includes(id)) {
            onFilterChange(activeFilters.filter(f => f !== id));
        } else {
            onFilterChange([...activeFilters, id]);
        }
    };

    return (
        <div className="filter-sort-container">
            {/* Sort Section */}
            <div className="sort-section">
                <ArrowUpDown size={16} />
                <span className="label">Sort by:</span>
                <div className="select-wrapper">
                    <select
                        value={activeSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="sort-select input-hexagon"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                </div>
            </div>

            {/* Filter Section (Artworks only) */}
            {type === 'artwork' && showFilter && (
                <div className="filter-section" ref={filterRef}>
                    <button
                        className={`filter-toggle-btn ${activeFilters.length > 0 ? 'active' : ''}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={16} />
                        <span>Filter Tags {activeFilters.length > 0 && `(${activeFilters.length})`}</span>
                    </button>

                    {isFilterOpen && (
                        <div className="filter-dropdown card-hexagon">
                            <div className="filter-options">
                                {filterOptions.map(tag => (
                                    <button
                                        key={tag.tagId}
                                        className={`tag-option ${activeFilters.includes(tag.tagId) ? 'selected' : ''}`}
                                        onClick={() => toggleFilter(tag.tagId)}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Clear Button */}
            <button className="clear-btn" onClick={onClear} title="Reset Filters & Sort">
                <span className="icon-hexagon"><X size={16} /></span>
                <span className="clear-text">Clear</span>
            </button>
        </div>
    );
};

export default FilterSort;
