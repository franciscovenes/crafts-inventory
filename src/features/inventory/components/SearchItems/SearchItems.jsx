import { Search } from "lucide-react";
import { useState, useRef } from "react";
import styles from "./SearchItems.module.css";
import { parseCurrentInput } from "./parser/parseCurrentInput";
import {
  shouldCommitInput,
  prepareMasterData,
  insertMetadataToken,
  clipMetadataInput,
  deserializeSearchState,
} from "./searchItemsUtils";
import SearchChip from "./SearchChip";
import { findSuggestions } from "./suggestions/findSuggestions";
import { useSearchParams } from "react-router-dom";

export default function SearchItems({ masterData }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const preparedMasterData = prepareMasterData(masterData);
  const [searchState, setSearchState] = useState(() => {
    const searchPayloadString = searchParams.get("search");

    if (searchPayloadString !== null) {
      const searchPayload = JSON.parse(searchPayloadString);
      return deserializeSearchState(searchPayload, preparedMasterData);
    }

    return {
      tokens: [],
      currentInput: "",
    };
  });

  const { tokens: currentTokens, currentInput } = searchState;

  const [showRemovalHint, setShowRemovalHint] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const inputRef = useRef(null);

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

  const handleSuggestionNavigation = (event) => {
    if (event.key === "Enter" && suggestions.length > 0) {
      event.preventDefault();
      if (activeSuggestionIndex >= 0) {
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
        setActiveSuggestionIndex(-1);
      }
      return;
    }

    if (event.key === "Escape" && suggestions.length > 0) {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (suggestions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (activeSuggestionIndex < suggestions.length - 1) {
          setActiveSuggestionIndex((prev) => prev + 1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (activeSuggestionIndex > 0) {
          setActiveSuggestionIndex((prev) => prev - 1);
        }
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const keywords = currentInput.split(/[\s,;]/).filter(Boolean);

    const searchPayload = {
      hardFilters: searchState.tokens.map(
        ({ type, field, value, operator }) => ({
          type,
          field,
          value,
          ...(type === "primitive" && {
            operator,
          }),
        }),
      ),
      keywords,
    };

    if (
      searchPayload.keywords.length > 0 ||
      searchPayload.hardFilters.length > 0
    ) {
      setSearchParams({
        search: JSON.stringify(searchPayload),
      });
    } else {
      setSearchParams({});
    }
  };

  const handleSuggestionBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setSuggestions([]);
    }
  };

  return (
    <div className={styles.container} onBlur={handleSuggestionBlur}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
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
          suggestions.map(({ field, value, candidateSequence }, index) => {
            const { name, hex } = value;
            return (
              <li key={`${field}-${name}`}>
                <button
                  className={`
                    ${styles.suggestionBtn} 
                    ${index === activeSuggestionIndex ? styles.activeSuggestion : ""}
                  `}
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
