import { Input } from "reactstrap";
import "./Search.css";
interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}
const Search = (props: SearchProps) => {
  const { search, setSearch } = props;
  return (
    <Input
      className="form-control my-2"
      placeholder="Search"
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};
export default Search;
