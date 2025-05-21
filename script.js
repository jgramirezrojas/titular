// Registro de plugins de Chart.js
if (typeof Chart !== 'undefined') { // Asegurarse que Chart.js está cargado
    // Registrar plugin de Anotaciones (si lo usas en otros gráficos)
    if (typeof ChartAnnotation !== 'undefined') {
        Chart.register(ChartAnnotation);
        console.log("ChartAnnotation plugin registrado.");
    } else {
        console.warn("Plugin ChartAnnotation no encontrado para registrar.");
    }

    // Registrar plugin DataLabels
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
        console.log("ChartDataLabels plugin registrado.");
    } else {
        console.warn("Plugin ChartDataLabels no encontrado para registrar.");
    }
} else {
    console.error("Chart.js no está cargado. Los gráficos no funcionarán.");
}

Chart.register(ChartDataLabels);

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

    const animateCounter = (counterElement) => {
        const target = +counterElement.getAttribute('data-target');
        let count = 0;

        const updateCount = () => {
            const increment = Math.max(1, target / speed); // Asegura un incremento mínimo de 1
            count += increment;

            if (count < target) {
                counterElement.innerText = Math.ceil(count);
                setTimeout(updateCount, 10); // Un timeout un poco mayor puede suavizar
            } else {
                counterElement.innerText = target;
            }
        };
        updateCount();
    };

    // Animación de contadores cuando son visibles
    const observerOptions = {
        root: null, // Observa en relación al viewport
        threshold: 0.25 // Se activa cuando al menos el 25% del elemento es visible
    };

    // Función para inicializar la observación de contadores en una sección específica
    const initCountersObserver = (sectionId) => {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return; // Si la sección no existe en la página actual, no hacer nada

        let sectionCountersAnimated = false; // Bandera local para esta sección

        const sectionObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !sectionCountersAnimated) {
                    const countersInSection = sectionElement.querySelectorAll('.counter');
                    countersInSection.forEach(animateCounter);
                    sectionCountersAnimated = true; // Marcar como animado para esta sección
                    observerInstance.unobserve(entry.target); // Dejar de observar esta sección
                }
            });
        }, observerOptions);

        sectionObserver.observe(sectionElement);
    };    

    // Inicializar observadores para las secciones con contadores en las diferentes páginas
    initCountersObserver('achievements');      // Para index.html
    initCountersObserver('research-impact');   // Para investigacion.html
    // Si tienes contadores en otras páginas/secciones, añade más llamadas aquí:
    // initCountersObserver('otra-seccion-con-contadores');

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

// Gráfico: Evolución Puntaje Global (con datos oficiales y líneas de rango)
const globalScoreCtx = document.getElementById('globalScoreChart');
if (globalScoreCtx) {
    // Asegurarse de que el plugin de anotaciones esté disponible
    if (typeof Chart === 'undefined' || typeof Chart.registry.plugins.get('annotation') === 'undefined') {
        console.warn("Chart.js o el plugin de anotaciones no están completamente cargados/registrados. Las anotaciones podrían no funcionar.");
    }

    const officialLabels = ['201720', '201810', '201820', '201910', '201920', '202010', '202020', '202110', '202120', '202210', '202220', '202310', '202320', '202410', '202420', 'Acumulado'];
    // *** ¡POR FAVOR, REEMPLAZA ESTOS DATOS CON TUS VALORES EXACTOS! ***
    const officialData = [147, 149, 146.5, 150, 143.5, 144.5, 142.5, 143, 152, 148, 150, 142, 144, 153, 146, 148];

    new Chart(globalScoreCtx, {
        type: 'line',
        data: {
            labels: officialLabels,
            datasets: [{
                label: 'Puntaje Global Docente',
                data: officialData,
                borderColor: 'rgba(0, 170, 255, 1)',       // Línea azul
                backgroundColor: 'rgba(0, 170, 255, 0.2)',  // Relleno azul claro bajo la curva
                pointBackgroundColor: function(context) {
                    const index = context.dataIndex;
                    const Datalength = context.dataset.data.length;
                    // O puedes usar context.chart.data.labels[index] === 'Acumulado'
                    if (index === Datalength - 1) {
                        return 'rgba(255, 204, 0, 1)'; // Amarillo para el último punto ("Acumulado")
                    }
                    return 'rgba(0, 170, 255, 1)'; // Azul para los otros puntos
                },
                pointBorderColor: function(context) {
                    const index = context.dataIndex;
                    const Datalength = context.dataset.data.length;
                    if (index === Datalength - 1) {
                        return 'rgba(255, 204, 0, 1)'; // Borde amarillo para el último punto
                    }
                    return '#fff'; // Borde blanco para los otros puntos
                },
                pointRadius: function(context) {
                    const index = context.dataIndex;
                    const Datalength = context.dataset.data.length;
                    return index === Datalength - 1 ? 6 : 4; // Último punto un poco más grande
                },
                pointHoverRadius: function(context) {
                    const index = context.dataIndex;
                    const Datalength = context.dataset.data.length;
                    return index === Datalength - 1 ? 8 : 6;
                },
                tension: 0.1, // Para curvas suaves
                fill: true    // Relleno bajo la curva activado
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 125, // Ajustado al rango de tu gráfica oficial
                    max: 175, // Ajustado al rango de tu gráfica oficial
                    ticks: {
                        color: '#e0e0e0', // Color de ticks del eje Y (para tema oscuro)
                        stepSize: 5 // O 10, para que coincida con las divisiones de tu gráfica oficial
                    },
                    grid: {
                        color: 'rgba(224, 224, 224, 0.1)' // Grid sutil para tema oscuro
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0',
                        maxRotation: 45,
                        minRotation: 30
                    },
                    grid: {
                        color: 'rgba(224, 224, 224, 0.05)' // Grid vertical muy sutil o display: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                },
                annotation: {
                    annotations: {
                        lineaRangoSuperior: {
                            type: 'line',
                            yMin: 158, // Límite superior de la zona "Promedio" (Amarillo claro en tu gráfica)
                            yMax: 158, // O el valor exacto que defina el cambio a "Promedio-Alto"
                            borderColor: 'rgba(144, 238, 144, 0.5)', // Verde claro sutil para el límite superior de Promedio
                            borderWidth: 2,
                            borderDash: [5, 5], // Opcional: línea discontinua
                            label: {
                                content: 'Umbral Promedio-Alto',
                                display: true,
                                position: 'start',
                                color: 'rgba(144, 238, 144, 0.9)',
                                font: { size: 10, weight: 'normal' },
                                backgroundColor: 'rgba(26, 26, 46, 0.7)' // Fondo para la etiqueta
                            }
                        },
                        lineaRangoMedio: { // Esta sería la línea entre Promedio y Promedio-Bajo
                            type: 'line',
                            yMin: 145, // Límite inferior de la zona "Promedio" (Amarillo claro)
                            yMax: 145, // O el valor exacto que defina el cambio a "Promedio-Bajo"
                            borderColor: 'rgba(255, 224, 189, 0.5)', // Naranja claro sutil
                            borderWidth: 2,
                            borderDash: [5, 5],
                             label: {
                                content: 'Umbral Promedio',
                                display: true,
                                position: 'start',
                                color: 'rgba(255, 224, 189, 0.9)',
                                font: { size: 10, weight: 'normal' },
                                backgroundColor: 'rgba(26, 26, 46, 0.7)'
                            }
                        },
                        lineaRangoBajo: { // Esta sería la línea entre Promedio-Bajo y la zona inferior
                            type: 'line',
                            yMin: 135, // Límite inferior de la zona "Promedio-Bajo" (Naranja claro)
                            yMax: 135,
                            borderColor: 'rgba(255, 192, 203, 0.5)', // Rosa claro sutil
                            borderWidth: 2,
                            borderDash: [5, 5],
                             label: {
                                content: 'Umbral Promedio-Bajo',
                                display: true,
                                position: 'start',
                                color: 'rgba(255, 192, 203, 0.9)',
                                font: { size: 10, weight: 'normal' },
                                backgroundColor: 'rgba(26, 26, 46, 0.7)'
                            }
                        }
                    }
                }
            }
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
                data: [153.2, 141.1, 144.6, 144.2, 144.2], // Valores de ejemplo (escala 1-5)
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
                        color: 'rgba(224,224,224,0.2)',//'#1a1a2e', // Ocultar los números de los ticks
                        backdropColor: 'rgba(0,0,0,0)', // Fondo transparente para los ticks
                        stepSize: 5, // O el rango adecuado
                        //beginAtZero: true
                    },
                    min: 130, // Ajusta según tu escala
                    max: 155  // Ajusta según tu escala
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

// ... (código existente) ...

// FILTROS PARA PUBLICACIONES (investigacion.html)
const yearFilter = document.getElementById('year-filter');
const searchFilterInput = document.getElementById('search-filter');
const publicationsListItems = document.querySelectorAll('#publications-list li');

function filterPublications() {
    const selectedYear = yearFilter ? yearFilter.value : 'all';
    const searchTerm = searchFilterInput ? searchFilterInput.value.toLowerCase() : '';

    publicationsListItems.forEach(item => {
        const itemYear = item.dataset.year;
        const itemText = item.textContent.toLowerCase();
        let matchesYear = (selectedYear === 'all' || itemYear === selectedYear);
        let matchesSearch = (searchTerm === '' || itemText.includes(searchTerm));

        if (matchesYear && matchesSearch) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

if (yearFilter) {
    yearFilter.addEventListener('change', filterPublications);
}
if (searchFilterInput) {
    searchFilterInput.addEventListener('input', filterPublications);
}
// Cargar inicialmente todas las publicaciones si la lista es dinámica
// Si la lista es estática en HTML, esta llamada inicial no es estrictamente necesaria
// pero es buena práctica si en el futuro se carga con JS.
if (publicationsListItems.length > 0) {
    filterPublications();
}


// GRÁFICO DE CRECIMIENTO DE CITACIONES (investigacion.html)
const citationsGrowthCtx = document.getElementById('citationsGrowthChart');
if (citationsGrowthCtx) {
    new Chart(citationsGrowthCtx, {
        type: 'line',
        data: {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025 (Proy.)'], // Años
            datasets: [{
                label: 'Citaciones Acumuladas',
                data: [220, 398, 696, 981, 1330, 1669, 2257, 2374], // Datos de ejemplo, reemplaza
                borderColor: 'rgba(0, 170, 255, 1)',
                backgroundColor: 'rgba(0, 170, 255, 0.1)',
                fill: true,
                tension: 0.2
            },
            {
                label: 'Citaciones Anuales', // Opcional: dataset para citaciones anuales
                data: [220, 178, 298, 285, 349, 339, 288, 117], // Datos de ejemplo, reemplaza
                borderColor: 'rgba(128, 191, 255, 1)',
                type: 'bar', // Mostrar como barras si se desea
                backgroundColor: 'rgba(128, 191, 255, 0.5)',
            }
            ]
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
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
}

// (Opcional) Inicialización del Mapa de Colaboraciones (si decides usar Leaflet.js)

const collaborationMapElement = document.getElementById('collaboration-map');
// ... (otro código JS, como la inicialización del mapa y el tileLayer) ...

if (typeof L !== 'undefined') {
    const map = L.map('collaboration-map').setView([20, 0], 1); // Ajusta el zoom inicial si es necesario

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { // Usando CartoDB Positron como ejemplo
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 2
    }).addTo(map);

    // Array de Colaboraciones
    const collaborations = [
        {
            lat: 32.8801, lng: -117.2340,
            name: "UC San Diego, EEUU",
            details: "Prof. Ivan K. Schuller, Prof. Oleg Shpyrko, Prof. Alex Frano<br>Magnetismo, Óxidos, Interfaces, Técnicas de Sincrotrón."
        },
        {
            lat: -22.8172, lng: -47.0696,
            name: "UNICAMP, Brasil",
            details: "Prof. Marcelo Knobel, Prof. Diego Muraca<br>Nanopartículas magnéticas, BiFeO₃."
        },
        {
            lat: 41.3851, lng: 2.1734,
            name: "Barcelona, España",
            details: "Universitat de Barcelona (Dr. Xavier Batlle, Dr. Amílcar Labarta)<br>Sistemas magnéticos, efectos de proximidad." // Reemplaza con detalles específicos
        },
        {
            lat: 48.8566, lng: 2.3522,
            name: "París, Francia",
            details: "ESPCI Paris (Doble titulación)<br>Investigación en física y química." // Reemplaza con detalles específicos
        },
        {
            lat: 31.7683, lng: 35.2137,
            name: "Israel",
            details: "Bar Ilan University (Physics Seminar)<br>Dinámica de magnetización." // Reemplaza con detalles específicos
        },
        {
            lat: 39.7392, lng: -104.9903,
            name: "Denver, EEUU", // Asumiendo colaboración en Denver, Colorado
            details: "Colaboración en [Área específica]<br>Institución/Contacto." // Reemplaza con detalles específicos
        },
        {
            lat: 43.2630, lng: -2.9350,
            name: "Bilbao, España",
            details: "Universidad del País Vasco (Posible colaboración Magnamed meeting)<br>Detalles de la colaboración." // Reemplaza con detalles específicos
        },
        {
            lat: 6.2442, lng: -75.5812,
            name: "Medellín, Colombia",
            details: "Colaboración con U. Nacional/U. de Antioquia<br>Proyectos SGR, Workshops." // Reemplaza con detalles específicos
        },
        {
            lat: 3.4516, lng: -76.5320,
            name: "Cali, Colombia",
            details: "Universidad del Valle (Prof. Maria E. Gómez)<br>Multicapas magnéticas, Proyecto SGR." // Reemplaza con detalles específicos
        },
        {
            lat: 10.9639, lng: -74.7964,
            name: "Barranquilla, Colombia",
            details: "Universidad del Norte (Dr. Rafael González-Hernández)<br>Cálculos teóricos, DFT." // Reemplaza con detalles específicos
        },
        {
            lat: 5.0689, lng: -75.5174,
            name: "Manizales, Colombia",
            details: "Universidad Autónoma de Manizales (Prof. Oscar Moscoso)<br>Caracterización FORC." // Reemplaza con detalles específicos
        },
        {
            lat: 59.3293, lng: 18.0686, // Estocolmo, Suecia como ejemplo
            name: "Suecia",
            details: "Colaboración en [Área específica]<br>Institución/Contacto (Ej. U. Gotemburgo - V.H. González)." // Reemplaza con detalles específicos
        },
        {
            lat: 52.5200, lng: 13.4050, // Berlín, Alemania
            name: "Helmholtz-Zentrum Berlin, Alemania",
            details: "Dr. Florian Kronast<br>Técnicas de caracterización magnética avanzada."
        },
        {
            lat: -23.5558, lng: -46.7300, // São Paulo, Brasil (cerca de UNICAMP, podría ser otra inst.)
            name: "LNLS/CNPEM, Brasil",
            details: "Luz Sincrotrón, Colaboraciones en caracterización."
        },
        {
            lat: 42.4440, lng: -76.5019,
            name: "Cornell University, EEUU",
            details: "Special Seminar, Materials Science and Engineering.<br>Magnetism dynamics of oxide-magnetic heterostructures.<br>Charlas invitadas (2022). <br> Colaboración en Difracción XRD.<br>Contacto/Departamento: Prof. Andrej Singer.<br>Charlas/Proyectos: Quantum Materials for computing." // Puedes añadir más detalles si lo deseas
        },
                // ... (otros marcadores, como el de Cornell University) ...
        {
            lat: 40.4470, lng: -3.7278,
            name: "Universidad Complutense de Madrid, España",
            details: "Colaboración en Difracción XRD.<br>Contacto/Departamento: Prof. Andrej Singer.<br>Charlas/Proyectos: Quantum Materials for computing."
        },
        // ... (otros marcadores, como el de Cornell University) ...
        {
            lat: 40.4470, lng: -3.7278,
            name: "Universidad Complutense de Madrid, España",
            details: "Colaboración en [Área específica de colaboración].<br>Contacto/Departamento: [Si aplica].<br>Charlas/Proyectos: [Menciona si hubo alguna actividad específica]."
        }
        // ... puedes seguir añadiendo más objetos de colaboración aquí ...
    ];

    collaborations.forEach(collab => {
        L.marker([collab.lat, collab.lng]).addTo(map)
            .bindPopup(`<b>${collab.name}</b><br>${collab.details}`);
    });

} else {
    console.error("Leaflet.js (L) no está cargado. Asegúrate de que el script y el CSS estén en el <head>.");
}

// ... (código existente) ...

// GRÁFICO DE DISTRIBUCIÓN DE TESIS POR NIVEL (docencia.html)
const thesisLevelCtx = document.getElementById('thesisLevelDistributionChart');
if (thesisLevelCtx) {
    new Chart(thesisLevelCtx, {
        type: 'doughnut', // o 'pie'
        data: {
            labels: ['Pregrado', 'Maestría', 'Doctorado'],
            datasets: [{
                label: 'Número de Tesis',
                data: [20, 4, 2], // Tus datos: 20 pregrado, 4 maestría, 2 doctorado
                backgroundColor: [
                    'rgba(0, 170, 255, 0.8)',  // Azul Uniandes
                    'rgba(128, 191, 255, 0.8)',// Azul más claro
                    'rgba(0, 100, 170, 0.8)'  // Azul más oscuro
                ],
                borderColor: [
                    'rgba(0, 170, 255, 1)',
                    'rgba(128, 191, 255, 1)',
                    'rgba(0, 100, 170, 1)'
                ],
                borderWidth: 1,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + ' tesis';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// DATOS DE ESTUDIANTES DESTACADOS (pon tus datos reales aquí)
const featuredStudentsData = [
    {
        name: "Alexander Cardona Rodríguez",
        level: "doctorado",
        icon: "fas fa-user-doctor",
        thesis: "Tuning the magnetic properties of multiferroic BiFeO₃: From bulk to nanoscale (2016-2022).",
        achievements: "Cuatro publicaciones de alto impacto durante su doctorado (ej. Sci. Rep. 2019, JMMM 2022). Actualmente profesor de cátedra Uniandes y Rosario, y postdoctorando en proyecto SGR QUANEC.",
        publications: "Control of Multiferroic properties in BiFeO₃ nanoparticles (Scientific Reports, 2019); Resolving magnetic contributions in BiFeO₃ nanoparticles (JMMM, 2022)."
    },
    {
        name: "Diego Andrés Carranza Celis",
        level: "doctorado",
        icon: "fas fa-user-doctor",
        thesis: "Tailoring electronic phase separation in Pr-doped mixed-valence manganite (Completada Dic 2024).",
        achievements: "Contribuciones fundamentales al entendimiento de separación de fase en manganitas. Múltiples publicaciones (ej. Phys. Rev. Materials 2021, 2024). Proyectado para postdoc en SGR QUANEC.",
        publications: "Low-temperature paramagnetic phase reentrance (Phys. Rev. Materials, 2024); Magnetism dynamics driven by phase separation (Phys. Rev. Materials, 2021)."
    },
    {
        name: "Victor Hugo González Sánchez",
        level: "maestria",
        icon: "fas fa-user-graduate",
        thesis: "Study of RKKY coupling in Co/Nb/Co trilayers via magnetoresistance (2018-2020).",
        achievements: "Pasantía en ESPCI París. Actualmente investigador postdoctoral en la Universidad de Gotemburgo (Suecia) en espintrónica aplicada.",
        publications: "Continuación de línea de investigación iniciada en maestría." // Puedes añadir si hay alguna publicación específica
    },
    {
        name: "Daniel Fabián Hernández",
        level: "maestria",
        icon: "fas fa-user-graduate",
        thesis: "Confinamiento del pentóxido de vanadio V₂O₅ y la influencia del tamaño en sus propiedades ópticas (2021).",
        achievements: "Actualmente estudiante de Doctorado en Física en Uniandes y Asistente Graduado Docente, continuando la línea de investigación.",
        publications: "Tuning electronic and magnetic properties through disorder in V₂O₅ nanoparticles (Sci. Rep. 2023, coautor)."
    },
    // --- AÑADE MÁS ESTUDIANTES DE PREGRADO AQUÍ ---
    {
        name: "Sergio Andrés Correal López",
        level: "pregrado",
        icon: "fas fa-graduation-cap",
        thesis: "Efecto del cambio estructural y de vacancias de oxígeno en las propiedades ópticas y electrónicas del V₂O₅ mediante primeros principios.",
        achievements: "Publicación como primer autor en Sci. Rep. (2023). Actualmente en doctorado en UC San Diego.",
        publications: "Tuning electronic and magnetic properties through disorder in V₂O₅ nanoparticles (Sci. Rep. 2023, primer autor)."
    },
    {
        name: "Andrea Esquivel Sánchez",
        level: "pregrado",
        icon: "fas fa-graduation-cap",
        thesis: "Detection of polarons in reduced vanadium oxide V₂O₅₋ₓ.",
        achievements: "Publicación como primer autor en Sci. Rep. (2023). Actualmente en doctorado en la Universidad Paris Cité (Francia).",
        publications: "Tuning electronic and magnetic properties through disorder in V₂O₅ nanoparticles (Sci. Rep. 2023, primer autor)."
    },
    // Añade más estudiantes como Carlos Felipe Eugenio, Mily Geraldine Sánchez, Juan David Rueda T.
    {
        name: "Carlos Felipe Eugenio Gómez",
        level: "pregrado",
        icon: "fas fa-graduation-cap",
        thesis: "High-Entropy Spinel Oxides: Structural and Magnetic Characterization through Neutron Diffraction.",
        achievements: "Intercambio en U. Copenhague. Seleccionado para Lindau Nobel Laureate Meeting. Presentación en IMRC. Próximo a Maestría en Física (HEO).",
        publications: "(En preparación)"
    }
];

const studentListContainer = document.getElementById('featured-students-list');
const studentLevelFilter = document.getElementById('student-level-filter');

function displayStudents(level = 'all') {
    if (!studentListContainer) return;
    studentListContainer.innerHTML = ''; // Limpiar lista actual

    const filteredStudents = (level === 'all')
        ? featuredStudentsData
        : featuredStudentsData.filter(student => student.level === level);

    if (filteredStudents.length === 0) {
        studentListContainer.innerHTML = '<p style="text-align:center; color:#a0a0a0;">No hay estudiantes destacados para este nivel.</p>';
        return;
    }

    filteredStudents.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.classList.add('student-card');
        studentCard.dataset.level = student.level; // Para posible filtrado futuro más complejo

        let levelText = student.level.charAt(0).toUpperCase() + student.level.slice(1);

        studentCard.innerHTML = `
            <div class="student-card-header">
                <i class="${student.icon || 'fas fa-user'} student-icon"></i>
                <h4>${student.name} <span class="student-level-tag">${levelText}</span></h4>
            </div>
            <p><strong>Tesis:</strong> ${student.thesis || 'No especificada'}</p>
            <p><strong>Logros/Actualidad:</strong> ${student.achievements || 'Información no disponible.'}</p>
            ${student.publications ? `<p class="student-publications"><em>Publicaciones Clave: ${student.publications}</em></p>` : ''}
        `;
        studentListContainer.appendChild(studentCard);
    });
}

// Event listener para el filtro
if (studentLevelFilter) {
    studentLevelFilter.addEventListener('change', (event) => {
        displayStudents(event.target.value);
    });
}

// Cargar inicialmente los estudiantes de doctorado
if (studentListContainer && studentLevelFilter) { // Asegurarse que ambos existen
    displayStudents(studentLevelFilter.value); // Usar el valor actual del select
} else if (studentListContainer) {
    // Fallback si el filtro no existe, aunque no debería pasar con el HTML correcto
    displayStudents('doctorado');
}


// ... (código existente) ...

// DATOS DE CHARLAS INVITADAS (investigacion.html)
// Basado en la Tabla 5.6.1 de tu dossier
const invitedTalksData = [
    // 2025
    { year: "2025", title: "Control Of Metastable States in Phase-Separated Pr-doped Manganites", event: "International Workshop on Spintronics - Spin Galapagos 2025", location: "Islas Galápagos, Ecuador", date: "25-30 de mayo" },
    // 2024
    { year: "2024", title: "Effect Of Superconductivity On Magnetism In A Superconducting/Magnetic Hybrid", event: "IMRC 2024", location: "Cancún, México", date: "21 de agosto" },
    { year: "2024", title: "Emergence Of Metastable States In Electronic Phases-Separated Manganites", event: "IMRC 2024", location: "Cancún, México", date: "20 de agosto" },
    { year: "2024", title: "Magnetism dynamics of magnetic oxide heterostructures", event: "Coloquio Instituto de Física Gleb Wataghin IFGW, Unicamp", location: "Campinas, Brasil", date: "6 de junio" },
    // 2023
    { year: "2023", title: "Magnetization Dynamics: From Fundamentals to Applications", event: "Tercera Escuela Colombiana De Magnetismo", location: "Manizales, Colombia", date: "17 de noviembre" },
    { year: "2023", title: "Magnetism dynamics of magnetic oxide heterostructures", event: "Simposio de Imanes Permanentes y Materiales para Energías Limpias", location: "Cali, Colombia", date: "8 de noviembre" },
    { year: "2023", title: "Fabrication and characterization of Iron Oxide-based nanodisks for medical applications", event: "Magnamed meeting", location: "Bilbao, España", date: "19 de octubre" },
    { year: "2023", title: "Physical properties driven by phase separation in electron-correlated materials", event: "4ta Escuela de Física Estadística", location: "Bogotá, Colombia", date: "6 de octubre" },
    { year: "2023", title: "Strongly correlated materials for quantum technology: Experimental approach", event: "2nd Workshop on Higher Structures in Algebra, Geometry, Topology and Physics", location: "Barranquilla, Colombia", date: "28 de febrero" },
    // 2022
    { year: "2022", title: "Nanoscale properties of multifunctional oxide materials: Role of defects and microstructure", event: "International Workshop Ceramics Nanomaterials, Magnetism and Cryogenics", location: "Medellín, Colombia", date: "25 de noviembre" },
    { year: "2022", title: "Neuromorphic Computing: Analog vs Digital", event: "Neuromorphic lecture series, UC San Diego", location: "San Diego, CA, EE.UU.", date: "21 de julio" },
    { year: "2022", title: "Magnetism dynamics of oxide-magnetic heterostructures", event: "Special Seminar, Materials Science and Engineering, Cornell University", location: "Ithaca, NY, EE.UU.", date: "11 de mayo" },
    // 2021
    { year: "2021", title: "Micromagnetic simulations to explore nanoscale effects in complex materials", event: "1st Latin-American tutorial of magnetism", location: "Virtual", date: "8-19 de noviembre" },
    { year: "2021", title: "Fenómenos cuánticos en sistemas de baja dimensionalidad", event: "Coloquio Física, Universidad de los Andes", location: "Bogotá, Colombia", date: "12 de octubre" },
    { year: "2021", title: "Unusual Dynamical Properties of Oxide-Magnetic nanostructures", event: "Condensed Matter Physics Seminar, Universidad Nacional La Plata", location: "La Plata, Argentina", date: "5 de octubre" },
    { year: "2021", title: "Unusual dynamical properties of oxide-magnetic heterostructures: Proximity effects", event: "Condensed Matter Physics Seminar, Universidad de Chile", location: "Santiago, Chile (Virtual)", date: "7 de abril" },
    // 2020
    { year: "2020", title: "Unusual dynamical properties of oxide-magnetic heterostructures", event: "Annual Conference on Magnetism and Magnetic Materials", location: "Virtual", date: "2 de noviembre" },
    { year: "2020", title: "Confinement effects in quantum matter", event: "Universidad del Norte", location: "Barranquilla, Colombia", date: "23 de enero" },
    // 2019
    { year: "2019", title: "Mechanisms of the photo- and voltage-induced phase transition in the electron-correlated V₂O₃", event: "XXVII International Materials Research Congress", location: "Cancún, México", date: "18-23 de agosto" },
    // 2018
    { year: "2018", title: "Tailoring novel functionalities in quantum materials", event: "Materials Science & Engineering Seminar, University of Florida", location: "Gainesville, FL, EE.UU.", date: "4 de septiembre" },
    { year: "2018", title: "Size-induced multiferroicity in oxide nanoparticles", event: "XXVII International Materials Research Congress", location: "Cancún, México", date: "19-24 de agosto" },
    { year: "2018", title: "Magnetism @Uniandes", event: "1st Cali Magnetism School, Universidad del Valle", location: "Cali, Colombia", date: "26/02 - 2/03" },
    // 2017
    { year: "2017", title: "Dinámica ultra-rápida de transiciones de fase de primer orden", event: "Physics Seminar at Universidad del Valle", location: "Cali, Colombia", date: "18 de octubre" },
    { year: "2017", title: "Correlaciones cuánticas en sólidos", event: "Physics Colloquium, Universidad Distrital", location: "Bogotá, Colombia", date: "8 de septiembre" },
    // 2016
    { year: "2016", title: "Pathways to control magnetization dynamics with first-order phase transitions", event: "Physics Seminar, Bar Ilan University", location: "Israel", date: "20 de diciembre" },
    { year: "2016", title: "Controlling magnetization dynamics in heterostructures with first-order phase transitions", event: "Physics Seminar, Universidad Autónoma de Madrid", location: "Madrid, España", date: "14 de diciembre" },
    { year: "2016", title: "Strongly correlated materials: Nanoscale Phase coexistence as a tool for magnetic control", event: "1st Workshop on Superconductivity and Magnetism at Low Dimensionality", location: "Bogotá, Colombia", date: "5 de diciembre" },
    { year: "2016", title: "Controlling magnetization dynamics in hybrid heterostructures with first-order phase transitions", event: "61st Annual Conference on Magnetism and Magnetic Materials", location: "New Orleans, EE.UU.", date: "31/10 - 4/11" },
    // 2015
    { year: "2015", title: "Control of magnetization dynamics in hybrid materials at the nanoscale", event: "3rd International Conference on Nanoscience, Nanotechnology, and Nanobiotechnology", location: "Brasília, Brasil", date: "14-18 de diciembre" },
];

const talksListContainer = document.getElementById('invited-talks-list');
const talkYearFilter = document.getElementById('talk-year-filter');
const talkSearchFilterInput = document.getElementById('talk-search-filter');

function displayInvitedTalks(year = 'all', searchTerm = '') {
    if (!talksListContainer) return;
    talksListContainer.innerHTML = ''; // Limpiar lista

    const lowerSearchTerm = searchTerm.toLowerCase();

    const filteredTalks = invitedTalksData.filter(talk => {
        const matchesYear = (year === 'all' || talk.year === year);
        const matchesSearch = (searchTerm === '' ||
                              talk.title.toLowerCase().includes(lowerSearchTerm) ||
                              talk.event.toLowerCase().includes(lowerSearchTerm) ||
                              talk.location.toLowerCase().includes(lowerSearchTerm));
        return matchesYear && matchesSearch;
    });

    if (filteredTalks.length === 0) {
        talksListContainer.innerHTML = '<p style="text-align:center; color:#a0a0a0;">No se encontraron charlas para los criterios seleccionados.</p>';
        return;
    }

    filteredTalks.forEach(talk => {
        const talkItem = document.createElement('li');
        talkItem.dataset.year = talk.year; // Para consistencia, aunque el filtrado principal es por JS

        talkItem.innerHTML = `
            <div class="talk-meta">
                <span class="talk-year-badge">${talk.year}</span>
                <span class="talk-date">${talk.date}</span>
            </div>
            <span class="talk-title">${talk.title}</span>
            <span class="talk-event-location">
                <i class="fas fa-map-marker-alt"></i> ${talk.event} (${talk.location})
            </span>
        `;
        talksListContainer.appendChild(talkItem);
    });
}

// Event listeners para los filtros de charlas
if (talkYearFilter) {
    talkYearFilter.addEventListener('change', () => {
        displayInvitedTalks(talkYearFilter.value, talkSearchFilterInput ? talkSearchFilterInput.value : '');
    });
}
if (talkSearchFilterInput) {
    talkSearchFilterInput.addEventListener('input', () => {
        displayInvitedTalks(talkYearFilter ? talkYearFilter.value : 'all', talkSearchFilterInput.value);
    });
}

// Cargar todas las charlas (o el año por defecto si se configura) al inicio
if (talksListContainer) {
    // Si quieres un año por defecto (ej. 2025), ajústalo en el HTML <select> con 'selected'
    // y luego el valor inicial del filtro lo tomará de ahí.
    displayInvitedTalks(talkYearFilter ? talkYearFilter.value : 'all', talkSearchFilterInput ? talkSearchFilterInput.value : '');
}



// GRÁFICO DE DISTRIBUCIÓN DE RECURSOS SGR (investigacion.html)
const sgrDistributionCtx = document.getElementById('sgrDistributionChart');
if (sgrDistributionCtx) {
    const sgrLabels = [
        'Universidad de Envigado',
        'Universidad de la Amazonia',
        'Maloka',
        'Universidad del Norte',
        'Universidad de Antioquia',
        'Universidad del Valle',
        'Universidad de los Andes'
    ].reverse(); // Reverse para que U. Andes quede arriba como en tu imagen

    const sgrDataPercentages = [
        0.85,
        1.83,
        2.21,
        4.37,
        6.06,
        11.9,
        72.78
    ].reverse(); // Reverse para que U. Andes quede arriba

    // (Opcional) Si tienes los valores absolutos en Miles de Millones de COP
    // const sgrDataAbsolute = [/*...valores en orden correspondiente a sgrLabels ANTES de reverse...*/].reverse();

    new Chart(sgrDistributionCtx, {
        type: 'bar',
        data: {
            labels: sgrLabels,
            datasets: [{
                label: '% del Financiamiento SGR',
                data: sgrDataPercentages,
                backgroundColor: 'rgba(0, 123, 255, 0.7)', // Azul similar al de tu imagen
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Esto hace que las barras sean horizontales
            responsive: true,
            maintainAspectRatio: false, // Permite controlar mejor la altura con CSS del contenedor
            scales: {
                x: { // Anteriormente eje Y en gráfico de barras vertical
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje del Financiamiento (%)', // O 'Miles de Millones de Pesos COP' si usas datos absolutos
                        color: '#e0e0e0',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#e0e0e0',
                        callback: function(value) { // Formatear ticks para mostrar '%'
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(224, 224, 224, 0.1)', // Líneas de grid claras
                        borderColor: 'rgba(224, 224, 224, 0.1)' // Línea del eje X
                    }
                },
                y: { // Anteriormente eje X
                    ticks: {
                        color: '#e0e0e0',
                        font: {
                            size: 11 // Ajustar tamaño para nombres largos
                        }
                    },
                    grid: {
                        display: false // Ocultar líneas de grid verticales para el eje Y
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // La leyenda no es muy necesaria para un solo dataset
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.x !== null) { // Para barras horizontales, el valor está en .x
                                label += context.parsed.x.toFixed(2) + '%';
                            }
                            return label;
                        }
                    }
                },
                // Plugin para mostrar los valores directamente en las barras (opcional, pero como en tu imagen)
                datalabels: { // Necesitarías el plugin chartjs-plugin-datalabels
                    anchor: 'end',
                    align: 'end',
                    color: '#e0e0e0', // Color del texto de la etiqueta
                    font: {
                        weight: 'normal',
                        size: 10
                    },
                    formatter: function(value, context) {
                        return value.toFixed(2) + '%';
                    },
                    // Offset para que no se solape con el borde de la barra
                    offset: 4, // Ajusta este valor
                    // clamp: true // Para evitar que la etiqueta se salga del área del gráfico
                }
            }
        },
        // Registrar el plugin de datalabels si lo vas a usar
        // plugins: [ChartDataLabels] // Descomenta si instalas y registras chartjs-plugin-datalabels
    });
}

// ... (código existente) ...


// GRÁFICO DE DISTRIBUCIÓN DE CUARTILES (investigacion.html) - BARRAS HORIZONTALES
const quartileChartCtx = document.getElementById('quartilePieChart'); // O el ID que estés usando para el canvas
if (quartileChartCtx) {
    const quartileLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
    const quartileValues = [26, 10, 3, 0]; // Tus datos

    const totalPublications = quartileValues.reduce((sum, value) => sum + value, 0);

    new Chart(quartileChartCtx, {
        type: 'bar',
        data: {
            labels: quartileLabels,
            datasets: [{
                label: 'Número de Publicaciones',
                data: quartileValues,
                backgroundColor: [
                    'rgba(0, 170, 255, 0.8)',  // Q1
                    'rgba(0, 136, 204, 0.8)',  // Q2
                    'rgba(128, 191, 255, 0.7)',// Q3
                    'rgba(100, 100, 120, 0.6)' // Q4 (se mostrará como una barra de altura 0 si el valor es 0)
                ],
                borderColor: [
                    'rgba(0, 170, 255, 1)',
                    'rgba(0, 136, 204, 1)',
                    'rgba(128, 191, 255, 1)',
                    'rgba(100, 100, 120, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Para barras horizontales
            scales: {
                x: { // Eje X (valores de las publicaciones)
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0',
                        stepSize: 5, // Ajusta según el rango de tus datos
                        padding: 10 // Espacio entre los ticks y el eje
                    },
                    grid: {
                        drawOnChartArea: true, // Dibuja líneas de cuadrícula para los ticks del eje X
                        color: 'rgba(224, 224, 224, 0.1)', // Color de las líneas de cuadrícula visibles
                        drawBorder: true, //  dibuja la línea que bordea el área del gráfico en este eje

                    },
                    title: {
                        display: true,
                        text: 'Número de Publicaciones',
                        color: '#c0c0c0',
                        font: {
                            size: 12,
                            weight: 'normal'
                        },
                        padding: { top: 10, bottom: 0 }
                    }
                },
                y: { // Eje Y (Cuartiles Q1, Q2, etc.)
                    ticks: {
                        color: '#e0e0e0',
                        padding: 10 // Espacio entre las etiquetas y el eje
                    },
                    grid: {
                        drawOnChartArea: true, // Dibuja líneas de cuadrícula para los ticks del eje Y (serán verticales)
                        color: 'rgba(224, 224, 224, 0.1)',
                        drawBorder: true //  dibuja la línea que bordea el área del gráfico en este eje
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // La leyenda del dataset es usualmente redundante para un solo dataset en barras
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 36, 71, 0.9)', // Fondo del tooltip
                    titleColor: '#00aaff', // Color del título del tooltip
                    bodyColor: '#e0e0e0', // Color del cuerpo del tooltip
                    borderColor: '#00aaff',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || ''; // "Número de Publicaciones"
                            if (label) {
                                label += ': ';
                            }
                            // Para barras horizontales (indexAxis: 'y'), el valor está en context.parsed.x
                            const value = context.parsed.x;
                            label += value;

                            const percentage = totalPublications > 0 ? ((value / totalPublications) * 100).toFixed(1) : 0;
                            label += ` (${percentage}%)`;
                            return label;
                        }
                    }
                },
                title: { // Título principal del gráfico (opcional, ya que tienes un <h3> en HTML)
                    display: true,
                    text: 'Distribución de Publicaciones por Cuartil (Q) desde 2015',
                    color: '#ffffff',
                    font: {
                        size: 16,
                        family: 'Montserrat, sans-serif' // Coincidir con tus h
                    },
                    padding: {
                        top: 0, // Si el h3 ya da espacio
                        bottom: 20 // Espacio debajo del título del gráfico
                    }
                },
                    datalabels: {
                        // --- POSICIONAMIENTO ---
                        anchor: 'center',
                        // Descripción: Define el punto de anclaje de la etiqueta en la barra.
                        // Opciones:
                        //  'start': Al inicio de la barra (cerca del eje Y para barras horizontales).
                        //  'center': En el centro de la barra.
                        //  'end': Al final de la barra (donde termina la barra).
                        // Para barras horizontales, 'end' suele ser una buena opción para poner el texto al final de la barra.

                        align: 'end',
                        // Descripción: Define la alineación de la etiqueta con respecto a su punto de anclaje.
                        // Opciones (relativas a la barra y 'anchor'):
                        //  'start': El inicio de la etiqueta se alinea con el 'anchor'.
                        //  'center': El centro de la etiqueta se alinea con el 'anchor'.
                        //  'end': El final de la etiqueta se alinea con el 'anchor'.
                        // También puede ser un ángulo (ej. 45) o valores como 'left', 'right', 'top', 'bottom' (más útil para 'center' anchor).
                        // Para 'anchor: end' en barras horizontales, 'align: start' o 'align: center' podría poner la etiqueta justo *después* de la barra si hay 'offset'.
                        // 'align: end' con 'anchor: end' la pondría justo *dentro* al final de la barra.
                        // Para tu imagen, parece que los números están *dentro* y al final de la barra.

                        offset: -10, // Ajusta este valor si 'align: end' y 'anchor: end' no es suficiente
                        // Descripción: Distancia en píxeles desde el punto de anclaje.
                        // Un valor positivo mueve la etiqueta *hacia afuera* de la barra (si align lo permite).
                        // Un valor negativo mueve la etiqueta *hacia adentro* de la barra.
                        // Si anchor es 'end' y align es 'end', un offset negativo la moverá más hacia adentro desde el final.

                        padding: 0, // O {top: 2, bottom: 2} etc.
                        // Descripción: Padding alrededor del texto de la etiqueta.

                        // --- FORMATEO DEL TEXTO ---
                        formatter: (value, context) => {
                            // 'value' es el valor numérico del dato para esa barra (ej. 26, 10, 3, 0).
                            // 'context' es un objeto con información sobre el dato, dataset, índice, etc.
                            // const totalPublications = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                            // const percentage = totalPublications > 0 ? ((value / totalPublications) * 100).toFixed(0) : 0;

                            if (value > 0) { // Solo mostrar la etiqueta si el valor es mayor a 0
                                // return value + ` (${percentage}%)`; // Muestra: "26 (67%)"
                                return value; // Muestra solo el valor: "26" (como en tu imagen)
                            }
                            // Si quieres mostrar "0" para la barra Q4, quita el if o ajusta la condición:
                            // return value; // Esto mostraría "0"

                            return null; // No dibuja ninguna etiqueta para esta barra si el valor no cumple la condición.
                                         // Si Q4 es 0 y quieres que se muestre "0", entonces usa `return value;` directamente.
                        },

                        // --- ESTILO DEL TEXTO ---
                        color: (context) => {
                            // Color dinámico para asegurar contraste con el color de la barra.
                            const value = context.dataset.data[context.dataIndex];
                            const barColor = context.dataset.backgroundColor[context.dataIndex]; // Color de la barra actual

                            // Lógica simple para elegir blanco o negro basado en la luminosidad (muy simplificado)
                            // Puedes usar una librería para calcular mejor la luminosidad si es necesario.
                            // Este es un ejemplo básico: si la barra es muy oscura, texto claro, y viceversa.
                            // Los colores de tus barras son azules, así que un color claro para el texto debería funcionar bien.
                            // Para tu imagen, los números parecen ser un azul más oscuro o gris sobre las barras claras.
                            // Y blanco/gris claro sobre las barras más oscuras.

                            // Ejemplo para tu imagen:
                            // Si la barra Q1 (26) es azul brillante, el texto "26" es un azul más oscuro.
                            // Si la barra Q3 (3) es un azul más claro, el texto "3" es blanco/casi blanco.
                            if (context.dataIndex === 0) return '#FFFFFF'; // Azul oscuro para Q1 (alto impacto)
                            if (context.dataIndex === 1) return '#FFFFFF'; // Blanco para Q2
                            if (context.dataIndex === 2) return '#FFFFFF'; // Azul muy oscuro/casi negro para Q3
                            if (context.dataIndex === 3 && value === 0) return '#a0a0a0'; // Gris para el "0" de Q4

                            return '#FFFFFF'; // Color por defecto
                        },
                        // O un color fijo si todas las barras tienen buen contraste con él:
                        // color: '#FFFFFF', // Texto blanco

                        font: {
                            weight: 'normal', // 'bold' o 'normal'
                            size: 11,       // Tamaño de la fuente
                            family: 'Open Sans, sans-serif' // Coincidir con tu fuente principal
                        },

                        // --- ROTACIÓN (raramente necesario para datalabels en barras) ---
                        // rotation: 0, // Ángulo en grados

                        // --- VISIBILIDAD (puedes ocultar etiquetas condicionalmente) ---
                        // display: (context) => {
                        //     return context.dataset.data[context.dataIndex] > 0; // Solo muestra si el valor es > 0
                        // }
                        // Esto es similar a devolver `null` en el `formatter`.
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


