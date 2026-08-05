const verifyUrl = async (url) => {
  if (!url || typeof url !== "string") return false;
  // If it's already a search query, it's guaranteed to work
  if (url.includes("google.com/search") || url.includes("youtube.com/results") || url.includes("developer.mozilla.org/en-US/search")) {
    return true;
  }

  try {
    // Try HEAD request first for performance
    const res = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(2000), // 2 seconds timeout
    });
    if (res.status >= 200 && res.status < 400) return true;
  } catch (err) {
    // Ignore error and fall through to GET
  }

  try {
    // Try GET request in case server blocks HEAD
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(2000),
    });
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false;
  }
};

const verifyAndFilterResources = async (steps) => {
  if (!steps || !Array.isArray(steps)) return steps;

  const verifiedSteps = await Promise.all(
    steps.map(async (step) => {
      if (!step.resources || !Array.isArray(step.resources)) return step;

      const verifiedResources = await Promise.all(
        step.resources.map(async (resource) => {
          const isValid = await verifyUrl(resource.url);
          if (isValid) {
            return resource;
          }

          // Fallback to Google Search if URL is dead/outdated
          console.log(`[URL Verifier] URL 404 or dead: ${resource.url}. Replacing with search query fallback.`);
          return {
            title: `Search: ${step.title} Official Documentation`,
            url: `https://www.google.com/search?q=${encodeURIComponent(step.title + " official documentation")}`,
            type: "documentation",
          };
        })
      );

      return {
        ...step,
        resources: verifiedResources,
      };
    })
  );

  return verifiedSteps;
};

module.exports = { verifyUrl, verifyAndFilterResources };
