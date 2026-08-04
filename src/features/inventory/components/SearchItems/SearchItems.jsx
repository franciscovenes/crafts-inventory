import { Search } from "lucide-react";
import { useState, useRef } from "react";
import styles from "./SearchItems.module.css";
import { parseCurrentInput } from "./parser/parseCurrentInput";
import { prepareMasterData } from "./parser/parserUtils";
import { shouldCommitInput } from "./searchItemsUtils";
import SearchChip from "./SearchChip";

export default function SearchItems({ masterData }) {
  const preparedMasterData = prepareMasterData(masterData);

  const [searchState, setSearchState] = useState({
    tokens: [],
    currentInput: "",
  });
  // console.log("Search state: ", searchState);

  const [showRemovalHint, setShowRemovalHint] = useState(false);
  console.log("showRemovalHint: ", showRemovalHint);

  const inputRef = useRef(null);

  const { tokens: currentTokens, currentInput } = searchState;

  // console.log("Current Input: ", currentInput);
  console.log("Tokens: ", currentTokens);

  const handleCurrentInput = (event) => {
    const { value } = event.target;

    if (currentInput !== "" && value === "") {
      setShowRemovalHint(true);
      setTimeout(() => setShowRemovalHint(false), 300);
    }

    if (shouldCommitInput(value)) {
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
    } else {
      setSearchState((prev) => ({
        ...prev,
        currentInput: value,
      }));
    }
  };

  const removeTokenById = (tokenId) =>
    setSearchState((prev) => ({
      ...prev,
      tokens: prev.tokens.filter((token) => token.id !== tokenId),
    }));

  const removeLastToken = () =>
    setSearchState((prev) => ({
      ...prev,
      tokens: prev.tokens.slice(0, -1),
    }));

  const handleBackspaceRemoval = (event) => {
    if (
      currentInput === "" &&
      event.code === "Backspace" &&
      !event.repeat &&
      currentTokens.length > 0
    ) {
      removeLastToken();
    }
  };

  return (
    <form className={styles.searchForm}>
      <div
        className={styles.searchBox}
        onClick={() => inputRef.current?.focus()}
      >
        {currentTokens.map((token, index) => (
          <SearchChip
            key={token.id}
            token={token}
            onRemove={removeTokenById}
            removalHint={showRemovalHint && index == currentTokens.length - 1}
          />
        ))}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search items..."
          value={currentInput}
          onChange={handleCurrentInput}
          onKeyDown={handleBackspaceRemoval}
        />
      </div>
      <button className={styles.button} type="submit">
        <Search />
      </button>
    </form>
  );
}
