// =====================INITIALISATION GLOBALE DU DOM====================
// On attend que l'intégralité du code HTML (le DOM) soit complètement chargée
// et lue par le navigateur avant de lancer le script. Cela évite les erreurs de ciblage.
document.addEventListener("DOMContentLoaded", () => {

    // =========================GESTION DU SYSTÈME SOMBRE / CLAIR (DARK & LIGHT MODE)====================
    // Récupération des éléments nécessaires pour le bouton de bascule de thème
    const themeToggleBtn = document.getElementById('theme-toggle');       // Le bouton lui-même
    const themeToggleIcon = document.getElementById('theme-toggle-icon'); // L'icône (émoji) à l'intérieur
    const htmlElement = document.documentElement;                         // La balise racine <html>

    // On s'assure que la balise html et l'icône existent
    if (htmlElement && themeToggleIcon) {
        // On récupère le thème actuellement appliqué par Bootstrap (light ou dark)
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        
        // On ajuste l'émoji de départ en fonction du thème actif lors du chargement
        if (currentTheme === 'dark') {
            themeToggleIcon.textContent = '☀️'; // Si c'est sombre, on propose le soleil pour passer au clair
        } else {
            themeToggleIcon.textContent = '🌙'; // Si c'est clair, on propose la lune pour passer au sombre
        }
    }

    // Gestion de l'événement de clic sur le bouton de changement de thème
    if (themeToggleBtn && htmlElement && themeToggleIcon) {
        themeToggleBtn.addEventListener('click', () => {
            // On vérifie le thème actif au moment du clic
            const activeTheme = htmlElement.getAttribute('data-bs-theme');
            
            if (activeTheme === 'dark') {
                // Bascule vers le mode clair
                htmlElement.setAttribute('data-bs-theme', 'light');
                themeToggleIcon.textContent = '🌙';
                localStorage.setItem('theme', 'light'); // On sauvegarde le choix de l'utilisateur
            } else {
                // Bascule vers le mode sombre
                htmlElement.setAttribute('data-bs-theme', 'dark');
                themeToggleIcon.textContent = '☀️';
                localStorage.setItem('theme', 'dark');  // On sauvegarde le choix de l'utilisateur
            }
        });
    }

    //=============================GESTION DU BOUTON RETOUR EN HAUT (BACK TO TOP)============================
    
    // Récupération du bouton de retour en haut via son identifiant unique
    const backToTopBtn = document.getElementById("backToTop");
 
    // On vérifie si le bouton existe physiquement sur la page actuelle.
    // Si la page n'a pas ce bouton (ex: sur une autre page du site), le code à l'intérieur est ignoré au lieu de planter !
    if (backToTopBtn) {
        
        // Surveillance du défilement de la page (scroll)
        window.addEventListener("scroll", function() {
            // Si l'utilisateur a défilé de plus de 300 pixels vers le bas
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");    // On ajoute la classe CSS pour afficher le bouton
            } else {
                backToTopBtn.classList.remove("show"); // Sinon, on retire la classe pour le masquer
            }
        });

        // Gestion du clic sur le bouton pour remonter
        backToTopBtn.addEventListener("click", function() {
            // On ordonne au navigateur de remonter tout en haut de la page
            window.scrollTo({
                top: 0,
                behavior: "smooth" // L'effet "smooth" permet une remontée fluide et animée, pas brutale
            });
        });
    }
});

// ======================NAVBAR DYNAMIQUE (CHANGE DE STYLE AU DEFILEMENT)==============================
// Cet écouteur surveille en permanence le défilement de la fenêtre globale (window)
window.addEventListener('scroll', function() {
    // On cherche la barre de navigation Bootstrap (.navbar)
    const navbar = document.querySelector('.navbar');
    
    // Si la navbar est présente sur la page
    if (navbar) {
        // Si on descend à plus de 50 pixels du haut de la page
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');    // On applique le style compact/ombré
        } else {
            navbar.classList.remove('navbar-scrolled'); // On réapplique le style transparent/large d'origine
        }
    }
});