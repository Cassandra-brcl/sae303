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
    
    infoText.innerHTML = '<p>'+text+'</p>';
    infoBox.classList.remove('hidden');

    // Ajouter les événements de clic aux images avec liens
    setTimeout(() => {
        const linkImages = infoText.querySelectorAll('img[data-url]');
        linkImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        });

    // Ajouter les événements de clic aux images avec liens internes
        const internalLinks = infoText.querySelectorAll('img[data-case]');
        internalLinks.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                const caseId = this.getAttribute('data-case');
                if (caseId) {
                    handleImageClick(caseId);
                }
            });
        });
    }, 100);
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
            texte = `Salut ! Moi c'est Athéna, la mascotte de l'IUT, je suis là tout au long de l'année pour t'accompagner dans ta vie étudiante.<br>
            Tu me retrouveras généralement lors des évènements étudiants organisés par le BDE. <br> <br>
            Je te laisse me rejoindre sur insta et tiktok pour suivre toutes mes aventures !<br> <br>

            <img src="sources/insta.png" 
            data-url="https://www.instagram.com/aeiutbeziers?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            style="width:40px; height:40px; margin:05px;"></img>

            <img src="sources/tiktok.png" 
            data-url="https://www.tiktok.com/@aeiutbeziers34?_r=1&_t=ZN-91yCmLAi91K" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'planet':
            texte = `Situé dans le Sud de la France, au cœur de l'Occitanie, l'IUT vous permet de bénéficier d'un cadre de vie agréable.<br>
            Venez profiter d'une vie étudiante dynamique entre plages, patrimoines et paysages.<br>
            La ville de Béziers offre un cadre de vie convivial et abordable, faisant de cet IUT l'endroit parfait pour allier études de qualité et quotidien ensoleillé.<br><br>
            
            <img src="sources/office.png" 
            data-url="https://www.beziers-mediterranee.com/" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'etu':
            texte = 'Nos étudiants sont au cœur de notre projet pédagogique.';
            break;
        case '3but':
            texte = `Le Bachelor Universitaire de Technologie est un diplôme sur 3 ans.<br>
            Il s'agit d'une formation professionnalisante entre théorie et pratique en intégrant : travaux pratiques et dirigés,  stages obligatoires et la possibilité d'alternance.<br>
            L'obtention du BUT ouvre deux voies principales : une insertion professionnelle immédiate ou la poursuite d'études vers un Master ou une école spécialisée.<br><br>
            Découvrez les 3 BUT que nous proposons à l'IUT: <br>
            
            <img src="sources/mmi.png" 
            data-case="mmi"
            style="width:40px; height:40px; margin:5px;"></img>
            
            <img src="sources/RT.png" 
            data-case="rt"
            style="width:40px; height:40px; margin:5px;"></img>
            
            <img src="sources/TC.png" 
            data-case="tc"
            style="width:40px; height:40px; margin:5px;"></img>`;
            break;
        case 'licence':
            texte = `La licence professionnelle en 3 ans est une formation professionnalisante entre théorie et pratique en intégrant la gestion de projet agile,  stages obligatoires et la possibilité d\'alternance.<br>
            L'obtention d'une licence pro ouvre deux voies principales : une insertion professionnelle immédiate ou la poursuite d'études vers un Master ou une école spécialisée.<br><br>
            Découvrez la licence pro que nous proposons à l'IUT: <br>
            
            <img src="sources/rob.png" 
            data-case="rob"
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'iut':
            texte = `L\'Institut Universitaire de Technologie de Béziers est un établissement d\'enseignement supérieur public qui fait partie de l\'Université de Montpellier.<br><br>
            
            <img src="sources/info.png" 
            data-url="https://iut-beziers.edu.umontpellier.fr/" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'commerce':
            texte = `La formation BUT Techniques de Commercialisation (TC) de l'IUT de Béziers ouvre des débouchés essentiels et évolutifs dans le secteur du commerce omnicanal et du marketing digital.<br>
            Les diplômés sont formés pour devenir des professionnels polyvalents, capables de maîtriser l'ensemble de la chaîne de valeur, de la prospection à la fidélisation client.<br>
            Il ne s'agit plus seulement de vendre, mais de créer de la valeur en développant des stratégies commerciales et marketing adaptées à l'ère numérique, en ligne et en point de vente physique, grâce à l'analyse des données clients.`; 
            break;
        case 'industrie':
            texte = `la Licence Professionnelle Robotique & Intelligence Artificielle (ROB&IA) de l'IUT de Béziers ouvre des débouchés cruciaux et très demandés dans le domaine de l\'industrie 4.0 et 5.0.<br>
            Les diplômés sont formés pour devenir des techniciens supérieurs polyvalents capables de combler le fossé entre les systèmes de production (OT) et les systèmes informatiques (IT).<br>
            Il ne s'agit plus seulement de fabriquer, mais d'optimiser, d'automatiser et de rendre les usines intelligentes grâce à l'interconnexion des machines et à l'analyse des données.`;
            break;
        case 'com':
            texte = `Le secteur de la Communication est un secteur large qui offres de nombreuses opportunités.<br><br>
            Les diplômés du BUT Métiers du Multimédia et de l'Internet (MMI) sont formés à concevoir et développer des solutions numériques. Ils deviennent des professionnels polyvalents dans l'audiovisuel, l'infographie, le web design et la gestion de projet digital.<br> <br>
            Les diplômés du BUT Techniques de Commercialisation (TC) sont formés au marketing, leur permettant de gérer une stratégie de marque et les campagnes de communication en ligne et hors ligne.`;
            break;
        case 'num':
            texte = `Le secteur du Numérique est le moteur de l'économie moderne, couvrant l'infrastructure réseau et le développement de contenu et de services. Il est caractérisé par une demande constante en connectivité sécurisée et en expériences utilisateur (UX) innovantes.<br><br>
            Les diplômés du BUT Réseaux et Télécommunications (RT) sont formés à devenir des experts chargés de concevoir, déployer et sécuriser les réseaux (fixes, mobiles, cloud, IoT), garantissant la fiabilité de l'information et des communications <br> <br>
            Les diplômés du BUT Métiers du Multimédia et de l'Internet (MMI) sont formés à être les créatifs et les développeurs qui conçoivent les interfaces, les sites web, les applications mobiles et le contenu audiovisuel, transformant l'infrastructure réseau en services visibles pour les utilisateurs.`;
            break;
        case 'alternant':
            texte =`Le parcours en alternance permet à l'étudiant de partager son temps entre l'IUT et une entreprise, en suivant un rythme qui alterne périodes de cours et périodes de travail.<br>
            Ce mode de formation offre une immersion professionnelle continue, permet d'acquérir de l'expérience profesinnelle tout au long de l'année et donne souvent accès à une insertion plus rapide dans le monde du travail.<br> <br>
            À Béziers, 2 étudiants sur 10 choisissent l'alternance, privilégiant ainsi une formation directement ancrée dans la réalité professionnelle et une expérience significative dès leur deuxième année d'étude.`;
            break;
        case 'stagiaire':
            texte = `Le parcours initial avec stage est une modalité de formation dans laquelle l'étudiant suit ses cours à temps plein à l'IUT tout au long de l'année, puis réalise un stage en entreprise pour mettre en pratique les compétences acquises.<br>
            Ce stage, généralement effectué à la fin de l'année, permet de découvrir le monde professionnel et de développer une première expérience concrète.<br><br>
            À Béziers, 8 étudiants sur 10 choisissent le parcours initial, ce qui en fait la voie la plus répandue et la plus adaptée à ceux qui souhaitent suivre une formation complète à l'IUT avant de réaliser leurs stages.`;
            break;
        case 'rob':
            texte = `La Licence Professionnelle Rob&AI forme des techniciens, ingénieurs et cadres spécialisés en robotique, intelligence artificielle et cybersécurité, avec un accent sur les environnements industriels modernes, notamment l'industrie 4.0 et 5.0. La formation permet aux étudiants d'acquérir les compétences nécessaires pour concevoir et déployer des solutions de robotique et d'automatisation, gérer et maintenir des systèmes industriels connectés via l'IoT et l'IA, et sécuriser ces systèmes tant sur le plan opérationnel (OT) que numérique (IT). <br>
            Les diplômés peuvent intervenir dans des entreprises industrielles pour mettre en œuvre des systèmes automatisés intelligents, assurer leur maintenance et leur sécurité, et développer des solutions innovantes adaptées aux besoins de l'industrie moderne.<br><br>
            
            <img src="sources/info.png" 
            data-url="https://iut-beziers.edu.umontpellier.fr/files/2025/10/ROBIA2024.pdf" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'mmi':
            texte = `Le BUT MMI (métiers du multimédia et de l'Internet) est un diplôme bac + 3 qui forme à la création de sites web, à la gestion de communautés sur les réseaux sociaux, à la production de contenus multimédias (jeux vidéo, applications, etc.) et au développement de services en ligne.
            Dès la 2e année la formation s'organise autour de deux parcours :<br>
            - création numérique <br>
            - développement web et dispositifs interactifs <br><br>
            
            <img src="sources/info.png" 
            data-url="https://iut-beziers.edu.umontpellier.fr/files/2025/10/MMI2024.pdf" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'rt':
            texte = `Le BUT R&T forme des spécialistes capables d'installer, sécuriser et maintenir des réseaux informatiques.<br>
            Dès la 2ᵉ année, la formation s'organise autour de deux parcours :<br>
            - la cybersécurité, qui vise à protéger les systèmes et les données contre les attaques <br>
            - le développement système et cloud, qui permet de maîtriser la création et la gestion d'infrastructures informatiques et de services cloud.<br><br>
            
            <img src="sources/info.png" 
            data-url="https://iut-beziers.edu.umontpellier.fr/files/2025/10/RT2024.pdf" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
        case 'tc':
            texte = `Le BUT TC (Techniques de Commercialisation) est un diplôme bac +3 qui forme aux métiers du commerce, du marketing et de la relation client. Les étudiants apprennent à vendre, communiquer, analyser un marché et gérer des projets.<br>
            Dès la 2ᵉ année, la formation s'organise autour de deux parcours :<br> 
            - le marketing digital <br>
            - l'international <br>
            - la gestion de points de vente.<br><br>
            
            <img src="sources/info.png" 
            data-url="https://iut-beziers.edu.umontpellier.fr/files/2025/10/TC2024.pdf" 
            style="width:40px; height:40px; margin:05px;"></img>`;
            break;
message
        default:
            texte = 'Information sur : ' + imageId;
    }
    
    showInfoBox(texte);
}