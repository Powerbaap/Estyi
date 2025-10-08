// Scroll utility functions
export const scrollToTopInstant = () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
};

export const scrollToTopSmooth = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
