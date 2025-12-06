import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/SearchBar.css';

const TAGS = ["1", "2", "3", "4", "5"]

function SearchBar({ showConfig, setShowConfig, selectedFilters, setSelectedFilters, selectedSort, setSelectedSort, selectedOrder, setSelectedOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInput, setFilterInput] = useState('');
  const [filterList, setFilterList] = useState(false);
  const [filterTags, setFilterTags] = useState(TAGS);

  const navigate = useNavigate();
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  const handleFilterClick = (tag) =>
  {
    if(!selectedFilters.includes(tag))
    {
      setSelectedFilters([...selectedFilters, tag]);
    }
    setFilterInput('');
    setFilterList(false);
  };

  const handleRemoveFilter = (tag) =>
  {
    setSelectedFilters(selectedFilters.filter(f => f !== tag));
  };

  useEffect(() =>
  {
    if(filterInput === '')
    {
      setFilterTags(TAGS.filter(tag => !selectedFilters.includes(tag)));
    }
    else
    {
      setFilterTags(TAGS.filter(tag => tag.toLowerCase().includes(filterInput.toLowerCase()) && !selectedFilters.includes(tag)));
    }
  }, [filterInput, selectedFilters]);

  useEffect(() =>
  {
    const handleClickOutside = (event) =>
    {
      if(inputRef.current && !inputRef.current.contains(event.target))
      {
        setFilterList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <button className="filter-btn" onClick={() => setShowConfig(!showConfig)}>
          ▽
        </button>
        <form className="search-bar" onSubmit={handleSubmit}>
          <input type="text" value={searchTerm} placeholder="Search for recipes..." onChange={(e) => setSearchTerm(e.target.value)}/>
          <button type="submit">Search</button>
        </form>

        {showConfig && (
          <div className="search-settings-box">
            <div className="sort-controls">
              <label>
                Sort by:
                <select onChange={e => setSelectedSort(e.target.value)} value={selectedSort}>
                  <option value="relevance">Relevance</option>
                  <option value="likes">Likes</option>
                </select>
              </label>

              <label>
                Order:
                <select onChange={e => setSelectedOrder(e.target.value)} value={selectedOrder}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
            </div>

            <div className="filter-input-wrapper" ref={inputRef}>
              <div className="selected-tags">
                {selectedFilters.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag} <span className="remove-tag" onClick={() => handleRemoveFilter(tag)}>x</span>
                  </span>
                ))}
                <input type="text" value={filterInput} placeholder="Add filters..." onFocus={() => setFilterList(true)} onChange={(e) => setFilterInput(e.target.value)}/>
              </div>

              {filterList && filterTags.length > 0 && (
                <div className="filter-dropdown">
                  {filterTags.map(tag => (
                    <div key={tag} className="filter-option" onClick={() => handleFilterClick(tag)}>
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
