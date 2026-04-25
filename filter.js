const supabaseUrl = "https://gnhjqxgnbgrdxobasvwi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaGpxeGduYmdyZHhvYmFzdndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5MDUxMDQsImV4cCI6MjAzMTQ4MTEwNH0.Ep2aDEXK5aM7O-52Lh_tW6yW3g3vGg9yqFjw1i5m0aE";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
(async () => {
    try {
        // 1. Create a blur overlay to block content until user is verified.
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(255,255,255,0.8);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:999998;';
        document.body.appendChild(overlay);

        // 2. Load Supabase
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        s.onerror = () => { throw new Error('Failed to load the Supabase library from CDN. Check your network or for content blockers.'); };
        document.head.appendChild(s);
        await new Promise(r => s.onload = r);
        const S = window.supabase.createClient('https://yhhrkirlabyghtczabqh.supabase.co', 'sb_publishable_VAd887a32f8HihbGKeLiJw_lkN6eIse');

        // 3. Check for authenticated user
        const { data: { user } } = await S.auth.getUser();
        console.log("User object:", user);

        if (!user) {
            // No user is signed in. Show login message.
            const loginPanel = document.createElement('div');
            loginPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#ef4444;';
            loginPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Access Denied</div><div>Please log in to continue.</div>`;
            document.body.appendChild(loginPanel);
            return;
        }

        // 4. User is authenticated, check their status in the 'members' table
        const { data, error } = await S.from('members').select('member_id,active').eq('id', user.id).limit(1);
        console.log("Data from members table:", data);


        if (error) {
            throw new Error(`Database query failed: ${error.message}. Check network, RLS policies, or if the table exists.`);
        }

        if (!data || data.length === 0) {
            // User authenticated but no profile in our 'members' table.
            const statusPanel = document.createElement('div');
            statusPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fef2f2;border:1px solid #ef4444;border-radius:12px;padding:16px;width:300px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#b91c1c;';
            statusPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Profile Incomplete</div><div style="font-size:12px;">Your user profile is not fully set up. Please contact support.</div>`;
            document.body.appendChild(statusPanel);
            return;
        }

        const member = data[0];
        if (member.active !== true) {
            // User is not active.
            const statusPanel = document.createElement('div');
            statusPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#ef4444;';
            statusPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">AR Wallet Status</div><div>ID: ${user.id}</div><div>Status: <span style="font-weight:bold;">Inactive</span></div><div style="font-size:11px;color:#888;margin-top:10px;">Please contact an administrator to activate your account.</div>`;
            document.body.appendChild(statusPanel);
            return;
        }

        // 5. If active, remove overlay and show the AR Wallet
        overlay.remove(); 

        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;';
        panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font-weight:700;font-size:15px;">AR Wallet</span><span id="aw-dot" style="font-size:11px;color:#22c55e;font-weight:600;">● Active</span></div><div style="font-size:11px;color:#888;margin-bottom:8px;">ID: ${user.id}</div><input id="aw-val" type="number" placeholder="Enter amount ₹" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:7px;margin-bottom:10px;box-sizing:border-box;font-size:13px;"/><div style="display:flex;gap:8px;margin-bottom:10px;"><button id="aw-start" style="flex:1;background:#22c55e;color:#fff;border:none;border-radius:6px;padding:9px;cursor:pointer;font-weight:700;">Start</button><button id="aw-stop" style="flex:1;background:#ef4444;color:#fff;border:none;border-radius:6px;padding:9px;cursor:pointer;font-weight:700;">Stop</button></div><div id="aw-msg" style="font-size:12px;text-align:center;color:#555;min-height:16px;">Ready</div>`;
        document.body.appendChild(panel);

    } catch (e) {
        console.error('A critical error occurred:', e);
        const errorPanel = document.createElement('div');
        errorPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fef2f2;border:1px solid #ef4444;border-radius:12px;padding:16px;width:300px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#b91c1c;';
        errorPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Critical Error</div><div style="font-size:12px;word-wrap:break-word;"><b>Message:</b> ${e.message}</div><pre style="font-size:10px;color:#555;margin-top:10px;white-space:pre-wrap;word-wrap:break-word;">${e.stack}</pre>`;
        document.body.appendChild(errorPanel);
    }
})();