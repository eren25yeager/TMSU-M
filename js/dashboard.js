// ==========================================
// ⚙️ إعدادات النظام
// ==========================================
// ⚠️ تأكد من استبدال الرابط أدناه برابط السكربت الجديد الخاص بك بعد التحديث
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMLzvKE92wJDrEgb5QrW_2vDVJ2JcYyWNNSFDIJABWfWcTjTwbTCpHPQdVJQdxCaXt/exec';

const DEFAULT_ACCOUNTS = {
    "2252004": "أحمد عبدالسلام",
    "31102002": "محمد الشافعي",
    "162006": "رامز وائل"
};

let ADMIN_ACCOUNTS = JSON.parse(localStorage.getItem('saved_admin_accounts')) || DEFAULT_ACCOUNTS;
let isEditMode = false;
let currentEditKey = null;

// ==========================================
// 🚀 التهيئة
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if(sessionStorage.getItem('isLoggedIn') === 'true') {
        const userName = sessionStorage.getItem('adminName') || 'أدمن';
        const nameDisplay = document.getElementById('adminNameDisplay');
        if(nameDisplay) nameDisplay.innerText = userName;

        document.getElementById('loginScreen').style.display = 'none';
        const app = document.getElementById('appContainer');
        app.style.display = 'flex';
        app.classList.add('dashboard-enter');

        loadAllData();
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    const savedTheme = localStorage.getItem('adminTheme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    setInterval(updateClock, 1000);
    updateClock();

    setupForms();

    document.getElementById('passwordInput')?.addEventListener('input', function() {
        document.querySelector('.login-panel').classList.remove('login-error');
    });
});

// ==========================================
// 🔍 وظيفة البحث السريع
// ==========================================
window.handleGlobalSearch = function(query) {
    query = query.toLowerCase().trim();
    const gridIds = ['manageNewsGrid', 'manageStarsGrid', 'managePartnersGrid', 'manageTeamGrid'];
    gridIds.forEach(gridId => {
        const grid = document.getElementById(gridId);
        if(grid) {
            const cards = grid.querySelectorAll('.manage-card');
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? 'flex' : 'none';
            });
        }
    });
};

// ==========================================
// 📋 سجل النشاطات (Activity Logs)
// ==========================================
async function loadActivityLogs() {
    const container = document.getElementById('logsList');
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fas fa-circle-notch fa-spin"></i> جاري تحميل السجل...</div>';

    try {
        const response = await fetch(`${SCRIPT_URL}?sheet=Logs`);
        const data = await response.json();
        const safeLogs = Array.isArray(data) ? data.reverse() : []; 

        if (safeLogs.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد نشاطات مسجلة بعد</div>`;
            return;
        }

        container.innerHTML = '';
        safeLogs.forEach(log => {
            let icon = 'fa-plus';
            let typeClass = 'add';
            let actionText = 'إضافة';
            
            if(log.Action === 'Delete') { icon = 'fa-trash-alt'; typeClass = 'delete'; actionText = 'حذف'; }
            if(log.Action === 'Edit') { icon = 'fa-pen'; typeClass = 'edit'; actionText = 'تعديل'; }

            const dateStr = new Date(log.Date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

            const html = `
            <div class="log-card ${typeClass}">
                <div class="log-info">
                    <div class="log-icon"><i class="fas ${icon}"></i></div>
                    <div class="log-details">
                        <h4>${log.Details}</h4>
                        <p>${actionText} • ${dateStr}</p>
                    </div>
                </div>
                <div class="log-meta">
                    <span class="log-admin"><i class="fas fa-user-circle"></i> ${log.Admin}</span>
                </div>
            </div>`;
            container.innerHTML += html;
        });

    } catch (e) {
        container.innerHTML = `<div style="text-align:center; color:#e74c3c;">فشل تحميل السجل. يرجى المحاولة لاحقاً.</div>`;
    }
}

// ==========================================
// 🔐 إدارة الحسابات والدخول
// ==========================================
window.attemptLogin = function() {
    const input = document.getElementById('passwordInput');
    const btn = document.querySelector('.cyber-button');
    if(btn.disabled) return;

    Swal.close();
    const loginPanel = document.querySelector('.login-panel');
    loginPanel.classList.remove('login-error');

    let originalText = btn.innerHTML;
    if(originalText.includes('fa-spin')) originalText = '<span>تسجيل الدخول</span><i class="fas fa-arrow-left"></i>';
    
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري التحقق...';
    btn.style.opacity = '0.8';
    btn.disabled = true;
    input.disabled = true;
    
    setTimeout(() => {
        const enteredPass = input.value;
        ADMIN_ACCOUNTS = JSON.parse(localStorage.getItem('saved_admin_accounts')) || DEFAULT_ACCOUNTS;

        if (ADMIN_ACCOUNTS[enteredPass]) {
            Swal.close();
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('adminName', ADMIN_ACCOUNTS[enteredPass]);
            sessionStorage.setItem('currentSessionPass', enteredPass);
            
            const screen = document.getElementById('loginScreen');
            screen.style.transition = 'all 0.5s ease';
            screen.style.opacity = '0';
            screen.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                showDashboard();
                loadAllData();
                const nameDisplay = document.getElementById('adminNameDisplay');
                if(nameDisplay) nameDisplay.innerText = ADMIN_ACCOUNTS[enteredPass];
                
                btn.disabled = false;
                input.disabled = false;
                btn.style.opacity = '1';
                btn.innerHTML = originalText;
                loginPanel.classList.remove('login-error');
            }, 500);
        } else {
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            input.disabled = false;
            input.focus();
            loginPanel.classList.add('login-error');
            setTimeout(() => loginPanel.classList.remove('login-error'), 500);
            Swal.fire({ icon: 'error', title: 'خطأ', text: 'رمز الدخول غير صحيح' });
        }
    }, 600);
};

function showDashboard() {
    const login = document.getElementById('loginScreen');
    const app = document.getElementById('appContainer');
    login.style.display = 'none';
    app.style.display = 'flex';
    app.classList.remove('dashboard-exit');
    app.classList.add('dashboard-enter');
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    Swal.fire({ icon: 'info', title: 'جاري تسجيل الخروج...', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
    const app = document.getElementById('appContainer');
    app.classList.remove('dashboard-enter');
    app.classList.add('dashboard-exit');
    setTimeout(() => {
        sessionStorage.clear();
        window.location.reload();
    }, 800);
});

document.getElementById('changePasswordForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const currentPassInput = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;
    const loggedInPass = sessionStorage.getItem('currentSessionPass');
    const loggedInUser = sessionStorage.getItem('adminName');

    if (currentPassInput !== loggedInPass) { Swal.fire('خطأ', 'كلمة المرور الحالية غير صحيحة!', 'error'); return; }
    if (newPass !== confirmPass) { Swal.fire('خطأ', 'كلمة المرور الجديدة غير متطابقة!', 'error'); return; }
    if (newPass.length < 4) { Swal.fire('تنبيه', 'كلمة المرور يجب أن تكون 4 أحرف/أرقام على الأقل.', 'warning'); return; }

    Swal.fire({
        title: 'تأكيد التغيير؟', text: "سيتم تسجيل الخروج بعد التغيير.", icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#00d2d3', confirmButtonText: 'نعم', cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            delete ADMIN_ACCOUNTS[loggedInPass];
            ADMIN_ACCOUNTS[newPass] = loggedInUser;
            localStorage.setItem('saved_admin_accounts', JSON.stringify(ADMIN_ACCOUNTS));
            Swal.fire('تم!', 'تم تحديث كلمة المرور.', 'success').then(() => document.getElementById('logoutBtn').click());
        }
    });
});

// ==========================================
// 📡 دوال الاتصال بالسيرفر
// ==========================================
async function loadAllData() {
    try {
        const [newsRes, starsRes, partnersRes, teamRes] = await Promise.all([
            fetch(`${SCRIPT_URL}?sheet=News`),
            fetch(`${SCRIPT_URL}?sheet=Stars`),
            fetch(`${SCRIPT_URL}?sheet=Partners`),
            fetch(`${SCRIPT_URL}?sheet=Team`)
        ]);
        const newsData = await newsRes.json();
        const starsData = await starsRes.json();
        const partnersData = await partnersRes.json();
        const teamData = await teamRes.json();

        window.allData = {
            News: Array.isArray(newsData) ? newsData.reverse() : [],
            Stars: Array.isArray(starsData) ? starsData.reverse() : [],
            Partners: Array.isArray(partnersData) ? partnersData.reverse() : [],
            Team: Array.isArray(teamData) ? teamData : [] // الفريق لا نعكسه لأنه يعتمد على الترتيب
        };

        renderManageList('manageNewsGrid', window.allData.News, 'News', 'Title', 'Date');
        renderManageList('manageStarsGrid', window.allData.Stars, 'Stars', 'Name', 'Committee');
        renderManageList('managePartnersGrid', window.allData.Partners, 'Partners', 'Name', 'Link');
        renderManageList('manageTeamGrid', window.allData.Team, 'Team', 'Name', 'Role');

        animateVal(document.getElementById('newsCount'), 0, window.allData.News.length, 1000);
        animateVal(document.getElementById('starsCount'), 0, window.allData.Stars.length, 1000);
        animateVal(document.getElementById('partnersCount'), 0, window.allData.Partners.length, 1000);
        animateVal(document.getElementById('teamCount'), 0, window.allData.Team.length, 1000);
        
    } catch (e) { console.error("Error loading data:", e); }
}

window.startEdit = function(sheetName, key) {
    const item = window.allData[sheetName].find(i => (i.Title === key || i.Name === key));
    if(!item) return;

    let formId = '';
    if(sheetName === 'News') formId = 'newsForm';
    else if(sheetName === 'Stars') formId = 'starsForm';
    else if(sheetName === 'Partners') formId = 'partnersForm';
    else if(sheetName === 'Team') formId = 'teamForm';

    const form = document.getElementById(formId);
    
    if(sheetName === 'News') {
        document.getElementById('newsTitle').value = item.Title;
        document.getElementById('newsDate').value = item.Date;
        document.getElementById('newsLink').value = item.Link;
        document.getElementById('newsContent').value = item.Content;
    } else if (sheetName === 'Stars') {
        document.getElementById('starName').value = item.Name;
        document.getElementById('starCommittee').value = item.Committee;
    } else if (sheetName === 'Partners') {
        document.getElementById('partnerName').value = item.Name;
        document.getElementById('partnerLink').value = item.Link;
    } else if (sheetName === 'Team') {
        document.getElementById('teamName').value = item.Name;
        document.getElementById('teamRole').value = item.Role;
        document.getElementById('teamCommittee').value = item.Committee;
        document.getElementById('teamQuote').value = item.Quote || '';
        document.getElementById('teamFB').value = item.Facebook || '';
        document.getElementById('teamInsta').value = item.Instagram || '';
        document.getElementById('teamLinkedIn').value = item.LinkedIn || '';
    }

    isEditMode = true;
    currentEditKey = key;
    
    const btn = form.querySelector('.submit-btn');
    btn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';
    btn.style.background = '#3498db';
    
    if(!form.querySelector('.cancel-edit-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'submit-btn cancel-edit-btn';
        cancelBtn.innerHTML = 'إلغاء';
        cancelBtn.onclick = () => resetFormState(formId);
        form.appendChild(cancelBtn);
    }
    form.scrollIntoView({ behavior: 'smooth' });
    form.classList.add('form-editing');
    Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'وضع التعديل', showConfirmButton: false, timer: 3000 });
};

function resetFormState(formId) {
    const form = document.getElementById(formId);
    form.reset();
    form.classList.remove('form-editing');
    const btn = form.querySelector('.submit-btn:not(.cancel-edit-btn)');
    
    let btnText = 'نشر الخبر';
    if(formId.includes('star')) btnText = 'إضافة النجم';
    if(formId.includes('partner')) btnText = 'حفظ الشريك';
    if(formId.includes('team')) btnText = 'إضافة العضو';

    btn.innerHTML = btnText;
    btn.style.background = ''; 
    const cancelBtn = form.querySelector('.cancel-edit-btn');
    if(cancelBtn) cancelBtn.remove();
    isEditMode = false;
    currentEditKey = null;
}

async function handleFormSubmit(event, formId, sheetName) {
    event.preventDefault();
    const form = document.getElementById(formId);
    const fileInput = form.querySelector('input[type="file"]');
    if (!isEditMode && !fileInput.files[0]) { Swal.fire('تنبيه', 'يرجى اختيار صورة.', 'warning'); return; }

    const loader = document.getElementById('loader');
    loader.classList.add('active');

    try {
        const getBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });

        let base64Data = null, mimeType = null, fileName = null;
        if (fileInput.files[0]) {
            base64Data = await getBase64(fileInput.files[0]);
            mimeType = fileInput.files[0].type;
            fileName = fileInput.files[0].name;
        }

        const payload = new URLSearchParams();
        payload.append('action', isEditMode ? 'edit' : 'add');
        payload.append('sheet', sheetName);
        payload.append('adminName', sessionStorage.getItem('adminName') || 'Unknown');
        
        if (isEditMode) payload.append('originalKey', currentEditKey);
        if (base64Data) {
            payload.append('imageData', base64Data);
            payload.append('mimeType', mimeType);
            payload.append('fileName', fileName);
        }

        if(formId === 'newsForm') {
            payload.append('Title', document.getElementById('newsTitle').value);
            payload.append('Date', document.getElementById('newsDate').value);
            payload.append('Link', document.getElementById('newsLink').value);
            payload.append('Content', document.getElementById('newsContent').value);
        } else if (formId === 'starsForm') {
            payload.append('Name', document.getElementById('starName').value);
            payload.append('Committee', document.getElementById('starCommittee').value);
        } else if (formId === 'partnersForm') {
            payload.append('Name', document.getElementById('partnerName').value);
            payload.append('Link', document.getElementById('partnerLink').value);
        } else if (formId === 'teamForm') {
            payload.append('Name', document.getElementById('teamName').value);
            payload.append('Role', document.getElementById('teamRole').value);
            payload.append('Committee', document.getElementById('teamCommittee').value);
            payload.append('Quote', document.getElementById('teamQuote').value);
            payload.append('Facebook', document.getElementById('teamFB').value);
            payload.append('Instagram', document.getElementById('teamInsta').value);
            payload.append('LinkedIn', document.getElementById('teamLinkedIn').value);
        }

        const response = await fetch(SCRIPT_URL, { method: 'POST', body: payload });
        const result = await response.json();
        loader.classList.remove('active');

        if(result.result === 'success') {
            Swal.fire({ icon: 'success', title: isEditMode ? 'تم التعديل!' : 'تم النشر!', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            resetFormState(formId);
            loadAllData();
        } else {
            throw new Error(result.msg || result.error);
        }
    } catch (error) {
        loader.classList.remove('active');
        Swal.fire('خطأ', error.message, 'error');
    }
}

window.deleteItem = async function(sheetName, key, btnElement) {
    const result = await Swal.fire({
        title: 'تأكيد الحذف؟', text: `سيتم حذف "${key}" نهائياً.`, icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'حذف', cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
        btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const formData = new URLSearchParams();
            formData.append('action', 'delete');
            formData.append('sheet', sheetName);
            formData.append('key', key);
            formData.append('adminName', sessionStorage.getItem('adminName') || 'Unknown');

            const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
            const data = await response.json();
            
            if(data.result === 'success') {
                loadAllData();
                Swal.fire('تم الحذف', '', 'success');
            } else { throw new Error('فشل الحذف'); }
        } catch (error) {
            Swal.fire('خطأ', error.message, 'error');
            loadAllData(); 
        }
    }
};

function setupForms() {
    const forms = [
        { id: 'newsForm', sheet: 'News' },
        { id: 'starsForm', sheet: 'Stars' },
        { id: 'partnersForm', sheet: 'Partners' },
        { id: 'teamForm', sheet: 'Team' } // إضافة فورم الفريق
    ];
    forms.forEach(item => {
        const el = document.getElementById(item.id);
        if(el) el.addEventListener('submit', (e) => handleFormSubmit(e, item.id, item.sheet));
    });
}

function renderManageList(containerId, data, sheetName, keyTitle, keySub) {
    const container = document.getElementById(containerId);
    if(!container) return;
    if(data.length === 0) { container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px; color:var(--text-muted);">لا توجد بيانات</div>`; return; }

    container.innerHTML = '';
    data.forEach(item => {
        const img = item.Image || 'images/logo.png';
        const keyValue = item[keyTitle]; 
        const html = `
        <div class="manage-card">
            <img src="${img}" class="manage-img" onerror="this.src='images/logo.png'">
            <div class="manage-info"><h4>${keyValue}</h4><span>${item[keySub] || ''}</span></div>
            <div class="card-actions">
                <button class="edit-btn" onclick="startEdit('${sheetName}', '${keyValue}')" title="تعديل"><i class="fas fa-pen"></i></button>
                <button class="delete-btn" onclick="deleteItem('${sheetName}', '${keyValue}', this)" title="حذف"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>`;
        container.innerHTML += html;
    });
}

function animateVal(obj, start, end, duration) {
    if(!obj) return;
    if(start === end) { obj.innerText = end; return; }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step); else obj.innerHTML = end;
    };
    window.requestAnimationFrame(step);
}

function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('liveTime');
    const ampmEl = document.getElementById('ampm');
    const dateEl = document.getElementById('liveDate');
    if(timeEl) {
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        hours = String(hours).padStart(2, '0');
        timeEl.innerText = `${hours}:${minutes}:${seconds}`;
        if(ampmEl) ampmEl.innerText = ampm;
    }
    if(dateEl) dateEl.innerText = now.toLocaleDateString('en-GB');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if(sidebar) sidebar.classList.toggle('active');
    if(overlay) overlay.classList.toggle('active');
}

window.switchTab = function(tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => { if(item.getAttribute('onclick').includes(tabId)) item.classList.add('active'); });
    
    if(['news', 'stars', 'partners', 'home', 'team'].includes(tabId)) loadAllData();
    if(tabId === 'logs') loadActivityLogs();

    if(window.innerWidth <= 768) toggleSidebar();
};

const themeBtn = document.getElementById('themeToggleBtn');
if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('adminTheme', newTheme);
    });
}