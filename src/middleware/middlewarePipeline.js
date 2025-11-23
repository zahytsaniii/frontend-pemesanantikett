function middlewarePipeline(context, middleware, index) {
  const nextMiddleware = middleware[index];

  if (!nextMiddleware) {
    return context.next;
  }

  return (...parameters) => {
    // Jika next dipanggil dengan argumen (redirect / abort), hentikan pipeline.
    if (parameters.length > 0) {
      return context.next(...parameters);
    }

    const nextPipeline = middlewarePipeline(context, middleware, index + 1);

    nextMiddleware({
      ...context,
      next: nextPipeline,
    });
  };
}

export default middlewarePipeline;
