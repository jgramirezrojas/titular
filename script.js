document.addEventListener("DOMContentLoaded", () => {
    loadHeaderAndFooter();
});

function loadHeaderAndFooter() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Create separate promises for header and footer
    const headerPromise = headerPlaceholder ? 
        fetch('header.html').then(res => res.ok ? res.text() : '').catch(() => '') : 
        Promise.resolve('');
    
    const footerPromise = footerPlaceholder ? 
        fetch('footer.html').then(res => res.ok ? res.text() : '').catch(() => '') : 
        Promise.resolve('');

    Promise.all([headerPromise, footerPromise])
        .then(([headerHtml, footerHtml]) => {
            // Replace the placeholder DIV itself with the fetched HTML content.
            // This restores the <header> and <footer> tags so the CSS can target them.
            if (headerPlaceholder && headerHtml) {
                headerPlaceholder.outerHTML = headerHtml;
            }
            if (footerPlaceholder && footerHtml) {
                footerPlaceholder.outerHTML = footerHtml;
            }

            // Now that the DOM is correctly structured, initialize the site's JS functionalities.
            initializeSite();
        })
        .catch(error => {
            console.error('Error loading header or footer:', error);
            // Fallback: try to initialize site anyway with existing elements
            // This ensures the site remains functional even if header/footer loading fails
            initializeSite();
        });
}

function initializeSite() {
    setupNavigation();
    initializePageSpecificScripts();
}

// ==========================================================================
// Lógica de Navegación (Menú Hamburguesa y Link Activo)
// ==========================================================================

function setupNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            burger.classList.toggle('toggle');
        });
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}


// ==========================================================================
// Inicialización de Scripts Específicos de la Página
// ==========================================================================

function initializePageSpecificScripts() {
    if (typeof Chart !== 'undefined') {
        if (typeof ChartAnnotation !== 'undefined') Chart.register(ChartAnnotation);
        if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels);
    }

    initCountersObserver('achievements');
    initCountersObserver('research-impact');
    setupModals();
    setupFilters();
    setupMap();
    setupCharts();
}


// ==========================================================================
// Funciones de Componentes (Contadores, Modales, Filtros, etc.)
// ==========================================================================

function initCountersObserver(sectionId) {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    let sectionCountersAnimated = false;
    const observerOptions = { root: null, threshold: 0.25 };

    const sectionObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sectionCountersAnimated) {
                const countersInSection = sectionElement.querySelectorAll('.counter');
                countersInSection.forEach(animateCounter);
                sectionCountersAnimated = true;
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionObserver.observe(sectionElement);
}

function animateCounter(counterElement) {
    const target = +counterElement.getAttribute('data-target');
    const speed = 200;
    let count = 0;

    const updateCount = () => {
        const increment = Math.max(1, target / speed);
        count += increment;
        if (count < target) {
            counterElement.innerText = Math.ceil(count);
            setTimeout(updateCount, 10);
        } else {
            counterElement.innerText = target;
        }
    };
    updateCount();
}

function setupModals() {
    const modalButtons = document.querySelectorAll('.btn-modal');
    const closeButtons = document.querySelectorAll('.close-button');

    if (modalButtons.length === 0) return;

    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalTarget = document.getElementById(button.dataset.modalTarget);
            if (modalTarget) modalTarget.style.display = 'block';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function setupFilters() {
    const yearFilter = document.getElementById('year-filter');
    const searchFilterInput = document.getElementById('search-filter');
    const publicationsListItems = document.querySelectorAll('#publications-list li');

    function filterPublications() {
        const selectedYear = yearFilter ? yearFilter.value : 'all';
        const searchTerm = searchFilterInput ? searchFilterInput.value.toLowerCase() : '';
        publicationsListItems.forEach(item => {
            const itemYear = item.dataset.year;
            const itemText = item.textContent.toLowerCase();
            const matchesYear = (selectedYear === 'all' || itemYear === selectedYear);
            const matchesSearch = (searchTerm === '' || itemText.includes(searchTerm));
            item.style.display = (matchesYear && matchesSearch) ? '' : 'none';
        });
    }

    if (yearFilter) yearFilter.addEventListener('change', filterPublications);
    if (searchFilterInput) searchFilterInput.addEventListener('input', filterPublications);
    if (publicationsListItems.length > 0) filterPublications();

    const talkYearFilter = document.getElementById('talk-year-filter');
    const talkSearchFilterInput = document.getElementById('talk-search-filter');
    if (talkYearFilter || talkSearchFilterInput) {
        displayInvitedTalks();
        if (talkYearFilter) talkYearFilter.addEventListener('change', displayInvitedTalks);
        if (talkSearchFilterInput) talkSearchFilterInput.addEventListener('input', displayInvitedTalks);
    }

    const studentLevelFilter = document.getElementById('student-level-filter');
    if (studentLevelFilter) {
        displayStudents(studentLevelFilter.value);
        studentLevelFilter.addEventListener('change', () => displayStudents(studentLevelFilter.value));
    }
}

function setupMap() {
    const mapElement = document.getElementById('collaboration-map');
    if (!mapElement || typeof L === 'undefined') return;

    const map = L.map(mapElement).setView([20, 0], 1.5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 2
    }).addTo(map);

    collaborations.forEach(collab => {
        L.marker([collab.lat, collab.lng]).addTo(map)
            .bindPopup(`<b>${collab.name}</b><br>${collab.details}`);
    });
}


// ==========================================================================
// Datos para Contenido Dinámico
// ==========================================================================

const featuredStudentsData = [
    { name: "Alexander Cardona Rodríguez", level: "doctorado", icon: "fas fa-user-doctor", thesis: "Tuning the magnetic properties of multiferroic BiFeO₃: From bulk to nanoscale (2016-2022).", achievements: "Cuatro publicaciones de alto impacto durante su doctorado (ej. Sci. Rep. 2019, JMMM 2022). Actualmente profesor de cátedra Uniandes y Rosario, y postdoctorando en proyecto SGR QUANEC.", publications: "Control of Multiferroic properties in BiFeO₃ nanoparticles (Scientific Reports, 2019); Resolving magnetic contributions in BiFeO₃ nanoparticles (JMMM, 2022)." },
    { name: "Diego Andrés Carranza Celis", level: "doctorado", icon: "fas fa-user-doctor", thesis: "Tailoring electronic phase separation in Pr-doped mixed-valence manganite (Completada Dic 2024).", achievements: "Contribuciones fundamentales al entendimiento de separación de fase en manganitas. Múltiples publicaciones (ej. Phys. Rev. Materials 2021, 2024). Proyectado para postdoc en SGR QUANEC.", publications: "Low-temperature paramagnetic phase reentrance (Phys. Rev. Materials, 2024); Magnetism dynamics driven by phase separation (Phys. Rev. Materials, 2021)." },
    { name: "Victor Hugo González Sánchez", level: "maestria", icon: "fas fa-user-graduate", thesis: "Study of RKKY coupling in Co/Nb/Co trilayers via magnetoresistance (2018-2020).", achievements: "Pasantía en ESPCI París. Actualmente investigador postdoctoral en la Universidad de Gotemburgo (Suecia) en espintrónica aplicada.", publications: "Continuación de línea de investigación iniciada en maestría." },
    { name: "Daniel Fabián Hernández", level: "maestria", icon: "fas fa-user-graduate", thesis: "Confinamiento del pentóxido de vanadio V₂O₅ y la influencia del tamaño en sus propiedades ópticas (2021).", achievements: "Actualmente estudiante de Doctorado en Física en Uniandes y Asistente Graduado Docente, continuando la línea de investigación.", publications: "Tuning electronic and magnetic properties through disorder in V₂O₅ nanoparticles (Sci. Rep. 2023, coautor)." },
    { name: "Sergio Andrés Correal López", level: "pregrado", icon: "fas fa-graduation-cap", thesis: "Efecto del cambio estructural y de vacancias de oxígeno en las propiedades ópticas y electrónicas del V₂O₅ mediante primeros principios.", achievements: "Publicación como primer autor en Sci. Rep. (2023). Actualmente en doctorado en UC San Diego.", publications: "Tuning electronic and magnetic properties through disorder in V₂O₅ nanoparticles (Sci. Rep. 2023, primer autor)." },
    { name: "Andrea Esquivel Sánchez", level: "pregrado", icon: "fas fa-graduation-cap", thesis: "Detection of polarons in reduced vanadium oxide V₂O₅₋ₓ.", achievements: "Publicación como primer autor en Sci. Rep. (2023). Actualmente en doctorado en la Universidad Paris Cité (Francia).", publications: "Tuning electronic and magnetic properties through disorder in V₂O₅ nanoparticles (Sci. Rep. 2023, primer autor)." },
    { name: "Carlos Felipe Eugenio Gómez", level: "pregrado", icon: "fas fa-graduation-cap", thesis: "High-Entropy Spinel Oxides: Structural and Magnetic Characterization through Neutron Diffraction.", achievements: "Intercambio en U. Copenhague. Seleccionado para Lindau Nobel Laureate Meeting. Presentación en IMRC. Próximo a Maestría en Física (HEO).", publications: "(En preparación)" }
];

const invitedTalksData = [
    { year: "2025", title: "Control Of Metastable States in Phase-Separated Pr-doped Manganites", event: "International Workshop on Spintronics - Spin Galapagos 2025", location: "Islas Galápagos, Ecuador", date: "25-30 de mayo" },
    { year: "2024", title: "Effect Of Superconductivity On Magnetism In A Superconducting/Magnetic Hybrid", event: "IMRC 2024", location: "Cancún, México", date: "21 de agosto" },
    { year: "2024", title: "Emergence Of Metastable States In Electronic Phases-Separated Manganites", event: "IMRC 2024", location: "Cancún, México", date: "20 de agosto" },
    { year: "2024", title: "Magnetism dynamics of magnetic oxide heterostructures", event: "Coloquio Instituto de Física Gleb Wataghin IFGW, Unicamp", location: "Campinas, Brasil", date: "6 de junio" },
    { year: "2023", title: "Magnetization Dynamics: From Fundamentals to Applications", event: "Tercera Escuela Colombiana De Magnetismo", location: "Manizales, Colombia", date: "17 de noviembre" },
    { year: "2023", title: "Magnetism dynamics of magnetic oxide heterostructures", event: "Simposio de Imanes Permanentes y Materiales para Energías Limpias", location: "Cali, Colombia", date: "8 de noviembre" },
    { year: "2023", title: "Fabrication and characterization of Iron Oxide-based nanodisks for medical applications", event: "Magnamed meeting", location: "Bilbao, España", date: "19 de octubre" },
    { year: "2023", title: "Physical properties driven by phase separation in electron-correlated materials", event: "4ta Escuela de Física Estadística", location: "Bogotá, Colombia", date: "6 de octubre" },
    { year: "2023", title: "Strongly correlated materials for quantum technology: Experimental approach", event: "2nd Workshop on Higher Structures in Algebra, Geometry, Topology and Physics", location: "Barranquilla, Colombia", date: "28 de febrero" },
    { year: "2022", title: "Nanoscale properties of multifunctional oxide materials: Role of defects and microstructure", event: "International Workshop Ceramics Nanomaterials, Magnetism and Cryogenics", location: "Medellín, Colombia", date: "25 de noviembre" },
    { year: "2022", title: "Neuromorphic Computing: Analog vs Digital", event: "Neuromorphic lecture series, UC San Diego", location: "San Diego, CA, EE.UU.", date: "21 de julio" },
    { year: "2022", title: "Magnetism dynamics of oxide-magnetic heterostructures", event: "Special Seminar, Materials Science and Engineering, Cornell University", location: "Ithaca, NY, EE.UU.", date: "11 de mayo" },
    { year: "2021", title: "Micromagnetic simulations to explore nanoscale effects in complex materials", event: "1st Latin-American tutorial of magnetism", location: "Virtual", date: "8-19 de noviembre" },
    { year: "2021", title: "Fenómenos cuánticos en sistemas de baja dimensionalidad", event: "Coloquio Física, Universidad de los Andes", location: "Bogotá, Colombia", date: "12 de octubre" },
    { year: "2021", title: "Unusual Dynamical Properties of Oxide-Magnetic nanostructures", event: "Condensed Matter Physics Seminar, Universidad Nacional La Plata", location: "La Plata, Argentina", date: "5 de octubre" },
    { year: "2021", title: "Unusual dynamical properties of oxide-magnetic heterostructures: Proximity effects", event: "Condensed Matter Physics Seminar, Universidad de Chile", location: "Santiago, Chile (Virtual)", date: "7 de abril" },
    { year: "2020", title: "Unusual dynamical properties of oxide-magnetic heterostructures", event: "Annual Conference on Magnetism and Magnetic Materials", location: "Virtual", date: "2 de noviembre" },
    { year: "2020", title: "Confinement effects in quantum matter", event: "Universidad del Norte", location: "Barranquilla, Colombia", date: "23 de enero" },
    { year: "2019", title: "Mechanisms of the photo- and voltage-induced phase transition in the electron-correlated V₂O₃", event: "XXVII International Materials Research Congress", location: "Cancún, México", date: "18-23 de agosto" },
    { year: "2018", title: "Tailoring novel functionalities in quantum materials", event: "Materials Science & Engineering Seminar, University of Florida", location: "Gainesville, FL, EE.UU.", date: "4 de septiembre" },
    { year: "2018", title: "Size-induced multiferroicity in oxide nanoparticles", event: "XXVII International Materials Research Congress", location: "Cancún, México", date: "19-24 de agosto" },
    { year: "2018", title: "Magnetism @Uniandes", event: "1st Cali Magnetism School, Universidad del Valle", location: "Cali, Colombia", date: "26/02 - 2/03" },
    { year: "2017", title: "Dinámica ultra-rápida de transiciones de fase de primer orden", event: "Physics Seminar at Universidad del Valle", location: "Cali, Colombia", date: "18 de octubre" },
    { year: "2017", title: "Correlaciones cuánticas en sólidos", event: "Physics Colloquium, Universidad Distrital", location: "Bogotá, Colombia", date: "8 de septiembre" },
    { year: "2016", title: "Pathways to control magnetization dynamics with first-order phase transitions", event: "Physics Seminar, Bar Ilan University", location: "Israel", date: "20 de diciembre" },
    { year: "2016", title: "Controlling magnetization dynamics in heterostructures with first-order phase transitions", event: "Physics Seminar, Universidad Autónoma de Madrid", location: "Madrid, España", date: "14 de diciembre" },
    { year: "2016", title: "Strongly correlated materials: Nanoscale Phase coexistence as a tool for magnetic control", event: "1st Workshop on Superconductivity and Magnetism at Low Dimensionality", location: "Bogotá, Colombia", date: "5 de diciembre" },
    { year: "2016", title: "Controlling magnetization dynamics in hybrid heterostructures with first-order phase transitions", event: "61st Annual Conference on Magnetism and Magnetic Materials", location: "New Orleans, EE.UU.", date: "31/10 - 4/11" },
    { year: "2015", title: "Control of magnetization dynamics in hybrid materials at the nanoscale", event: "3rd International Conference on Nanoscience, Nanotechnology, and Nanobiotechnology", location: "Brasília, Brasil", date: "14-18 de diciembre" },
];

const collaborations = [
    { lat: 32.8801, lng: -117.2340, name: "UC San Diego, EEUU", details: "Prof. Ivan K. Schuller, Prof. Oleg Shpyrko, Prof. Alex Frano<br>Magnetismo, Óxidos, Interfaces, Técnicas de Sincrotrón." },
    { lat: -22.8172, lng: -47.0696, name: "UNICAMP, Brasil", details: "Prof. Marcelo Knobel, Prof. Diego Muraca<br>Nanopartículas magnéticas, BiFeO₃." },
    { lat: 41.3851, lng: 2.1734, name: "Barcelona, España", details: "Universitat de Barcelona (Dr. Xavier Batlle, Dr. Amílcar Labarta)<br>Sistemas magnéticos, efectos de proximidad." },
    { lat: 48.8566, lng: 2.3522, name: "París, Francia", details: "ESPCI Paris (Doble titulación)<br>Investigación en física y química." },
    { lat: 31.7683, lng: 35.2137, name: "Israel", details: "Bar Ilan University (Physics Seminar)<br>Dinámica de magnetización." },
    { lat: 43.2630, lng: -2.9350, name: "Bilbao, España", details: "Universidad del País Vasco (Magnamed meeting)<br>Nanoestructuras magnéticas." },
    { lat: 6.2442, lng: -75.5812, name: "Medellín, Colombia", details: "Colaboración con U. Nacional/U. de Antioquia<br>Proyectos SGR, Workshops." },
    { lat: 3.4516, lng: -76.5320, name: "Cali, Colombia", details: "Universidad del Valle (Prof. Maria E. Gómez)<br>Multicapas magnéticas, Proyecto SGR." },
    { lat: 10.9639, lng: -74.7964, name: "Barranquilla, Colombia", details: "Universidad del Norte (Dr. Rafael González-Hernández)<br>Cálculos teóricos, DFT." },
    { lat: 5.0689, lng: -75.5174, name: "Manizales, Colombia", details: "Universidad Autónoma de Manizales (Prof. Oscar Moscoso)<br>Caracterización FORC." },
    { lat: 52.5200, lng: 13.4050, name: "Helmholtz-Zentrum Berlin, Alemania", details: "Dr. Florian Kronast<br>Técnicas de caracterización magnética avanzada." },
    { lat: 42.4440, lng: -76.5019, name: "Cornell University, EEUU", details: "Special Seminar, Materials Science and Engineering.<br>Contacto: Prof. Andrej Singer." },
    { lat: 40.4470, lng: -3.7278, name: "Universidad Complutense de Madrid, España", details: "Colaboración en Difracción XRD.<br>Contacto: Prof. Andrej Singer." }
];


// ==========================================================================
// Funciones para Renderizar Contenido Dinámico
// ==========================================================================

function displayStudents(level = 'all') {
    const container = document.getElementById('featured-students-list');
    if (!container) return;
    container.innerHTML = '';
    const filtered = (level === 'all') ? featuredStudentsData : featuredStudentsData.filter(s => s.level === level);
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#a0a0a0;">No hay estudiantes para este nivel.</p>';
        return;
    }
    filtered.forEach(student => {
        const levelText = student.level.charAt(0).toUpperCase() + student.level.slice(1);
        const card = `
            <div class="student-card" data-level="${student.level}">
                <div class="student-card-header">
                    <i class="${student.icon || 'fas fa-user'}"></i>
                    <h4>${student.name} <span class="student-level-tag">${levelText}</span></h4>
                </div>
                <p><strong>Tesis:</strong> ${student.thesis || 'No especificada'}</p>
                <p><strong>Logros/Actualidad:</strong> ${student.achievements || 'Información no disponible.'}</p>
                ${student.publications ? `<p class="student-publications"><em>Publicaciones Clave: ${student.publications}</em></p>` : ''}
            </div>`;
        container.innerHTML += card;
    });
}

function displayInvitedTalks() {
    const container = document.getElementById('invited-talks-list');
    const yearFilter = document.getElementById('talk-year-filter');
    const searchFilter = document.getElementById('talk-search-filter');
    if (!container) return;

    const selectedYear = yearFilter ? yearFilter.value : 'all';
    const searchTerm = searchFilter ? searchFilter.value.toLowerCase() : '';

    container.innerHTML = '';
    const filtered = invitedTalksData.filter(talk => {
        const matchesYear = (selectedYear === 'all' || talk.year === selectedYear);
        const matchesSearch = (searchTerm === '' ||
            talk.title.toLowerCase().includes(searchTerm) ||
            talk.event.toLowerCase().includes(searchTerm) ||
            talk.location.toLowerCase().includes(searchTerm));
        return matchesYear && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#a0a0a0;">No se encontraron charlas.</p>';
        return;
    }

    filtered.forEach(talk => {
        const item = `
            <li>
                <div class="talk-meta">
                    <span class="talk-year-badge">${talk.year}</span>
                    <span class="talk-date">${talk.date}</span>
                </div>
                <span class="talk-title">${talk.title}</span>
                <span class="talk-event-location">
                    <i class="fas fa-map-marker-alt"></i> ${talk.event} (${talk.location})
                </span>
            </li>`;
        container.innerHTML += item;
    });
}


// ==========================================================================
// Lógica de Gráficos (Chart.js)
// ==========================================================================

function setupCharts() {
    const coursesTypeCtx = document.getElementById('coursesTypeChart');
    if (coursesTypeCtx) {
        new Chart(coursesTypeCtx, {
            type: 'bar',
            data: {
                labels: ['Magistral Fundamental', 'Disciplinar Especializado', 'Introductorio/Lab'],
                datasets: [{ label: 'Número de Cursos Impartidos (2015–2026)', data: [24, 12, 10], backgroundColor: ['rgba(0, 170, 255, 0.7)', 'rgba(0, 136, 204, 0.7)', 'rgba(128, 191, 255, 0.7)'], borderColor: ['rgba(0, 170, 255, 1)', 'rgba(0, 136, 204, 1)', 'rgba(128, 191, 255, 1)'], borderWidth: 1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(224, 224, 224, 0.1)' } }, x: { ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(224, 224, 224, 0.1)' } } }, plugins: { legend: { labels: { color: '#e0e0e0' } } } }
        });
    }

    const globalScoreCtx = document.getElementById('globalScoreChart');
    if (globalScoreCtx) {
        const officialLabels = ['201720', '201810', '201820', '201910', '201920', '202010', '202020', '202110', '202120', '202210', '202220', '202310', '202320', '202410', '202420', '202510', '202520', '202610', 'Acumulado'];
        const officialData = [147, 149, 146.5, 150, 143.5, 144.5, 142.5, 143, 152, 148, 150, 142, 144, 153, 147, 152, 155, 151, 149];
        new Chart(globalScoreCtx, {
            type: 'line',
            data: { labels: officialLabels, datasets: [{ label: 'Puntaje Global Docente', data: officialData, borderColor: 'rgba(0, 170, 255, 1)', backgroundColor: 'rgba(0, 170, 255, 0.2)', tension: 0.1, fill: true }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 125, max: 175, ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(224, 224, 224, 0.1)' } }, x: { ticks: { color: '#e0e0e0', maxRotation: 45, minRotation: 30 }, grid: { display: false } } }, plugins: { legend: { labels: { color: '#e0e0e0' } } } }
        });
    }

    const conceptScoreCtx = document.getElementById('conceptScoreChart');
    if (conceptScoreCtx) {
        new Chart(conceptScoreCtx, {
            type: 'radar',
            data: { labels: ['Coherencia', 'Retroalimentación', 'Trato a Estudiantes'], datasets: [{ label: 'Aspectos globales 2025-20 (Nivel Alto / Verde)', data: [155, 155, 157], fill: true, backgroundColor: 'rgba(0, 170, 255, 0.3)', borderColor: 'rgb(0, 170, 255)', pointBackgroundColor: 'rgb(0, 170, 255)', pointBorderColor: '#fff' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { color: 'rgba(224,224,224,0.2)' }, grid: { color: 'rgba(224,224,224,0.2)' }, pointLabels: { color: '#e0e0e0', font: { size: 11 } }, ticks: { display: false, stepSize: 5 }, min: 140, max: 162 } }, plugins: { legend: { labels: { color: '#e0e0e0' } } } }
        });
    }

    const thesisLevelCtx = document.getElementById('thesisLevelDistributionChart');
    if (thesisLevelCtx) {
        new Chart(thesisLevelCtx, {
            type: 'doughnut',
            data: { labels: ['Pregrado', 'Maestría', 'Doctorado'], datasets: [{ label: 'Número de Tesis', data: [22, 8, 3], backgroundColor: ['rgba(0, 170, 255, 0.8)', 'rgba(128, 191, 255, 0.8)', 'rgba(0, 100, 170, 0.8)'], hoverOffset: 8 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#e0e0e0', padding: 15 } } } }
        });
    }

    const citationsGrowthCtx = document.getElementById('citationsGrowthChart');
    if (citationsGrowthCtx) {
        new Chart(citationsGrowthCtx, {
            type: 'line',
            data: { labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026*'], datasets: [{ label: 'Citaciones Acumuladas', data: [220, 398, 696, 981, 1330, 1669, 2257, 2850, 3153], borderColor: 'rgba(0, 170, 255, 1)', backgroundColor: 'rgba(0, 170, 255, 0.1)', fill: true, tension: 0.2 }, { label: 'Citaciones Anuales', data: [220, 178, 298, 285, 349, 339, 588, 593, 303], type: 'bar', backgroundColor: 'rgba(128, 191, 255, 0.5)' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(224, 224, 224, 0.1)' } }, x: { ticks: { color: '#e0e0e0' }, grid: { color: 'rgba(224, 224, 224, 0.1)' } } }, plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { mode: 'index', intersect: false } } }
        });
    }

    const sgrDistributionCtx = document.getElementById('sgrDistributionChart');
    if (sgrDistributionCtx) {
        const sgrLabels = ['Universidad de Envigado', 'Universidad de la Amazonia', 'Maloka', 'Universidad del Norte', 'Universidad de Antioquia', 'Universidad del Valle', 'Universidad de los Andes'].reverse();
        const sgrDataPercentages = [0.85, 1.83, 2.21, 4.37, 6.06, 11.9, 72.78].reverse();
        new Chart(sgrDistributionCtx, {
            type: 'bar',
            data: { labels: sgrLabels, datasets: [{ label: '% del Financiamiento SGR', data: sgrDataPercentages, backgroundColor: 'rgba(0, 123, 255, 0.7)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1 }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, title: { display: true, text: 'Porcentaje del Financiamiento (%)', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', callback: (v) => v + '%' }, grid: { color: 'rgba(224, 224, 224, 0.1)' } }, y: { ticks: { color: '#e0e0e0' }, grid: { display: false } } }, plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#e0e0e0', formatter: (v) => v.toFixed(2) + '%' } } }
        });
    }

    const quartileChartCtx = document.getElementById('quartilePieChart');
    if (quartileChartCtx) {
        const quartileLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
        const quartileValues = [26, 10, 3, 0];
        new Chart(quartileChartCtx, {
            type: 'bar',
            data: { labels: quartileLabels, datasets: [{ label: 'Número de Publicaciones', data: quartileValues, backgroundColor: ['rgba(0, 170, 255, 0.8)', 'rgba(0, 136, 204, 0.8)', 'rgba(128, 191, 255, 0.7)', 'rgba(100, 100, 120, 0.6)'], borderWidth: 1 }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, title: { display: true, text: 'Número de Publicaciones', color: '#c0c0c0' }, ticks: { color: '#e0e0e0' } }, y: { ticks: { color: '#e0e0e0' } } }, plugins: { legend: { display: false }, title: { display: true, text: 'Distribución de Publicaciones por Cuartil (Q) desde 2015', color: '#ffffff', padding: { bottom: 20 } }, datalabels: { anchor: 'end', align: 'end', color: '#ffffff', formatter: (v) => v > 0 ? v : null } } }
        });
    }
}