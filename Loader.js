(async () => {
  try {
    const repo = 'ajehrg26/filter.js';
    const branch = 'main';
    const filePath = 'filter.js'; // change if inside folder

    // Get latest commit SHA
    const res = await fetch(`https://api.github.com/repos/${repo}/commits/${branch}`);
    const data = await res.json();
    const sha = data.sha;

    const url = `https://cdn.jsdelivr.net/gh/${repo}@${sha}/${filePath}`;
    console.log('Loading:', url);

    // Prevent duplicate injection
    if (document.querySelector(`script[data-loader="${repo}"]`)) {
      console.log('⚠️ Script already injected');
      return;
    }

    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.dataset.loader = repo;

    s.onload = () => console.log('✅ filter.js loaded (SHA):', sha);
    s.onerror = () => console.error('❌ Failed to load script');

    document.head.appendChild(s);

  } catch (e) {
    console.error('Loader error:', e);
  }
})();
