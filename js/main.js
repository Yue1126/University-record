/* ============================================================
   大学时光 - 个人成长记录网页 交互脚本
   功能：导航栏、滚动高亮、移动端菜单、文字轮播、
        证书筛选、相册筛选+灯箱、随笔年级筛选、图片懒加载
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. 导航栏滚动变色 ---------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ---------- 2. 移动端汉堡菜单 ---------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('open');
    });
    // 点击菜单项后自动收起（移动端）
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
        });
    });

    /* ---------- 3. 滚动时高亮当前导航项 ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function highlightNav() {
        let current = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    /* ---------- 4. 首页动态短句轮播 ---------- */
    const rotatorText = document.getElementById('rotatorText');
    // 可自行修改 / 新增轮播文案
    const rotatorPhrases = [
        '记录细碎美好，见证大学成长',
        '愿你出走半生，归来仍是少年',
        '每一个平凡的日子，都值得被珍藏',
        '以梦为马，不负韶华',
        '慢慢走，沿途有风景，背后有阳光',
        '青春没有售价，疯狂就在当下'
    ];
    let phraseIndex = 0;
    setInterval(function () {
        rotatorText.style.opacity = '0';
        setTimeout(function () {
            phraseIndex = (phraseIndex + 1) % rotatorPhrases.length;
            rotatorText.textContent = rotatorPhrases[phraseIndex];
            rotatorText.style.opacity = '1';
        }, 500);
    }, 3500);

    /* ---------- 5. 荣誉证书分类筛选 ---------- */
    const honorFilterBtns = document.querySelectorAll('.honor-filters .filter-btn');
    const honorCards = document.querySelectorAll('.honor-card');
    honorFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            honorFilterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            honorCards.forEach(function (card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ---------- 6. 生活相册分类筛选 ---------- */
    const galleryFilterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            galleryFilterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ---------- 7. 成长随笔年级筛选 ---------- */
    const yearTabs = document.querySelectorAll('.year-tab');
    const timelineItems = document.querySelectorAll('.timeline-item');
    yearTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            yearTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            const year = tab.getAttribute('data-year');
            timelineItems.forEach(function (item) {
                if (year === 'all' || item.getAttribute('data-year') === year) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ---------- 8. 图片灯箱（点击放大、左右切换、键盘操作） ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // 获取当前可见的相册图片列表
    function getVisibleImages() {
        return Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img'));
    }
    let currentImageIndex = 0;

    // 打开灯箱
    function openLightbox(index) {
        const images = getVisibleImages();
        if (images.length === 0) return;
        currentImageIndex = index;
        lightboxImg.src = images[index].src;
        lightboxCaption.textContent = images[index].getAttribute('data-caption') || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 切换图片
    function showImage(direction) {
        const images = getVisibleImages();
        if (images.length === 0) return;
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].src;
        lightboxCaption.textContent = images[currentImageIndex].getAttribute('data-caption') || '';
    }

    // 绑定相册图片点击事件
    document.querySelectorAll('.gallery-item').forEach(function (item, index) {
        item.addEventListener('click', function () {
            const visibleImages = getVisibleImages();
            const img = item.querySelector('img');
            const realIndex = visibleImages.indexOf(img);
            openLightbox(realIndex >= 0 ? realIndex : 0);
        });
    });

    // 证书图片也支持点击放大
    document.querySelectorAll('.honor-card:not(.honor-placeholder)').forEach(function (card) {
        card.addEventListener('click', function () {
            const img = card.querySelector('.honor-image img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = card.querySelector('.honor-name').textContent;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { showImage(-1); });
    lightboxNext.addEventListener('click', function () { showImage(1); });

    // 点击灯箱背景关闭
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // 键盘操作：ESC 关闭，左右箭头切换
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(-1);
        if (e.key === 'ArrowRight') showImage(1);
    });

    // 移动端触摸滑动切换
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            showImage(diff > 0 ? 1 : -1);
        }
    }, { passive: true });

    /* ---------- 9. 图片懒加载（兼容不支持 loading=lazy 的浏览器） ---------- */
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(function (img) { imageObserver.observe(img); });
    }

    /* ---------- 10. 平滑滚动（兼容旧浏览器） ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 60;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    console.log('%c🎓 大学时光 - 个人成长记录网页已加载', 'color:#7fb3d5;font-size:14px;font-weight:bold;');
});
