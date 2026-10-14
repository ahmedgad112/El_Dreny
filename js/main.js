/* ============ الإعدادات: غيّر رقم الواتساب من هنا فقط ============ */
// الرقم بالصيغة الدولية بدون + أو أصفار (مثال السعودية: 9665XXXXXXXX)
const WHATSAPP_NUMBER = "966500000000";
const COMPANY_NAME = "رواد المعرفة";

/* ============ فتح واتساب برسالة ============ */
function openWhatsApp(message) {
    const url = "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMBER +
        "&text=" + encodeURIComponent(message);
    const win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url; // في حال منع النوافذ المنبثقة
}

/* ============ أزرار الواتساب العامة (data-wa) ============ */
document.querySelectorAll("[data-wa]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const service = btn.dataset.service;
        const msg = service
            ? "السلام عليكم، أرغب بحجز خدمة: " + service + " من شركة " + COMPANY_NAME + " في الرياض."
            : "السلام عليكم، أرغب بالاستفسار عن خدمات شركة " + COMPANY_NAME + " في الرياض.";
        openWhatsApp(msg);
    });
});

/* ============ نموذج الحجز ============ */
const form = document.getElementById("bookingForm");

// تحويل الأرقام العربية/الهندية إلى إنجليزية
function normalizeDigits(str) {
    return str
        .replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x0660; })
        .replace(/[\u06F0-\u06F9]/g, function (d) { return d.charCodeAt(0) - 0x06F0; });
}

// التحقق من رقم جوال سعودي (05XXXXXXXX أو 5XXXXXXXX أو 9665XXXXXXXX)
function isValidSaudiPhone(v) {
    const p = normalizeDigits(v).replace(/[\s\-()+]/g, "");
    return /^(009665|9665|05|5)\d{8}$/.test(p);
}

function setError(field, show) {
    const el = form.querySelector('.err[data-for="' + field + '"]');
    const input = form.elements[field];
    el.classList.toggle("hidden", !show);
    input.classList.toggle("border-red-500", show);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const service = form.elements.service.value.trim();
    const notes = form.elements.notes.value.trim();

    const okName = name.length >= 2;
    const okPhone = isValidSaudiPhone(phone);
    const okService = service !== "";

    setError("name", !okName);
    setError("phone", !okPhone);
    setError("service", !okService);

    if (!(okName && okPhone && okService)) {
        const firstBad = !okName ? "name" : (!okPhone ? "phone" : "service");
        form.elements[firstBad].focus();
        return;
    }

    const lines = [
        "السلام عليكم، أرغب بحجز خدمة من " + COMPANY_NAME + ":",
        "",
        "👤 الاسم: " + name,
        "📱 رقم الجوال: " + normalizeDigits(phone),
        "🛠️ الخدمة المطلوبة: " + service
    ];
    if (notes) lines.push("📝 ملاحظات: " + notes);
    lines.push("", "شكراً لكم.");

    openWhatsApp(lines.join("\n"));
});

// إزالة رسالة الخطأ أثناء الكتابة
["name", "phone", "service"].forEach(function (f) {
    form.elements[f].addEventListener("input", function () { setError(f, false); });
    form.elements[f].addEventListener("change", function () { setError(f, false); });
});

/* ============ قائمة الجوال ============ */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const iconOpen = document.getElementById("iconOpen");
const iconClose = document.getElementById("iconClose");

function toggleMenu(forceClose) {
    const open = forceClose ? false : mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", !open);
    iconOpen.classList.toggle("hidden", open);
    iconClose.classList.toggle("hidden", !open);
}
menuBtn.addEventListener("click", function () { toggleMenu(false); });
document.querySelectorAll(".mobile-link").forEach(function (a) {
    a.addEventListener("click", function () { toggleMenu(true); });
});

/* ============ ظهور العناصر عند التمرير ============ */
const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

/* ============ السنة الحالية ============ */
document.getElementById("year").textContent = new Date().getFullYear();
