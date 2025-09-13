// Premium Disaster Awareness Website - JavaScript
// Apple-style animations and interactive features

class DisasterAwarenessApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupQuiz();
        this.setupFlashcards();
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupDisasterAnimations();
    }

    // Scroll-triggered animations using Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
      if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Stagger animation for grid items
                    if (entry.target.classList.contains('first-aid-grid') || 
                        entry.target.classList.contains('disasters-grid') ||
                        entry.target.classList.contains('stats-grid') ||
                        entry.target.classList.contains('quiz-container') ||
                        entry.target.classList.contains('emergency-grid')) {
                        this.staggerGridItems(entry.target);
                    }

                    // Animate statistics numbers
                    if (entry.target.classList.contains('stats-grid')) {
                        this.animateStatistics();
                    }
                }
            });
        }, observerOptions);

        // Observe all sections and grids
        const elementsToAnimate = document.querySelectorAll(
            '.section-header, .first-aid-grid, .disasters-grid, .stats-grid, .quiz-container, .emergency-grid'
        );
        
        elementsToAnimate.forEach(el => observer.observe(el));
    }

    // Stagger animation for grid items
    staggerGridItems(container) {
        const items = container.querySelectorAll('.first-aid-card, .disaster-card, .stat-card, .quiz-card, .flashcards-container, .emergency-card');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Animate statistics numbers
    animateStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format numbers with commas for large numbers
                if (target >= 1000) {
                    stat.textContent = Math.floor(current).toLocaleString();
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });

        // Animate risk bars
        const riskBars = document.querySelectorAll('.risk-fill');
        riskBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    // Interactive Quiz System
    setupQuiz() {
        const quizQuestions = [
            {
                question: "What should you do if you're caught in a flood?",
                options: [
                    { text: "Move to higher ground", correct: true },
                    { text: "Stay in the car", correct: false },
                    { text: "Swim through the water", correct: false },
                    { text: "Wait for help in the basement", correct: false }
                ]
            },
            {
                question: "During an earthquake, what is the correct sequence?",
                options: [
                    { text: "Run outside immediately", correct: false },
                    { text: "Drop → Cover → Don't move", correct: true },
                    { text: "Stand in a doorway", correct: false },
                    { text: "Go to the basement", correct: false }
                ]
            },
            {
                question: "What does the SAFE mnemonic stand for in cyclone safety?",
                options: [
                    { text: "Stay, Alert, Follow, Emergency", correct: true },
                    { text: "Stop, Ask, Find, Exit", correct: false },
                    { text: "Safety, Action, First, Emergency", correct: false },
                    { text: "Stay, Avoid, Fight, Escape", correct: false }
                ]
            },
            {
                question: "What is the emergency number for earthquake rescue?",
                options: [
                    { text: "112", correct: false },
                    { text: "108", correct: false },
                    { text: "1092", correct: true },
                    { text: "1070", correct: false }
                ]
            }
        ];

        let currentQuestion = 0;
        let score = 0;

        const questionElement = document.getElementById('quiz-question');
        const optionsElement = document.getElementById('quiz-options');
        const feedbackElement = document.getElementById('quiz-feedback');
        const nextButton = document.getElementById('quiz-next');

        function displayQuestion() {
            const question = quizQuestions[currentQuestion];
            questionElement.innerHTML = `<p>${question.question}</p>`;
            
            optionsElement.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option';
                button.textContent = option.text;
                button.setAttribute('data-answer', option.correct ? 'correct' : 'wrong');
                button.addEventListener('click', () => selectAnswer(option.correct, button));
                optionsElement.appendChild(button);
            });

            feedbackElement.style.display = 'none';
            nextButton.style.display = 'none';
        }

        function selectAnswer(isCorrect, selectedButton) {
            const options = optionsElement.querySelectorAll('.quiz-option');
            options.forEach(option => {
                option.disabled = true;
                if (option.getAttribute('data-answer') === 'correct') {
                    option.classList.add('correct');
                } else if (option === selectedButton && !isCorrect) {
                    option.classList.add('wrong');
                }
            });

            if (isCorrect) {
                score++;
                feedbackElement.textContent = 'Correct! Well done! 🎉';
                feedbackElement.className = 'quiz-feedback correct';
            } else {
                feedbackElement.textContent = 'Not quite right. The correct answer is highlighted in green.';
                feedbackElement.className = 'quiz-feedback wrong';
            }

            feedbackElement.style.display = 'block';
            nextButton.style.display = 'block';
        }

        function nextQuestion() {
            currentQuestion++;
            if (currentQuestion < quizQuestions.length) {
                displayQuestion();
            } else {
                showQuizResults();
            }
        }

        function showQuizResults() {
            const percentage = Math.round((score / quizQuestions.length) * 100);
            questionElement.innerHTML = `<h3>Quiz Complete! 🎉</h3><p>You scored ${score} out of ${quizQuestions.length} (${percentage}%)</p>`;
            optionsElement.innerHTML = '';
            feedbackElement.style.display = 'none';
            nextButton.textContent = 'Restart Quiz';
            nextButton.onclick = () => {
                currentQuestion = 0;
                score = 0;
                displayQuestion();
            };
        }

        nextButton.addEventListener('click', nextQuestion);
        displayQuestion();
    }

    // Interactive Flashcards
    setupFlashcards() {
        const flashcards = document.querySelectorAll('.flashcard');
        
        flashcards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
                
                // Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        const navLinkElements = document.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(25px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Disaster-specific background animations
    setupDisasterAnimations() {
        const heroAnimation = document.querySelector('.disaster-animation');
        if (!heroAnimation) return;

        // Cycle through different disaster animations
        const animations = [
            { class: 'flood-animation', duration: 10000 },
            { class: 'earthquake-animation', duration: 8000 },
            { class: 'drought-animation', duration: 12000 },
            { class: 'cyclone-animation', duration: 9000 }
        ];

        let currentAnimationIndex = 0;

        function switchAnimation() {
            // Remove current animation class
            heroAnimation.className = 'disaster-animation';
            
            // Add new animation class
            const animation = animations[currentAnimationIndex];
            heroAnimation.classList.add(animation.class);
            
            // Schedule next animation
            setTimeout(switchAnimation, animation.duration);
            
            // Move to next animation
            currentAnimationIndex = (currentAnimationIndex + 1) % animations.length;
        }

        // Start the animation cycle
        switchAnimation();
    }

    // Utility function for smooth scrolling to sections
    scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Additional CSS for disaster animations and mobile navigation
const additionalStyles = `
    .earthquake-animation {
        background: linear-gradient(45deg, 
            rgba(255, 149, 0, 0.8) 0%, 
            rgba(255, 59, 48, 0.6) 50%, 
            rgba(255, 214, 10, 0.4) 100%);
        animation: earthquakeShake 0.5s ease-in-out infinite;
    }

    .earthquake-animation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="crack" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0,10 L20,10 M10,0 L10,20" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none"/></pattern></defs><rect width="100" height="100" fill="url(%23crack)"/></svg>');
        animation: crackMotion 2s ease-in-out infinite;
    }

    .drought-animation {
        background: linear-gradient(45deg, 
            rgba(255, 214, 10, 0.8) 0%, 
            rgba(255, 149, 0, 0.6) 50%, 
            rgba(255, 107, 107, 0.4) 100%);
        animation: droughtHeat 3s ease-in-out infinite;
    }

    .drought-animation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="heat" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="7.5" cy="7.5" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23heat)"/></svg>');
        animation: heatWaves 4s ease-in-out infinite;
    }

    .cyclone-animation {
        background: linear-gradient(45deg, 
            rgba(142, 142, 147, 0.8) 0%, 
            rgba(28, 28, 30, 0.6) 50%, 
            rgba(0, 122, 255, 0.4) 100%);
        animation: cycloneSpin 4s linear infinite;
    }

    .cyclone-animation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="spiral" x="50" y="50" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M50,50 A25,25 0 0,1 75,50 A25,25 0 0,1 50,50 A12.5,12.5 0 0,1 62.5,50 A12.5,12.5 0 0,1 50,50" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none"/></pattern></defs><rect width="100" height="100" fill="url(%23spiral)"/></svg>');
        animation: spiralMotion 3s linear infinite;
    }

    @keyframes earthquakeShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px) translateY(-1px); }
        75% { transform: translateX(2px) translateY(1px); }
    }

    @keyframes crackMotion {
        0%, 100% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(1px) translateY(-1px); }
    }

    @keyframes droughtHeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.01); }
    }

    @keyframes heatWaves {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    @keyframes cycloneSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes spiralMotion {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1.1); }
    }

    /* Mobile navigation styles */
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(25px);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-lg);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }

    /* Enhanced accessibility */
    .quiz-option:focus,
    .flashcard:focus {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
    }

    /* Success animations */
    .success-animation {
        animation: successPulse 0.6s ease-out;
    }

    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DisasterAwarenessApp();
});

// Make scrollToSection globally available
window.scrollToSection = function(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};