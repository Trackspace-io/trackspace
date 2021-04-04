import React, { useState } from 'react';

import ClickHandler from './ClickHandler';

import style from '../../styles/gui/SearchBar.module.css';
import { Input, useInput } from './Input';

interface ISearchBarProps {
  items: any[];
  text: (param: any) => string;
  render: (item: any, index: number) => JSX.Element;
}

/**
 * Represents a search bar.
 *
 * @param {{
 *  items: any[],
 *  text: (any) => string,
 *  render: (any) => JSX.Element
 * }} props The props of the component.
 */
const SearchBar: React.FC<ISearchBarProps> = (props) => {
  // Initialize the internal state.
  const Inputs = useInput({ searchText: '' });

  const [inputHasFocus, setInputHasFocus] = useState(false);
  const [suggestionHasFocus, setSuggestionHasFocus] = useState(false);

  // Render the component.
  return (
    <div>
      {/* Search bar */}
      <Input
        name="searchText"
        type="text"
        placeholder="Search..."
        value={Inputs.values.searchText}
        onChange={Inputs.handleInputChange}
        onFocus={() => {
          setInputHasFocus(true);
        }}
        onBlur={() => {
          setInputHasFocus(false);
        }}
      />

      {/* Suggestions */}
      <ClickHandler
        onClickInside={() => {
          setSuggestionHasFocus(true);
        }}
        onClickOutside={() => {
          setSuggestionHasFocus(false);
        }}>
        <div className={style['container']}>
          <div className={style['suggestions']}>
            {inputHasFocus || suggestionHasFocus ? (
              props.items.map((item, i) => {
                const text = props.text(item).toUpperCase();
                if (text.indexOf(Inputs.values.searchText.toUpperCase()) < 0) {
                  return <div key={i} />;
                }

                return (
                  <div
                    key={i}
                    onClick={() => {
                      Inputs.setValues({
                        ...Inputs.values,
                        ['searchText']: props.text(item),
                      });
                      setSuggestionHasFocus(false);
                    }}>
                    {props.render(item, i)}
                  </div>
                );
              })
            ) : (
              <div />
            )}
          </div>
        </div>
      </ClickHandler>
    </div>
  );
};

export default SearchBar;
