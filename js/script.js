/* ==============================================
   JAVASCRIPT INTERATIVO - PORTFÓLIO REFRAMME STYLE
   Funcionalidades:
   - Scroll reveal com Intersection Observer
   - Header fixo com efeito de scroll
   - Menu mobile toggle
   - Smooth scroll para navegação
   ============================================== */

// ========== AGUARDA O CARREGAMENTO DO DOM ==========
document.addEventListener('DOMContentLoaded', () => {

    // ========== ELEMENTOS DO DOM ==========
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // ========== HEADER: EFEITO DE SCROLL ==========
    // Adiciona classe 'scrolled' ao header quando rolar mais de 50px
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Adiciona classe 'scrolled' quando scroll > 50px
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========== MENU MOBILE TOGGLE ==========
    // Toggle do menu mobile ao clicar no botão hamburger
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');

            // Previne scroll do body quando menu está aberto
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // ========== FECHA MENU AO CLICAR EM LINK ==========
    // Fecha o menu mobile ao clicar em qualquer link de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ========== SMOOTH SCROLL PARA ÂNCORAS ==========
    // Implementa scroll suave ao clicar em links internos
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Verifica se é uma âncora interna
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Calcula posição considerando altura do header
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========== INTERSECTION OBSERVER PARA SCROLL REVEAL ==========
    // Observa elementos e adiciona classe 'visible' quando entram na viewport

    // Configurações do observer
    const observerOptions = {
        threshold: 0.15, // 15% do elemento visível
        rootMargin: '0px 0px -100px 0px' // Trigger antes do elemento estar totalmente visível
    };

    // Callback executado quando elemento entra/sai da viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona classe 'visible' com delay progressivo para criar efeito cascata
                const delay = parseInt(entry.target.dataset.delay) || 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Para de observar o elemento após animação (performance)
                observer.unobserve(entry.target);
            }
        });
    };

    // Cria instância do Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // ========== OBSERVA ITENS DA GALERIA ==========
    // Adiciona animação de fade-in para cada item da galeria
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        // Adiciona delay progressivo para criar efeito cascata
        item.dataset.delay = index * 100; // 100ms entre cada item
        observer.observe(item);
    });

    // ========== OBSERVA SEÇÃO SOBRE ==========
    // Adiciona animação para a seção sobre
    const sobreContent = document.querySelector('.sobre-content');
    if (sobreContent) {
        observer.observe(sobreContent);
    }

    // ========== FECHA MENU AO CLICAR FORA ==========
    // Fecha menu mobile ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active')) {
            // Verifica se clique foi fora do nav e do toggle
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ========== PREVINE COMPORTAMENTO PADRÃO DE LINKS VAZIOS ==========
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    // ========== LOG DE INICIALIZAÇÃO ==========
    console.log('%c✨ Portfólio LOOK\'N FEEL carregado com sucesso!',
                'color: #6a6a6a; font-size: 14px; font-weight: 300;');
    console.log('%cEstilo minimalista inspirado em Reframme',
                'color: #9a9a9a; font-size: 12px; font-weight: 300;');
});

// ========== OTIMIZAÇÃO DE PERFORMANCE ==========
// Debounce para eventos de scroll (previne execução excessiva)
function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ========== TRATAMENTO DE IMAGENS ==========
// Lazy loading para imagens (se você adicionar imagens reais)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Se a imagem tem data-src, carrega a imagem
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observa todas as imagens com data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== ACESSIBILIDADE: NAVEGAÇÃO POR TECLADO ==========
// Melhora a visibilidade do foco para navegação por teclado
document.addEventListener('keydown', (e) => {
    // Detecta navegação por Tab
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ========== PREVINE FLASH DE CONTEÚDO NÃO ESTILIZADO ==========
// Remove classe 'no-js' se JavaScript estiver ativo
document.documentElement.classList.remove('no-js');

// ========== ANIMAÇÃO DE ENTRADA DA PÁGINA ==========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
