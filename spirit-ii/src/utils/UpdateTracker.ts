/**
 * Utility to track which fields have been updated in an object
 */
export class UpdateTracker<T> {
  private previousValues: Partial<T> = {};
  private updatedFields: Set<keyof T> = new Set();
  
  /**
   * Update the tracker with new values, identifying which fields have changed
   */
  trackChanges(newValues: Partial<T>): Set<keyof T> {
    this.updatedFields.clear();
    
    // Compare new values with previous values
    Object.keys(newValues).forEach(key => {
      const typedKey = key as keyof T;
      if (this.previousValues[typedKey] !== undefined && 
          this.previousValues[typedKey] !== newValues[typedKey]) {
        this.updatedFields.add(typedKey);
      }
    });
    
    // Update previous values for next comparison
    this.previousValues = { ...newValues };
    
    return this.updatedFields;
  }
  
  /**
   * Check if a specific field was updated in the last comparison
   */
  wasUpdated(field: keyof T): boolean {
    return this.updatedFields.has(field);
  }
  
  /**
   * Reset the tracker
   */
  reset(): void {
    this.previousValues = {};
    this.updatedFields.clear();
  }
}
