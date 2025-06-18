import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface CuisineSelectorPillsProps {
  /** List of cuisine names to display as pills. E.g., ['Italian', 'Chinese', 'Pizza'] */
  cuisines: string[];
  /** The currently selected cuisine name. Use `undefined` if no cuisine is selected. */
  selectedCuisine: string | undefined;
  /**
   * Callback function invoked when a cuisine pill is selected or deselected.
   * Passes the selected cuisine name as a string, or `undefined` if a pill is deselected.
   */
  onCuisineChange: (cuisine: string | undefined) => void;
  /** Optional className to apply to the root ToggleGroup element for custom styling. */
  className?: string;
}

const CuisineSelectorPills: React.FC<CuisineSelectorPillsProps> = ({
  cuisines,
  selectedCuisine,
  onCuisineChange,
  className,
}) => {
  console.log('CuisineSelectorPills loaded. Current selection:', selectedCuisine);

  const handleValueChange = (value: string) => {
    // For ToggleGroup with type="single" and collapsible={true}:
    // - When an item is selected, `value` is the item's `value` prop (the cuisine name).
    // - When the selected item is clicked again to deselect it, `value` becomes an empty string `""`.
    // This logic normalizes an empty string to `undefined` for the parent component.
    onCuisineChange(value ? value : undefined);
  };

  return (
    <ToggleGroup
      type="single"
      value={selectedCuisine} // Controlled component: current selected cuisine
      onValueChange={handleValueChange} // Handler for when selection changes
      collapsible // Allows deselecting the currently active pill by clicking it again
      className={cn(
        "flex flex-wrap justify-center gap-2 py-2", // Basic layout: flex, wraps, centered items, gap, padding
        className // Allows custom classes from parent
      )}
      aria-label="Filter by cuisine" // Accessibility: label for the group
    >
      {cuisines.map((cuisineName) => (
        <ToggleGroupItem
          key={cuisineName}
          value={cuisineName} // The value associated with this item
          aria-label={`Filter by ${cuisineName}`} // Accessibility: label for individual pill
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium", // Pill shape, padding, text size, font weight
            "transition-colors duration-150 ease-in-out", // Smooth transition for color changes
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Focus styling
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground", // Styling for selected state
            "hover:bg-accent hover:text-accent-foreground" // Styling for hover state (unselected)
          )}
        >
          {cuisineName}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default CuisineSelectorPills;