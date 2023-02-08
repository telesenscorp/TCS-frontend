export const waiter = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout * 1000));
};
export const waiterCallback = async (timeout, fn = () => {}) => {
  await waiter(timeout);
  fn();
};
