
(async () => {
  // Function to load a script dynamically
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script load error for ${src}`));
      document.head.appendChild(script);
    });
  }

  try {
    // Load Supabase client
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js');
  } catch (error) {
    console.error('Failed to load Supabase client library:', error);
    const accessDeniedMessage = document.createElement('div');
    accessDeniedMessage.textContent = 'Verification Error: Could not load dependencies.';
    accessDeniedMessage.style.position = 'fixed';
    accessDeniedMessage.style.top = '50%';
    accessDeniedMessage.style.left = '50%';
    accessDeniedMessage.style.transform = 'translate(-50%, -50%)';
    accessDeniedMessage.style.backgroundColor = 'orange';
    accessDeniedMessage.style.color = 'white';
    accessDeniedMessage.style.padding = '20px';
    accessDeniedMessage.style.borderRadius = '10px';
    accessDeniedMessage.style.zIndex = '999999';
    document.body.appendChild(accessDeniedMessage);
    return;
  }

  const supabaseUrl = "https://yhhrkirlabyghtczabqh.supabase.co";
  const supabaseAnonKey = "sb_publishable_VAd887a32f8HihbGKeLiJw_lkN6eIse";
  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

  async function checkAccess() {
    console.log("Checking access...");
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      console.log("No memberId found in localStorage.");
      return false;
    }
    console.log(`memberId found: ${memberId}`);

    const { data, error } = await supabase
      .from('members')
      .select('id')
      .eq('id', memberId)
      .single();

    if (error || !data) {
      console.error("Supabase verification failed:", error);
      return false;
    }

    console.log("Access granted.");
    return true;
  }

  const hasAccess = await checkAccess();

  if (!hasAccess) {
    console.log("Access denied. Halting script execution.");
    const accessDeniedMessage = document.createElement('div');
    accessDeniedMessage.textContent = 'Access Denied';
    accessDeniedMessage.style.position = 'fixed';
    accessDeniedMessage.style.top = '50%';
    accessDeniedMessage.style.left = '50%';
    accessDeniedMessage.style.transform = 'translate(-50%, -50%)';
    accessDeniedMessage.style.backgroundColor = 'red';
    accessDeniedMessage.style.color = 'white';
    accessDeniedMessage.style.padding = '20px';
    accessDeniedMessage.style.borderRadius = '10px';
    accessDeniedMessage.style.zIndex = '999999';
    document.body.appendChild(accessDeniedMessage);
    return; // This will stop the rest of the script from running
  }

  console.log("Verification successful. Proceeding with script.");

  // The original script logic will now run only if access is granted.
  function a0_0x1703(_0x24082f, _0x44ab98) {
    _0x24082f = _0x24082f - 0x196;
    const _0x4cfb7e = a0_0x4cfb();
    let _0x170385 = _0x4cfb7e[_0x24082f];
    if (a0_0x1703["bPtxJv"] === undefined) {
      var _0x321e82 = function(_0x1542a8) {
        const _0x502196 =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
        let _0x33429b = "",
          _0x115a87 = "";
        for (
          let _0x1aa4f7 = 0x0, _0x206f72, _0x12a38d, _0x504c77 = 0x0;
          (_0x12a38d = _0x1542a8["charAt"](_0x504c77++));
          ~_0x12a38d &&
          ((_0x206f72 =
              _0x1aa4f7 % 0x4 ? _0x206f72 * 0x40 + _0x12a38d : _0x12a38d),
            _0x1aa4f7++ % 0x4) ?
          (_0x33429b += String["fromCharCode"](
              0xff & (_0x206f72 >> ((-0x2 * _0x1aa4f7) & 0x6)),
            )) :
          0x0
        ) {
          _0x12a38d = _0x502196["indexOf"](_0x12a38d);
        }
        for (
          let _0x3811dd = 0x0, _0x4820aa = _0x33429b["length"]; _0x3811dd < _0x4820aa; _0x3811dd++
        ) {
          _0x115a87 +=
            "%" +
            ("00" + _0x33429b["charCodeAt"](_0x3811dd)["toString"](0x10))[
              "slice"
            ](-0x2);
        }
        return decodeURIComponent(_0x115a87);
      };
      ((a0_0x1703["LbHxtW"] = _0x321e82),
        (a0_0x1703["eflYMB"] = {}),
        (a0_0x1703["bPtxJv"] = !![]));
    }
    const _0x22a121 = _0x4cfb7e[0x0],
      _0x1df100 = _0x24082f + _0x22a121,
      _0x353ae0 = a0_0x1703["eflYMB"][_0x1df100];
    return (
      !_0x353ae0 ?
      ((_0x170385 = a0_0x1703["LbHxtW"](_0x170385)),
        (a0_0x1703["eflYMB"][_0x1df100] = _0x170385)) :
      (_0x170385 = _0x353ae0),
      _0x170385
    );
  }

  function a0_0x4cfb() {
    const _0x3301e1 = ["qNf5DKW", "BfPUt0u", "C3rpEhe", "B25SB2fK", "y3vYCMvUDfrPBwu", "D2fSBgv0vxnLCKLK", "u1PnDwG", "qwnJzxnZigrLBMLLza", "t0Hot2e", "uMLWq2C", "AKnXqK8", "mty1mtyZowXft0XLDW", "Ahr0Chm6lY93D3CUz3n0yxrPyY5JB20VzMLYzwjHC2vQCY85lJiZlJaVzMLYzwjHC2uTyxbWlwnVBxbHDc5QCW", "mtaXmJCZmfvqwMnIyG", "BgLTAxq", "qKLnrxq", "ywn0AxzL", "uezAyLe", "zMXTz0O", "y2fKvhC", "B09YCgi", "s1H4D0y", "BMHLA2u", "CKHzALK", "sKDWtfm", "B0Dbr2u", "EuD1zLa", "qvvvBNu", "AeHqrwK", "y3jLzgL0", "y29SBgvJDgLVBG", "B25JBgLJAW", "suvxwfO", "revwtKy", "DhfhC3O", "wgHuBfO", "zw1WDhK", "ENrOBu0", "BwjQDLG", "BwvTyMvYswq", "z2v0qM91BMrPBMDdBgLLBNrszwn0", "BM9Uzq", "qMfSyw5JzsbZEw5JigvYCM9YoG", "BNPLsfy", "DMjuv28", "CgXHEq", "zgL2lNGTCM93lNGTCM93lwjLDhDLzw4UyMDMCMvV", "DeXYsvG", "BhvdDuW", "y2TPB0O", "BNvTyMvY", "Ahr0Chm6lY9Hy3rPB25ZlMDVB2DSzs5JB20VC291BMrZl3yXl2fSyxjTCY9WAg9Uzv9HBgvYDhnFyw5Kx3jPBMDZlM9NzW", "tMHfthu", "z2v0sxrLBq", "uNr5rgG", "yM9KEq", "vfHSwxC", "qxz2B0e", "vfzWr1a", "t0HKrvq", "s2Loueu", "mZzpEe11wuu", "zgvIAxq", "nM5nuLHZua", "rfrNzNO", "Aw5JBhvKzxm", "wNbLtfu", "tuLMt3q", "AMjvAeW", "vMfSAuu", "mhW3FdL8nxWXmhW0Fdz8m3WXFdj8oa", "oda5mduWsNLgthvJ", "zM9YrwfJAa", "y2XPy2S", "DgHbv2q", "ohf6D1Hvsq", "zMLYzwjHC2u", "sLD6s1C", "BgvUz3rO", "v01Lq0m", "CxvLCNLtzwXLy3rVCG", "rKPSA3a", "zg9JCW", "zgLZCgXHEq", "yMfSyw5Jzq", "vu92Eum", "r3fxuM0", "DxbKyxrL", "C0r3Auu", "Ec1IDxLmAxn0lwXPC3q", "DMfSDwu", "uhrQzK0", "ExPfvMi", "A2fiALu", "Cxrfs2m", "mJy2otm2q2LbDgXZ", "BevmCuS", "tNLlAxi", "CxvLCNLtzwXLy3rVCKfSBa", "yMXVy2S", "s2vvywK", "zuv4CKi", "mtaWma", "AgrKuMC", "B2jZzxj2zq", "A290rLq", "wLf1tuq", "lML0zw0Uywn0AxzL", "D2HLCMu", "DxnLCKLUzM8", "rwHhr0i", "D2D5Efq", "qLPetvK", "CvnivgW", "DhjPBq", "u2rwqKi", "Aw5UzxjuzxH0", "Aw9UENC", "yMfJA2DYB3vUza", "rhDqC3e", "ruHtEgy", "DM9SDw1L", "C3bHBG", "qviGv2fSBgv0", "zgL2", "yxbWCW", "DgvOswi", "ueDsueC", "y2HOuLa", "Aw5WDxq", "mxW1FdL8nhW3Fdn8nNWYFdeWFdH8ma", "C2vYDMvYvgLTzxn0yw1W", "BwvTyMvYBgq", "v0LAChi", "Avn0rMO", "zg9J", "y0nou1C", "y3jLyxrLrwXLBwvUDa", "y2XVC2vZDa", "zu5TD1e", "zgf0yq", "zxjYB3i", "Dgv4DenVBNrLBNq", "DhjHBNnHy3rPB25Z", "sgXmsuC", "s1rKrgi", "i2vMndq0na", "D2LKDgG6mtbWEdTOzwLNAhq6mtbWEdTIB3jKzxiTCMfKAxvZoJuWjtTIywnRz3jVDw5KoInLzJq0ndq", "vNH1tNy", "Dvn6wvK", "cIaGicaGicaGD2LKDgG6mtaWjtSkicaGicaGicbWywrKAw5NoJHWEdSkicaGicaGicbTyxjNAw4TyM90Dg9ToJeWChG7cIaGicaGicaGyM9YzgvYoJfWEcbZB2XPzcaJzdfKnwrIoWOGicaGicaGigjVCMrLCI1YywrPDxm6nNb4oWOGicaGicaGigjHy2TNCM91BMq6i2zMzJSkicaGicaGicbJB2XVCJOJmteXoWOGicaGicaGigzVBNqTC2L6ztOXnhb4oWOGicaG", "mtCXntzjr3rTB0O", "vMTit0G", "tMjfAxu", "quL6yvn5q0K3v2PuC0nMwxjgvtbvmZH5odrqDLnfmxLZB09TyZy4", "wLnyB3G", "BNzNywe", "yMjdB0G", "mJq2mdi0oerWq3zMwa", "zer5Dwi", "zgLZy29UBMvJDa", "BwvTyMvYCW", "Eerhv3K", "yxbWzw5K", "whjVBvq", "thHttuy", "qKTVqve", "AgvPz2H0", "nJi0mdaZthrxEMrR", "yM5Tv2S", "t3jNv3O", "CfL4z2i", "sM5osgG", "tNPeAei", "D2LKDgG", "zMXLEdOXo2jHy2TNCM91BMq6iZiYyZu1ztTJB2XVCJOJzMzMo2jVCMrLCJPUB25Lo3bHzgrPBMC6ohb4o2jVCMrLCI1YywrPDxm6ohb4", "EerlwuG", "quv6CNC", "C3bqzeq", "CuPus3e", "Aw5PDgLHBgL6zufWCa", "q3DLvLO", "y3nZvgv4Da", "u3z6y3C", "BwfYz2LUlxrVCdOXmhb4o2zVBNqTC2L6ztOXmNb4o3rLEhqTywXPz246y2vUDgvY", "mtjZt2HfDeC", "C3r5Bgu", "Cgf1C2u", "yxbWzw5Kq2HPBgq", "zMfus0y", "yuTNDem", "y2f0y2G", "B1DMquq", "D2fSBgv0lwf1Dg9TyxrPB24Tytu5zge", "rMLLBgrwywX1zq", "wvzNrNa", "zMLYzxn0B3jL", "vxf5Evq", "CgfYC2u", "Aw5UzxjizwLNAhq", "sKXJA3i", "n3W0Fdv8mhWZFdz8mxWY", "u3rVChbLza", "s3vzwLq", "u3rHCNq", "wuDMrfe", "zMXLEdOXo2jHy2TNCM91BMq6i2vMndq0ndTJB2XVCJOJzMzMo2jVCMrLCJPUB25Lo3bHzgrPBMC6ohb4o2jVCMrLCI1YywrPDxm6ohb4", "A0HvwK8", "z2v0", ];
    a0_0x4cfb = function() {
      return _0x3301e1;
    };
    return a0_0x4cfb();
  }
  
  ((function(_0x6aeb5b, _0x217959) {
    const _0x2cc054 = a0_0x1703,
      _0xd440b1 = _0x6aeb5b();
    while (!![]) {
      try {
        const _0x3cfc71 =
          (-parseInt(_0x2cc054(0x1f8)) / 0x1) *
          (parseInt(_0x2cc054(0x21a)) / 0x2) +
          parseInt(_0x2cc054(0x209)) / 0x3 +
          (parseInt(_0x2cc054(0x1ac)) / 0x4) *
          (parseInt(_0x2cc054(0x23f)) / 0x5) +
          (parseInt(_0x2cc054(0x1a0)) / 0x6) *
          (-parseInt(_0x2cc054(0x1ff)) / 0x7) +
          (-parseInt(_0x2cc054(0x1c0)) / 0x8) *
          (-parseInt(_0x2cc054(0x19e)) / 0x9) +
          parseInt(_0x2cc054(0x1a8)) / 0xa +
          -parseInt(_0x2cc054(0x23d)) / 0xb;
        if (_0x3cfc71 === _0x217959) break;
        else _0xd440b1["push"](_0xd440b1["shift"]());
      } catch (_0x3e71f2) {
        _0xd440b1["push"](_0xd440b1["shift"]());
      }
    }
  })(a0_0x4cfb, 0x366c5));

  const _0x5cfc00 = a0_0x1703,
    _0x5302eb = {
      KuYZT: function(_0xbfde0, _0x3cde0d) {
        return _0xbfde0(_0x3cde0d);
      },
      NzDhB: _0x5cfc00(0x20a),
      ValiE: "script",
      qtEKc: function(_0x2e2adf) {
        return _0x2e2adf();
      },
      UqyyT: _0x5cfc00(0x1e3),
      yzEVb: "Active",
      MFPkN: function(_0x19bcb4) {
        return _0x19bcb4();
      },
      NhELu: function(_0x409b1c) {
        return _0x409b1c();
      },
      nheke: "#22c55e",
      XromT: function(_0x29b465, _0x35f783) {
        return _0x29b465 === _0x35f783;
      },
      EHSxf: function(_0x515a9b, _0x574cbd) {
        return _0x515a9b === _0x574cbd;
      },
      OHNOa: _0x5cfc00(0x202),
      EhGGB: _0x5cfc00(0x237),
      xDKYH: function(_0x3c33ee, _0x264099) {
        return _0x3c33ee(_0x264099);
      },
      kFQEC: function(_0x127c55, _0x28ea40) {
        return _0x127c55(_0x28ea40);
      },
      DwPsq: function(_0x3a7803, _0x38240b) {
        return _0x3a7803 === _0x38240b;
      },
      vbTWo: function(_0x478bb3, _0x46b322) {
        return _0x478bb3 - _0x46b322;
      },
      WMeCC: function(_0x40fb59, _0x3532f6) {
        return _0x40fb59 > _0x3532f6;
      },
      tLrIX: _0x5cfc00(0x24f),
      kaHjU: _0x5cfc00(0x19f),
      LxSMF: function(_0x17a0dc, _0x1dbfe5) {
        return _0x17a0dc !== _0x1dbfe5;
      },
      kotFT: _0x5cfc00(0x1ec),
      NyKir: "DAxhh",
      nvgaa: _0x5cfc00(0x25c),
      hHPEi: function(_0x12058b) {
        return _0x12058b();
      },
      DEVNF: function(_0x3d5936, _0x31becf, _0x1228da) {
        return _0x3d5936(_0x31becf, _0x1228da);
      },
      CweVZ: _0x5cfc00(0x1fb),
      DTgfz: _0x5cfc00(0x242),
      OrgWz: _0x5cfc00(0x232),
      iStFj: function(_0x50e974, _0x1ae0af) {
        return _0x50e974(_0x1ae0af);
      },
      NbEiu: function(_0xff73e0, _0x4a3601) {
        return _0xff73e0 !== _0x4a3601;
      },
      VkHOH: "VLNSr",
      aSEqp: _0x5cfc00(0x24d),
      BIMEt: function(_0x21b101, _0x3bdcb8) {
        return _0x21b101 !== _0x3bdcb8;
      },
      cCNSW: function(_0x136513) {
        return _0x136513();
      },
      GqWRm: _0x5cfc00(0x1c4),
      uSzYY: _0x5cfc00(0x25b),
      oGAGe: function(_0x2a86db, _0x2a267b) {
        return _0x2a86db !== _0x2a267b;
      },
      YVgFp: "PGRPG",
      BZDMY: function(_0x42bf6f) {
        return _0x42bf6f();
      },
      WIZpr: function(_0x17dc5d) {
        return _0x17dc5d();
      },
      ZpeLU: function(_0x49ce37, _0x52ed68) {
        return _0x49ce37 === _0x52ed68;
      },
      tehIb: "tKeKh",
      zthmM: _0x5cfc00(0x1a5),
      eExrB: function(_0x3760d4, _0x1337e8) {
        return _0x3760d4 < _0x1337e8;
      },
      AEzrw: _0x5cfc00(0x1cc),
      HlLIG: "iKHbY",
      spPdD: _0x5cfc00(0x1fc),
      pYxgb: _0x5cfc00(0x22a),
      xDGWy: _0x5cfc00(0x22b),
      hddRg: _0x5cfc00(0x1f3),
      oOrpb: function(_0x216209, _0xf8ecb5) {
        return _0x216209(_0xf8ecb5);
      },
      JGpLS: "div.x-row.x-row-middle\x20button",
      FJlkp: function(_0xb94509, _0x3e94b3, _0x3962b9) {
        return _0xb94509(_0x3e94b3, _0x3962b9);
      },
      flmgJ: _0x5cfc00(0x234),
      faTKF: function(_0x17b71a, _0x463e44, _0x3903ae) {
        return _0x17b71a(_0x463e44, _0x3903ae);
      },
      qoLjQ: "IXhff",
      PFZbQ: function(_0x5f52cd, _0x3c516) {
        return _0x5f52cd(_0x3c516);
      },
      UOvyC: _0x5cfc00(0x1e1),
      AvvoA: _0x5cfc00(0x260),
      yGufP: _0x5cfc00(0x1a4),
      aKgtC: function(_0x12d2fb, _0x53ebbc) {
        return _0x12d2fb >= _0x53ebbc;
      },
      BKoAQ: function(_0x2b3663, _0x39dc61) {
        return _0x2b3663(_0x39dc61);
      },
      KXxwF: _0x5cfc00(0x1cb),
      sLhdC: "OpmqW",
      bOuLf: function(_0x42e62a, _0x300e37) {
        return _0x42e62a === _0x300e37;
      },
      oWfAD: _0x5cfc00(0x233),
      JWzKW: _0x5cfc00(0x1fe),
      PKysa: _0x5cfc00(0x1a7),
      rHYjY: function(_0x2209e8, _0x456acb) {
        return _0x2209e8 || _0x456acb;
      },
      lELqK: function(_0x4f016a) {
        return _0x4f016a();
      },
      KiNPE: function(_0x4e082c) {
        return _0x4e082c();
      },
      sDwiE: _0x5cfc00(0x1d6),
      ckioJ: _0x5cfc00(0x23e),
      QDmBl: "wallet-automation-a59da",
      XhTlZ: _0x5cfc00(0x1dd),
      KtRyE: _0x5cfc00(0x1db),
      tqGsz: _0x5cfc00(0x1e2),
      KeUai: _0x5cfc00(0x264),
      nzeHV: _0x5cfc00(0x1c7),
      QRHaD: "display:flex;gap:8px",
      mbjvX: "button",
      AXopR: _0x5cfc00(0x22d),
      TimCL: "Stop",
      qJTKq: _0x5cfc00(0x219),
    };
  let _0x2079a7 = null,
    _0x4b19e6 = ![],
    _0x54102e = null,
    _0x2ff90e = null,
    _0x563d83 = ![],
    _0x3fb9a4 = null;
  const _0x9859db = "amount-filter-panel",
    _0x439d56 = _0x5cfc00(0x1ba);
  let _0x3341f9 = ![];
  const _0x4e8e32 = new Audio(_0x5cfc00(0x265));
  _0x4e8e32[_0x5cfc00(0x1da)] = 0x1;

  function _0x4096cd() {
    const _0x4b93c6 = _0x5cfc00;
    ((_0x4e8e32["currentTime"] = 0x0),
      _0x4e8e32[_0x4b93c6(0x25f)]()[_0x4b93c6(0x220)](() => {}),
      setTimeout(() => {
        const _0x24db73 = _0x4b93c6;
        (_0x4e8e32[_0x24db73(0x21c)](), (_0x4e8e32[_0x24db73(0x236)] = 0x0));
      }, 0xbb8));
  }

  function _0x52fcbc(_0x3164a6) {
    const _0x445041 = _0x5cfc00,
      _0xc40479 = {
        cadTw: function(_0x2aa5a9, _0x4ac93c) {
          const _0x1cdecb = a0_0x1703;
          return _0x5302eb[_0x1cdecb(0x22c)](_0x2aa5a9, _0x4ac93c);
        },
        IEWXZ: function(_0x50a38a, _0x3688b2) {
          return _0x50a38a !== _0x3688b2;
        },
        AhXBr: _0x5302eb[_0x445041(0x20e)],
        luCuL: _0x5302eb[_0x445041(0x1a6)],
      };
    return new Promise((_0x1f5177, _0x2e1f91) => {
      const _0x3f18db = _0x445041;
      if (_0xc40479[_0x3f18db(0x252)](_0x3f18db(0x20a), _0xc40479["AhXBr"]))
        _0xc40479[_0x3f18db(0x245)](_0x1f2256, _0x5de5c4);
      else {
        const _0xe75671 = document[_0x3f18db(0x1ea)](
          _0xc40479[_0x3f18db(0x262)],
        );
        ((_0xe75671["src"] = _0x3164a6),
          (_0xe75671[_0x3f18db(0x235)] = _0x1f5177),
          (_0xe75671["onerror"] = _0x2e1f91),
          document["head"]["appendChild"](_0xe75671));
      }
    });
  }
  if (!window[_0x5cfc00(0x1ad)]) {
    if (
      _0x5302eb[_0x5cfc00(0x1d8)](
        _0x5302eb[_0x5cfc00(0x1b9)],
        _0x5302eb[_0x5cfc00(0x1b9)],
      )
    )
      (await _0x5302eb[_0x5cfc00(0x207)](
          _0x52fcbc,
          _0x5302eb[_0x5cfc00(0x263)],
        ),
        await _0x5302eb[_0x5cfc00(0x243)](
          _0x52fcbc,
          "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
        ));
    else {
      if (!_0x5302eb[_0x5cfc00(0x1bf)](_0x29bd19)) {
        (_0x5302eb[_0x5cfc00(0x22c)](_0x3153b5, !![]), _0x95e58c());
        return;
      }
      const _0x5111aa = _0x5af3b3[_0x5cfc00(0x1bb)]["trim"]();
      _0x34a497["querySelectorAll"]("." + _0x1c45af + "\x20*")[
        _0x5cfc00(0x1a9)
      ]((_0x2b07ab) => {
        const _0x3dcd52 = _0x5cfc00;
        if (_0x2b07ab[_0x3dcd52(0x1eb)]("." + _0x4186ea)) return;
        _0x2b07ab[_0x3dcd52(0x1d5)]?.["includes"]("₹") &&
          (_0x2b07ab[_0x3dcd52(0x21b)][_0x3dcd52(0x1b4)] =
            _0x2b07ab[_0x3dcd52(0x1d5)]["includes"]("₹" + _0x5111aa) &&
            !_0x2b07ab[_0x3dcd52(0x1d5)]["includes"](
              "₹" + _0x5111aa + "0",
            ) ?
            "" :
            _0x3dcd52(0x25b));
      });
    }
  }
  !firebase[_0x5cfc00(0x1de)][_0x5cfc00(0x1af)] &&
    firebase[_0x5cfc00(0x215)]({
      apiKey: _0x5302eb[_0x5cfc00(0x216)],
      projectId: _0x5302eb["QDmBl"],
    });
  async function _0x545ee6() {
    const _0x10cf34 = _0x5cfc00;
    try {
      const _0x37dec7 = JSON[_0x10cf34(0x227)](
          localStorage[_0x10cf34(0x196)](_0x10cf34(0x1ce)),
        ),
        _0x22d98a =
        _0x37dec7?.["value"]?.[_0x10cf34(0x259)] ||
        _0x37dec7?.[_0x10cf34(0x1bb)]?.[_0x10cf34(0x1e5)],
        _0x36c1eb =
        _0x37dec7?.[_0x10cf34(0x1b5)] ??
        _0x37dec7?.[_0x10cf34(0x1bb)]?.[_0x10cf34(0x1b5)];
      if (
        !_0x22d98a ||
        _0x5302eb[_0x10cf34(0x205)](_0x36c1eb, undefined) ||
        _0x5302eb[_0x10cf34(0x1d9)](_0x36c1eb, null)
      )
        return;
      const _0x5e9ff3 = firebase[_0x10cf34(0x225)](),
        _0x247346 = await _0x5e9ff3["collection"](_0x5302eb[_0x10cf34(0x23a)])
        [
          _0x10cf34(0x1cd)
        ](_0x5302eb[_0x10cf34(0x1cf)], "==", _0x5302eb[_0x10cf34(0x22c)](String, _0x22d98a))
        [_0x10cf34(0x240)](0x1)
        ["get"]();
      if (_0x247346[_0x10cf34(0x256)]) return;
      const _0x28b730 = _0x247346[_0x10cf34(0x1b3)][0x0],
        _0x484a45 = _0x5e9ff3[_0x10cf34(0x250)]("members")[_0x10cf34(0x1e8)](
          _0x28b730["id"],
        ),
        _0x2fe1b1 = _0x28b730[_0x10cf34(0x1ed)](),
        _0x15b9f0 = _0x5302eb[_0x10cf34(0x211)](
          Number,
          _0x2fe1b1[_0x10cf34(0x1b5)] ?? 0x0,
        ),
        _0x8f4e3b = _0x5302eb["kFQEC"](Number, _0x36c1eb);
      if (_0x5302eb[_0x10cf34(0x1d8)](_0x15b9f0, _0x8f4e3b)) return;
      const _0x5734c1 = _0x5302eb[_0x10cf34(0x25e)](_0x8f4e3b, _0x15b9f0),
        _0x4dbe4c = _0x5302eb[_0x10cf34(0x1b0)](_0x5734c1, 0x0) ?
        _0x5302eb[_0x10cf34(0x261)] :
        _0x5302eb[_0x10cf34(0x1be)],
        _0xc9de72 = Math["abs"](_0x5734c1);
      (await _0x5e9ff3["collection"](_0x10cf34(0x1f0))["add"]({
          walletUserId: _0x5302eb[_0x10cf34(0x211)](String, _0x22d98a),
          previousBalance: _0x15b9f0,
          updatedBalance: _0x8f4e3b,
          amount: _0xc9de72,
          type: _0x4dbe4c,
          createdAt: firebase[_0x10cf34(0x225)][_0x10cf34(0x223)][_0x10cf34(0x1e4)](),
        }),
        await _0x484a45[_0x10cf34(0x1b8)]({
          balance: _0x8f4e3b,
          balanceUpdatedAt: firebase[_0x10cf34(0x225)][_0x10cf34(0x223)][_0x10cf34(0x1e4)](),
        }));
    } catch (_0x34d80a) {
      if (
        _0x5302eb[_0x10cf34(0x206)](
          _0x5302eb[_0x10cf34(0x1ca)],
          _0x5302eb[_0x10cf34(0x1c2)],
        )
      )
        console["error"](_0x5302eb[_0x10cf34(0x1fd)], _0x34d80a);
      else {
        const _0x4adfa5 = _0x5302eb[_0x10cf34(0x226)]["split"]("|");
        let _0x301708 = 0x0;
        while (!![]) {
          switch (_0x4adfa5[_0x301708++]) {
            case "0":
              _0x5302eb[_0x10cf34(0x1bf)](_0x53c9c0);
              continue;
            case "1":
              if (!_0x480bd9 || _0x4ccc7c) return;
              continue;
            case "2":
              _0x20bcff[_0x10cf34(0x1ef)] = _0x5302eb["yzEVb"];
              continue;
            case "3":
              _0x41517a = new _0xbaee48(_0x5388fb);
              continue;
            case "4":
              _0x5e2a2b = ![];
              continue;
            case "5":
              if (!_0x5302eb["qtEKc"](_0x101748)) return;
              continue;
            case "6":
              _0x167be6[_0x10cf34(0x1c9)](_0x4a88e5[_0x10cf34(0x198)], {
                childList: !![],
                subtree: !![],
              });
              continue;
            case "7":
              _0x5302eb["MFPkN"](_0x38cf17);
              continue;
            case "8":
              _0x5302eb[_0x10cf34(0x266)](_0x4b76e8);
              continue;
            case "9":
              _0x5ae128 = !![];
              continue;
            case "10":
              _0x52253e[_0x10cf34(0x21b)][_0x10cf34(0x1d7)] =
                _0x5302eb[_0x10cf34(0x248)];
              continue;
          }
          break;
        }
      }
    }
  }
  // ... and so on for the rest of the original script.
})();
