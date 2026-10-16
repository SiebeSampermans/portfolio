const fr = {
  languageName: 'Français',
  layout: {
    languageLabel: 'Langue',
    languageSwitch: 'Choisir la langue',
    themeLabel: 'Thème',
    themeSwitch: 'Changer le thème de couleur',
    nav: {
      home: 'Accueil',
      about: 'À propos',
      projects: 'Projets',
      cv: 'CV',
      contact: 'Contact',
    },
    openMenu: 'Ouvrir le menu de navigation',
    closeMenu: 'Fermer le menu de navigation',
    brandListening: 'Siebe, en écoute sur Spotify',
    spotifyLoading: 'Chargement',
    spotifyOffline: 'Hors ligne',
    spotifyListening: 'En écoute',
    spotifyIdle: 'Inactif',
    artworkFor: (title) => `Pochette de ${title}`,
    checkingSpotify: 'Vérification de Spotify...',
    loadingPlayback: 'Chargement de la lecture en cours.',
    connectionIssue: 'Problème de connexion à Spotify',
    unableToLoad: 'Impossible de charger la lecture en cours.',
    nothingPlaying: 'Rien en lecture pour le moment',
  },
  home: {
    title: 'Siebe | Accueil',
    eyebrow: 'Portfolio vitrine',
    intro1:
      'Je suis Siebe, un étudiant motivé en informatique appliquée, passionné par la technologie, la créativité et le travail d’équipe.',
    intro2:
      'Sur ce site, je montre qui je suis, ce que je fais et quels projets et compétences je souhaite continuer à développer en vue de stages et d’une carrière professionnelle.',
    moreAboutMe: 'En savoir plus sur moi',
    viewProjects: 'Voir les projets',
    focusLabel: 'Orientation professionnelle',
    focus: [
      {
        title: 'Qui suis-je ?',
        text: 'Un étudiant sociable, curieux et sportif, doté d’une solide base technique.',
      },
      {
        title: 'Que fais-je ?',
        text: 'J’étudie l’informatique appliquée et je travaille sur des projets où technologie et créativité se rejoignent, tout en facilitant la communication entre les clients et les équipes de projet.',
      },
      {
        title: 'Pourquoi ce portfolio ?',
        text: 'Pour construire une première vitrine professionnelle, prête pour des stages et pour évoluer.',
      },
    ],
    statsEyebrow: 'Aperçu',
    statsTitle: 'En un coup d’œil',
    statsText: 'Quatre mots-clés qui résument ma façon de travailler, d’apprendre et où je veux aller.',
    stats: [
      {
        label: 'Personnel',
        title: 'Sociable',
        text: 'J’aime travailler avec les autres, réfléchir ensemble et puiser de l’énergie dans les relations humaines.',
      },
      {
        label: 'État d’esprit',
        title: 'Curieux',
        text: 'Je veux comprendre comment fonctionnent les systèmes et j’aime apprendre sans cesse de nouvelles choses.',
      },
      {
        label: 'Intérêt',
        title: 'Technologie',
        text: 'Le montage de PC, le développement et l’IA sont les domaines qui me passionnent le plus.',
      },
      {
        label: 'Objectif',
        title: 'Prêt pour un stage',
        text: 'Ce portfolio est ma première étape vers une solide vitrine professionnelle pour la 3ITF.',
      },
    ],
    footer: '© 2026 Siebe - Portfolio vitrine',
    footerLink: 'Voir mon CV',
  },
  about: {
    title: 'Siebe | À propos',
    eyebrow: 'À propos',
    heading: 'Qui je suis',
    intro:
      'Sur cette page, j’explique brièvement qui je suis, ce qui me motive et dans quels domaines je veux continuer à progresser.',
    photoAlt: 'Photo portrait de Siebe',
    introTitle: 'Une courte présentation',
    paragraphs: [
      'Je m’appelle Siebe et je suis un étudiant motivé en informatique appliquée. J’ai l’esprit social, je suis curieux de nature et j’aime collaborer avec les autres pour créer des solutions solides.',
      'En dehors de l’école, je fais du football, du beatbox, je joue aux jeux vidéo, je monte des PC et je passe du temps avec mes amis. Ces loisirs montrent non seulement ce que j’aime, mais en disent aussi long sur ma discipline, ma créativité et mon esprit d’équipe.',
      'J’ai choisi l’informatique appliquée parce que j’aime travailler avec des ordinateurs et parce que cette formation s’inscrit parfaitement dans l’orientation IT et développement que j’ai suivie en secondaire. Dès que j’ai remarqué que je repérais rapidement les bugs dans le code, j’ai su que l’IT était vraiment fait pour moi.',
    ],
    spotifyTitle: 'La musique occupe une grande place dans ma vie',
    spotifyText1:
      'J’écoute beaucoup de musique, et elle fait vraiment partie de mon quotidien. Elle m’accompagne dans les bons comme dans les mauvais moments, m’aide à rester concentré, me donne de l’énergie et est toujours là, que je veuille me détendre, travailler ou me vider la tête.',
    spotifyText2:
      'Le bloc en direct à droite donne un aperçu rapide de ce qui donne le ton à ma journée en ce moment.',
    liveListening: 'Écoute en direct',
    statusLoading: 'Chargement',
    statusOffline: 'Hors ligne',
    statusListening: 'En écoute',
    statusNotPlaying: 'Pas de lecture',
    checkingSpotify: 'Vérification de Spotify...',
    loadingTrack: 'Chargement du morceau en cours.',
    notSetUp: 'La connexion Spotify n’est pas encore configurée.',
    notSetUpText:
      'Ajoutez les identifiants de votre application Spotify et votre refresh token pour afficher l’écoute en direct ici.',
    artworkFor: (title) => `Pochette de ${title}`,
    trackProgress: 'Progression du morceau en cours',
    idleText: 'Se met à jour en direct dès qu’un morceau démarre.',
    futureEyebrow: 'Avenir',
    futureTitle: 'Mes rêves et ambitions',
    futureText:
      'À long terme, je veux utiliser la technologie d’une manière claire et utile pour les autres. L’IA est ce qui m’intéresse le plus en ce moment, mais le développement d’applications reste clairement une voie dans laquelle je me vois évoluer.',
    visionLabel: 'Vision',
    visionTitle: 'Je veux rendre la technologie humaine et pratique.',
    visionText:
      'Pour moi, une belle carrière dans l’IT n’est pas seulement technique. Je veux créer des solutions claires, utiles et qui ont aussi un sens pour la société.',
    shortTerm: 'Court terme',
    shortTermText:
      'Continuer à progresser en IA, en développement d’applications et en travail par projet.',
    longTerm: 'Long terme',
    longTermText:
      'Devenir un professionnel de l’IT qui contribue à la société de manière claire et humaine.',
    stackLabel: 'Tech stack',
    stackTitle: 'Outils et technologies que j’ai déjà utilisés',
    stackText:
      'Au cours de ma formation et de mes projets, j’ai déjà acquis de l’expérience avec différents langages, frameworks, outils et plateformes. Cette base étendue m’aide à passer facilement du front-end au back-end et à l’infrastructure technique.',
    skillsCarousel: 'Carrousel des compétences techniques',
    skillCategories: {
      Programming: 'Programmation',
      Framework: 'Framework',
      'Back-end': 'Back-end',
      Database: 'Base de données',
      'Front-end': 'Front-end',
      Cloud: 'Cloud',
      Networking: 'Réseaux',
      Enterprise: 'Entreprise',
      'Data & BI': 'Data & BI',
      'Low-code': 'Low-code',
      Process: 'Processus',
    },
    softSkillsLabel: 'Soft skills',
    softSkillsTitle: 'Mes soft skills font la différence',
    softSkillsText:
      'Au-delà des connaissances techniques, ce sont surtout mes soft skills qui me distinguent. Elles me permettent non seulement de réaliser un projet, mais aussi de le présenter clairement, de penser de manière humaine et de collaborer efficacement.',
    softSkills: [
      {
        title: 'Présenter et convaincre',
        text: 'Extraverti, je parle facilement aux gens et je présente mes projets clairement et avec assurance.',
      },
      {
        title: 'Empathie et orientation client',
        text: 'J’aime expliquer comment les choses fonctionnent à des personnes sans bagage technique.',
      },
      {
        title: 'Analyse et résolution de problèmes',
        text: 'J’analyse les processus métier et les besoins des clients, et je justifie clairement mes choix.',
      },
      {
        title: 'Travail d’équipe et responsabilité',
        text: 'Je prends des initiatives en équipe et j’assume mes responsabilités quand quelque chose ne va pas ou n’est pas à temps.',
      },
    ],
    footer: '© 2026 Siebe - À propos',
    footerLink: 'Voir mon CV',
  },
  projects: {
    title: 'Siebe | Projets',
    eyebrow: 'Projets / Réalisations',
    heading: 'Mes projets',
    intro:
      'Cette page rassemble des projets de cours et des travaux personnels qui montrent comment je progresse en analyse, design, développement et collaboration. Pour chaque projet, je décris le contexte, ma contribution, le résultat et ce que j’en ai appris.',
    loading: 'Chargement des visuels des projets...',
    open: (title) => `Ouvrir ${title}`,
    scrollFurther: 'Continuer à défiler',
    detailTitles: {
      context: 'Contexte',
      did: 'Ce que j’ai fait',
      result: 'Résultat',
      learned: 'Ce que j’ai appris',
    },
    items: {
      'project-5': {
        alt: 'Capture d’écran du modèle de données de l’analyse et de la conception du semestre 1',
        label: 'Deuxième année / Semestre 1',
        title: 'Rapport d’analyse',
        visualMeta: 'Analyse, conception et modèle de données',
        context:
          'Pendant le premier semestre de ma deuxième année en informatique appliquée, nous avons travaillé sur un projet SKIL plus important centré sur l’analyse et la conception. Il ne s’agissait pas seulement de trouver des idées, mais de documenter une solution complète avec des exigences claires, des flux et un modèle de données structuré.',
        did: 'J’ai contribué à l’analyse, aidé à structurer la documentation et traduit les exigences en une conception concrète. Cela impliquait de réfléchir aux entités, aux relations, aux parcours utilisateurs et à la manière dont la base de données et la structure de l’application devaient soutenir le projet.',
        result:
          'Le résultat final était un livrable complet d’analyse et de conception, avec un modèle de données détaillé pouvant servir de solide point de départ pour l’implémentation. Il a montré que je peux aider à façonner un projet avant le début du développement et garder des informations complexes bien structurées.',
        learned:
          'J’ai appris à quel point une bonne phase d’analyse est importante pour le développement qui suit. J’ai aussi progressé dans la documentation des décisions, la modélisation claire des données et la transformation d’exigences abstraites en une base technique sur laquelle une équipe peut construire.',
      },
      'project-6': {
        alt: 'Capture d’écran de la plateforme de fitness et de coaching Poutrel',
        label: 'Deuxième année / Semestre 2',
        title: 'Poutrel',
        visualMeta: 'Plateforme de fitness et de coaching',
        context:
          'Au deuxième semestre de ma deuxième année en informatique appliquée, nous avons reçu le rapport d’analyse et de conception d’un autre groupe et devions le transformer en un site web fonctionnel avec la TALL stack. Le concept est devenu Poutrel, une plateforme de fitness et de coaching où les utilisateurs peuvent réserver des cours, du matériel et suivre des programmes d’entraînement.',
        did: 'J’ai travaillé à traduire l’analyse reçue en une application web fonctionnelle, en veillant à la structure, à l’ergonomie et à la cohérence avec le concept d’origine. J’ai donc participé à la construction de l’interface comme de la logique applicative sous-jacente au sein de la TALL stack.',
        result:
          'Le résultat était un site web TALL stack fonctionnel, avec une interface épurée de type tableau de bord et des parcours clairs pour les réservations et le suivi des entraînements.',
        linkLabel: 'Voir Poutrel',
        learned:
          'J’ai appris à construire à partir de l’analyse de quelqu’un d’autre plutôt qu’à partir de mon propre concept. Cela m’a aidé à lire attentivement les exigences, à prendre des décisions techniques dans un cadre contraint et à collaborer dans un fonctionnement plus proche d’une vraie passation avec un client.',
      },
      'project-7': {
        alt: "Capture d’écran du site du salon de toilettage canin T'Snuffeltje",
        label: 'Projet personnel',
        title: "T'Snuffeltje",
        visualTitle: 'Site client',
        visualMeta: 'Site chaleureux pour un salon de toilettage canin',
        context:
          'Ce projet a commencé lorsqu’une amie de ma mère m’a demandé un site web pour son salon de toilettage canin. L’objectif était de créer un site chaleureux et personnel, fidèle à l’atmosphère paisible du salon et qui inspire immédiatement confiance aux visiteurs.',
        did: 'J’ai conçu et réalisé le site, puis je l’ai récemment mis à jour pour qu’il reflète mieux les compétences que j’ai développées depuis la première version. Je me suis concentré sur un style visuel doux, une meilleure structure du contenu et une présentation attentionnée et professionnelle pour un vrai client.',
        result:
          'Le résultat est un site en ligne pour une vraie entreprise, avec une identité visuelle forte, un contenu centré sur les services et un design en accord avec l’atmosphère du salon, visible dans les photos et la typographie.',
        linkLabel: "Voir T'Snuffeltje",
        learned:
          'J’ai beaucoup appris sur la conception pour un vrai client, la transformation de retours en améliorations concrètes et l’adaptation du style visuel d’un site à la personnalité d’une entreprise. Cela m’a aussi aidé à gagner en autonomie et en finition.',
      },
      'project-1': {
        alt: 'Capture d’écran du projet FarmForward',
        label: 'Deuxième année / Semestre 2',
        title: 'FarmForward',
        context:
          'FarmForward est né de l’histoire de Juma, un agriculteur de 54 ans vivant dans une région rurale de Tanzanie, qui dépend de la météo, de l’état du sol et du bon moment pour faire vivre sa famille. Le défi : beaucoup de petits agriculteurs font face à une météo imprévisible, à peu d’informations sur les semis ou les récoltes et à un accès limité aux smartphones ou aux outils en ligne.',
        did: 'J’ai aidé à concevoir un assistant SMS basé sur l’IA qui offre aux agriculteurs une aide simple et pratique grâce à des options numérotées. Le système a été pensé pour rester accessible même sur les téléphones les plus basiques, sans accès à Internet.',
        result:
          'Le résultat était une preuve de concept claire pour un assistant SMS à base d’IA capable de fournir des prévisions météo, des conseils sur les pesticides et des alertes de tempête via un simple menu. Il a montré comment la technologie peut être rendue utile et accessible à des agriculteurs souvent exclus des outils numériques.',
        learned:
          'J’ai appris à quel point l’accessibilité et la simplicité sont importantes dans la conception de solutions numériques. J’ai aussi amélioré ma capacité à penser du point de vue de l’utilisateur et à traduire un problème réel en un concept technique concret.',
      },
      'project-2': {
        alt: 'Capture d’écran du projet FridgeMate',
        label: 'Deuxième année / Semestre 1',
        title: 'FridgeMate',
        context:
          'FridgeMate est une preuve de concept qui aide les utilisateurs à savoir ce qu’il y a dans leur frigo. L’objectif était de réduire le gaspillage alimentaire, d’économiser de l’argent et de faciliter le choix de ce qu’on va cuisiner.',
        did: 'J’ai travaillé sur le concept et le front-end de l’application. J’ai aussi présenté l’idée lors d’un pitch, ce qui m’a permis de développer et de trouver ma propre voix à l’oral.',
        result:
          'Le résultat est un prototype simple et clair qui montre comment le suivi du contenu d’un frigo peut fonctionner en pratique.',
        linkLabel: 'Voir FridgeMate',
        learned:
          'J’ai appris à transformer une idée en une preuve de concept fonctionnelle. J’ai aussi amélioré mes compétences en pitch et en communication.',
      },
      'project-3': {
        alt: 'Capture d’écran du projet VRCade',
        label: 'Première année / Semestre 2',
        title: 'VRCade',
        context:
          'Pour le cours Fullstack Essentials, j’ai développé le front-end d’une salle d’arcade VR fictive. L’objectif était de créer un site moderne et attrayant qui reflète une expérience VR.',
        did: 'J’ai conçu et réalisé tout le front-end en HTML, CSS et JavaScript. Je me suis concentré sur une structure claire et un design futuriste.',
        result: 'Le résultat est un site responsive au look moderne, adapté à une salle d’arcade VR.',
        linkLabel: 'Voir VRCade',
        learned:
          'J’ai amélioré mes compétences en développement front-end et en responsive design. J’ai aussi compris l’importance de l’UX/UI pour offrir une bonne expérience utilisateur.',
      },
      'project-4': {
        alt: 'Capture d’écran du projet de portfolio en webdesign',
        label: 'Première année / Semestre 1',
        title: 'Portfolio webdesign',
        context:
          'Pour le cours Webdesign Essentials, j’ai créé un site web afin d’améliorer mes compétences en webdesign. L’objectif était de réaliser un site personnel attrayant et bien structuré.',
        did: 'J’ai conçu et développé le site de A à Z, en me concentrant sur la mise en page, le style et l’ergonomie. J’ai expérimenté différents éléments de design pour améliorer le rendu global.',
        result:
          'Le résultat est un site personnel sur le thème du gaming qui met en valeur mes compétences et mon style en design. Le site est hébergé sur une plateforme d’hébergement pour étudiants.',
        linkLabel: 'Voir le site',
        learned:
          'J’ai amélioré mes compétences en webdesign et en mise en page grâce à la pratique. J’ai aussi mieux compris le design visuel et l’expérience utilisateur.',
      },
    },
    footer: '© 2026 Siebe - Projets',
    footerLink: 'Voir À propos',
  },
  cv: {
    title: 'Siebe | CV',
    eyebrow: 'Curriculum Vitae',
    heading: 'Télécharger mon CV',
    intro:
      'Cette page contient une section dédiée à mon CV, disponible en PDF. Vous pouvez le télécharger directement ou l’afficher sur la page.',
    download: 'Télécharger le CV',
    printerOff: 'Éteindre l’imprimante',
    printerOn: 'Allumer l’imprimante',
    stationLabel: 'Station d’aperçu',
    printerTitle: 'Imprimante de CV interactive',
    printerText: 'Appuyez sur le bouton d’alimentation et regardez votre CV s’imprimer sous la fente.',
    previewLabel: 'Aperçu du CV',
    previewTitle: 'Aperçu du CV',
    footer: '© 2026 Siebe - CV',
    footerLink: 'Retour à l’accueil',
  },
  contact: {
    title: 'Siebe | Contact',
    eyebrow: 'Contact',
    heading: 'Prendre contact',
    intro:
      'Vous souhaitez me contacter pour un stage, un projet ou une première rencontre ? Laissez un message via le formulaire ou scannez le QR code pour accéder directement à mon profil LinkedIn.',
    formLabel: 'Formulaire de contact',
    formTitle: 'Envoyez-moi un message',
    formText:
      'Rédigez votre message et envoyez-le directement via EmailJS. Pendant l’envoi, vous verrez d’abord une barre de progression, puis un message indiquant si l’envoi a réussi. Les messages de cette page sont envoyés à',
    honeypot: 'Laissez ce champ vide',
    name: 'Nom',
    namePlaceholder: 'Votre nom',
    email: 'E-mail',
    emailPlaceholder: 'vous@email.com',
    message: 'Message',
    messagePlaceholder: 'Expliquez brièvement pourquoi vous me contactez...',
    sendingEmail: 'Envoi de l’e-mail',
    success: 'Succès',
    error: 'Erreur',
    sending: 'Envoi...',
    send: 'Envoyer le message',
    errors: {
      blocked: 'L’envoi a été bloqué. Veuillez réessayer.',
      tooFast: 'Veuillez patienter un instant avant de réessayer.',
      offensiveName: 'Veuillez utiliser un nom respectueux, sans langage offensant.',
      offensiveMessage: 'Veuillez garder un message respectueux, sans langage offensant.',
      invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
      notConfigured:
        'EmailJS n’est pas encore configuré. Ajoutez VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID et VITE_EMAILJS_PUBLIC_KEY à votre fichier .env.',
      failed: 'L’envoi a échoué. Vérifiez votre configuration EmailJS et réessayez.',
    },
    preparing: 'Préparation de votre message...',
    sendingMessage: 'Envoi de votre message...',
    sent: 'Votre e-mail a bien été envoyé.',
    linkedinTitle: 'Scannez mon QR code',
    linkedinText:
      'Scannez le code pour ouvrir directement mon profil LinkedIn, ou utilisez le bouton ci-dessous pour y accéder.',
    openLinkedin: 'Ouvrir LinkedIn',
    socialsEyebrow: 'Réseaux sociaux',
    socialsTitle: 'Retrouvez-moi aussi ici',
    socialsText:
      'En plus du formulaire de contact, vous pouvez aussi me joindre directement via ces trois cartes de contact.',
    socials: {
      Instagram: {
        text: 'Pour des moments en coulisses, des nouvelles au quotidien et un côté plus personnel de moi.',
        cta: 'Ouvrir Instagram',
      },
      Facebook: {
        text: 'Pour des nouvelles personnelles, des liens sociaux et une autre façon de rester en contact.',
        cta: 'Ouvrir Facebook',
      },
      Outlook: {
        text: 'Pour des questions directes, des collaborations ou une présentation professionnelle par e-mail.',
        cta: 'Écrire via Outlook',
      },
    },
    footer: '© 2026 Siebe - Contact',
    footerLink: 'Voir mon CV',
  },
};

export default fr;
