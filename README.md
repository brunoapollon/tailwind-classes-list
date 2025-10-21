# Tailwind Classes List

A powerful JavaScript library that dynamically returns Tailwind CSS utility class options based on your input. Perfect for building class pickers, autocomplete components, UI builders, or any application that needs intelligent Tailwind CSS class suggestions.

## Features

- 🚀 **Dynamic Class Generation**: Get relevant Tailwind CSS classes based on partial input
- 🎯 **Smart Filtering**: Intelligent filtering that matches class prefixes and patterns
- 🔧 **Variant Support**: Full support for Tailwind variants (hover, focus, responsive, etc.)
- ⚡ **High Performance**: Optimized processing with configurable result limits
- 📦 **Zero Dependencies**: Lightweight library with minimal footprint
- 🎨 **Complete Coverage**: Supports all Tailwind CSS utility classes

## Installation

```bash
npm install @brunoapollon/tailwind-classes-list
```

or

```bash
yarn add @brunoapollon/tailwind-classes-list
```

## Usage

### Basic Usage

```javascript
const { geClassList } = require('@brunoapollon/tailwind-classes-list');

// Get class suggestions for 'bg-'
const result = await geClassList({ param: 'bg-' });
console.log(result.classes);
// Returns: [
//   { label: 'bg-red-500', value: 'bg-red-500' },
//   { label: 'bg-blue-500', value: 'bg-blue-500' },
//   { label: 'bg-green-500', value: 'bg-green-500' },
//   // ... more background classes
// ]
```

### With Variants

```javascript
// Get suggestions for hover variant
const result = await geClassList({ param: 'hover:bg-' });
console.log(result.classes);
// Returns classes with hover variant applied
```

### Limiting Results

```javascript
// Limit results to 20 items
const result = await geClassList({ 
  param: 'text-', 
  limit: 20 
});
```

## API Reference

### `geClassList(options)`

Returns a promise that resolves to an object containing Tailwind CSS class suggestions.

#### Parameters

- `options` (Object)
  - `param` (string): The input string to match against Tailwind classes
  - `limit` (number, optional): Maximum number of results to return (default: 100)

#### Returns

Promise that resolves to:

```javascript
{
  classes: [
    {
      label: string,  // Display name for the class
      value: string   // Actual class value
    }
  ]
}
```

## Examples

### Building a Class Picker Component

```javascript
import { geClassList } from '@brunoapollon/tailwind-classes-list';

async function createClassPicker(inputValue) {
  const suggestions = await geClassList({ param: inputValue });
  
  return suggestions.classes.map(cls => ({
    text: cls.label,
    value: cls.value
  }));
}

// Usage in a search input
const handleInputChange = async (value) => {
  const options = await createClassPicker(value);
  setDropdownOptions(options);
};
```

### Autocomplete Integration

```javascript
// Perfect for autocomplete libraries
const getAutocompleteSuggestions = async (query) => {
  const { classes } = await geClassList({ param: query, limit: 10 });
  return classes.map(c => c.value);
};
```

## Supported Class Types

This library supports all Tailwind CSS utility classes including:

- **Layout**: `container`, `box-border`, `block`, `flex`, `grid`, etc.
- **Spacing**: `m-*`, `p-*`, `space-*`, etc.
- **Sizing**: `w-*`, `h-*`, `min-*`, `max-*`, etc.
- **Typography**: `text-*`, `font-*`, `leading-*`, etc.
- **Colors**: `bg-*`, `text-*`, `border-*`, etc.
- **Borders**: `border-*`, `rounded-*`, etc.
- **Effects**: `shadow-*`, `opacity-*`, etc.
- **Filters**: `blur-*`, `brightness-*`, etc.
- **Transforms**: `scale-*`, `rotate-*`, `translate-*`, etc.
- **Interactivity**: `cursor-*`, `select-*`, etc.
- **SVG**: `fill-*`, `stroke-*`, etc.
- **Accessibility**: `sr-only`, etc.

## Variants Support

Full support for all Tailwind CSS variants:

- **Pseudo-classes**: `hover:`, `focus:`, `active:`, `visited:`, etc.
- **Pseudo-elements**: `before:`, `after:`, `placeholder:`, etc.
- **Media queries**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, etc.
- **Feature queries**: `supports-*:`, etc.
- **Attribute selectors**: `open:`, `checked:`, etc.

## Performance

The library is optimized for performance with:
- Efficient string processing algorithms
- Configurable result limits to prevent overwhelming UIs
- Minimal memory footprint
- Fast startup time

## Use Cases

- **UI Builders**: Provide class suggestions in visual editors
- **Code Editors**: Autocomplete for Tailwind classes
- **Design Systems**: Class picker components
- **Documentation**: Interactive class explorers
- **Learning Tools**: Tailwind CSS class discovery

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Bruno Lopes

## Repository

[GitHub Repository](https://github.com/brunoapollon/tailwind-classes-list)
