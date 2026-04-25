
(async () => {
    try {
        // 1. Load Supabase
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        s.onerror = () => { throw new Error('Failed to load the Supabase library from CDN. Check your network or for content blockers.'); };
        document.head.appendChild(s);
        await new Promise(r => s.onload = r);
        const S = window.supabase.createClient('https://yhhrkirlabyghtczabqh.supabase.co', 'sb_publishable_VAd887a32f8HihbGKeLiJw_lkN6eIse');

        // 2. Define getMemberId function
        function getMemberId() {
            try {
                const a = JSON.parse(localStorage.getItem('memberId') || '{}');
                if (a?.value) return String(a.value);
            } catch (e) {}
            try {
                const b = JSON.parse(localStorage.getItem('userInfo') || '{}');
                if (b?.value?.memberId) return String(b.value.memberId);
            } catch (e) {}
            for (const k of Object.keys(localStorage)) {
                try {
                    const v = JSON.parse(localStorage.getItem(k));
                    const id = v?.value?.memberId || v?.memberId || v?.value?.member_id || v?.member_id;
                    if (id) return String(id);
                } catch (e) {}
            }
            return null;
        }

        // Function to register a new user
        async function registerNewUser() {
            const newMemberId = String(Date.now());
            const { error } = await S.from('members').insert({ member_id: newMemberId, active: false });
            if (error) {
                throw new Error(`Registration failed: ${error.message}. This may be due to Row Level Security on the 'members' table.`);
            }
            localStorage.setItem('memberId', JSON.stringify({ value: newMemberId }));
            const statusPanel = document.createElement('div');
            statusPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#f97316;';
            statusPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Registration Complete</div><div>ID: ${newMemberId}</div><div>Status: <span style="font-weight:bold;">Pending Activation</span></div><div style="font-size:11px;color:#888;margin-top:10px;">An administrator must now activate your account.</div>`;
            document.body.appendChild(statusPanel);
        }

        // 3. Main Logic
        let memberId = getMemberId();

        if (memberId) {
            const { data, error } = await S.from('members').select('member_id,active').eq('member_id', memberId).limit(1);
            if (error) {
                throw new Error(`Database query failed: ${error.message}. Check network, RLS policies, or if the table exists.`);
            }

            if (!data || data.length === 0) {
                localStorage.clear();
                await registerNewUser();
                return;
            }

            const member = data[0];
            if (member.active !== true) {
                const statusPanel = document.createElement('div');
                statusPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#ef4444;';
                statusPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">AR Wallet Status</div><div>ID: ${memberId}</div><div>Status: <span style="font-weight:bold;">Inactive</span></div><div style="font-size:11px;color:#888;margin-top:10px;">Please contact an administrator to activate your account.</div>`;
                document.body.appendChild(statusPanel);
                return;
            }
        } else {
            await registerNewUser();
            return;
        }

        // 4. If active, show the AR Wallet
        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;';
        panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font-weight:700;font-size:15px;">AR Wallet</span><span id="aw-dot" style="font-size:11px;color:#22c55e;font-weight:600;">● Active</span></div><div style="font-size:11px;color:#888;margin-bottom:8px;">ID: ${memberId}</div><input id="aw-val" type="number" placeholder="Enter amount ₹" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:7px;margin-bottom:10px;box-sizing:border-box;font-size:13px;"/><div style="display:flex;gap:8px;margin-bottom:10px;"><button id="aw-start" style="flex:1;background:#22c55e;color:#fff;border:none;border-radius:6px;padding:9px;cursor:pointer;font-weight:700;">Start</button><button id="aw-stop" style="flex:1;background:#ef4444;color:#fff;border:none;border-radius:6px;padding:9px;cursor:pointer;font-weight:700;">Stop</button></div><div id="aw-msg" style="font-size:12px;text-align:center;color:#555;min-height:16px;">Ready</div>`;
        document.body.appendChild(panel);

    } catch (e) {
        console.error('A critical error occurred:', e);
        const errorPanel = document.createElement('div');
        errorPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fef2f2;border:1px solid #ef4444;border-radius:12px;padding:16px;width:300px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#b91c1c;';
        errorPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Critical Error</div><div style="font-size:12px;word-wrap:break-word;"><b>Message:</b> ${e.message}</div><pre style="font-size:10px;color:#555;margin-top:10px;white-space:pre-wrap;word-wrap:break-word;">${e.stack}</pre>`;
        document.body.appendChild(errorPanel);
    }
})();
