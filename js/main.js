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

// ====================COMPTEURS DE STATISTIQUES AU SCROLL====================

// On attend que le document HTML soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sélection de tous les éléments HTML qui possèdent la classe 'counter'
    const counters = document.querySelectorAll('.counter');
    
    // Durée totale souhaitée pour l'animation (en millisecondes : 2000ms = 2 secondes)
    const animationDuration = 2000; 

    /**
     * Fonction responsable de l'animation d'un compteur individuel
     * @param {HTMLElement} counter - L'élément HTML à animer
     */
    const animateCounter = (counter) => {
        // Récupération de la valeur cible stockée dans l'attribut HTML 'data-target'
        // Le signe '+' transforme la chaîne de caractères (string) en un nombre manipulable (number)
        const target = +counter.getAttribute('data-target'); 
        
        // Enregistre le moment précis (en millisecondes) où l'animation commence
        const startTime = performance.now();

        /**
         * Fonction interne appelée en boucle par le navigateur pour mettre à jour le chiffre
         * @param {number} currentTime - Le temps actuel fourni par requestAnimationFrame
         */
        const updateCount = (currentTime) => {
            // Calcul du temps qui s'est écoulé depuis le début de l'animation
            const elapsedTime = currentTime - startTime;
            
            // Calcul du pourcentage de progression (entre 0.0 et 1.0)
            // Math.min évite de dépasser 1.0 même si le temps calculé déborde légèrement
            const progress = Math.min(elapsedTime / animationDuration, 1);
            
            // Calcul de la valeur intermédiaire correspondante à la progression
            // Math.floor permet d'obtenir un nombre entier (pas de décimales pendant le décompte)
            const currentValue = Math.floor(progress * target);
            
            // Affichage de la valeur actuelle dans la balise HTML
            counter.innerText = currentValue;

            // Tant que la progression n'est pas arrivée à son maximum (1), on continue
            if (progress < 1) {
                // Demande au navigateur de rappeler 'updateCount' dès la prochaine image (frame) disponible
                requestAnimationFrame(updateCount);
            } else {
                // Par sécurité, une fois le temps écoulé, on affiche exactement la valeur cible finale
                counter.innerText = target; 
            }
        };

        // Initialisation du premier cycle d'animation
        requestAnimationFrame(updateCount);
    };

    /**
     * 2. Configuration de l'Intersection Observer
     * Cet outil surveille la position des compteurs par rapport à l'écran visible (viewport).
     */
    const observerOptions = {
        root: null,         // Utilise l'écran du navigateur comme zone de référence
        threshold: 0.2      // Déclenche l'action dès que 20% de l'élément est visible à l'écran
    };

    // Création de l'observateur avec la logique de déclenchement
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'élément surveillé entre dans le champ de vision
            if (entry.isIntersecting) {
                const counter = entry.target; // On récupère l'élément en question
                
                // Lance l'animation de chiffres pour cet élément
                animateCounter(counter);
                
                // Très important : On dit à l'observateur d'arrêter de surveiller cet élément.
                // Cela évite de relancer l'animation à chaque fois que l'utilisateur remonte et redescend.
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    // 3. Liaison de l'observateur à nos éléments HTML
    // On passe en revue chaque compteur trouvé sur la page pour le mettre sous surveillance
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// ====================SECTIONS QUI APPARAISSENT EN FONDU====================
// On s'assure que le DOM (l'arbre HTML) est totalement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
    const fadeOptions = {
        // 'root: null' signifie que la zone de détection est la fenêtre visible du navigateur (le viewport)
        root: null,         
        
        // 'threshold: 0.2' déclenche l'action dès que 30% de la section ciblée est visible à l'écran
        threshold: 0.2,     
        
        // 'rootMargin' applique une marge virtuelle au bas de l'écran. 
        // '-100px' retarde légèrement le déclenchement pour que l'effet s'active 
        // proprement juste après que la section a franchi le bas de l'écran.
        rootMargin: "0px 0px -100px 0px" 
    };
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        // On passe en revue chaque élément surveillé qui a changé d'état (entré ou sorti de l'écran)
        entries.forEach(entry => {
            
            // On vérifie si l'élément est actuellement visible à l'écran (isIntersecting)
            if (entry.isIntersecting) {
                
                // Récupération de l'élément HTML en cours d'intersection
                const currentSection = entry.target;
                
                // On lui ajoute la classe CSS 'is-visible' pour lancer l'animation CSS (opacité et déplacement)
                currentSection.classList.add('is-visible');
                
                // PERFORMANCE OPTIMISATION : Une fois la section visible, il est inutile de continuer 
                // à la surveiller. On dit à l'observateur d'arrêter (unobserve) pour libérer de la mémoire.
                observer.unobserve(currentSection);
            }
        });
    }, fadeOptions); // On associe les options de configuration définies plus haut
    // On cible toutes les sections ou blocs de la page contenant la classe '.fade-in-section'
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    // On applique l'observateur individuellement sur chaque section trouvée
    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });
    
});

// ====================FILTRAGE PAR CATEGORIE SUR FREELANCES=====================

document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const freelanceItems = document.querySelectorAll(".freelance-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            // 1. Gérer la classe 'active' sur les boutons Bootstrap
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // 2. Récupérer le filtre sélectionné (ex: "all", "création", etc.)
            const filterValue = this.getAttribute("data-filter");

            // 3. Filtrer les profils
            freelanceItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");

                if (filterValue === "all" || itemCategory === filterValue) {
                    // On affiche l'élément de manière fluide
                    item.style.display = "block";
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 10);
                } else {
                    // On cache l'élément
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 300); // Correspond au temps de l'animation CSS
                }
            });
        });
    });
});

// =====================VALIDATION DU FORMULAIRE DE CONTACT====================

// Ciblage du formulaire de contact
const contactForm = document.getElementById("contact-form");

// Sécurité : On exécute ce bloc uniquement si le formulaire est présent sur la page
if (contactForm) {
    // Sélection de tous les champs de saisie du nouveau HTML
    const nomInput = document.getElementById("nom");
    const prenomInput = document.getElementById("prenom");
    const emailInput = document.getElementById("email");
    const sujetSelect = document.getElementById("sujet");
    const messageInput = document.getElementById("message");
    
    // Sélection des zones d'affichage des erreurs et du succès
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");
    const successMessage = document.getElementById("success-message");

    // Sélection générique pour le prénom et le sujet (qui utilisent la classe .error-message dans votre HTML)
    const prenomError = prenomInput.nextElementSibling;
    const sujetError = sujetSelect.nextElementSibling;

    // Écoute de l'événement de soumission (clic sur "Envoyer")
    contactForm.addEventListener("submit", (e) => {
        // Empêche le rechargement complet de la page
        e.preventDefault(); 

        // Variable témoin de validité
        let isFormValid = true;
        
        // Réinitialisation de tous les messages textuels d'erreur
        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
        if (prenomError) prenomError.textContent = "";
        if (sujetError) sujetError.textContent = "";
        
        // On cache le bandeau de succès par défaut
        successMessage.classList.add("d-none"); 
        
        // On nettoie les anciennes bordures de couleur Bootstrap (vert/rouge) sur tous les champs
        const allInputs = [nomInput, prenomInput, emailInput, sujetSelect, messageInput];
        allInputs.forEach(input => {
            if (input) input.classList.remove("is-invalid", "is-valid");
        });

        // --- 1. VALIDATION : NOM ---
        if (nomInput.value.trim() === "") {
            nameError.textContent = "Le nom est obligatoire.";
            nomInput.classList.add("is-invalid");
            isFormValid = false;
        } else {
            nomInput.classList.add("is-valid");
        }

        // --- 2. VALIDATION : PRÉNOM ---
        if (prenomInput.value.trim() === "") {
            if (prenomError) prenomError.textContent = "Le prénom est obligatoire.";
            prenomInput.classList.add("is-invalid");
            isFormValid = false;
        } else {
            prenomInput.classList.add("is-valid");
        }

        // --- 3. VALIDATION : ADRESSE EMAIL ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === "") {
            emailError.textContent = "L'adresse email est obligatoire.";
            emailInput.classList.add("is-invalid");
            isFormValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = "Veuillez entrer une adresse email valide.";
            emailInput.classList.add("is-invalid");
            isFormValid = false;
        } else {
            emailInput.classList.add("is-valid");
        }

        // --- 4. VALIDATION : SUJET ---
        if (sujetSelect.value === "") {
            if (sujetError) sujetError.textContent = "Veuillez sélectionner un sujet.";
            sujetSelect.classList.add("is-invalid");
            isFormValid = false;
        } else {
            sujetSelect.classList.add("is-valid");
        }

        // --- 5. VALIDATION : MESSAGE (20 CARACTÈRES MIN) ---
        const messageValue = messageInput.value.trim();
        if (messageValue === "") {
            messageError.textContent = "Le message ne peut pas être vide.";
            messageInput.classList.add("is-invalid");
            isFormValid = false;
        } else if (messageValue.length < 20) {
            messageError.textContent = `Votre message est trop court (minimum 20 caractères, actuel : ${messageValue.length}).`;
            messageInput.classList.add("is-invalid");
            isFormValid = false;
        } else {
            messageInput.classList.add("is-valid");
        }

        // --- 6. TRAITEMENT EN CAS DE SUCCÈS ---
        if (isFormValid) {
            // Affiche le bandeau de succès vert
            successMessage.classList.remove("d-none");
            
            // Vide l'intégralité du formulaire
            contactForm.reset();
            
            // Optionnel : Retire proprement les bordures vertes après 4 secondes
            setTimeout(() => {
                allInputs.forEach(input => {
                    if (input) input.classList.remove("is-valid");
                });
            }, 4000);
        }
    });
}