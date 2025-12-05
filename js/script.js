// Attendre que la scène soit chargée
document.addEventListener('DOMContentLoaded', function() {
    
    const scene = document.querySelector('a-scene');
    
    if (scene) {
        scene.addEventListener('loaded', function () {
            console.log('Scène A-Frame chargée');
            setTimeout(function() {
                initClickEvents();
            }, 1000);
        });
    }
});

function initClickEvents() {
    const canvas = document.querySelector('a-scene').canvas;
    const infoBox = document.getElementById('infoBox');
    const retourBtn = document.getElementById('retourBtn');
    const camera = document.querySelector('a-camera');
    
    // Fonction pour détecter quel objet est cliqué
    function detectClickedObject(x, y) {
        console.log('clic à:', x, y);
        
        // Créer un raycaster THREE.js manuel
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // Convertir les coordonnées écran en coordonnées normalisées
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

        
        // Obtenir la caméra THREE.js
        const threeCamera = camera.getObject3D('camera');
        if (!threeCamera) {
            return null;
        }
        
        raycaster.setFromCamera(mouse, threeCamera);
        
        // Récupérer tous les objets cliquables
        const clickableImages = document.querySelectorAll('.clickable');
        const objects = [];
        
        clickableImages.forEach(image => {
            const obj = image.getObject3D('mesh');
            if (obj) {
                obj.userData.imageId = image.id;
                objects.push(obj);
            }
        });
        
        
        // Tester les intersections
        const intersects = raycaster.intersectObjects(objects, true);
        
        if (intersects.length > 0) {
            // Trouver l'ID de l'image
            let obj = intersects[0].object;
            while (obj && !obj.userData.imageId) {
                obj = obj.parent;
            }
            
            if (obj && obj.userData.imageId) {
                return obj.userData.imageId;
            }
        }
        
        return null;
    }
    
    // Événement de clic sur le canvas
    canvas.addEventListener('click', function(evt) {
        const imageId = detectClickedObject(evt.clientX, evt.clientY);
        if (imageId) {
            handleImageClick(imageId);
        } 
    });
    
    // Événement tactile pour mobile
    canvas.addEventListener('touchend', function(evt) {
        evt.preventDefault();
        const touch = evt.changedTouches[0];
        const imageId = detectClickedObject(touch.clientX, touch.clientY);
        if (imageId) {
            handleImageClick(imageId);
        }
    });
    
    // Bouton retour
    if (retourBtn) {
        retourBtn.addEventListener('click', function(evt) {
            evt.stopPropagation();
            hideInfoBox();
        });
    }
}

function showInfoBox(text) {
    
    const clickableImages = document.querySelectorAll('.clickable');
    const infoBox = document.getElementById('infoBox');
    const infoText = document.getElementById('infoText');
    
    clickableImages.forEach(image => {
        image.setAttribute('visible', 'false');
    });
    
    infoText.textContent = text;
    infoBox.classList.remove('hidden');
}

function hideInfoBox() {
    
    const clickableImages = document.querySelectorAll('.clickable');
    const infoBox = document.getElementById('infoBox');
    
    clickableImages.forEach(image => {
        image.setAttribute('visible', 'true');
    });
    
    infoBox.classList.add('hidden');
}

function handleImageClick(imageId) {
    
    let texte = '';
    
    switch(imageId) {
        case 'hibou':
            texte = 'Salut ! Moi c\'est Athéna, la mascotte de l\'iut, je suis là tout au long de l\'année pour t\'accompagner dans ta vie étudiante. Tu me retrouveras généralement lors des évènements étudiants organisés par le BDE. Je te laisse me rejoindre sur insta et tiktok pour suivre toutes mes aventures ! ';
            break;
        case 'planet':
            texte = 'Situé dans le Sud de la France, au cœur de l\'Occitanie, l\'iut vous permet de bénéficier d\'un cadre de vie agréable. Venz profiter d\'une vie étudiante dynamique entre plages, patrimoines et paysages. La ville de Béziers offre un cadre de vie convivial et abordable, faisant de cet IUT l\'endroit parfait pour allier études de qualité et quotidien ensoleillé. ';
            break;
        case 'etu':
            texte = 'Nos étudiants sont au cœur de notre projet pédagogique.';
            break;
        case '3but':
            texte = 'Le Bachelor Universitaire de Technologie est un diplôme sur 3 ans. Il s\'agit d\'une formation professionnalisante entre théorie et pratique en intégrant : travaux pratiques et dirigés,  stages obligatoires et la possibilité d\'alternance. L\'obtention du BUT ouvre deux voies principales : une insertion professionnelle immédiate ou la poursuite d\'études vers un Master ou une école spécialisée.';
            break;
        case 'licence':
            texte = 'La licence professionnelle en 3 ans est une formation professionnalisante entre théorie et pratique en intégrant la gestion de projet agile,  stages obligatoires et la possibilité d\'alternance. L\'obtention d\'une licence pro ouvre deux voies principales : une insertion professionnelle immédiate ou la poursuite d\'études vers un Master ou une école spécialisée.';
            break;
        case 'iut':
            texte = 'L\'Institut Universitaire de Technologie de Béziers est un établissement d\'enseignement supérieur public qui fait partie de l\'Université de Montpellier.';
            break;
        case 'commerce':
            texte = 'Le secteur du commerce est accessible grâce à notre BUT TC qui forme aux métiers de la vente et du marketing.';
            break;
        case 'industrie':
            texte = 'Le secteur de l\'industrie est accessible grâce à notre Licence Pro Rob&IA qui prépare aux métiers de l\'industrie 4.0 et 5.0: mécatronique et robotique.';
            break;
        case 'com':
            texte = 'Le secteur de la communication est accessible grâce à nos BUT MMI et TC qui forment les étudiants à développer des stratégies de communications, au marketing et à produire des contenus visuels et web.';
            break;
        case 'num':
            texte = 'Le secteur numérique est accessible grâce à nos BUT RT et MMI qui forment nos étudiants à la création et gestion de contenu web, au développement de système et cloud et à la cybersécurité.';
            break;
        case 'alternant':
            texte = 'L\'alternance permet de combiner formation théorique et expérience professionnelle.';
            break;
        case 'stagiaire':
            texte = 'Les stages sont une partie intégrante de votre formation.';
            break;
        case 'rob':
            texte = 'La robotique représente l\'avenir de l\'industrie et de la technologie.';
            break;
        case 'mmi':
            texte = 'Le BUT MMI (Métiers du Multimédia et de l\'Internet) forme aux métiers du web et du digital.';
            break;
        case 'rt':
            texte = 'Le BUT Réseaux & Télécommunications forme aux infrastructures réseau.';
            break;
        case 'tc':
            texte = 'Le BUT Techniques de Commercialisation forme aux métiers du commerce et du marketing.';
            break;
        default:
            texte = 'Information sur : ' + imageId;
    }
    
    showInfoBox(texte);
}