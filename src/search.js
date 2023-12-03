import React,{useState} from 'react';
const [searchTerm, setSearchTerm] = useState('');

const search = ({handleSearch}) => {
  return (
    <>
    <label htmlFor="search">Search: </label>
      <input
        type="text"
        id="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-icon" onClick={handleSearch}>
        Search
      </button>
      </>
  )
}

export default search