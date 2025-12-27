/*
 * ==========================================================================
 * 🎨 Tahya Masr Chatbot - UI Module (v13.2 - Classic & Typewriter)
 * ==========================================================================
 * - التحديث:
 * 1. استعادة أيقونة "الرسالة" الكلاسيكية للزر العائم.
 * 2. إعادة تفعيل تأثير "الآلة الكاتبة" (Typewriter Effect) للرسائل الترحيبية.
 * 3. الحفاظ على مكتبة الرسائل الضخمة والمتنوعة.
 */

window.TMChatUI = (function() {
    let toggler, chatWindow, chatBox, chatInput, sendBtn, closeBtn, tooltip;
    let messageInterval; 

    // 📚 مكتبة الرسائل الضخمة والمتنوعة
    const ROTATING_MESSAGES = [
        "👋 أهلاً يا قائد! يومك جميل ومشرق.",
        "✨ منور الموقع! جاهز نساعدك في أي وقت.",
        "🌹 أهلاً بيك في عائلة تحيا مصر.",
        "🤖 معاك المساعد الذكي، تحت أمرك.",
        "🚀 انضم لأقوى كيان شبابي في مصر الآن!",
        "💪 خليك مؤثر.. خليك قائد.. ابدأ معانا.",
        "🌟 فرصة التطوع بتيجي مرة.. استغلها صح!",
        "🇪🇬 تحيا مصر.. بشبابها الواعي والمثقف.",
        "🦁 القادة بيصنعوا هنا.. في تحيا مصر.",
        "🤔 محتار تختار لجنة ايه؟ اسألني وأنا أساعدك.",
        "🧐 عارف إيه هي أهداف الاتحاد؟ تعالى أقولك.",
        "❓ عندك فكرة مشروع ومحتاج دعم؟ كلمنا.",
        "📅 عايز تعرف مواعيد الفعاليات الجاية؟",
        "⚖️ تعرف حقوقك وواجباتك في اللائحة؟",
        "🎤 بتحب الإعلام والتصوير؟ مكانك في الميديا.",
        "📋 دقيق ومنظم؟ لجنة التنظيم (OC) محتاجاك.",
        "🤝 عندك كاريزما؟ لجنة العلاقات العامة (PR) بانتظارك.",
        "🧠 عايز تطور مهاراتك؟ اسأل عن لجنة التدريب (T&D).",
        "⚖️ بتحب النظام؟ لجنة الموارد البشرية (HR) هي بيتك.",
        "😄 متتكسفش تسأل.. أنا مش بتعب من الأسئلة!",
        "☕ تشرب شاي ولا قهوة؟.. بهزر، تعالى ندردش!",
        "🕶️ جاهز للمغامرة؟ دوس على الزرار وابدأ.",
        "📝 املأ استمارة العضوية دلوقتي وخليك واحد مننا.",
        "🔗 تابعنا على السوشيال ميديا عشان يوصلك كل جديد.",
        "📩 ابعتلنا رسالة.. احنا دايماً موجودين.",
        "👀 لسه بتفكر؟ الوقت بيجري.. خد الخطوة!"
    ];

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;800&display=swap');
        
        :root {
            --tm-primary: #8e44ad;
            --tm-primary-dark: #6c3483;
            --tm-accent: #00d2d3;
            --tm-bg: #ffffff;
            --tm-glass-bg: rgba(255, 255, 255, 0.9);
            --tm-text: #2d3436;
            --tm-gray-light: #f1f2f6;
        }

        /* زر الفتح العائم */
        .tm-chatbot-toggler {
            position: fixed; bottom: 35px; right: 35px;
            width: 70px; height: 70px;
            border: none; border-radius: 50%;
            cursor: pointer; z-index: 2147483647;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
            box-shadow: 0 10px 30px rgba(142, 68, 173, 0.5);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: superPulse 3s infinite;
        }
        
        @keyframes superPulse {
            0% { box-shadow: 0 0 0 0 rgba(142, 68, 173, 0.7); transform: scale(1); }
            50% { box-shadow: 0 0 0 20px rgba(142, 68, 173, 0); transform: scale(1.05); }
            100% { box-shadow: 0 0 0 0 rgba(142, 68, 173, 0); transform: scale(1); }
        }

        .tm-chatbot-toggler:hover { 
            transform: scale(1.15) rotate(-5deg); 
            animation: none; 
            box-shadow: 0 15px 40px rgba(142, 68, 173, 0.7);
        }

        .tm-chatbot-toggler svg { 
            width: 36px; height: 36px; fill: white; /* أيقونة الرسالة أصغر قليلاً لتناسب الدائرة */
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            transition: transform 0.5s ease;
        }
        .tm-chatbot-toggler:hover svg { transform: rotate(15deg) scale(1.1); }

        /* الفقاعة المتغيرة */
        .tm-chat-tooltip {
            position: fixed; bottom: 120px; right: 35px;
            background: #2d3436;
            color: #fff; padding: 12px 20px;
            border-radius: 12px; border-bottom-right-radius: 2px;
            font-family: 'Cairo', sans-serif; font-size: 0.9rem; font-weight: 600;
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            z-index: 2147483646;
            opacity: 0; transform: translateY(10px) scale(0.9); pointer-events: none;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 240px; text-align: center; line-height: 1.4;
            min-height: 24px; display: flex; align-items: center; justify-content: center;
        }
        .tm-chat-tooltip::after {
            content: ''; position: absolute; bottom: -8px; right: 20px;
            border-width: 8px 8px 0; border-style: solid;
            border-color: #2d3436 transparent transparent transparent;
        }
        .tm-chat-tooltip.show { opacity: 1; transform: translateY(0) scale(1); }

        /* مؤشر الكتابة (Cursor) */
        .typing-cursor::after {
            content: '|';
            animation: blink 1s infinite;
            color: #00d2d3;
            margin-right: 2px;
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* نافذة الشات */
        .tm-chatbot-window {
            position: fixed; bottom: 110px; right: 35px;
            width: 380px; max-width: calc(100vw - 40px); max-height: 80vh;
            background: var(--tm-glass-bg);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            overflow: hidden; opacity: 0; pointer-events: none;
            transform: translateY(40px) scale(0.8); transform-origin: bottom right;
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            z-index: 2147483648;
            font-family: 'Cairo', sans-serif; direction: rtl;
            display: flex; flex-direction: column;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.8);
        }
        body.show-chatbot .tm-chatbot-window { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
        
        body.show-chatbot .tm-chat-tooltip { opacity: 0 !important; display: none; }
        body.show-chatbot .tm-chatbot-toggler { transform: scale(0) rotate(180deg); opacity: 0; pointer-events: none; }

        /* الهيدر */
        .chat-header {
            background: linear-gradient(135deg, #8e44ad, #6c3483);
            padding: 18px 24px; display: flex; align-items: center; justify-content: space-between;
            color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); flex-shrink: 0;
        }
        .header-info { display: flex; align-items: center; gap: 12px; }
        .bot-avatar-header {
            width: 42px; height: 42px; background: rgba(255,255,255,0.2);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(5px); border: 2px solid rgba(255,255,255,0.4);
        }
        .bot-avatar-header svg { width: 24px; height: 24px; fill: white; }
        .header-text h3 { margin: 0; font-size: 1.1rem; font-weight: 700; }
        .header-text p { margin: 2px 0 0; font-size: 0.75rem; opacity: 0.9; display: flex; align-items: center; gap: 6px; }
        .status-pulse { 
            width: 8px; height: 8px; background: #00ff9d; border-radius: 50%; 
            box-shadow: 0 0 0 rgba(0, 255, 157, 0.4); animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.7); }
            70% { box-shadow: 0 0 0 8px rgba(0, 255, 157, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0); }
        }
        .close-chat {
            background: rgba(255,255,255,0.2); border: none; color: white;
            width: 34px; height: 34px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s;
        }
        .close-chat:hover { background: rgba(255,255,255,0.4); transform: rotate(90deg); }

        /* المحتوى */
        .chat-box {
            flex: 1; overflow-y: auto; padding: 24px;
            background: #fff;
            background-image: radial-gradient(#dfe6e9 1px, transparent 1px);
            background-size: 20px 20px;
            display: flex; flex-direction: column; gap: 18px;
        }
        .chat-msg { display: flex; align-items: flex-end; gap: 10px; max-width: 85%; }
        .msg-content {
            padding: 12px 18px; font-size: 0.95rem; line-height: 1.6;
            position: relative; word-wrap: break-word;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .chat-msg.bot .msg-content {
            background: #f8f9fa; color: var(--tm-text); 
            border-radius: 20px 20px 20px 4px;
        }
        .bot-icon {
            width: 32px; height: 32px; background: var(--tm-primary); color: white;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 16px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(142,68,173,0.3);
        }
        .bot-icon svg { width: 18px; height: 18px; fill: white; }
        .chat-msg.user { align-self: flex-end; flex-direction: row-reverse; }
        .chat-msg.user .msg-content {
            background: linear-gradient(135deg, #8e44ad, #9b59b6); color: white;
            border-radius: 20px 20px 4px 20px; 
        }

        /* منطقة الكتابة */
        .chat-input-area {
            padding: 16px 20px; background: rgba(255,255,255,0.9);
            display: flex; align-items: flex-end; gap: 10px;
            border-top: 1px solid rgba(0,0,0,0.06); flex-shrink: 0;
        }
        .input-wrapper { flex: 1; position: relative; }
        .chat-input-area textarea {
            width: 100%; border: 2px solid var(--tm-gray-light); border-radius: 24px;
            padding: 12px 18px; resize: none; height: 50px; outline: none;
            font-family: inherit; font-size: 0.95rem; background: #fdfdfd;
            transition: all 0.3s; box-sizing: border-box;
        }
        .chat-input-area textarea:focus { border-color: var(--tm-primary); background: #fff; }
        .send-btn {
            background: var(--tm-primary); color: white; border: none; border-radius: 50%;
            width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center;
            justify-content: center; transition: all 0.3s;
            box-shadow: 0 4px 10px rgba(142, 68, 173, 0.2);
        }
        .send-btn:hover { transform: scale(1.1); background: var(--tm-primary-dark); }
        .send-btn svg { width: 22px; height: 22px; fill: white; margin-right: -2px; }

        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .typing-indicator span {
            width: 6px; height: 6px; background: #b2bec3; border-radius: 50%; display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both; margin: 0 2px;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @media (max-width: 480px) {
            .tm-chatbot-window {
                right: 0; bottom: 0; width: 100%; max-width: 100%; height: 100%; 
                max-height: 100vh; border-radius: 0; transform-origin: center;
            }
            .tm-chatbot-toggler { bottom: 25px; right: 25px; width: 60px; height: 60px; }
            .tm-chat-tooltip { bottom: 100px; right: 25px; }
        }
    `;

    const ICONS = {
        // أيقونة الروبوت الاحترافية (لداخل الشات والهيدر)
        bot: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C7.58172 2 4 5.58172 4 10V14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14V10C20 5.58172 16.4183 2 12 2Z" fill="currentColor" fill-opacity="0.2"/>
            <path d="M12 2C7.58172 2 4 5.58172 4 10V14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14V10C20 5.58172 16.4183 2 12 2Z" stroke="currentColor" stroke-width="2"/>
            <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
            <path d="M12 2V0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="-2" r="1" fill="currentColor"/>
            <path d="M9 16C9 16 10 17 12 17C14 17 15 16 15 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        
        // أيقونة الرسالة الكلاسيكية (للزر العائم)
        msg: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
        
        send: `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
        close: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    };

    // دالة الكتابة (Typewriter)
    function typeWriter(text, element, speed = 35) {
        let i = 0;
        element.textContent = ''; 
        element.classList.add('typing-cursor'); 
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing-cursor'); 
            }
        }
        type();
    }

    function buildUI() {
        if (document.querySelector('.tm-chatbot-toggler')) return;

        const style = document.createElement('style');
        style.innerHTML = STYLES;
        document.head.appendChild(style);

        const chatHTML = `
            <div class="tm-chat-tooltip"></div> 
            <button class="tm-chatbot-toggler" aria-label="افتح الشات">
                ${ICONS.msg}
            </button>
            <div class="tm-chatbot-window">
                <header class="chat-header">
                    <div class="header-info">
                        <div class="bot-avatar-header">${ICONS.bot}</div>
                        <div class="header-text">
                            <h3>TahyaMisr Chatbot</h3>
                            <p><span class="status-pulse"></span>Online</p>
                        </div>
                    </div>
                    <button class="close-chat" aria-label="اغلق الشات">${ICONS.close}</button>
                </header>
                <ul class="chat-box" aria-live="polite">
                    <li class="chat-msg bot">
                        <div class="bot-icon">${ICONS.bot}</div>
                        <div class="msg-content">أهلاً بك يا قائد! 👋 <br>معك المساعد الذكي، كيف يمكنني خدمتك اليوم؟</div>
                    </li>
                </ul>
                <div class="chat-input-area">
                    <div class="input-wrapper">
                        <textarea placeholder="اكتب رسالتك..." required aria-label="صندوق إدخال الرسالة" rows="1"></textarea>
                    </div>
                    <button class="send-btn" aria-label="إرسال">${ICONS.send}</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", chatHTML);

        toggler = document.querySelector(".tm-chatbot-toggler");
        tooltip = document.querySelector(".tm-chat-tooltip");
        closeBtn = document.querySelector(".close-chat");
        chatBox = document.querySelector(".chat-box");
        chatInput = document.querySelector(".chat-input-area textarea");
        sendBtn = document.querySelector(".send-btn");
        chatWindow = document.querySelector(".tm-chatbot-window");

        // --- نظام الرسائل المتغيرة مع الكتابة ---
        let msgIndex = Math.floor(Math.random() * ROTATING_MESSAGES.length); 
        
        function showNextMessage() {
            if (document.body.classList.contains("show-chatbot")) return;

            // إظهار التول تيب
            tooltip.classList.add("show");
            
            // بدء الكتابة للنص الحالي
            typeWriter(ROTATING_MESSAGES[msgIndex], tooltip);

            // إخفاء بعد فترة (بما يكفي للقراءة)
            setTimeout(() => {
                tooltip.classList.remove("show");
            }, 8000); 

            // تجهيز الرسالة القادمة
            msgIndex = (msgIndex + 1) % ROTATING_MESSAGES.length;
        }

        // أول مرة
        setTimeout(showNextMessage, 2000);

        // تكرار كل 15 ثانية
        messageInterval = setInterval(showNextMessage, 15000);

        // Events
        toggler.addEventListener("click", () => {
            document.body.classList.toggle("show-chatbot");
            tooltip.classList.remove("show");
        });
        
        closeBtn.addEventListener("click", () => {
            document.body.classList.remove("show-chatbot");
        });
        
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    return {
        init: buildUI,
        onSend: function(callback) {
            const handleSend = () => {
                const text = chatInput.value.trim();
                if(!text) return;
                callback(text);
                chatInput.value = "";
                chatInput.style.height = '50px';
                chatInput.focus();
            };

            sendBtn.addEventListener("click", handleSend);
            chatInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            });
        },
        addMessage: function(text, type) {
            const msgLi = document.createElement("li");
            msgLi.classList.add("chat-msg", type);
            
            let contentHTML = '';
            if (type === 'bot') {
                contentHTML = `<div class="bot-icon">${ICONS.bot}</div><div class="msg-content">${text}</div>`;
            } else {
                contentHTML = `<div class="msg-content">${text}</div>`;
            }
            
            msgLi.innerHTML = contentHTML;
            chatBox.appendChild(msgLi);
            chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
        },
        showLoader: function() {
            const typingHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            const msgLi = document.createElement("li");
            msgLi.classList.add("chat-msg", "bot", "loading-msg");
            msgLi.innerHTML = `<div class="bot-icon">${ICONS.bot}</div><div class="msg-content">${typingHTML}</div>`;
            chatBox.appendChild(msgLi);
            chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
            return msgLi;
        },
        removeLoader: function(loaderElement) {
            if(loaderElement) loaderElement.remove();
        },
        lockInput: function() {
            sendBtn.disabled = true;
            chatInput.disabled = true;
        },
        unlockInput: function() {
            sendBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    };
})();