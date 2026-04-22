(function() {
    // Check if it's already loaded to prevent duplicates
    if (document.getElementById('my-filter-script')) {
        console.log('Filter script is already loaded.');
        return;
    }

    // Create the script tag
    var script = document.createElement('script');
    script.id = 'my-filter-script';
    
    // Fetch your specific filter.js file directly from your GitHub repo
    script.src = 'https://cdn.jsdelivr.net/gh/anirban66622/Filter.jsss@main/filter.js';
    script.type = 'text/javascript';

    // Log success or error to the console
    script.onload = function() {
        console.log('✅ Filter script loaded successfully from GitHub!');
    };
    script.onerror = function() {
        console.error('❌ Failed to load the filter script. Check your internet or GitHub repo visibility.');
    };

    // Inject it into the current webpage
    document.body.appendChild(script);
})();

