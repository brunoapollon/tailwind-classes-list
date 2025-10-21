const BACKSLASH = 92;
const OPEN_CURLY = 123;
const CLOSE_CURLY = 125;
const OPEN_PAREN = 40;
const CLOSE_PAREN = 41;
const OPEN_BRACKET = 91;
const CLOSE_BRACKET = 93;
const DOUBLE_QUOTE = 34;
const SINGLE_QUOTE = 39;
const closingBracketStack = new Uint8Array(256);

const LIMIT_SUGGESTIONS = 100;

class ClassListProcessorService {
  constructor(limitSuggestions = LIMIT_SUGGESTIONS) {
    this.limitSuggestions = limitSuggestions;
  }

  segment(input, separator) {
    let stackPos = 0;
    const parts = [];
    let lastPos = 0;
    const len = input.length;
    const separatorCode = separator.charCodeAt(0);
    for (let idx = 0; idx < len; idx++) {
      const char = input.charCodeAt(idx);
      if (stackPos === 0 && char === separatorCode) {
        parts.push(input.slice(lastPos, idx));
        lastPos = idx + 1;
        continue;
      }
      switch (char) {
        case BACKSLASH:
          idx += 1;
          break;
        case SINGLE_QUOTE:
        case DOUBLE_QUOTE:
          while (++idx < len) {
            const nextChar = input.charCodeAt(idx);
            if (nextChar === BACKSLASH) {
              idx += 1;
              continue;
            }
            if (nextChar === char) {
              break;
            }
          }
          break;
        case OPEN_PAREN:
          closingBracketStack[stackPos] = CLOSE_PAREN;
          stackPos++;
          break;
        case OPEN_BRACKET:
          closingBracketStack[stackPos] = CLOSE_BRACKET;
          stackPos++;
          break;
        case OPEN_CURLY:
          closingBracketStack[stackPos] = CLOSE_CURLY;
          stackPos++;
          break;
        case CLOSE_BRACKET:
        case CLOSE_CURLY:
        case CLOSE_PAREN:
          if (stackPos > 0 && char === closingBracketStack[stackPos - 1]) {
            stackPos--;
          }
          break;
      }
    }
    parts.push(input.slice(lastPos));
    return parts;
  }

  isValidVariant(part, state) {
    if (state.variants.map(v => v.name).includes(part)) {
      return true;
    }
    const className2 = `${part}${state.separator}[color:red]`;
    if (!state.designSystem) return false;

    const compiled = state.designSystem.candidatesToCss([className2]);
    if (compiled.length !== 1) return false;
    return compiled[0] !== null;
  }

  getVariantsFromClassName(state, className) {
    let parts = this.segment(className, state.separator);
    if (parts.length < 2) {
      return { variants: [], offset: 0 };
    }
    parts = parts.filter(Boolean);

    let offset = 0;
    const variants = new Set();
    for (const part of parts) {
      if (!this.isValidVariant(part, state)) break;
      variants.add(part);
      offset += part.length + state.separator.length;
    }
    return { variants: Array.from(variants), offset };
  }

  naturalExpand(value2, total) {
    const length = typeof total === "number" ? total.toString().length : 8;
    return ("0".repeat(length) + value2).slice(-length);
  }

  filterClassList(classList, query) {
    if (!query) return classList;

    const splitQuery = query.split(':');
    const input = splitQuery[splitQuery.length - 1];
    return classList.filter(item => item.startsWith(input) || item.includes(`-${input}`)).slice(0, this.limitSuggestions);
  }

  getOptionValue({ className, modifiers }) {
    return `${modifiers.join(':')}${modifiers.length > 0 ? ":" : ""}${className}`
  }

  process(state, classList = "", value = []) {
    const classNames = classList.split(":");
    const partialClassName = classNames[classNames.length - 1];
    const { separator: sep4 } = state;
    const { variants: existingVariants } = this.getVariantsFromClassName(state, partialClassName)

    let items = [];
    const seenVariants = new Set();
    for (const variant of state.variants) {
      if (existingVariants.includes(variant.name)) continue

      if (seenVariants.has(variant.name)) continue

      seenVariants.add(variant.name);

      if (variant.isArbitrary) {
        items.push(`${variant.name}${variant.hasDash ? "-" : ""}[]${sep4}`)
      } else {
        let selectors = [];
        try {
          selectors = variant.selectors();
        } catch (err) {
          console.log("Error while trying to get selectors for variant");
        }
        if (selectors.length === 0) continue

        items.push(`${variant.name}${sep4}`)
      }
      for (const value2 of variant.values ?? []) {
        if (existingVariants.includes(`${variant.name}-${value2}`)) continue

        if (seenVariants.has(`${variant.name}-${value2}`)) continue

        seenVariants.add(`${variant.name}-${value2}`);

        let selectors = [];
        try {
          selectors = variant.selectors({ value: value2 });
        } catch (err) {
          console.log("Error while trying to get selectors for variant");
        }

        if (selectors.length === 0) continue

        items.push(value2 === "DEFAULT" ? `${variant.name}${sep4}` : `${variant.name}${variant.hasDash ? "-" : ""}${value2}${sep4}`)
      }
    }

    items = items.concat(
      state.classList.reduce((acc, [className]) => {
        if (state.blocklist?.includes([...existingVariants, className].join(state.separator))) return acc

        acc.push(className)

        return acc;
      }, []),
    )

    const filteredItems = this.filterClassList(items, classList);
    const modifiers = classNames.slice(0, -1)

    const classes = filteredItems.reduce((acc, className) => {
      acc.push({
        label: this.getOptionValue({ className, modifiers }),
        value: this.getOptionValue({ className, modifiers }),
      });
      return acc;
    }, [])

    return {
      classes,
    }
  }
}

module.exports = ClassListProcessorService