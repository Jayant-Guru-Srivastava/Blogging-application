import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // solid icons
import { far } from '@fortawesome/free-regular-svg-icons'; // regular icons

// Add all the icon packs to the library
library.add(fas, far);

// Define a type for icon prefix mappings
type IconPrefixMap = {
  [key: string]: string;
};

// Create a mapping for the icon prefixes
const iconPrefixMap: IconPrefixMap = {
  'fa-solid': 'fas',
  'fa-regular': 'far',
};

export function getIcon(icon: string) {
  const [prefix, iconName] = icon.split(' ');
  const resolvedPrefix = iconPrefixMap[prefix as keyof IconPrefixMap]; // Ensure TypeScript understands the type
  return [resolvedPrefix, iconName];
}