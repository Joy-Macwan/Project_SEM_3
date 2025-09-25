// Test script to check React rendering
console.log('Testing React rendering...');

// Function to check if React is rendering properly
function checkReactRendering() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found! Check your HTML.');
    return false;
  }
  
  // Check if React has rendered anything inside the root
  if (rootElement.children.length === 0) {
    console.error('Root element is empty! React may not be rendering.');
    return false;
  }
  
  console.log('React appears to be rendering content.');
  console.log('Root element has', rootElement.children.length, 'child elements.');
  
  return true;
}

// Add the script to run after page load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    checkReactRendering();
  }, 1000);
});