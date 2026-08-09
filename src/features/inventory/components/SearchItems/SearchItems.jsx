import { Search } from "lucide-react";
import { useState, useRef } from "react";
import styles from "./SearchItems.module.css";
import { parseCurrentInput } from "./parser/parseCurrentInput";
import {
  shouldCommitInput,
  prepareMasterData,
  insertMetadataToken,
  clipMetadataInput,
} from "./searchItemsUtils";
import SearchChip from "./SearchChip";
import { findSuggestions } from "./suggestions/findSuggestions";
import ColorLabel from "../../../../components/ColorLabel/ColorLabel";

export default function SearchItems({ masterData }) {
  const preparedMasterData = prepareMasterData(masterData);

  const [searchState, setSearchState] = useState({
    tokens: [],
    currentInput: "",
  });
  // console.log("Search state: ", searchState);

  const [showRemovalHint, setShowRemovalHint] = useState(false);
  // console.log("showRemovalHint: ", showRemovalHint);

  const [suggestions, setSuggestions] = useState([]);
  console.log("Suggestions: ", suggestions);

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const inputRef = useRef(null);

  const { tokens: currentTokens, currentInput } = searchState;

  // console.log("Current Input: ", currentInput);
  // console.log("Tokens: ", currentTokens);

  const handleCurrentInput = (event) => {
    const { value } = event.target;

    if (currentInput !== "" && value === "") {
      setShowRemovalHint(true);
      setTimeout(() => setShowRemovalHint(false), 300);
    }

    const suggestions = findSuggestions(
      value,
      preparedMasterData,
      currentTokens,
    );

    setSuggestions(suggestions);

    // console.log("Suggestions: ", suggestions);

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

  const handleSuggestionClick = (suggestion) => {
    const { field, value, candidateSequence } = suggestion;
    insertMetadataToken(currentTokens, field, value);

    const start = currentInput.length - candidateSequence.length;

    const clippedInput = clipMetadataInput(
      currentInput,
      start,
      candidateSequence.length,
    );

    setSearchState((prev) => ({
      ...prev,
      currentInput: clippedInput,
    }));

    setSuggestions([]);

    inputRef.current?.focus();
  };

  const handleSuggestionNavigation = (event) => {};

  return (
    <div className={styles.container}>
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
            onKeyDown={(event) => {
              handleBackspaceRemoval(event);
              handleSuggestionNavigation(event);
            }}
          />
        </div>
        <button className={styles.button} type="submit">
          <Search />
        </button>
      </form>
      <ul
        className={`
          ${styles.suggestionsBox} 
          ${suggestions.length > 0 ? styles.visible : ""}
          `}
      >
        {suggestions.length > 0 &&
          suggestions.map(({ field, value, candidateSequence }) => {
            const { name, hex } = value;
            return (
              <li key={`${field}-${name}`}>
                <button
                  className={styles.suggestionBtn}
                  onClick={() =>
                    handleSuggestionClick({ field, value, candidateSequence })
                  }
                >
                  <span className={styles.suggestionField}>{field}:</span>
                  {field === "color" && (
                    <span
                      className={styles.colorSwatch}
                      style={{ "--color": hex }}
                      aria-hidden="true"
                    />
                  )}
                  <span className={styles.suggestionName}>{name}</span>
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
