export const activeLogger = true;
export const log = {
  error: (input) => (activeLogger ? console.log("%cFail: ", "color:white;background:red;padding:1px 4px;border-radius:2px;", input) : null),
  request: (input) =>
    activeLogger
      ? console.log(`%cRequest -> ${input?.url}:`, "color:white;background:#1E90FF;padding:1px 4px;border-radius:2px;", input)
      : null,
  response: (input) =>
    activeLogger
      ? console.log(
          `%cResponse -> ${input?.config?.url}: `,
          "color:white;background:#228B22;padding:1px 4px;border-radius:2px;",
          input?.data
        )
      : null,
};
