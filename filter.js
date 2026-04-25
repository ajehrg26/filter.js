
(async () => {
    // 1. Load Supabase
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
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

    // Function to register a new user and display status
    async function registerNewUser() {
        const newMemberId = String(Date.now());
        const { error } = await S.from('members').insert({ member_id: newMemberId, active: false });
        if (error) {
            console.error('Failed to register new user:', error.message);
            // Display error panel if registration fails (e.g. RLS)
            const errorPanel = document.createElement('div');
            errorPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#ef4444;';
            errorPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Registration Failed</div><div style="font-size:12px;">${error.message}. This is likely due to Row Level Security (RLS) being enabled on the 'members' table. Please disable it and try again.</div>`;
            document.body.appendChild(errorPanel);
            return;
        }
        localStorage.setItem('memberId', JSON.stringify({ value: newMemberId }));
        const statusPanel = document.createElement('div');
        statusPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#f97316;';
        statusPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">Registration Complete</div><div>ID: ${newMemberId}</div><div>Status: <span style="font-weight:bold;">Pending Activation</span></div><div style="font-size:11px;color:#888;margin-top:10px;">An administrator must now activate your account.</div>`;
        document.body.appendChild(statusPanel);
    }

    // 3. Get memberId and check status
    let memberId = getMemberId();

    if (memberId) {
        const { data, error } = await S.from('members').select('member_id,active').eq('member_id', memberId).limit(1);
        if (error) {
            console.error('Supabase query error:', error.message);
            return; // Exit silently
        }

        if (!data || data.length === 0) {
            // Invalid memberId found in localStorage. Clear it and register as a new user.
            localStorage.clear();
            await registerNewUser();
            return;
        }

        const member = data[0];
        if (member.active !== true) {
            // Member found but is not active.
            const statusPanel = document.createElement('div');
            statusPanel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;color:#ef4444;';
            statusPanel.innerHTML = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">AR Wallet Status</div><div>ID: ${memberId}</div><div>Status: <span style="font-weight:bold;">Inactive</span></div><div style="font-size:11px;color:#888;margin-top:10px;">Please contact an administrator to activate your account.</div>`;
            document.body.appendChild(statusPanel);
            return;
        }
    } else {
        // No memberId found, so register a new user.
        await registerNewUser();
        return;
    }

    // 4. If we get here, the user is active. Show the AR Wallet.
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#fff;border-radius:12px;padding:16px;width:230px;font-family:system-ui;box-shadow:0 12px 28px rgba(0,0,0,.18);z-index:999999;font-size:14px;';
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font-weight:700;font-size:15px;">AR Wallet</span><span id="aw-dot" style="font-size:11px;color:#22c55e;font-weight:600;">● Active</span></div><div style="font-size:11px;color:#888;margin-bottom:8px;">ID: ${memberId}</div><input id="aw-val" type="number" placeholder="Enter amount ₹" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:7px;margin-bottom:10px;box-sizing:border-box;font-size:13px;"/><div style="display:flex;gap:8px;margin-bottom:10px;"><button id="aw-start" style="flex:1;background:#22c55e;color:#fff;border:none;border-radius:6px;padding:9px;cursor:pointer;font-weight:700;">Start</button><button id="aw-stop" style="flex:1;background:#ef4444;color:#fff;border:none;border-radius:6px;padding:9px;cursor:pointer;font-weight:700;">Stop</button></div><div id="aw-msg" style="font-size:12px;text-align:center;color:#555;min-height:16px;">Ready</div>`;
    document.body.appendChild(panel);
    const dot = document.getElementById('aw-dot'),
        msg = document.getElementById('aw-msg'),
        inp = document.getElementById('aw-val');
    let running = false,
        interval = null,
        observer = null;

    function filterRows(a) {
        document.querySelectorAll('*').forEach(el => {
            if (el.children.length) return;
            if (el.innerText?.includes('₹')) {
                el.style.display = el.innerText.includes('₹' + a) && !el.innerText.includes('₹' + a + '0') ? '' : 'none';
            }
        });
    }

    function autoClick() {
        document.querySelectorAll('div.x-row.x-row-middle button').forEach(btn => {
            const r = btn.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0) btn.click();
        });
    }

    document.getElementById('aw-start').onclick = async () => {
        if (running) return;
        msg.textContent = 'Verifying...';
        const { data: d, error: e } = await S.from('members').select('member_id,active').eq('member_id', memberId).eq('active', true).limit(1);
        if (e || !d || !d.length) {
            panel.remove();
            return;
        }
        const amount = inp.value.trim();
        if (!amount) {
            msg.textContent = '⚠️ Enter amount';
            msg.style.color = '#f97316';
            return;
        }
        running = true;
        dot.textContent = '● Running';
        dot.style.color = '#22c55e';
        msg.textContent = '✓ Filtering ₹' + amount;
        msg.style.color = '#22c55e';
        filterRows(amount);
        observer = new MutationObserver(() => filterRows(amount));
        observer.observe(document.body, { childList: true, subtree: true });
        interval = setInterval(autoClick, 500);
    };

    document.getElementById('aw-stop').onclick = () => {
        if (!running) return;
        running = false;
        if (interval) clearInterval(interval);
        if (observer) observer.disconnect();
        interval = null;
        observer = null;
        document.querySelectorAll('*').forEach(el => {
            if (el.style.display === 'none' && el.innerText?.includes('₹')) el.style.display = '';
        });
        dot.textContent = '● Stopped';
        dot.style.color = '#ef4444';
        msg.textContent = 'Stopped';
        msg.style.color = '#555';
    };
})();
