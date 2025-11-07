/* ============================================
   PORTFÓLIO REFRAMME - JAVASCRIPT
   Modal + Formulário + Menu Mobile
   ============================================ */

// ========== ELEMENTOS DO DOM ==========
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const masonryItems = document.querySelectorAll('.masonry-item');
const contactForm = document.getElementById('contactForm');
const clockSP = document.getElementById('clockSP');
const darkModeToggle = document.getElementById('darkModeToggle');

let currentImageIndex = 0;
const totalImages = masonryItems.length;

// ========== MENU MOBILE TOGGLE ==========
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== RELÓGIO DE SÃO PAULO ==========
function updateSaoPauloClock() {
    if (!clockSP) return;

    // São Paulo timezone: UTC-3 (BRT - Brasília Time)
    const now = new Date();
    const saoPauloTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

    const hours = String(saoPauloTime.getHours()).padStart(2, '0');
    const minutes = String(saoPauloTime.getMinutes()).padStart(2, '0');
    const seconds = String(saoPauloTime.getSeconds()).padStart(2, '0');

    clockSP.textContent = `${hours}:${minutes}:${seconds}`;
}

// Atualizar relógio a cada segundo
if (clockSP) {
    updateSaoPauloClock();
    setInterval(updateSaoPauloClock, 1000);
}

// ========== DARK MODE ==========
function initDarkMode() {
    // Verificar preferência salva
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'enabled' || (!savedMode && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    // Salvar preferência
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Inicializar dark mode
initDarkMode();

// Event listener do dark mode toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

// ========== MODAL DE IMAGENS ==========
// Abrir modal ao clicar na imagem
masonryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openModal(index);
    });
});

function openModal(index) {
    currentImageIndex = index;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Aqui você pode adicionar a URL real da imagem
    // Por enquanto, mostra um placeholder
    const imageSrc = getImageSrc(index);
    modalImage.src = imageSrc;
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    const imageSrc = getImageSrc(currentImageIndex);
    modalImage.src = imageSrc;
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    const imageSrc = getImageSrc(currentImageIndex);
    modalImage.src = imageSrc;
}

// Função para obter URL da imagem
function getImageSrc(index) {
    const item = masonryItems[index];
    if (!item) return '';

    // Obter a URL da imagem do background-image
    const itemImage = item.querySelector('.item-image');
    if (itemImage) {
        const bgImage = window.getComputedStyle(itemImage).backgroundImage;
        // Extrair URL do background-image: url("...")
        const match = bgImage.match(/url\(["']?([^"']*)["']?\)/);
        if (match && match[1]) {
            return match[1];
        }
    }

    // Fallback para placeholder
    return `https://via.placeholder.com/1200x800/e5e5e5/999999?text=Projeto+${index + 1}`;
}

// Event listeners do modal
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalPrev) {
    modalPrev.addEventListener('click', prevImage);
}

if (modalNext) {
    modalNext.addEventListener('click', nextImage);
}

// Fechar modal ao clicar fora da imagem
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    }
});

// ========== FORMULÁRIO DE CONTATO ==========
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coletar dados do formulário
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Log dos dados (em produção, você enviaria para um servidor)
        console.log('Formulário enviado:', formData);

        // Feedback visual
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'mensagem enviada!';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.borderColor = '#4CAF50';

        // Resetar formulário
        setTimeout(() => {
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
            submitButton.style.borderColor = '';
        }, 3000);

        // AQUI VOCÊ PODE ADICIONAR O ENVIO REAL
        // Exemplo com Fetch API:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => console.log('Sucesso:', data))
        .catch(error => console.error('Erro:', error));
        */
    });
}

// ========== ANIMAÇÃO DE FADE IN AO SCROLL (OPCIONAL) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar fade in em elementos específicos (opcional)
const fadeElements = document.querySelectorAll('.section-header, .service-item, .sobre-content, .contato-grid');
fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Log
console.log('✨ reframme portfolio loaded');
console.log(`📸 ${totalImages} imagens carregadas`);
