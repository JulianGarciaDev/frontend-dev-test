import "./SearchBar.css";

export function SearchBar({ value, onChange, placeholder = "Buscar por marca o modelo" }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-bar__input"
        data-testid="search-bar-input"
      />
    </div>
  );
}
