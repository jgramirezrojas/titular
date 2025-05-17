document.addEventListener('DOMContentLoaded', () => {
    // Menú responsive (Hamburguesa)
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // Contadores Animados
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Velocidad de la animación (menor es más rápido)

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let count = 0;

        const updateCount = () => {
            const increment = target / speed;
            count += increment;

            if (count < target) {
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    // Animación de contadores cuando son visibles
    const observerOptions = {
        root: null, // viewport
        threshold: 0.3 // 30% visible
    };

    const achievementSection = document.getElementById('achievements');
    let countersAnimated = false; // Bandera para asegurar que se anime solo una vez

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                counters.forEach(animateCounter);
                countersAnimated = true; // Marcar como animado
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    if (achievementSection) {
        observer.observe(achievementSection);
    }


    // (Opcional) Animación de trayectoria en Canvas - Ejemplo muy básico
    const canvas = document.getElementById('trajectory-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let x = 50;
        let y = canvas.height / 1.5;
        let dx = 2;
        let dy = -3; // Simula un lanzamiento hacia arriba
        let gravity = 0.05;
        let points = [];

        function drawTrajectory() {
            // Limpia una parte del canvas para efecto de "cola" o todo para redibujar
            // ctx.fillStyle = 'rgba(26, 26, 46, 0.1)'; // Efecto de estela
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
             ctx.clearRect(0,0, canvas.width, canvas.height); // Limpia todo


            points.push({x: x, y: y});
            if(points.length > 100) points.shift(); // Limita la longitud de la cola

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for(let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.strokeStyle = 'rgba(0, 170, 255, 0.7)'; // Azul de la trayectoria
            ctx.lineWidth = 3;
            ctx.stroke();

            x += dx;
            dy += gravity;
            y += dy;

            // Reinicia si sale de la pantalla (muy simplificado)
            if (x > canvas.width + 50 || y > canvas.height + 50) {
                x = Math.random() * (canvas.width / 4);
                y = canvas.height / 1.5 + (Math.random() * 100 - 50);
                dx = 1 + Math.random() * 2;
                dy = -2 - Math.random() * 2;
                points = [];
            }
            requestAnimationFrame(drawTrajectory);
        }
        // Descomentar para activar la animación del canvas
        // drawTrajectory();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

/* DOCENCIA */

// ... (código existente del menú y contadores) ...

// Funcionalidad de Modales (reutilizable)
const modalButtons = document.querySelectorAll('.btn-modal');
const closeButtons = document.querySelectorAll('.close-button');

modalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalTarget = document.getElementById(button.dataset.modalTarget);
        if (modalTarget) {
            modalTarget.style.display = 'block';
        }
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});


// Gráficos para la página de Docencia (Ejemplos básicos)
// Necesitarás los datos reales de tu dossier

// Gráfico: Distribución de Cursos por Tipo (Figura 4.2.1 - simplificado)
const coursesTypeCtx = document.getElementById('coursesTypeChart');
if (coursesTypeCtx) {
    new Chart(coursesTypeCtx, {
        type: 'bar', // o 'doughnut', 'pie'
        data: {
            labels: ['Magistral Fundamental', 'Disciplinar Especializado', 'Introductorio/Lab'],
            datasets: [{
                label: 'Número de Cursos Impartidos (Ejemplo)',
                data: [15, 8, 10], // Reemplaza con tus datos reales o proporciones
                backgroundColor: [
                    'rgba(0, 170, 255, 0.7)',
                    'rgba(0, 136, 204, 0.7)',
                    'rgba(128, 191, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(0, 170, 255, 1)',
                    'rgba(0, 136, 204, 1)',
                    'rgba(128, 191, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(224, 224, 224, 0.1)' }
                },
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(224, 224, 224, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}

// Gráfico: Evolución Puntaje Global (Figura 4.7.1 - ejemplo)
const globalScoreCtx = document.getElementById('globalScoreChart');
if (globalScoreCtx) {
    new Chart(globalScoreCtx, {
        type: 'line',
        data: {
            labels: ['2018', '2019', '2020 (Pandemia)', '2021', '2022', '2023', '2024'], // Tus periodos
            datasets: [{
                label: 'Puntaje Global Docente (Ejemplo)',
                data: [148, 145, 140, 142, 148, 143, 150], // Reemplaza con tus datos
                borderColor: 'rgba(0, 170, 255, 1)',
                backgroundColor: 'rgba(0, 170, 255, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { /* ... (similar a arriba) ... */ },
            plugins: { /* ... (similar a arriba) ... */ }
        }
    });
}

// Gráfico: Calificación por Concepto (Figura 4.7.2 - simplificado, muestra un concepto)
const conceptScoreCtx = document.getElementById('conceptScoreChart');
if (conceptScoreCtx) {
     new Chart(conceptScoreCtx, {
        type: 'radar', // o barras agrupadas si son muchos conceptos
        data: {
            labels: ['Trato a Estudiantes', 'Coherencia', 'Gestión de Clase', 'Retroalimentación', 'Habilidades Presentación'],
            datasets: [{
                label: 'Promedio Período Reciente (Ejemplo)',
                data: [4.8, 4.2, 4.0, 4.5, 4.3], // Valores de ejemplo (escala 1-5)
                fill: true,
                backgroundColor: 'rgba(0, 170, 255, 0.3)',
                borderColor: 'rgb(0, 170, 255)',
                pointBackgroundColor: 'rgb(0, 170, 255)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(0, 170, 255)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              line: {
                borderWidth: 2
              }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(224,224,224,0.2)' },
                    grid: { color: 'rgba(224,224,224,0.2)' },
                    pointLabels: { color: '#e0e0e0', font: {size: 10}},
                    ticks: {
                        color: '#1a1a2e', // Ocultar los números de los ticks
                        backdropColor: 'rgba(0,0,0,0)', // Fondo transparente para los ticks
                        stepSize: 1, // O el rango adecuado
                        //beginAtZero: true
                    },
                    min: 0, // Ajusta según tu escala
                    max: 5  // Ajusta según tu escala
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}

// Gráfico: Distribución de Tesis (Figura 4.11.1 - simplificado)
const thesisDistributionCtx = document.getElementById('thesisDistributionChart');
if (thesisDistributionCtx) {
    new Chart(thesisDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Magnetismo/Mat. Magnéticos', 'Óxidos Multifuncionales', 'Aplic. Biomédicas', 'Otros'],
            datasets: [{
                label: 'Distribución Temática Tesis',
                data: [52.2, 26.1, 7.7, 14], // Porcentajes
                backgroundColor: [
                    'rgba(0, 170, 255, 0.8)',
                    'rgba(0, 136, 204, 0.8)',
                    'rgba(128, 191, 255, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}


});

// CSS para la animación de los links del menú (opcional, puedes ponerlo en style.css)
/*
@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}
*/


