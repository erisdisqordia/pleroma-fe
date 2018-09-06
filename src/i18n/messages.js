// sed command for converting currently formatted JS to JSON:
// sed -i -e "s/'//gm" -e 's/"/\\"/gm' -re 's/^( +)(.+?): ((.+?))?(,?)(\{?)$/\1"\2": "\4"/gm' -e 's/\"\{\"/{/g' -e 's/,"$/",/g' file.json

// To sort json use jq https://stedolan.github.io/jq and invoke it like `jq -S . xx.json > ss.sorted.json`

// Languages with MRs pending: de, oc, pt, eo

const de = {
  chat: {
    title: 'Chat'
  },
  nav: {
    chat: 'Lokaler Chat',
    timeline: 'Zeitleiste',
    mentions: 'Erwähnungen',
    public_tl: 'Lokale Zeitleiste',
    twkn: 'Das gesamte Netzwerk'
  },
  user_card: {
    follows_you: 'Folgt dir!',
    following: 'Folgst du!',
    follow: 'Folgen',
    blocked: 'Blockiert!',
    block: 'Blockieren',
    statuses: 'Beiträge',
    mute: 'Stummschalten',
    muted: 'Stummgeschaltet',
    followers: 'Folgende',
    followees: 'Folgt',
    per_day: 'pro Tag',
    remote_follow: 'Remote Follow'
  },
  timeline: {
    show_new: 'Zeige Neuere',
    error_fetching: 'Fehler beim Laden',
    up_to_date: 'Aktuell',
    load_older: 'Lade ältere Beiträge',
    conversation: 'Unterhaltung',
    collapse: 'Einklappen',
    repeated: 'wiederholte'
  },
  settings: {
    user_settings: 'Benutzereinstellungen',
    name_bio: 'Name & Bio',
    name: 'Name',
    bio: 'Bio',
    avatar: 'Avatar',
    current_avatar: 'Dein derzeitiger Avatar',
    set_new_avatar: 'Setze neuen Avatar',
    profile_banner: 'Profil Banner',
    current_profile_banner: 'Dein derzeitiger Profil Banner',
    set_new_profile_banner: 'Setze neuen Profil Banner',
    profile_background: 'Profil Hintergrund',
    set_new_profile_background: 'Setze neuen Profil Hintergrund',
    settings: 'Einstellungen',
    theme: 'Farbschema',
    presets: 'Voreinstellungen',
    export_theme: 'Farbschema speichern',
    import_theme: 'Farbschema laden',
    invalid_theme_imported: 'Die ausgewählte Datei ist kein unterstütztes Pleroma-Theme. Keine Änderungen wurden vorgenommen.',
    theme_help: 'Benutze HTML Farbcodes (#rrggbb) um dein Farbschema anzupassen',
    radii_help: 'Kantenrundung (in Pixel) der Oberfläche anpassen',
    background: 'Hintergrund',
    foreground: 'Vordergrund',
    text: 'Text',
    links: 'Links',
    cBlue: 'Blau (Antworten, Folgt dir)',
    cRed: 'Rot (Abbrechen)',
    cOrange: 'Orange (Favorisieren)',
    cGreen: 'Grün (Retweet)',
    btnRadius: 'Buttons',
    inputRadius: 'Eingabefelder',
    panelRadius: 'Panel',
    avatarRadius: 'Avatare',
    avatarAltRadius: 'Avatare (Benachrichtigungen)',
    tooltipRadius: 'Tooltips/Warnungen',
    attachmentRadius: 'Anhänge',
    filtering: 'Filter',
    filtering_explanation: 'Alle Beiträge die diese Wörter enthalten werden ausgeblendet. Ein Wort pro Zeile.',
    attachments: 'Anhänge',
    hide_attachments_in_tl: 'Anhänge in der Zeitleiste ausblenden',
    hide_attachments_in_convo: 'Anhänge in Unterhaltungen ausblenden',
    nsfw_clickthrough: 'Aktiviere ausblendbares Overlay für Anhänge, die als NSFW markiert sind',
    stop_gifs: 'Play-on-hover GIFs',
    autoload: 'Aktiviere automatisches Laden von älteren Beiträgen beim scrollen',
    streaming: 'Aktiviere automatisches Laden (Streaming) von neuen Beiträgen',
    reply_link_preview: 'Aktiviere reply-link Vorschau bei Maus-Hover',
    follow_import: 'Folgeliste importieren',
    import_followers_from_a_csv_file: 'Importiere Kontakte, denen du folgen möchtest, aus einer CSV-Datei',
    follows_imported: 'Folgeliste importiert! Die Bearbeitung kann eine Zeit lang dauern.',
    follow_import_error: 'Fehler beim importieren der Folgeliste',
    delete_account: 'Account löschen',
    delete_account_description: 'Lösche deinen Account und alle deine Nachrichten dauerhaft.',
    delete_account_instructions: 'Tippe dein Passwort unten in das Feld ein um die Löschung deines Accounts zu bestätigen.',
    delete_account_error: 'Es ist ein Fehler beim löschen deines Accounts aufgetreten. Tritt dies weiterhin auf, wende dich an den Administrator der Instanz.',
    follow_export: 'Folgeliste exportieren',
    follow_export_processing: 'In Bearbeitung. Die Liste steht gleich zum herunterladen bereit.',
    follow_export_button: 'Liste (.csv) erstellen',
    change_password: 'Passwort ändern',
    current_password: 'Aktuelles Passwort',
    new_password: 'Neues Passwort',
    confirm_new_password: 'Neues Passwort bestätigen',
    changed_password: 'Passwort erfolgreich geändert!',
    change_password_error: 'Es gab ein Problem bei der Änderung des Passworts.'
  },
  notifications: {
    notifications: 'Benachrichtigungen',
    read: 'Gelesen!',
    followed_you: 'folgt dir',
    favorited_you: 'favorisierte deine Nachricht',
    repeated_you: 'wiederholte deine Nachricht'
  },
  login: {
    login: 'Anmelden',
    username: 'Benutzername',
    placeholder: 'z.B. lain',
    password: 'Passwort',
    register: 'Registrieren',
    logout: 'Abmelden'
  },
  registration: {
    registration: 'Registrierung',
    fullname: 'Angezeigter Name',
    email: 'Email',
    bio: 'Bio',
    password_confirm: 'Passwort bestätigen'
  },
  post_status: {
    posting: 'Veröffentlichen',
    default: 'Sitze gerade im Hofbräuhaus.',
    account_not_locked_warning: 'Dein Profil ist nicht {0}. Wer dir folgen will, kann das jederzeit tun und dann auch deine privaten Beiträge sehen.',
    account_not_locked_warning_link: 'gesperrt',
    direct_warning: 'Dieser Beitrag wird nur für die erwähnten Nutzer sichtbar sein.',
    scope: {
      public: 'Öffentlich - Beitrag an öffentliche Zeitleisten',
      unlisted: 'Nicht gelistet - Nicht in öffentlichen Zeitleisten anzeigen',
      private: 'Nur Folgende - Beitrag nur an Folgende',
      direct: 'Direkt - Beitrag nur an erwähnte Profile'
    }
  },
  finder: {
    find_user: 'Finde Benutzer',
    error_fetching_user: 'Fehler beim Suchen des Benutzers'
  },
  general: {
    submit: 'Absenden',
    apply: 'Anwenden'
  },
  user_profile: {
    timeline_title: 'Beiträge'
  }
}

const eo = {
  chat: {
    title: 'Babilo'
  },
  nav: {
    chat: 'Loka babilo',
    timeline: 'Tempovido',
    mentions: 'Mencioj',
    public_tl: 'Publika tempovido',
    twkn: 'Tuta konata reto'
  },
  user_card: {
    follows_you: 'Abonas vin!',
    following: 'Abonanta!',
    follow: 'Aboni',
    blocked: 'Barita!',
    block: 'Bari',
    statuses: 'Statoj',
    mute: 'Silentigi',
    muted: 'Silentigita',
    followers: 'Abonantoj',
    followees: 'Abonatoj',
    per_day: 'tage',
    remote_follow: 'Fora abono'
  },
  timeline: {
    show_new: 'Montri novajn',
    error_fetching: 'Eraro ĝisdatigante',
    up_to_date: 'Ĝisdata',
    load_older: 'Enlegi pli malnovajn statojn',
    conversation: 'Interparolo',
    collapse: 'Maletendi',
    repeated: 'ripetata'
  },
  settings: {
    user_settings: 'Uzulaj agordoj',
    name_bio: 'Nomo kaj prio',
    name: 'Nomo',
    bio: 'Prio',
    avatar: 'Profilbildo',
    current_avatar: 'Via nuna profilbildo',
    set_new_avatar: 'Agordi novan profilbildon',
    profile_banner: 'Profila rubando',
    current_profile_banner: 'Via nuna profila rubando',
    set_new_profile_banner: 'Agordi novan profilan rubandon',
    profile_background: 'Profila fono',
    set_new_profile_background: 'Agordi novan profilan fonon',
    settings: 'Agordoj',
    theme: 'Haŭto',
    presets: 'Antaŭmetaĵoj',
    theme_help: 'Uzu deksesumajn kolorkodojn (#rrvvbb) por adapti vian koloran haŭton.',
    radii_help: 'Agordi fasadan rondigon de randoj (rastrumere)',
    background: 'Fono',
    foreground: 'Malfono',
    text: 'Teksto',
    links: 'Ligiloj',
    cBlue: 'Blua (Respondo, abono)',
    cRed: 'Ruĝa (Nuligo)',
    cOrange: 'Orange (Ŝato)',
    cGreen: 'Verda (Kunhavigo)',
    btnRadius: 'Butonoj',
    panelRadius: 'Paneloj',
    avatarRadius: 'Profilbildoj',
    avatarAltRadius: 'Profilbildoj (Sciigoj)',
    tooltipRadius: 'Ŝpruchelpiloj/avertoj',
    attachmentRadius: 'Kunsendaĵoj',
    filtering: 'Filtrado',
    filtering_explanation: 'Ĉiuj statoj kun tiuj ĉi vortoj silentiĝos, po unu linie',
    attachments: 'Kunsendaĵoj',
    hide_attachments_in_tl: 'Kaŝi kunsendaĵojn en tempovido',
    hide_attachments_in_convo: 'Kaŝi kunsendaĵojn en interparoloj',
    nsfw_clickthrough: 'Ŝalti traklakan kaŝon de konsternaj kunsendaĵoj',
    stop_gifs: 'Movi GIF-bildojn dum ŝvebo',
    autoload: 'Ŝalti memfaran enlegadon ĉe subo de paĝo',
    streaming: 'Ŝalti memfaran fluigon de novaj afiŝoj ĉe supro de paĝo',
    reply_link_preview: 'Ŝalti respond-ligilan antaŭvidon dum ŝvebo',
    follow_import: 'Abona enporto',
    import_followers_from_a_csv_file: 'Enporti abonojn de CSV-dosiero',
    follows_imported: 'Abonoj enportiĝis! Traktado daŭros iom.',
    follow_import_error: 'Eraro enportante abonojn'
  },
  notifications: {
    notifications: 'Sciigoj',
    read: 'Legita!',
    followed_you: 'ekabonis vin',
    favorited_you: 'ŝatis vian staton',
    repeated_you: 'ripetis vian staton'
  },
  login: {
    login: 'Saluti',
    username: 'Salutnomo',
    placeholder: 'ekz. lain',
    password: 'Pasvorto',
    register: 'Registriĝi',
    logout: 'Adiaŭi'
  },
  registration: {
    registration: 'Registriĝo',
    fullname: 'Vidiga nomo',
    email: 'Retpoŝtadreso',
    bio: 'Prio',
    password_confirm: 'Konfirmo de pasvorto'
  },
  post_status: {
    posting: 'Afiŝanta',
    default: 'Ĵus alvenis la universalan kongreson!'
  },
  finder: {
    find_user: 'Trovi uzulon',
    error_fetching_user: 'Eraro alportante uzulon'
  },
  general: {
    submit: 'Sendi',
    apply: 'Apliki'
  },
  user_profile: {
    timeline_title: 'Uzula tempovido'
  }
}

const oc = {
  chat: {
    title: 'Messatjariá'
  },
  nav: {
    chat: 'Chat local',
    timeline: 'Flux d’actualitat',
    mentions: 'Notificacions',
    public_tl: 'Estatuts locals',
    twkn: 'Lo malhum conegut'
  },
  user_card: {
    follows_you: 'Vos sèc !',
    following: 'Seguit !',
    follow: 'Seguir',
    blocked: 'Blocat',
    block: 'Blocar',
    statuses: 'Estatuts',
    mute: 'Amagar',
    muted: 'Amagat',
    followers: 'Seguidors',
    followees: 'Abonaments',
    per_day: 'per jorn',
    remote_follow: 'Seguir a distància'
  },
  timeline: {
    show_new: 'Ne veire mai',
    error_fetching: 'Error en cercant de mesas a jorn',
    up_to_date: 'A jorn',
    load_older: 'Ne veire mai',
    conversation: 'Conversacion',
    collapse: 'Tampar',
    repeated: 'repetit'
  },
  settings: {
    user_settings: 'Paramètres utilizaire',
    name_bio: 'Nom & Bio',
    name: 'Nom',
    bio: 'Biografia',
    avatar: 'Avatar',
    current_avatar: 'Vòstre avatar actual',
    set_new_avatar: 'Cambiar l’avatar',
    profile_banner: 'Bandièra del perfil',
    current_profile_banner: 'Bandièra actuala del perfil',
    set_new_profile_banner: 'Cambiar de bandièra',
    profile_background: 'Imatge de fons',
    set_new_profile_background: 'Cambiar l’imatge de fons',
    settings: 'Paramètres',
    theme: 'Tèma',
    presets: 'Pre-enregistrats',
    theme_help: 'Emplegatz los còdis de color hex (#rrggbb) per personalizar vòstre tèma de color.',
    radii_help: 'Configurar los caires arredondits de l’interfàcia (en pixèls)',
    background: 'Rèire plan',
    foreground: 'Endavant',
    text: 'Tèxte',
    links: 'Ligams',
    cBlue: 'Blau (Respondre, seguir)',
    cRed: 'Roge (Anullar)',
    cOrange: 'Irange (Metre en favorit)',
    cGreen: 'Verd (Repartajar)',
    inputRadius: 'Camps tèxte',
    btnRadius: 'Botons',
    panelRadius: 'Panèls',
    avatarRadius: 'Avatars',
    avatarAltRadius: 'Avatars (Notificacions)',
    tooltipRadius: 'Astúcias/Alèrta',
    attachmentRadius: 'Pèças juntas',
    filtering: 'Filtre',
    filtering_explanation: 'Totes los estatuts amb aqueles mots seràn en silenci, un mot per linha.',
    attachments: 'Pèças juntas',
    hide_attachments_in_tl: 'Rescondre las pèças juntas',
    hide_attachments_in_convo: 'Rescondre las pèças juntas dins las conversacions',
    nsfw_clickthrough: 'Activar lo clic per mostrar los imatges marcats coma pels adults o sensibles',
    stop_gifs: 'Lançar los GIFs al subrevòl',
    autoload: 'Activar lo cargament automatic un còp arribat al cap de la pagina',
    streaming: 'Activar lo cargament automatic dels novèls estatus en anar amont',
    reply_link_preview: 'Activar l’apercebut en passar la mirga',
    follow_import: 'Importar los abonaments',
    import_followers_from_a_csv_file: 'Importar los seguidors d’un fichièr csv',
    follows_imported: 'Seguidors importats. Lo tractament pòt trigar una estona.',
    follow_import_error: 'Error en important los seguidors'
  },
  notifications: {
    notifications: 'Notficacions',
    read: 'Legit !',
    followed_you: 'vos sèc',
    favorited_you: 'a aimat vòstre estatut',
    repeated_you: 'a repetit your vòstre estatut'
  },
  login: {
    login: 'Connexion',
    username: 'Nom d’utilizaire',
    placeholder: 'e.g. lain',
    password: 'Senhal',
    register: 'Se marcar',
    logout: 'Desconnexion'
  },
  registration: {
    registration: 'Inscripcion',
    fullname: 'Nom complèt',
    email: 'Adreça de corrièl',
    bio: 'Biografia',
    password_confirm: 'Confirmar lo senhal'
  },
  post_status: {
    posting: 'Mandadís',
    default: 'Escrivètz aquí vòstre estatut.'
  },
  finder: {
    find_user: 'Cercar un utilizaire',
    error_fetching_user: 'Error pendent la recèrca d’un utilizaire'
  },
  general: {
    submit: 'Mandar',
    apply: 'Aplicar'
  },
  user_profile: {
    timeline_title: 'Flux utilizaire'
  }
}

const pt = {
  chat: {
    title: 'Chat'
  },
  nav: {
    chat: 'Chat Local',
    timeline: 'Linha do tempo',
    mentions: 'Menções',
    public_tl: 'Linha do tempo pública',
    twkn: 'Toda a rede conhecida'
  },
  user_card: {
    follows_you: 'Segue você!',
    following: 'Seguindo!',
    follow: 'Seguir',
    blocked: 'Bloqueado!',
    block: 'Bloquear',
    statuses: 'Postagens',
    mute: 'Silenciar',
    muted: 'Silenciado',
    followers: 'Seguidores',
    followees: 'Seguindo',
    per_day: 'por dia',
    remote_follow: 'Seguidor Remoto'
  },
  timeline: {
    show_new: 'Mostrar novas',
    error_fetching: 'Erro buscando atualizações',
    up_to_date: 'Atualizado',
    load_older: 'Carregar postagens antigas',
    conversation: 'Conversa'
  },
  settings: {
    user_settings: 'Configurações de Usuário',
    name_bio: 'Nome & Biografia',
    name: 'Nome',
    bio: 'Biografia',
    avatar: 'Avatar',
    current_avatar: 'Seu avatar atual',
    set_new_avatar: 'Alterar avatar',
    profile_banner: 'Capa de perfil',
    current_profile_banner: 'Sua capa de perfil atual',
    set_new_profile_banner: 'Alterar capa de perfil',
    profile_background: 'Plano de fundo de perfil',
    set_new_profile_background: 'Alterar o plano de fundo de perfil',
    settings: 'Configurações',
    theme: 'Tema',
    presets: 'Predefinições',
    theme_help: 'Use cores em código hexadecimal (#rrggbb) para personalizar seu esquema de cores.',
    background: 'Plano de Fundo',
    foreground: 'Primeiro Plano',
    text: 'Texto',
    links: 'Links',
    filtering: 'Filtragem',
    filtering_explanation: 'Todas as postagens contendo estas palavras serão silenciadas, uma por linha.',
    attachments: 'Anexos',
    hide_attachments_in_tl: 'Ocultar anexos na linha do tempo.',
    hide_attachments_in_convo: 'Ocultar anexos em conversas',
    nsfw_clickthrough: 'Habilitar clique para ocultar anexos NSFW',
    autoload: 'Habilitar carregamento automático quando a rolagem chegar ao fim.',
    streaming: 'Habilitar o fluxo automático de postagens quando ao topo da página',
    reply_link_preview: 'Habilitar a pré-visualização de link de respostas ao passar o mouse.',
    follow_import: 'Importar seguidas',
    import_followers_from_a_csv_file: 'Importe seguidores a partir de um arquivo CSV',
    follows_imported: 'Seguidores importados! O processamento pode demorar um pouco.',
    follow_import_error: 'Erro ao importar seguidores'
  },
  notifications: {
    notifications: 'Notificações',
    read: 'Ler!',
    followed_you: 'seguiu você'
  },
  login: {
    login: 'Entrar',
    username: 'Usuário',
    placeholder: 'p.e. lain',
    password: 'Senha',
    register: 'Registrar',
    logout: 'Sair'
  },
  registration: {
    registration: 'Registro',
    fullname: 'Nome para exibição',
    email: 'Correio eletrônico',
    bio: 'Biografia',
    password_confirm: 'Confirmação de senha'
  },
  post_status: {
    posting: 'Publicando',
    default: 'Acabo de aterrizar em L.A.'
  },
  finder: {
    find_user: 'Buscar usuário',
    error_fetching_user: 'Erro procurando usuário'
  },
  general: {
    submit: 'Enviar',
    apply: 'Aplicar'
  }
}

const messages = {
  de: de,
  fi: require('./fi.json'),
  en: require('./en.json'),
  eo: eo,
  et: require('./et.json'),
  hu: require('./hu.json'),
  ro: require('./ro.json'),
  ja: require('./ja.json'),
  fr: require('./fr.json'),
  it: require('./it.json'),
  oc: oc,
  pl: require('./pl.json'),
  es: require('./es.json'),
  pt: pt,
  ru: require('./ru.json'),
  nb: require('./nb.json'),
  he: require('./he.json')
}

export default messages
