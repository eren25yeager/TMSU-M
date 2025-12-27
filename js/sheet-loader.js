// ⚠️ تأكد من أن هذا الرابط هو نفس الرابط المستخدم في Dashboard.js
const API_URL = 'https://script.google.com/macros/s/AKfycbyMLzvKE92wJDrEgb5QrW_2vDVJ2JcYyWNNSFDIJABWfWcTjTwbTCpHPQdVJQdxCaXt/exec';

document.addEventListener('DOMContentLoaded', () => {
    // عناصر الصفحة الرئيسية والفعاليات
    const newsGrid = document.querySelector('.news-grid');
    const eventsGrid = document.querySelector('.events-grid');
    const starsSection = document.querySelector('.monthly-stars-section');
    const partnersGrid = document.querySelector('.partners-grid');

    // عناصر صفحة عن الاتحاد (About)
    const highBoardContainer = document.getElementById('highBoardContainer');
    const committeesContainer = document.getElementById('committeesContainer');

    if (newsGrid || eventsGrid) loadNews(newsGrid, eventsGrid);
    if (starsSection) loadStars(starsSection);
    if (partnersGrid) loadPartners(partnersGrid);
    if (highBoardContainer || committeesContainer) loadTeam(highBoardContainer, committeesContainer);
});

// 🎨 تصميم جديد وعصري لحالة "لا يوجد بيانات"
function getEmptyStateHTML(icon, title, desc) {
    return `
    <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; animation: fadeInUp 0.8s ease;">
        <div style="
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            width: 110px; height: 110px; 
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; 
            margin: 0 auto 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 4px solid #fff;
        ">
            <i class="fas ${icon}" style="font-size: 3rem; color: #9ca3af;"></i>
        </div>
        <h3 style="color: #374151; margin-bottom: 12px; font-size: 1.6rem; font-weight: 800;">${title}</h3>
        <p style="color: #6b7280; font-size: 1.1rem; max-width: 400px; margin: 0 auto; line-height: 1.6;">${desc}</p>
    </div>`;
}

// ---------------------------------------------------------
// 1. دالة الأخبار والفعاليات
// ---------------------------------------------------------
function loadNews(newsGrid, eventsGrid) {
    const loaderHTML = '<div class="preloader" style="position:relative; background:transparent; height:200px; z-index:1; grid-column: 1/-1;"><div class="spinner"></div></div>';
    if(newsGrid) newsGrid.innerHTML = loaderHTML;
    if(eventsGrid) eventsGrid.innerHTML = loaderHTML;

    // إضافة وقت حالي للرابط لمنع الكاش
    fetch(`${API_URL}?sheet=News&t=${new Date().getTime()}`)
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data)) data = [];
        data.reverse();

        if (newsGrid) {
            newsGrid.innerHTML = '';
            if (data.length === 0) {
                newsGrid.innerHTML = getEmptyStateHTML('fa-newspaper', 'لا توجد أخبار حديثة', 'تابعنا قريباً، نعمل على تجهيز محتوى مميز لك.');
            } else {
                data.slice(0, 3).forEach((item, index) => {
                    const html = `
                    <div class="news-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="news-image">
                            <img src="${item.Image}" alt="${item.Title}" crossorigin="anonymous" onerror="this.src='images/logo.png'">
                        </div>
                        <div class="news-content">
                            <h3>${item.Title}</h3>
                            <p class="news-date"><i class="fas fa-calendar-alt"></i> ${item.Date}</p>
                            <a href="${item.Link}" target="_blank" class="news-link">
                                شاهد على فيسبوك <i class="fab fa-facebook-f"></i>
                            </a>
                        </div>
                    </div>`;
                    newsGrid.innerHTML += html;
                });
            }
        }

        if (eventsGrid) {
            eventsGrid.innerHTML = '';
            if (data.length === 0) {
                eventsGrid.innerHTML = getEmptyStateHTML('fa-calendar-day', 'جدول الفعاليات فارغ', 'ترقبوا الإعلان عن فعالياتنا القادمة قريباً.');
            } else {
                data.forEach((item, index) => {
                    const html = `
                    <div class="event-card" data-aos="fade-up" data-aos-delay="${index * 50}">
                        <div class="event-image">
                            <img src="${item.Image}" alt="${item.Title}" crossorigin="anonymous" onerror="this.src='images/logo.png'">
                        </div>
                        <div class="event-content">
                            <div class="event-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${item.Date}</span>
                            </div>
                            <h3>${item.Title}</h3>
                            <p>${item.Content}</p>
                            <a href="${item.Link}" target="_blank" class="read-more-btn">
                                التفاصيل <i class="fas fa-arrow-left"></i>
                            </a>
                        </div>
                    </div>`;
                    eventsGrid.innerHTML += html;
                });
            }
        }
        setTimeout(applyBlurEffect, 100);
    })
    .catch(err => {
        console.error(err);
        if(eventsGrid) eventsGrid.innerHTML = getEmptyStateHTML('fa-wifi', 'انقطع الاتصال', 'يرجى التحقق من الإنترنت وإعادة المحاولة.');
    });
}

// ---------------------------------------------------------
// 2. دالة النجوم
// ---------------------------------------------------------
function loadStars(container) {
    container.innerHTML = '<div class="preloader" style="position:relative; background:transparent; height:200px; z-index:1;"><div class="spinner"></div></div>';

    fetch(`${API_URL}?sheet=Stars&t=${new Date().getTime()}`)
    .then(res => res.json())
    .then(data => {
        container.innerHTML = '';
        if (!Array.isArray(data)) data = [];
        
        if(data.length === 0) {
            container.innerHTML = getEmptyStateHTML('fa-award', 'نجوم الشهر', 'سيتم تكريم المتميزين قريباً، كن واحداً منهم!');
            return;
        }

        const starsByCommittee = {};
        data.forEach(star => {
            const comm = star.Committee || 'عام';
            if (!starsByCommittee[comm]) starsByCommittee[comm] = [];
            starsByCommittee[comm].push(star);
        });

        const iconsMap = {
            'الموارد البشرية': 'fa-sitemap',
            'العلاقات العامة': 'fa-globe-americas',
            'التنظيم': 'fa-tasks',
            'المكتب الإعلامي': 'fa-bullhorn',
            'التدريب والتطوير': 'fa-chalkboard-teacher'
        };

        Object.entries(starsByCommittee).forEach(([commName, starsList], index) => {
            let starsHTML = '';
            starsList.forEach((star, i) => {
                starsHTML += `
                <div class="star-card" data-aos="zoom-in" data-aos-delay="${i * 100}">
                    <img src="${star.Image}" alt="${star.Name}" onerror="this.src='images/logo.png'">
                    <h4>(${star.Name})</h4>
                    <span>عضو متميز</span>
                </div>`;
            });

            const sectionHTML = `
            <div class="committee-stars-group" data-aos="fade-up" data-aos-delay="${index * 100}">
                <h3 class="committee-title">
                    <i class="fas ${iconsMap[commName] || 'fa-star'}"></i> لجنة ${commName}
                </h3>
                <div class="stars-grid">
                    ${starsHTML}
                </div>
            </div>`;
            container.innerHTML += sectionHTML;
        });
    });
}

// ---------------------------------------------------------
// 3. دالة الشركاء
// ---------------------------------------------------------
function loadPartners(container) {
    container.innerHTML = '<div class="preloader" style="position:relative; background:transparent; height:150px; z-index:1; grid-column: 1/-1;"><div class="spinner"></div></div>';

    fetch(`${API_URL}?sheet=Partners&t=${new Date().getTime()}`)
    .then(res => res.json())
    .then(data => {
        container.innerHTML = '';
        if (!Array.isArray(data)) data = [];

        if(data.length === 0) {
            container.innerHTML = getEmptyStateHTML('fa-handshake', 'شركاء النجاح', 'نرحب دائماً بشراكات جديدة تخدم المجتمع.');
            return;
        }
        data.reverse();
        data.forEach((item, index) => {
            const html = `
            <div class="partner-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <a href="${item.Link || '#'}" target="_blank">
                    <img src="${item.Image}" alt="${item.Name}" onerror="this.src='images/logo.png'">
                </a>
            </div>`;
            container.innerHTML += html;
        });
    })
    .catch(err => {
        container.innerHTML = getEmptyStateHTML('fa-exclamation-circle', 'خطأ في التحميل', 'حاول إعادة تحميل الصفحة.');
    });
}

// ---------------------------------------------------------
// 4. دالة الهيكل التنظيمي (Team) - 🌟 التصميم الجديد هنا
// ---------------------------------------------------------
function loadTeam(highBoardContainer, committeesContainer) {
    
    // 🎨 شكل التحميل الجديد: أنيق واحترافي
    const loadingHTML = `
    <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px;">
        <div class="loader-pulse" style="
            width: 70px; height: 70px;
            background: rgba(142, 68, 173, 0.1);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            position: relative;
            margin-bottom: 25px;
        ">
            <div style="
                position: absolute; width: 100%; height: 100%; border-radius: 50%;
                border: 3px solid #8e44ad; border-top-color: transparent;
                animation: spin 1s linear infinite;
            "></div>
            <i class="fas fa-sitemap" style="color: #8e44ad; font-size: 1.8rem;"></i>
        </div>
        <h4 style="color: #2d3436; margin:0; font-weight: 700; font-size: 1.2rem;">جاري تجهيز الهيكل التنظيمي...</h4>
        <p style="color: #636e72; margin-top: 8px; font-size: 0.95rem;">لحظات ونكون جاهزون</p>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    </div>`;

    if(highBoardContainer) highBoardContainer.innerHTML = loadingHTML;
    
    fetch(`${API_URL}?sheet=Team&t=${new Date().getTime()}`)
    .then(res => res.json())
    .then(data => {
        if(highBoardContainer) highBoardContainer.innerHTML = '';
        if(committeesContainer) committeesContainer.innerHTML = '';

        if (!Array.isArray(data)) data = [];

        // 🌟 حالة عدم وجود بيانات (Empty State)
        if(data.length === 0) {
            if(highBoardContainer) {
                highBoardContainer.innerHTML = getEmptyStateHTML('fa-users-cog', 'الهيكل قيد التحديث', 'يتم حالياً إعادة تشكيل الهيكل التنظيمي، انتظرونا قريباً.');
            }
            return;
        }

        const highBoard = data.filter(member => String(member.Committee || '').trim() === 'High Board');
        const otherCommittees = data.filter(member => String(member.Committee || '').trim() !== 'High Board');

        // --- عرض القيادة العليا ---
        if(highBoard.length > 0 && highBoardContainer) {
            const president = highBoard.find(m => String(m.Role || '').includes('رئيس الاتحاد')) || highBoard[0];
            const others = highBoard.filter(m => m !== president);

            // كارت الرئيس
            const presidentHTML = `
            <div class="leader-card president-card-style">
                <div class="leader-image-wrapper">
                    <img src="${president.Image}" alt="${president.Name}" onerror="this.src='images/logo.png'">
                    <div class="leader-badge"><i class="fas fa-crown"></i></div>
                </div>
                <div class="leader-info">
                    <span class="leader-role">${president.Role || 'عضو قيادي'}</span>
                    <h2>(${president.Name || 'عضو'})</h2>
                    <p class="leader-quote">${president.Quote || ''}</p>
                    <div class="leader-social">
                        ${president.Facebook ? `<a href="${president.Facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                        ${president.Instagram ? `<a href="${president.Instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                        ${president.LinkedIn ? `<a href="${president.LinkedIn}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
                    </div>
                </div>
            </div>`;
            highBoardContainer.innerHTML += presidentHTML;

            // باقي القيادة العليا
            if(others.length > 0) {
                let othersHTML = '<div class="sub-leadership-grid">';
                others.forEach(member => {
                    othersHTML += `
                    <div class="leader-card">
                        <div class="leader-image-wrapper">
                            <img src="${member.Image}" alt="${member.Name}" onerror="this.src='images/logo.png'">
                            <div class="leader-badge"><i class="fas fa-user-tie"></i></div>
                        </div>
                        <div class="leader-info">
                            <span class="leader-role">${member.Role || 'عضو قيادي'}</span>
                            <h2>(${member.Name || 'عضو'})</h2>
                            <p class="leader-quote">${member.Quote || ''}</p>
                            <div class="leader-social">
                                ${member.Facebook ? `<a href="${member.Facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                                ${member.Instagram ? `<a href="${member.Instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                                ${member.LinkedIn ? `<a href="${member.LinkedIn}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
                            </div>
                        </div>
                    </div>`;
                });
                othersHTML += '</div>';
                highBoardContainer.innerHTML += othersHTML;
            }
        } else if (highBoardContainer) {
             highBoardContainer.innerHTML = getEmptyStateHTML('fa-user-clock', 'جاري التعيين', 'يتم اختيار القيادة العليا حالياً.');
        }

        // --- عرض اللجان ---
        if(otherCommittees.length > 0 && committeesContainer) {
            committeesContainer.innerHTML = '<div class="connector"></div><h2 class="chart-title sub-title">المكتب التنفيذي</h2><div class="level level-2">';
            
            const groups = {};
            otherCommittees.forEach(m => {
                const c = m.Committee || 'لجنة عامة';
                if(!groups[c]) groups[c] = [];
                groups[c].push(m);
            });

            Object.entries(groups).forEach(([commName, members]) => {
                let membersHTML = '';
                members.sort((a, b) => String(a.Role || '').includes('رئيس') ? -1 : 1);

                members.forEach(m => {
                    membersHTML += `
                    <div class="member-card small">
                        <img src="${m.Image}" alt="${m.Name}" onerror="this.src='images/logo.png'">
                        <div>
                            <h5>(${m.Name})</h5>
                            <span>${m.Role || 'عضو'}</span>
                        </div>
                    </div>`;
                });

                committeesContainer.querySelector('.level').innerHTML += `
                <div class="committee-group" data-aos="fade-up">
                    <h4>لجنة ${commName}</h4>
                    ${membersHTML}
                </div>`;
            });
            committeesContainer.innerHTML += '</div>';
        }
    })
    .catch(err => {
        console.error(err);
        if(highBoardContainer) highBoardContainer.innerHTML = getEmptyStateHTML('fa-wifi', 'فشل الاتصال', 'تأكد من اتصال الإنترنت لديك.');
    });
}

function applyBlurEffect() {
    const cards = document.querySelectorAll('.news-card, .event-card');
    cards.forEach(card => {
        const img = card.querySelector('img');
        const container = card.querySelector('.news-image, .event-image');
        if (img && container) {
            const setBg = () => { container.style.setProperty('--bg-image', `url(${img.src})`); };
            if (img.complete) setBg(); else img.onload = setBg;
        }
    });
}