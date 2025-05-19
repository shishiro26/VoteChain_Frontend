export const showSessionExpiredAlert = async (): Promise<void> => {
  return new Promise((resolve) => {
    const customEvent = new CustomEvent("sessionExpired", {
      detail: resolve,
    });
    window.dispatchEvent(customEvent);
  });
};
