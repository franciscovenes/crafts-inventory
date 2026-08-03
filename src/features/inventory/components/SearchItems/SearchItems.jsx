import { Search } from "lucide-react";
import { useState } from "react";
import ActionBtn from "../../../../components/ActionBtn/ActionBtn";
import styles from "./SearchItems.module.css";
import { parseCurrentInput } from "./parser/parseCurrentInput";
import { prepareMasterData } from "./parser/parserUtils";

export default function SearchItems({ masterData }) {
  const preparedMasterData = prepareMasterData(masterData);

  const [searchState, setSearchState] = useState({
    tokens: [],
    currentInput: "",
  });

  // console.log("Search state: ", searchState);

  const { tokens: currentTokens, currentInput } = searchState;

  console.log("Current Input: ", currentInput);
  console.log("Tokens: ", currentTokens);

  const handleCurrentInput = (event) => {
    const { value } = event.target;

    const { clippedInput, tokens } = parseCurrentInput(
      value,
      currentTokens,
      preparedMasterData,
    );

    setSearchState((prev) => ({
      ...prev,
      tokens,
      currentInput: clippedInput,
    }));
  };
  return (
    <form className={styles.searchForm}>
      <div className={styles.searchBox}>
        {currentTokens.map((token, index) => (
          <div key={index}>{`${token.field}:${token.value}`}</div>
        ))}
        <input
          type="text"
          placeholder="Search items..."
          value={currentInput}
          onChange={handleCurrentInput}
        />
      </div>
      <button className={styles.button} type="submit">
        <Search />
      </button>
    </form>
  );
}
