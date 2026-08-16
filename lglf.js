
    document.addEventListener('DOMContentLoaded', () => {

    const WHATSAPP_NUMBER = '573243807506'; 

    /* ---------- LOADER ---------- */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('done'), 500);
    });
    setTimeout(() => loader.classList.add('done'), 2200);

    /* ---------- CUSTOM CURSOR DOT ---------- */
    const dot = document.getElementById('cursorDot');
    let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, cursorScale = 1;
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.opacity = 1;
    });
    (function animateDot(){
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%,-50%) scale(${cursorScale})`;
        requestAnimationFrame(animateDot);
    })();
    document.querySelectorAll('a, button, .service-card, .theme-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursorScale = 2.2);
        el.addEventListener('mouseleave', () => cursorScale = 1);
    });

    /* ---------- HEADER: shrink + active link on scroll ---------- */
    const header = document.getElementById('siteHeader');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-link]');

    function onScrollHeader(){
        header.classList.toggle('scrolled', window.scrollY > 40);
        let currentId = '';
        sections.forEach(sec => {
        const top = sec.offsetTop - 140;
        if (window.scrollY >= top) currentId = sec.id;
        });
        navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }
    window.addEventListener('scroll', onScrollHeader, { passive:true });
    onScrollHeader();

    /* ---------- MOBILE MENU ---------- */
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        });
    });

    /* ---------- SCROLL REVEAL ---------- */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting){
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
        }
        });
    }, { threshold:0.15 });
    revealEls.forEach(el => io.observe(el));

    /* ---------- HERO SPARKLES ---------- */
    const sparkleWrap = document.getElementById('sparkles');
    const SPARK_COUNT = 20;
    for (let i=0; i<SPARK_COUNT; i++){
        const s = document.createElement('span');
        s.className = 'spark';
        s.style.left = Math.random()*100 + '%';
        s.style.bottom = (Math.random()*45) + '%';
        s.style.animationDuration = (5 + Math.random()*7) + 's';
        s.style.animationDelay = (Math.random()*8) + 's';
        s.style.width = s.style.height = (3 + Math.random()*4) + 'px';
        sparkleWrap.appendChild(s);
    }

    /* ---------- ANIMATED COUNTERS ---------- */
    const counters = document.querySelectorAll('.stat-num');
    const countIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now){
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
        countIO.unobserve(el);
        });
    }, { threshold:0.5 });
    counters.forEach(c => countIO.observe(c));

    /* ---------- GALLERY CAROUSEL ---------- */
    const track = document.getElementById('carTrack');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('carPrev');
    const nextBtn = document.getElementById('carNext');
    const dotsWrap = document.getElementById('carDots');

    let perView = getPerView();
    let index = 0;
    let autoTimer;

    function getPerView(){
        const w = window.innerWidth;
        if (w >= 1100) return 3;
        if (w >= 760) return 2;
        return 1;
    }
    function maxIndex(){ return Math.max(0, slides.length - perView); }

    function renderDots(){
        dotsWrap.innerHTML = '';
        const count = maxIndex() + 1;
        for (let i=0; i<count; i++){
        const b = document.createElement('button');
        if (i === index) b.classList.add('active');
        b.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(b);
        }
    }
    function update(){
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(${-index * slideWidth}px)`;
        [...dotsWrap.children].forEach((d,i) => d.classList.toggle('active', i === index));
    }
    function goTo(i){ index = Math.max(0, Math.min(i, maxIndex())); update(); }
    function next(){ index = index >= maxIndex() ? 0 : index + 1; update(); }
    function prev(){ index = index <= 0 ? maxIndex() : index - 1; update(); }
    function startAuto(){ stopAuto(); autoTimer = setInterval(next, 4200); }
    function stopAuto(){ clearInterval(autoTimer); }

    nextBtn.addEventListener('click', () => { next(); startAuto(); });
    prevBtn.addEventListener('click', () => { prev(); startAuto(); });

    const carousel = document.getElementById('carousel');
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    let dragStartX = 0, isDragging = false, dragDelta = 0;
    track.addEventListener('pointerdown', e => {
        isDragging = true; dragStartX = e.clientX; stopAuto();
        track.style.transition = 'none';
    });
    window.addEventListener('pointermove', e => {
        if (!isDragging) return;
        dragDelta = e.clientX - dragStartX;
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(${-index * slideWidth + dragDelta}px)`;
    });
    window.addEventListener('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = '';
        if (dragDelta < -60) next();
        else if (dragDelta > 60) prev();
        else update();
        dragDelta = 0;
        startAuto();
    });

    window.addEventListener('resize', () => {
        perView = getPerView();
        index = Math.min(index, maxIndex());
        renderDots();
        update();
    });

    renderDots();
    update();
    startAuto();

    /* ---------- MINI CAROUSELS (servicios + temáticas) ---------- */
    document.querySelectorAll('.mini-carousel').forEach((media, mediaIndex) => {
        const imgs = Array.from(media.querySelectorAll('.carousel-imgs img'));
        const dotsWrap = media.querySelector('.carousel-dots');
        if (imgs.length < 2) return;

        imgs.forEach((_, i) => {
        const d = document.createElement('i');
        if (i === 0) d.classList.add('active');
        dotsWrap.appendChild(d);
        });
        const dots = Array.from(dotsWrap.children);

        let current = 0;
        function showSlide(i){
        imgs[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = i;
        imgs[current].classList.add('active');
        dots[current].classList.add('active');
        }

        // stagger start so cards don't all switch in sync
        const staggerDelay = mediaIndex * 700;
        setTimeout(() => {
        setInterval(() => {
            showSlide((current + 1) % imgs.length);
        }, 3200);
        }, staggerDelay);
    });

    /* ---------- THEME CARD PARTICLES ---------- */
    document.querySelectorAll('.theme-card').forEach(card => {
        const wrap = card.querySelector('.theme-particles');
        const char = card.dataset.particle || '✦';
        const count = parseInt(card.dataset.count, 10) || 10;
        for (let i=0; i<count; i++){
        const p = document.createElement('span');
        p.className = 'theme-particle';
        p.textContent = char;
        p.style.left = Math.random()*100 + '%';
        p.style.animationDuration = (4 + Math.random()*5) + 's';
        p.style.animationDelay = (Math.random()*6) + 's';
        p.style.fontSize = (0.7 + Math.random()*0.8) + 'rem';
        wrap.appendChild(p);
        }
    });

    /* ---------- THEME "CONSULTAR DISEÑO" -> WHATSAPP ---------- */
    document.querySelectorAll('.theme-link').forEach(link => {
        link.addEventListener('click', e => {
        e.preventDefault();
        const theme = link.dataset.theme || 'diseño de temporada';
        const msg = `Hola L&L Beauty Studio! Quiero ver diseños de la colección: ${theme}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    });

    /* ---------- CONTACT FORM -> WHATSAPP ---------- */
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value.trim();
        const message = document.getElementById('message').value.trim();

        let text = `Hola L&L Beauty Studio! Soy ${name}.`;
        if (service) text += ` Me interesa: ${service}.`;
        if (message) text += ` ${message}`;
        if (phone) text += ` (Mi teléfono: ${phone})`;

        form.classList.add('sent');

        setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
        form.reset();
        form.classList.remove('sent');
        }, 900);
    });

    /* ---------- FOOTER YEAR ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();

    });