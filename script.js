// ============================================== //
// SCRIPT.JS - ANALISI RISCHI MAGAZZINIERE        //
// Dott. Salvatore Trono                          //
// ============================================== //

// ============================================== //
// SEZIONE 1: STATO APPLICAZIONE E NAVIGAZIONE    //
// ============================================== //

const state = {
    currentPage: 'landing',
    currentCategory: null,
    currentRisk: null,
    history: []
};

// Funzione navigazione principale
function navigateTo(page, categoryId = null, riskId = null) {
    // Nascondi tutte le pagine
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    state.currentPage = page;
    state.currentCategory = categoryId;
    state.currentRisk = riskId;

    switch (page) {
        case 'landing':
            document.getElementById('page-landing').classList.add('active');
            updateBreadcrumb([{ label: 'Home', action: null }]);
            break;

        case 'categories':
            document.getElementById('page-categories').classList.add('active');
            updateBreadcrumb([
                { label: 'Home', action: () => navigateTo('landing') },
                { label: 'Categorie', action: null }
            ]);
            break;

        case 'risks':
            renderRisksList(categoryId);
            document.getElementById('page-risks').classList.add('active');
            updateBreadcrumb([
                { label: 'Home', action: () => navigateTo('landing') },
                { label: 'Categorie', action: () => navigateTo('categories') },
                { label: DATABASE[categoryId].name, action: null }
            ]);
            break;

        case 'detail':
            renderRiskDetail(categoryId, riskId);
            document.getElementById('page-detail').classList.add('active');
            const riskName = DATABASE[categoryId].risks[riskId].title;
            updateBreadcrumb([
                { label: 'Home', action: () => navigateTo('landing') },
                { label: 'Categorie', action: () => navigateTo('categories') },
                { label: DATABASE[categoryId].name, action: () => navigateTo('risks', categoryId) },
                { label: riskName, action: null }
            ]);
            break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Aggiornamento breadcrumb
function updateBreadcrumb(items) {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';

    items.forEach((item, index) => {
        if (index > 0) {
            const sep = document.createElement('span');
            sep.className = 'breadcrumb-separator';
            sep.textContent = '›';
            breadcrumb.appendChild(sep);
        }

        if (item.action) {
            const link = document.createElement('a');
            link.className = 'breadcrumb-link';
            link.href = '#';
            link.textContent = item.label;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                item.action();
            });
            breadcrumb.appendChild(link);
        } else {
            const current = document.createElement('span');
            current.className = 'breadcrumb-current';
            current.textContent = item.label;
            breadcrumb.appendChild(current);
        }
    });
}

// Rendering lista rischi per categoria
function renderRisksList(categoryId) {
    const category = DATABASE[categoryId];
    const container = document.getElementById('risks-container');
    const title = document.getElementById('risks-category-title');

    title.textContent = category.name;
    container.innerHTML = '';

    category.risks.forEach((risk, index) => {
        const card = document.createElement('div');
        card.className = 'card card-risk';
        card.addEventListener('click', () => navigateTo('detail', categoryId, index));

        const number = document.createElement('span');
        number.className = 'risk-number';
        number.textContent = (index + 1).toString().padStart(2, '0');

        const content = document.createElement('div');
        content.className = 'risk-card-content';

        const h3 = document.createElement('h3');
        h3.textContent = risk.title;

        const level = document.createElement('span');
        level.className = 'risk-level ' + risk.level;
        level.textContent = risk.level.charAt(0).toUpperCase() + risk.level.slice(1);

        const desc = document.createElement('p');
        desc.className = 'risk-card-desc';
        desc.textContent = risk.shortDesc;

        content.appendChild(h3);
        content.appendChild(level);
        content.appendChild(desc);

        card.appendChild(number);
        card.appendChild(content);
        container.appendChild(card);
    });
}

// Rendering dettaglio singolo rischio
function renderRiskDetail(categoryId, riskId) {
    const risk = DATABASE[categoryId].risks[riskId];
    const container = document.getElementById('detail-container');

    document.getElementById('detail-risk-title').textContent = risk.title;

    container.innerHTML = '';

    // Sezione Cause
    if (risk.cause) {
        const section = createDetailSection('Cause', risk.cause, 'cause');
        container.appendChild(section);
    }

    // Sezione Danni
    if (risk.danni) {
        const section = createDetailSection('Danni', risk.danni, 'danni');
        container.appendChild(section);
    }

    // Sezione Prevenzione
    if (risk.prevenzione) {
        const section = createDetailSection('Metodi di Prevenzione', risk.prevenzione, 'prevenzione');
        container.appendChild(section);
    }

    // Sezione Protezione
    if (risk.protezione) {
        const section = createDetailSection('Metodi di Protezione', risk.protezione, 'protezione');
        container.appendChild(section);
    }

    // Sezione Fonti
    if (risk.fonti) {
        const section = createDetailSection('Fonti Verificate', risk.fonti, 'fonti');
        container.appendChild(section);
    }

    // Pulsante torna indietro
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.textContent = '← Torna alla lista';
    backBtn.addEventListener('click', () => navigateTo('risks', categoryId));
    container.appendChild(backBtn);
}

// Creazione sezione dettaglio
function createDetailSection(title, content, className) {
    const section = document.createElement('div');
    section.className = 'detail-section ' + className;

    const h3 = document.createElement('h3');
    h3.textContent = title;
    section.appendChild(h3);

    const div = document.createElement('div');
    div.className = 'detail-content';
    div.innerHTML = content;
    section.appendChild(div);

    return section;
}

// ============================================== //
// SEZIONE 2: EVENT LISTENERS                     //
// ============================================== //

document.addEventListener('DOMContentLoaded', () => {
    // Pulsante "Inizia Analisi"
    document.getElementById('btn-start').addEventListener('click', () => {
        navigateTo('categories');
    });

    // Click sulle card categoria
    document.querySelectorAll('.card-category').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = parseInt(card.getAttribute('data-category'));
            navigateTo('risks', categoryId);
        });
    });

    // Pagina iniziale
    navigateTo('landing');
});

// ============================================== //
// SEZIONE 3: DATABASE RISCHI                     //
// ============================================== //

const DATABASE = [

    // ============================================== //
    // CATEGORIA 0: RISCHI BIOMECCANICI E             //
    //              MUSCOLOSCHELETRICI                 //
    // ============================================== //
    {
        name: "Rischi Biomeccanici e Muscoloscheletrici",
        risks: [
            // ------------------------------------------
            // 0.0 - Distorsioni articolari
            // ------------------------------------------
            {
                title: "Distorsioni articolari",
                level: "alto",
                shortDesc: "Lesioni legamentose da movimenti bruschi durante la movimentazione manuale dei carichi.",
                cause: `
                    <p>Le distorsioni articolari derivano principalmente da movimenti bruschi e scorretti durante la movimentazione manuale di carichi mal bilanciati o voluminosi, tipici delle operazioni di picking, stoccaggio e prelievo merci in magazzino. Fattori causali specifici includono:</p>
                    <ul>
                        <li>Sollevamento di carichi asimmetrici senza adeguata presa bilaterale.</li>
                        <li>Torsioni del tronco durante la retromarcia con transpallet o muletti in spazi ristretti.</li>
                        <li>Afferraggio di pallet instabili o merci scivolose, con accelerazioni improvvise.</li>
                        <li>Superfici irregolari o ostacoli che provocano passi falsi durante il trasporto manuale.</li>
                    </ul>
                `,
                danni: `
                    <p>Le distorsioni articolari provocano lesioni legamentose e capsulari con edema locale, dolore acuto, limitazione funzionale immediata e possibile instabilità cronica dell'articolazione interessata (tipicamente caviglia, ginocchio, polso). Conseguenze gravi includono:</p>
                    <ul>
                        <li><strong>Infortuni acuti:</strong> Rottura parziale/completa di legamenti (es. legamento collaterale mediale del ginocchio), con tempi di recupero 4-8 settimane.</li>
                        <li><strong>Patologie croniche:</strong> Instabilità recidivante, artrosi post-traumatica, riduzione della capacità lavorativa permanente (INAIL: invalidità media 5-15%).</li>
                        <li><strong>Complicanze sistemiche:</strong> In casi gravi, trombosi venosa profonda o sindrome compartimentale.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (eliminazione/ingegnerizzazione):</strong></p>
                    <ul>
                        <li><strong>Valutazione rischio MMC:</strong> Metodo NIOSH (National Institute for Occupational Safety and Health), con calcolo indice di sollevamento (LI): se LI &gt;1, rischio elevato → interventi urgenti. Metodo OCRA per arti superiori.</li>
                        <li><strong>Meccanizzazione:</strong> Sostituzione MMC con transpallet elettrici, tavoli regolabili, nastri trasportatori.</li>
                        <li><strong>Organizzazione lavoro:</strong> Team lifting (2 persone per carichi &gt;20kg), rotazione mansioni ogni 2h, micro-pause 5min/ora.</li>
                        <li><strong>Ambiente:</strong> Pavimentazione antiscivolo (SRA/SRB), illuminazione &gt;300 lux, rimozione ostacoli vie circolazione.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione (DPI + misure complementari):</strong></p>
                    <ul>
                        <li><strong>DPI certificati:</strong> Scarpe antinfortunistiche S3 con suola antiscivolo (UNI EN ISO 20345), cavigliere/ginocchiere elastiche di contenimento.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Protocollo INAIL (Art. 41 D.Lgs. 81/2008): visita preassuntiva + annuale, test stabilità articolare, ecografia/RMN per casi sospetti.</li>
                        <li><strong>Formazione:</strong> 16h modulo rischio DMS (Accordo Stato-Regioni 2011, agg. 2025), con training pratico su posture corrette e tecniche di sollevamento sicuro.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegati XXXIII-XXXIV); Linee guida INAIL "Disturbi Muscoloscheletrici" (2020); UNI EN ISO 11228-3; Policlinico Milano studio DMS lavoro (2023).</p>
                `
            },

            // ------------------------------------------
            // 0.1 - Lesioni muscolari
            // ------------------------------------------
            {
                title: "Lesioni muscolari",
                level: "alto",
                shortDesc: "Strappi e stiramenti muscolari da sforzo eccessivo durante sollevamento e trasporto carichi.",
                cause: `
                    <p>Le lesioni muscolari (strappi, stiramenti, contratture) derivano da sforzi eccessivi, movimenti improvvisi o posture scorrette durante le attività di movimentazione manuale dei carichi in magazzino. Fattori causali specifici:</p>
                    <ul>
                        <li>Sollevamento rapido di carichi pesanti (&gt;25kg) senza riscaldamento muscolare.</li>
                        <li>Movimenti bruschi di torsione/flessione del tronco durante picking e stoccaggio.</li>
                        <li>Trasporto manuale prolungato su distanze &gt;10m con carico asimmetrico.</li>
                        <li>Affaticamento cumulativo da turni prolungati (&gt;8h) senza pause adeguate.</li>
                        <li>Temperature fredde (&lt;15°C) che riducono l'elasticità muscolare.</li>
                    </ul>
                `,
                danni: `
                    <p>Le lesioni muscolari provocano danni di entità variabile dalla contrattura lieve allo strappo completo (lesione di III grado):</p>
                    <ul>
                        <li><strong>Contrattura:</strong> Irrigidimento muscolare doloroso, recupero 3-7 giorni.</li>
                        <li><strong>Stiramento:</strong> Elongazione fibre muscolari con microlesioni, dolore acuto, recupero 2-4 settimane.</li>
                        <li><strong>Strappo (I-III grado):</strong> Rottura parziale/completa delle fibre, ematoma, impotenza funzionale, recupero 4-12 settimane (III grado: chirurgia).</li>
                        <li><strong>Cronicizzazione:</strong> Fibrosi cicatriziale, recidive frequenti, riduzione capacità lavorativa.</li>
                        <li><strong>Sedi principali:</strong> Paravertebrali lombari, bicipite brachiale, quadricipite, adduttori.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Titolo VI - MMC):</strong></p>
                    <ul>
                        <li><strong>Valutazione NIOSH:</strong> Lifting Index &lt;1 (sicuro); 1-3 cautela; &gt;3 rischio alto → interventi immediati.</li>
                        <li><strong>Meccanizzazione:</strong> Transpallet elettrici, nastri trasportatori, manipolatori pneumatici per carichi &gt;15kg.</li>
                        <li><strong>Riscaldamento:</strong> Protocolli warm-up 5 minuti pre-turno (stretching dinamico dorso-lombari e arti).</li>
                        <li><strong>Organizzazione:</strong> Limiti MMC (max 25kg uomo / 15kg donna), rotazione mansioni ogni 2h, pause 10min/ora.</li>
                        <li><strong>Ambiente:</strong> Temperatura &gt;16°C in zone MMC, illuminazione adeguata.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione (DPI + sorveglianza):</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Cinture lombari di supporto (UNI EN 613), guanti antiscivolo per presa sicura, scarpe S3.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 41):</strong> Visita preassuntiva + annuale, valutazione forza muscolare (MRC scale), ecografia muscolare per recidivanti.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 16h):</strong> Tecniche corrette sollevamento ("piega ginocchia, non schiena"), esercizi compensativi, riconoscimento sintomi precoci.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo VI, Allegato XXXIII); Linee guida INAIL "Sovraccarico Biomeccanico" (2020); ISO 11228-1.</p>
                `
            },

            // ------------------------------------------
            // 0.2 - Ernie discali
            // ------------------------------------------
            {
                title: "Ernie discali",
                level: "alto",
                shortDesc: "Protrusione/erniazione disco intervertebrale da sovraccarico meccanico ripetuto della colonna.",
                cause: `
                    <p>Le ernie discali rappresentano la patologia professionale più grave per i magazzinieri, causate dal sovraccarico meccanico ripetuto sulla colonna vertebrale durante la movimentazione manuale dei carichi. Fattori causali specifici:</p>
                    <ul>
                        <li>Sollevamento carichi pesanti (&gt;25kg) con flessione/rotazione del tronco simultanee.</li>
                        <li>Compressione assiale ripetuta sui dischi intervertebrali (L4-L5, L5-S1 nel 90% dei casi).</li>
                        <li>Vibrazioni whole-body da carrelli elevatori (frequenze 1-20 Hz dannose per i dischi).</li>
                        <li>Posture statiche prolungate (guida muletto &gt;4h/giorno) con sedili inadeguati.</li>
                        <li>Degenerazione discale accelerata da microtraumi cumulativi (5-15 anni esposizione).</li>
                    </ul>
                `,
                danni: `
                    <p>L'ernia discale provoca compressione radicolare con sintomatologia neurologica progressiva:</p>
                    <ul>
                        <li><strong>Lombalgia acuta:</strong> Dolore intenso regione lombare, contrattura antalgica, limitazione funzionale.</li>
                        <li><strong>Sciatalgia:</strong> Irradiazione gluteo-coscia-gamba-piede (postero-laterale), parestesie (formicolio), ipoestesia, deficit forza (es. dorsiflessione piede L5 &lt;4/5 MRC), iporeflessia achilleo (S1).</li>
                        <li><strong>Complicanze gravi:</strong> Cauda equina (semeiologia sfinteriale alterata, urgenza chirurgica), debolezza muscolare cronica, atrofia.</li>
                        <li><strong>Invalidità:</strong> INAIL 15-40%, recidive 20-30%.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Allegato XXXIII - MMC):</strong></p>
                    <ul>
                        <li><strong>Valutazione rischio:</strong> Metodo MAPO (Movimentazione e Assistenza Pazienti Occupazionale, adattabile MMC) o NIOSH modificato; soglia LI &lt;0,8 per lavori ripetitivi.</li>
                        <li><strong>Ingegnerizzazione:</strong> Tavoli regolabili idraulicamente (60-110cm), muletti con cinture lombari integrate e sospensioni (riduzione vibrazioni &gt;60%), pavimenti antivibrazione.</li>
                        <li><strong>Organizzazione:</strong> MMC max 1,5h/turno, micro-pause 10min/ora, team 2 persone per carichi &gt;20kg, rotazione postazioni dinamiche.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Cinture lombari semiflessibili (UNI EN 613 cl. 2), scarpe antiscivolo SRA con supporto arco plantare (UNI EN ISO 20345), ginocchiere protettive.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 41):</strong> Visita medica preassuntiva + biennale &gt;45 anni, test Lasègue positivo &lt;60° diagnostico, EMG/TC lombare per positivi, protocollo INAIL DMS.</li>
                        <li><strong>Formazione accreditata (Accordo Stato-Regioni 2011 agg. 2025, 12h rischio lombare):</strong> Esercizi propriocettivi (McKenzie metodo), tecnica "golfer's lift" (unilaterale con gamba d'appoggio), simulazioni VR.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegati XXXIII-XXXIV); Linee guida INAIL "Disturbi Muscoloscheletrici" (2020); ISO 11228-1; INAIL statistiche ernie professionali.</p>
                `
            },

            // ------------------------------------------
            // 0.3 - Sindrome del tunnel carpale
            // ------------------------------------------
            {
                title: "Sindrome del tunnel carpale",
                level: "medio",
                shortDesc: "Compressione nervo mediano al polso da movimenti ripetitivi di presa e manipolazione.",
                cause: `
                    <p>La sindrome del tunnel carpale (STC) è causata dalla compressione del nervo mediano nel canale carpale, dovuta a movimenti ripetitivi e forzati della mano e del polso durante le operazioni di magazzino. Fattori causali specifici:</p>
                    <ul>
                        <li>Movimenti ripetitivi di presa/rilascio (&gt;1000 cicli/giorno) durante il picking.</li>
                        <li>Flessione/estensione forzata del polso durante la manipolazione di colli e pacchi.</li>
                        <li>Utilizzo prolungato di scanner barcode con impugnatura statica.</li>
                        <li>Vibrazioni mano-braccio da utensili e transpallet.</li>
                        <li>Temperature fredde (&lt;15°C) che riducono la vascolarizzazione del nervo.</li>
                    </ul>
                `,
                danni: `
                    <p>La STC provoca neuropatia progressiva del nervo mediano con:</p>
                    <ul>
                        <li><strong>Fase iniziale:</strong> Parestesie notturne (formicolio I-III dito), dolore al polso, "mano addormentata".</li>
                        <li><strong>Fase intermedia:</strong> Dolore diurno, perdita sensibilità polpastrelli, difficoltà movimenti fini (bottoni, presa piccoli oggetti).</li>
                        <li><strong>Fase avanzata:</strong> Atrofia eminenza tenar, deficit permanente forza presa (pinch grip &lt;3kg), necessità chirurgica (decompressione).</li>
                        <li><strong>Malattia professionale INAIL:</strong> STC riconosciuta (Art. 211 D.Lgs. 81/2008), invalidità 5-15%.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (Allegato XXXIV D.Lgs. 81/2008 - Movimenti ripetitivi):</strong></p>
                    <ul>
                        <li><strong>Valutazione OCRA:</strong> Indice OCRA &lt;3,5 (basso rischio); 3,5-7,5 medio; &gt;7,5 alto.</li>
                        <li><strong>Riprogettazione:</strong> Scanner vocali (riduce picking manuale 30%), impugnature ergonomiche, rotazione mansioni ogni 30 minuti.</li>
                        <li><strong>Micro-pause:</strong> 5-10% del ciclo lavoro (es. 2min/20min), stretching attivo polso e dita.</li>
                        <li><strong>Limiti:</strong> Cicli &lt;1200/ora, recupero attivo tra serie.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Guanti antivibrazione (UNI EN ISO 10819), polsini elastici di supporto, tutori notturni.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 41):</strong> Visite annuali, EMG nervo mediano (velocità conduzione &lt;50m/s patologica), test Phalen/Tinel.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 12-16h DMS):</strong> Riconoscimento sintomi precoci, tecniche corrette di presa, stretching preventivo.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegato XXXIV); Linee guida INAIL "OCRA Checklist" (2020); UNI EN ISO 11228-3.</p>
                `
            },

            // ------------------------------------------
            // 0.4 - Tendiniti e epicondiliti
            // ------------------------------------------
            {
                title: "Tendiniti e epicondiliti",
                level: "medio",
                shortDesc: "Infiammazione tendini e inserzioni muscolari da sovraccarico ripetitivo degli arti superiori.",
                cause: `
                    <p>Le tendiniti e le epicondiliti (gomito del tennista/golfista) sono causate dal sovraccarico ripetitivo dei tendini degli arti superiori durante le operazioni di magazzino. Fattori causali specifici:</p>
                    <ul>
                        <li>Movimenti ripetitivi di prono-supinazione avambraccio durante picking e confezionamento.</li>
                        <li>Presa forzata prolungata su colli, pacchi e attrezzi (forza &gt;4kg).</li>
                        <li>Estensione forzata del polso durante sollevamento e posizionamento merci su scaffali alti.</li>
                        <li>Vibrazioni mano-braccio trasmesse da transpallet manuali e carrelli.</li>
                        <li>Durata esposizione &gt;4h/giorno senza pause adeguate.</li>
                    </ul>
                `,
                danni: `
                    <p>Le tendinopatie provocano dolore e limitazione funzionale progressiva:</p>
                    <ul>
                        <li><strong>Epicondilite laterale:</strong> Dolore faccia esterna gomito, irradiazione avambraccio, dolore alla presa (test Cozen positivo).</li>
                        <li><strong>Epitrocleite (mediale):</strong> Dolore faccia interna gomito, aggravato da flessione polso e pronazione.</li>
                        <li><strong>Tendinite polso/spalla:</strong> Periartrite scapolo-omerale, tenosinovite De Quervain.</li>
                        <li><strong>Cronicizzazione:</strong> Calcificazioni tendinee, tendinosi degenerativa, necessità infiltrazioni/chirurgia (15% dei casi).</li>
                        <li><strong>Invalidità INAIL:</strong> 3-10%, giorni malattia 15-60.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (Allegato XXXIV D.Lgs. 81/2008):</strong></p>
                    <ul>
                        <li><strong>Valutazione OCRA/REBA:</strong> Mappatura movimenti ripetitivi per singola postazione.</li>
                        <li><strong>Riprogettazione:</strong> Ausili meccanici per presa e sollevamento, altezza scaffali ottimale (75-150cm), impugnature ergonomiche.</li>
                        <li><strong>Organizzazione:</strong> Rotazione mansioni ogni 30min, pause attive 5min/ora, limitazione cicli &lt;1500/giorno.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Gomitiere elastiche con rinforzo epicondilare, guanti con grip ergonomico, polsini di supporto.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 41):</strong> Visite annuali, ecografia tendinea, test clinici specifici (Cozen, Mills, Finkelstein).</li>
                        <li><strong>Formazione:</strong> Esercizi eccentrici preventivi, riconoscimento early symptoms, stretching pre/post turno.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegato XXXIV); Linee guida INAIL "Sovraccarico Biomeccanico Arti Superiori" (2020); UNI EN ISO 11228-3.</p>
                `
            },

            // ------------------------------------------
            // 0.5 - Patologie arti inferiori
            // ------------------------------------------
            {
                title: "Patologie arti inferiori",
                level: "medio",
                shortDesc: "Gonartrosi, fascite plantare e problemi circolatori da stazione eretta prolungata e MMC.",
                cause: `
                    <p>Le patologie degli arti inferiori sono causate dalla stazione eretta prolungata, dalla deambulazione continua e dal sovraccarico meccanico sulle articolazioni durante le operazioni di magazzino. Fattori causali specifici:</p>
                    <ul>
                        <li>Stazione eretta &gt;6h/giorno su pavimenti rigidi (cemento, piastrelle).</li>
                        <li>Deambulazione continua con carichi (&gt;10km/turno stimati in grandi magazzini).</li>
                        <li>Sovraccarico ginocchia durante accovacciamento per picking da livelli bassi.</li>
                        <li>Calzature inadeguate o consumate (supporto arco plantare insufficiente).</li>
                        <li>Sovrappeso/obesità come fattore aggravante (BMI &gt;30).</li>
                    </ul>
                `,
                danni: `
                    <p>Le patologie degli arti inferiori comprendono:</p>
                    <ul>
                        <li><strong>Gonartrosi:</strong> Degenerazione cartilagine articolare ginocchio, dolore al carico, limitazione flessione, crepitii.</li>
                        <li><strong>Fascite plantare:</strong> Infiammazione fascia plantare, dolore tallone primo mattino, cronicizzazione con sperone calcaneare.</li>
                        <li><strong>Insufficienza venosa:</strong> Varici, edema arti inferiori, sensazione pesantezza (stazione eretta prolungata).</li>
                        <li><strong>Metatarsalgia:</strong> Dolore avampiede da carico meccanico ripetuto.</li>
                        <li><strong>Invalidità INAIL:</strong> Gonartrosi riconosciuta come malattia professionale, invalidità 10-25%.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione:</strong></p>
                    <ul>
                        <li><strong>Analisi MMC avanzata:</strong> Metodo OCRA per arti superiori + NIOSH per colonna; soglia azione OCRA &lt;2,8 (Allegato XXXIV D.Lgs. 81/2008).</li>
                        <li><strong>Redesign workplace:</strong> Tappetini antifaticamento (spessore 15-20mm, coefficiente smorzamento &gt;30%), sgabelli regolabili (altezza 60-80cm), muletti con sospensioni pneumatiche (riduzione vibrazioni 50%).</li>
                        <li><strong>Organizzazione lavoro:</strong> Pausa micro (5min/ora), rotazione mansioni (max 2h MMC consecutiva), automazione picking (AGV - Automated Guided Vehicles).</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione (DPI + misure complementari):</strong></p>
                    <ul>
                        <li><strong>DPI certificati:</strong> Imbracature lombari (UNI EN 613), ginocchiere gel (UNI EN 14404 cl. 2), scarpe antistatiche SRA con plantari ortopedici.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Protocollo INAIL (Art. 41 D.Lgs. 81/2008): visita in fase preassuntiva + semestrale per &gt;35 anni, test algometrici (dolore soglia &gt;4kg/cm²), RMN/ecografia per casi sospetti.</li>
                        <li><strong>Formazione:</strong> 16h modulo rischio DMS (Accordo Stato-Regioni 2011, agg. 2025), con training pratico su posture corrette (es. "arco di forza" per sollevamenti).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegati XXXIII-XXXIV); Linee guida INAIL "Disturbi Muscoloscheletrici" (2020); UNI EN ISO 11228-3; Policlinico Milano studio DMS lavoro (2023).</p>
                `
            },

            // ------------------------------------------
            // 0.6 - Riepilogo biomeccanico e checklist DVR
            // ------------------------------------------
            {
                title: "Riepilogo biomeccanico e checklist DVR",
                level: "alto",
                shortDesc: "Sintesi fattori di rischio, metodi di valutazione, patologie associate e azioni raccomandate.",
                cause: `
                    <p><strong>Fattori di rischio principali (sintesi):</strong></p>
                    <ul>
                        <li><strong>Peso:</strong> Carichi &gt;25kg (uomo) / &gt;15kg (donna); singoli colli 5-35kg.</li>
                        <li><strong>Frequenza:</strong> &gt;10 sollevamenti/ora, turni 8-12h.</li>
                        <li><strong>Postura:</strong> Flessione tronco &gt;45°, torsione &gt;30°, accovacciamento.</li>
                        <li><strong>Distanza:</strong> Trasporto &gt;10m, altezza stoccaggio 0-200cm.</li>
                        <li><strong>Vibrazioni:</strong> Muletti/transpallet → whole-body &gt;0,5 m/s² (soglia D.Lgs. 81/2008).</li>
                        <li><strong>Ambiente:</strong> Pavimenti irregolari, spazi ristretti, temperature estreme.</li>
                        <li><strong>Ripetitività:</strong> &gt;2000 cicli/giorno arti superiori, mancanza pause.</li>
                        <li><strong>Metodi valutazione:</strong> ISO 11228-1/2/3 (NIOSH, MAPO), OCRA/REBA per ripetitivi.</li>
                    </ul>
                `,
                danni: `
                    <p><strong>Patologie associate (serie completa):</strong></p>
                    <ul>
                        <li><strong>Rachide:</strong> Lombalgie, ernie discali.</li>
                        <li><strong>Arti inferiori:</strong> Gonartrosi, fascite plantare.</li>
                        <li><strong>Arti superiori:</strong> Sindrome tunnel carpale, epicondilite.</li>
                        <li><strong>Muscolari:</strong> Mialgie diffuse, strappi, stiramenti.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Azioni Raccomandate (Checklist DVR):</strong></p>
                    <ul>
                        <li><strong>Valutazione:</strong> Mappatura MMC (peso, frequenza, distanza); soglia critica: spinta &gt;200N.</li>
                        <li><strong>Misure tecniche:</strong> Transpallet elettrici, pedane regolabili, ausili meccanici.</li>
                        <li><strong>Organizzative:</strong> Rotazione mansioni, pause 10% tempo, limiti 4h MMC/giorno.</li>
                        <li><strong>DPI:</strong> Scarpe S3, guanti antivibrazione (UNI EN ISO 10819), ginocchiere.</li>
                        <li><strong>Sorveglianza (Art. 41):</strong> Visite annuali, medico competente per EMG/ecografie.</li>
                        <li><strong>Formazione:</strong> 12-16h (moduli MMC/ripetitivi), simulazioni pratiche.</li>
                        <li><strong>Sanzioni:</strong> Arresto 3-6 mesi o ammenda 2.500-6.400€ per mancata valutazione (Art. 55).</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Nota normativa:</strong></p>
                    <p>La valutazione di questi rischi deve essere effettuata secondo il D.Lgs. 81/2008 (Art. 17, 28) e documentata nel Documento di Valutazione dei Rischi (DVR). Per la Movimentazione Manuale dei Carichi (MMC), si utilizza il metodo NIOSH (National Institute for Occupational Safety and Health), con indice di sollevamento: se &gt;1, indica rischio elevato che richiede interventi correttivi urgenti. Per l'utilizzo di carrelli elevatori è obbligatoria la formazione specifica e il patentino.</p>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo VI, Allegati XXXIII/XXXIV); Linee guida INAIL "Sovraccarico Biomeccanico" (2020); ISO 11228; Gazzetta Ufficiale n.101 30/4/2008.</p>
                `
            }
        ]
    },
    // ============================================== //
    // CATEGORIA 1: RISCHI TRAUMATICI E DA INCIDENTI  //
    // ============================================== //
    {
        name: "Rischi Traumatici e da Incidenti",
        risks: [
            // ------------------------------------------
            // 1.0 - Caduta di materiali/oggetti
            // ------------------------------------------
            {
                title: "Caduta di materiali/oggetti",
                level: "alto",
                shortDesc: "Schiacciamento da merci impilate in altezza in maniera scorretta, instabile o senza contenimento.",
                cause: `
                    <p>Caduta di merci impilate o stoccate in altezza in maniera scorretta, instabile o senza contenimento adeguato, con possibilità di schiacciamento dei lavoratori sottostanti. Fattori causali specifici:</p>
                    <ul>
                        <li>Scaffalature sovraccariche oltre la portata nominale o non ancorate a parete/soffitto.</li>
                        <li>Impilamento instabile di pallet (altezza &gt;4m senza reggettatura/filmatura).</li>
                        <li>Urti accidentali di carrelli elevatori contro scaffali o pile di merci.</li>
                        <li>Imballaggi deteriorati o danneggiati che cedono sotto il peso.</li>
                        <li>Mancanza di fermi/paracolpi sugli scaffali, assenza reti di contenimento.</li>
                        <li>Manovre scorrette di deposito con muletto (forche inclinate, velocità eccessiva).</li>
                    </ul>
                `,
                danni: `
                    <p>La caduta di materiali dall'alto provoca traumi da schiacciamento potenzialmente letali:</p>
                    <ul>
                        <li><strong>Traumi cranici:</strong> Contusioni cerebrali, fratture craniche, emorragie intracraniche (mortalità 10-30% per oggetti &gt;20kg da altezza &gt;3m).</li>
                        <li><strong>Traumi scheletrici:</strong> Fratture vertebrali, costali, arti superiori/inferiori, bacino.</li>
                        <li><strong>Lesioni organi interni:</strong> Rottura milza/fegato, pneumotorace da compressione toracica.</li>
                        <li><strong>Schiacciamento arti:</strong> Sindrome da schiacciamento (rabdomiolisi → insufficienza renale acuta).</li>
                        <li><strong>Decesso:</strong> Causa principale di morte in magazzino insieme ai ribaltamenti muletti (INAIL).</li>
                        <li><strong>Invalidità INAIL:</strong> 20-100% a seconda della gravità.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Art. 15, 111; Allegato VI):</strong></p>
                    <ul>
                        <li><strong>Scaffalature certificate:</strong> Portata nominale indicata su ogni campata, ispezioni trimestrali (UNI EN 15635), ancoraggio a pavimento/parete.</li>
                        <li><strong>Contenimento merci:</strong> Reggettatura/filmatura pallet, reti metalliche anti-caduta su scaffali, fermi laterali e posteriori.</li>
                        <li><strong>Procedure stoccaggio:</strong> Altezza massima impilamento definita per ogni tipologia merce, carichi pesanti in basso, leggeri in alto.</li>
                        <li><strong>Separazione zone:</strong> Divieto transito sotto carichi sospesi, segnaletica "Pericolo caduta oggetti", barriere fisiche.</li>
                        <li><strong>Manutenzione:</strong> Controllo periodico integrità scaffali, sostituzione elementi danneggiati, registro ispezioni.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI obbligatori:</strong> Casco protettivo (UNI EN 397), scarpe S3 con puntale acciaio (UNI EN ISO 20345, protezione 200J), gilet alta visibilità.</li>
                        <li><strong>Attrezzature:</strong> Muletti con cabina FOPS (Falling Object Protective Structure), paracolpi su scaffalature.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Visita post-infortunio, protocollo trauma cranico.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 8h):</strong> Procedure stoccaggio sicuro, segnalazione scaffali danneggiati, comportamento sotto carichi sospesi.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15, 111, Allegato VI); UNI EN 15635 (Scaffalature); UNI EN 397 (Caschi); INAIL "Sicurezza Magazzini" (2023).</p>
                `
            },

            // ------------------------------------------
            // 1.1 - Schiacciamento
            // ------------------------------------------
            {
                title: "Schiacciamento",
                level: "alto",
                shortDesc: "Compressione di parti del corpo tra oggetti pesanti, carrelli elevatori o strutture di magazzino.",
                cause: `
                    <p>Lo schiacciamento avviene quando parti del corpo vengono compresse tra oggetti pesanti, mezzi di movimentazione o strutture fisse del magazzino. Fattori causali specifici:</p>
                    <ul>
                        <li>Mani/piedi intrappolati tra pallet durante operazioni di stoccaggio manuale.</li>
                        <li>Compressione tra carrello elevatore e scaffalature/pareti durante manovre in spazi ristretti.</li>
                        <li>Cedimento improvviso di pile di merci instabili durante la manipolazione.</li>
                        <li>Ribaltamento di carichi mal bilanciati sulle forche del muletto.</li>
                        <li>Mancanza di distanze di sicurezza tra operatori e mezzi in movimento.</li>
                        <li>Assenza di sensori di prossimità sui carrelli elevatori.</li>
                    </ul>
                `,
                danni: `
                    <p>Lo schiacciamento provoca lesioni compressive gravi:</p>
                    <ul>
                        <li><strong>Fratture:</strong> Ossa metacarpali/metatarsali, falangi, costole, bacino.</li>
                        <li><strong>Lesioni vascolari:</strong> Ematomi compressivi, sindrome compartimentale (urgenza chirurgica).</li>
                        <li><strong>Amputazioni:</strong> Dita mani/piedi nei casi più gravi (presse, carrelli).</li>
                        <li><strong>Sindrome da schiacciamento:</strong> Rabdomiolisi → insufficienza renale acuta (schiacciamento prolungato &gt;1h).</li>
                        <li><strong>Decesso:</strong> Per schiacciamento toracico/addominale con arresto cardiopolmonare.</li>
                        <li><strong>Invalidità INAIL:</strong> 15-100%, amputazioni 30-60%.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Art. 15, 71; Allegato V-VI):</strong></p>
                    <ul>
                        <li><strong>Distanze di sicurezza:</strong> Min. 1,5m tra operatori e mezzi in movimento, corsie dedicate pedoni/veicoli.</li>
                        <li><strong>Dispositivi di sicurezza:</strong> Sensori di prossimità/radar su carrelli, segnalatori acustici retromarcia, luci lampeggianti.</li>
                        <li><strong>Procedure operative:</strong> Divieto di posizionamento mani/piedi sotto carichi sospesi, uso di guide/dime per posizionamento pallet.</li>
                        <li><strong>Stabilità carichi:</strong> Filmatura/reggettatura obbligatoria, verifiche pre-sollevamento bilanciamento.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Scarpe S3 con puntale acciaio (200J, UNI EN ISO 20345), guanti antiurto (UNI EN 388), gilet alta visibilità (UNI EN ISO 20471 cl. 2).</li>
                        <li><strong>Attrezzature:</strong> Muletti con FOPS + ROPS (Roll-Over Protective Structure), paracolpi su pilastri e scaffali.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Protocollo post-infortunio, riabilitazione.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 8h):</strong> Zone di pericolo schiacciamento, procedure sicure avvicinamento mezzi, primo soccorso traumi compressivi.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15, 71, Allegati V-VI); UNI EN ISO 20345; INAIL "Infortuni da schiacciamento" (2023).</p>
                `
            },

            // ------------------------------------------
            // 1.2 - Scivolamento e cadute
            // ------------------------------------------
            {
                title: "Scivolamento e cadute",
                level: "medio",
                shortDesc: "Cadute per scivolamento su superfici bagnate, oleose o ingombre da materiali sparsi.",
                cause: `
                    <p>Gli scivolamenti e le cadute al piano derivano dalla presenza di superfici scivolose, ostacoli e disordine nelle vie di circolazione del magazzino. Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Pavimenti bagnati/oleosi:</strong> Sversamenti di liquidi (acqua, olio, detergenti), condensa, infiltrazioni.</li>
                        <li><strong>Ostacoli:</strong> Imballaggi, reggette, film plastico a terra, merci fuori posto.</li>
                        <li><strong>Disordine:</strong> Vie di circolazione ingombre, materiali accatastati nelle corsie.</li>
                        <li><strong>Illuminazione insufficiente:</strong> Zone buie o mal illuminate (&lt;200 lux).</li>
                        <li><strong>Calzature inadeguate:</strong> Suole lisce, consumate, non antiscivolo.</li>
                        <li><strong>Fretta:</strong> Ritmi di lavoro accelerati che portano a disattenzione.</li>
                    </ul>
                `,
                danni: `
                    <p>Le cadute per scivolamento provocano traumi da impatto:</p>
                    <ul>
                        <li><strong>Fratture:</strong> Polso (Colles), anca (collo femore), caviglia, coccige.</li>
                        <li><strong>Traumi cranici:</strong> Commozione cerebrale, ematoma subdurale (caduta all'indietro).</li>
                        <li><strong>Distorsioni:</strong> Caviglia, ginocchio (legamento crociato anteriore).</li>
                        <li><strong>Contusioni:</strong> Ematomi estesi, contusioni costali.</li>
                        <li><strong>Invalidità INAIL:</strong> Frattura femore 20-35%, trauma cranico variabile.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Art. 15, 63, 64; Allegato IV):</strong></p>
                    <ul>
                        <li><strong>Pulizia immediata:</strong> Sversamenti rimossi immediatamente, kit assorbenti disponibili, procedure codificate.</li>
                        <li><strong>Ordine/organizzazione:</strong> Regola "Un posto per ogni cosa", rimozione immediata ostacoli, vie circolazione libere.</li>
                        <li><strong>Manutenzione pavimentazione:</strong> Ispezioni settimanali, riparazione buche/crepe, sostituzione sezioni danneggiate.</li>
                        <li><strong>Segnaletica:</strong> Cartelli "Pericolo scivolamento", zone ad alto rischio evidenziate.</li>
                        <li><strong>Illuminazione:</strong> Minimo 300 lux nelle corsie, 500 lux nelle zone picking.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Scarpe S3 con suola antiscivolo (SRA/SRB, UNI EN ISO 20345), casco (protezione caduta laterale).</li>
                        <li><strong>Attrezzature:</strong> Tappetini antiscivolo in zone critiche, corrimani su scale.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 4-6h):</strong> Riconoscimento rischi scivolamento, comportamenti sicuri, segnalazione sversamenti.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15, 36, Allegato VI); UNI EN ISO 20345 (Scarpe S3).</p>
                `
            },

            // ------------------------------------------
            // 1.3 - Collisioni con oggetti in movimento
            // ------------------------------------------
            {
                title: "Collisioni con oggetti in movimento",
                level: "alto",
                shortDesc: "Urti con transpallet, carriole, carrelli manuali e altri mezzi di movimentazione durante operazioni.",
                cause: `
                    <p>Urti con transpallet, carriole, carrelli manuali e altri mezzi di movimentazione durante operazioni. Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Mancanza segnaletica/percorsi:</strong> Assenza cartelli "Attenzione mezzi in movimento", vie circolazione non separate pedonali/veicoli.</li>
                        <li><strong>Visibilità ridotta:</strong> Angoli ciechi, carico ostruisce vista operatore, illuminazione insufficiente.</li>
                        <li><strong>Velocità eccessiva:</strong> Operatori non rispettano limiti velocità, manovre brusche.</li>
                        <li><strong>Comportamenti scorretti:</strong> Lavoratori attraversano vie circolazione senza guardare, operatori distratti.</li>
                        <li><strong>Attrezzature danneggiate:</strong> Transpallet/carriole con freni inefficaci, ruote consumate.</li>
                    </ul>
                `,
                danni: `
                    <p>Le collisioni con mezzi in movimento provocano traumi da impatto di entità variabile:</p>
                    <ul>
                        <li><strong>Contusioni e ematomi:</strong> Traumi agli arti inferiori (gambe, piedi) e superiori.</li>
                        <li><strong>Fratture:</strong> Tibia, perone, metatarsi (investimento piede), costole.</li>
                        <li><strong>Traumi interni:</strong> Lesioni organi addominali per urto diretto con carrelli.</li>
                        <li><strong>Lesioni da trascinamento:</strong> Abrasioni estese, lacerazioni cutanee.</li>
                        <li><strong>Invalidità INAIL:</strong> 10-40% a seconda della dinamica e della gravità.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Art. 15, 63, 64; Allegato IV):</strong></p>
                    <ul>
                        <li><strong>Separazione percorsi:</strong> Corsie dedicate pedonali e veicolari, segnaletica orizzontale (strisce gialle), barriere fisiche.</li>
                        <li><strong>Specchi/sensori:</strong> Specchi convessi agli angoli ciechi, sensori prossimità su mezzi.</li>
                        <li><strong>Limiti velocità:</strong> Max 10 km/h in corsie, 5 km/h in zone promiscue, segnaletica.</li>
                        <li><strong>Illuminazione:</strong> &gt;300 lux zone circolazione, luci lampeggianti su mezzi.</li>
                        <li><strong>Manutenzione:</strong> Controllo periodico freni, sterzo, ruote di tutti i mezzi.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Gilet alta visibilità (UNI EN ISO 20471 cl. 2-3), scarpe S3, casco in zone promiscue.</li>
                        <li><strong>Attrezzature:</strong> Transpallet con clacson, luci, segnalatori acustici.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 4-8h):</strong> Regole circolazione magazzino, precedenze, comportamenti sicuri in zone promiscue.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15, 63, 64, Allegato IV); INAIL "Sicurezza circolazione mezzi magazzino" (2023).</p>
                `
            },

            // ------------------------------------------
            // 1.4 - Collisioni e ribaltamenti carrelli elevatori
            // ------------------------------------------
            {
                title: "Collisioni e ribaltamenti di carrelli elevatori",
                level: "alto",
                shortDesc: "Incidenti con muletti motorizzati: causa principale di infortuni mortali in magazzino.",
                cause: `
                    <p>Incidenti durante operazioni di carico/scarico con muletti (carrelli elevatori a forche motorizzati), con rischio per operatore e altri lavoratori. Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Mancanza patentino:</strong> Operatori non abilitati, mancanza formazione specifica (Art. 73 D.Lgs. 81/2008).</li>
                        <li><strong>Manovre scorrette:</strong> Velocità eccessiva, retromarcia senza visibilità, stoccaggio in altezza con carico instabile.</li>
                        <li><strong>Percezione rischio:</strong> Operatori sottovalutano pericoli, mancanza consapevolezza dinamiche incidenti.</li>
                        <li><strong>Pavimentazione/ostacoli:</strong> Buche, oggetti sparsi, carico non bilanciato causano ribaltamento.</li>
                        <li><strong>Attrezzature danneggiate:</strong> Muletti con freni/sterzo difettosi, pneumatici consumati.</li>
                    </ul>
                `,
                danni: `
                    <p>Traumi gravi/mortali da schiacciamento e ribaltamento:</p>
                    <ul>
                        <li><strong>Lesioni:</strong> Fratture vertebrali/costali, traumi cranici, schiacciamento arti, decesso (ribaltamento &gt;1,5m mortalità 30-50%).</li>
                        <li><strong>Dinamica mortale:</strong> Operatore scende per riparare danno carico → carico cade → schiacciamento/soffocamento (3 casi INAIL 2019).</li>
                        <li><strong>Complicanze:</strong> Invalidità permanente 50-100%, decesso.</li>
                        <li><strong>Statistiche:</strong> Muletti causa principale infortuni mortali magazzini (dopo caduta materiali).</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Art. 15, 36, 73; Allegato VI; Accordo 2011 agg. 2025):</strong></p>
                    <ul>
                        <li><strong>Patentino obbligatorio:</strong> Formazione 12h (teoria 4h + pratica 8h), esame, rinnovo ogni 5 anni.</li>
                        <li><strong>Procedure operative:</strong> Limiti velocità (10 km/h), cintura sicurezza obbligatoria, retromarcia solo con visibilità o assistente a terra.</li>
                        <li><strong>Manutenzione:</strong> Controllo giornaliero pre-uso (checklist), manutenzione programmata trimestrale, registro interventi.</li>
                        <li><strong>Infrastruttura:</strong> Pavimentazione piana e integra, percorsi segnalati, specchi angoli ciechi, illuminazione adeguata.</li>
                        <li><strong>Stabilità carico:</strong> Verifica bilanciamento pre-sollevamento, altezza forche adeguata, inclinazione montante corretta.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Casco (UNI EN 397), scarpe S3 (UNI EN ISO 20345), gilet alta visibilità, guanti.</li>
                        <li><strong>Dispositivi carrello:</strong> ROPS (Roll-Over Protective Structure), FOPS (Falling Object Protective Structure), cintura di sicurezza, segnalatore acustico/luminoso.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Visita biennale, test vista/udito, idoneità psicofisica.</li>
                        <li><strong>Formazione (12h + aggiornamento 4h/5 anni):</strong> Dinamiche ribaltamento, manovre sicure, gestione emergenza, primo soccorso.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15, 36, 73, Allegato VI); Accordo Stato-Regioni 22/02/2012 (carrelli elevatori); INAIL "Infortuni mortali carrelli elevatori" (2019-2023).</p>
                `
            },

            // ------------------------------------------
            // 1.5 - Tagli e ferite
            // ------------------------------------------
            {
                title: "Tagli e ferite",
                level: "medio",
                shortDesc: "Lesioni da contatto con oggetti taglienti, cutter, reggette metalliche e imballaggi danneggiati.",
                cause: `
                    <p>Lesioni causate dal contatto con oggetti taglienti o da operazioni specifiche di movimentazione. Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Reggette metalliche/plastiche:</strong> Taglio durante rimozione reggette da pallet (effetto molla).</li>
                        <li><strong>Cutter e lame:</strong> Uso improprio di taglierini per apertura imballaggi, lame non retrattili.</li>
                        <li><strong>Imballaggi danneggiati:</strong> Bordi taglienti di scatole, vetro rotto, lamiere di contenitori.</li>
                        <li><strong>Pallet in legno:</strong> Schegge, chiodi sporgenti, assi rotte.</li>
                        <li><strong>Mancanza DPI:</strong> Operatori senza guanti antitaglio durante manipolazione.</li>
                    </ul>
                `,
                danni: `
                    <p>Tagli e ferite provocano lesioni di entità variabile:</p>
                    <ul>
                        <li><strong>Ferite superficiali:</strong> Tagli cutanei, abrasioni, necessità di medicazione.</li>
                        <li><strong>Ferite profonde:</strong> Lesioni tendinee (flessori/estensori dita), sezione vasi (arteria radiale/ulnare), danno nervoso.</li>
                        <li><strong>Infezioni:</strong> Tetano (da chiodi/legno sporco), infezioni batteriche, cellulite.</li>
                        <li><strong>Amputazioni parziali:</strong> Polpastrelli, falangi distali (cutter, macchine confezionamento).</li>
                        <li><strong>Invalidità INAIL:</strong> 3-20% per lesioni tendinee/nervose permanenti.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Art. 15, 36):</strong></p>
                    <ul>
                        <li><strong>Attrezzature sicure:</strong> Cutter con lama retrattile automatica, forbici di sicurezza con punta arrotondata.</li>
                        <li><strong>Riprogettazione:</strong> Pallet con spigoli arrotondati, imballaggi con aperture sicure (pre-taglio).</li>
                        <li><strong>Organizzazione:</strong> Procedure sicure apertura imballaggi, aree dedicate manipolazione fragili.</li>
                        <li><strong>Manutenzione:</strong> Controllo regolare attrezzature taglio, sostituzione lame danneggiate/usurate.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Guanti antitaglio (UNI EN 388, livello 3-4), grembiule protettivo se necessario.</li>
                        <li><strong>Attrezzature:</strong> Cutter con lama retrattile, forbici di sicurezza.</li>
                        <li><strong>Primo soccorso:</strong> Kit medicazione disponibile in ogni zona, procedura tamponamento emorragico.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 4-6h):</strong> Riconoscimento rischi taglio, uso corretto attrezzi, primo soccorso ferite.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15, 36); UNI EN 388 (Guanti antitaglio); INAIL "Infortuni da taglio" (2023).</p>
                `
            }
        ]
    },

    // ============================================== //
    // CATEGORIA 2: RISCHI POSTURALI E DA             //
    //              MOVIMENTAZIONE                    //
    // ============================================== //
    {
        name: "Rischi Posturali e da Movimentazione",
        risks: [
            // ------------------------------------------
            // 2.0 - Movimenti ripetitivi
            // ------------------------------------------
            {
                title: "Movimenti ripetitivi",
                level: "alto",
                shortDesc: "Stress biomeccanico da operazioni ripetute, in particolare durante il picking veloce con scanner.",
                cause: `
                    <p>Stress biomeccanico causato da operazioni ripetute nel tempo, in particolare durante picking veloce (prelievo merci da scaffali con scanner). Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Frequenza elevata:</strong> &gt;1000-2000 cicli/giorno (braccia/mano), cicli &lt;30sec, mancanza micro-pause.</li>
                        <li><strong>Picking veloce:</strong> Movimenti ripetitivi arti superiori (estensione gomito, flessione polso, pronazione/supinazione), scanner barcode, posture fisse.</li>
                        <li><strong>Postazioni fisse:</strong> Altezze scaffali incongrue (tronco flesso &gt;30°), spazi ristretti, illuminazione insufficiente.</li>
                        <li><strong>Fattori aggravanti:</strong> Durata &gt;4h/giorno, vibrazioni mano-braccio, freddo (&lt;15°C), stress produttività.</li>
                    </ul>
                `,
                danni: `
                    <p>Disturbi muscolo-scheletrici (DMS) da microtraumi cumulativi (prevalenza 40-60% magazzinieri):</p>
                    <ul>
                        <li><strong>Arti superiori:</strong> Sindrome tunnel carpale (STC), tendiniti epicondiloidea, periartrite scapolo-omerale, tenosinoviti.</li>
                        <li><strong>Collo/spalle:</strong> Cervicalgie, trapezio ipertonico, cefalee tensionali.</li>
                        <li><strong>Sintomi:</strong> Dolore, formicolio, intorpidimento, perdita forza, cronicizzazione &gt;3 mesi.</li>
                        <li><strong>Malattie professionali INAIL:</strong> STC riconosciuta (Art. 211 D.Lgs. 81/2008).</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (Allegato XXXIV D.Lgs. 81/2008 - Movimenti ripetitivi):</strong></p>
                    <ul>
                        <li><strong>Valutazione OCRA:</strong> Indice OCRA &lt;3,5 (basso rischio); soglia 3,5-7,5 media; &gt;7,5 alta.</li>
                        <li><strong>Micro-pause:</strong> 5-10% ciclo lavoro (es. 2min/20min), stretching attivo (rotazioni spalle, flessioni polso).</li>
                        <li><strong>Riprogettazione:</strong> Scanner vocali (riduce picking manuale 30%), postazioni regolabili, rotazione mansioni 30min.</li>
                        <li><strong>Limiti:</strong> Cicli &lt;1200/ora, recupero attivo, task rotation.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Guanti antivibrazione (UNI EN ISO 10819), polsini elastici.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 41):</strong> Visite annuali, EMG nervo mediano, medico competente.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 12-16h DMS):</strong> Riconoscimento early symptoms, tecniche corrette picking, stretching.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegato XXXIV); Linee guida INAIL "OCRA Checklist" (2020); UNI EN ISO 11228-3.</p>
                `
            },

            // ------------------------------------------
            // 2.1 - Posture incongrue
            // ------------------------------------------
            {
                title: "Posture incongrue",
                level: "alto",
                shortDesc: "Torsioni e flessioni del tronco e collo durante manovre muletti e movimentazione manuale.",
                cause: `
                    <p>Torsioni e flessioni del tronco e del collo durante manovre di carrelli elevatori (retromarcia, stoccaggio in alto) e durante la movimentazione manuale dei carichi. Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Retromarcia muletto:</strong> Torsione tronco &gt;45° prolungata per visibilità posteriore.</li>
                        <li><strong>Stoccaggio altezze estreme:</strong> Iperestensione cervicale per scaffali &gt;180cm, flessione lombare &gt;60° per livelli bassi.</li>
                        <li><strong>Picking da terra:</strong> Accovacciamento ripetuto, flessione tronco con rotazione simultanea.</li>
                        <li><strong>Seduta muletto prolungata:</strong> Postura statica &gt;4h, sedile non ergonomico, vibrazioni whole-body.</li>
                        <li><strong>Spazi ristretti:</strong> Corsie strette che obbligano a posture compensatorie.</li>
                    </ul>
                `,
                danni: `
                    <p>Le posture incongrue provocano patologie degenerative progressive:</p>
                    <ul>
                        <li><strong>Rachide cervicale:</strong> Cervicalgia cronica, spondilosi, protrusioni discali C5-C7.</li>
                        <li><strong>Rachide lombare:</strong> Lombalgia cronica, discopatie L4-L5/L5-S1, ernie discali.</li>
                        <li><strong>Muscoli/articolazioni:</strong> Stiramenti paravertebrali, artrosi lombare, problemi circolatori.</li>
                        <li><strong>Sintomi:</strong> Dolore acuto, irradiazione glutei/gambe, limitazione movimenti, invalidità temporanea &gt;30gg.</li>
                        <li><strong>Malattie professionali INAIL:</strong> Ernie discali (Art. 211).</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (Titolo VI D.Lgs. 81/2008 - MMC; Allegato XXXIII):</strong></p>
                    <ul>
                        <li><strong>Valutazione NIOSH/MAPO:</strong> Lifting Index &lt;1 (sicuro); 1-3 cautela; &gt;3 rischio alto.</li>
                        <li><strong>Gerarchia misure:</strong> Meccanizzazione (transpallet elettrici, muletti), riprogettazione postazioni, team lifting (2 persone).</li>
                        <li><strong>Limiti MMC:</strong> Max 25kg uomo/15kg donna, distanza corpo &lt;25cm, altezza 75-175cm.</li>
                        <li><strong>Ambiente:</strong> Spazi liberi &gt;1,2m, pavimenti piani, illuminazione adeguata.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Cinture lombari, guanti antiscivolo, scarpe S3.</li>
                        <li><strong>Sorveglianza (Art. 41):</strong> Visite annuali, RMN rachide se sintomi, medico competente.</li>
                        <li><strong>Formazione (Accordo 2011 agg. 2025, 16h MMC):</strong> Tecnica corretta: piega ginocchia non schiena, spinta gambe, no torsioni; simulazioni pratiche.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo VI, Allegato XXXIII); Linee guida INAIL "NIOSH Equation" (2020); ISO 11228-1 (Limiti MMC).</p>
                `
            },

            // ------------------------------------------
            // 2.2 - Sforzi eccessivi
            // ------------------------------------------
            {
                title: "Sforzi eccessivi",
                level: "alto",
                shortDesc: "Sollevamento pesi eccessivi o voluminosi senza ausilio di attrezzature meccaniche.",
                cause: `
                    <p>Sollevamento di pesi eccessivi o voluminosi senza ausilio di attrezzature, che mette sotto pressione articolazioni e muscoli. Fattori causali specifici:</p>
                    <ul>
                        <li><strong>Carichi eccessivi:</strong> Peso &gt;25kg (uomo) / &gt;15kg (donna) sollevati senza ausili meccanici.</li>
                        <li><strong>Voluminosità:</strong> Colli ingombranti che impediscono presa corretta e visibilità.</li>
                        <li><strong>Assenza attrezzature:</strong> Mancanza di transpallet, carrelli, manipolatori per carichi pesanti.</li>
                        <li><strong>Fretta/pressione produttiva:</strong> Operatori saltano l'uso di ausili per velocizzare il lavoro.</li>
                        <li><strong>Frequenza elevata:</strong> &gt;10 sollevamenti/ora per turni di 8-12h.</li>
                        <li><strong>Distanza trasporto:</strong> Trasporto manuale &gt;10m senza pause.</li>
                    </ul>
                `,
                danni: `
                    <p>Gli sforzi eccessivi provocano lesioni acute e degenerative a carico dell'apparato muscolo-scheletrico:</p>
                    <ul>
                        <li><strong>Rachide:</strong> Lombalgie acute, ernie discali (L4-L5, L5-S1), spondilolisi.</li>
                        <li><strong>Muscoli:</strong> Strappi muscolari (paravertebrali, bicipiti, quadricipiti), contratture croniche.</li>
                        <li><strong>Articolazioni:</strong> Distorsioni (ginocchio, caviglia, spalla), lesioni meniscali.</li>
                        <li><strong>Arti superiori:</strong> Sindrome tunnel carpale, epicondiliti, tendiniti spalla.</li>
                        <li><strong>Cardiovascolari:</strong> Ipertensione da sforzo, eventi cardiaci acuti (soggetti predisposti).</li>
                        <li><strong>Statistiche INAIL:</strong> MMC responsabile del 30-40% delle malattie professionali muscoloscheletriche.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Prevenzione (D.Lgs. 81/2008 Titolo VI; Allegato XXXIII; ISO 11228-1/2/3):</strong></p>
                    <ul>
                        <li><strong>Valutazione:</strong> Mappatura MMC (peso, frequenza, distanza); soglia critica: spinta &gt;200N. Metodo NIOSH (LI &lt;1 sicuro).</li>
                        <li><strong>Misure tecniche:</strong> Transpallet elettrici, pedane regolabili (60-110cm), nastri trasportatori, manipolatori pneumatici per carichi &gt;15kg.</li>
                        <li><strong>Organizzative:</strong> Rotazione mansioni, pause 10% tempo lavoro, limiti 4h MMC/giorno, team lifting per carichi &gt;20kg.</li>
                        <li><strong>Limiti normativi MMC:</strong> Max 25kg uomo / 15kg donna (condizioni ideali), riduzione per fattori sfavorevoli (distanza, altezza, frequenza).</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Scarpe S3 (UNI EN ISO 20345), guanti antivibrazione (UNI EN ISO 10819), cinture lombari, ginocchiere.</li>
                        <li><strong>Sorveglianza (Art. 41):</strong> Visite annuali, medico competente per EMG/ecografie.</li>
                        <li><strong>Formazione (12-16h moduli MMC/ripetitivi):</strong> Simulazioni pratiche, tecnica "piega ginocchia non schiena", spinta con gambe, riconoscimento sovraccarico.</li>
                        <li><strong>Sanzioni:</strong> Arresto 3-6 mesi o ammenda 2.500-6.400€ per mancata valutazione rischio MMC (Art. 55 D.Lgs. 81/2008).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo VI, Allegati XXXIII/XXXIV); Linee guida INAIL "Sovraccarico Biomeccanico" (2020); ISO 11228-1/2/3; Gazzetta Ufficiale n.101 30/4/2008.</p>
                `
            }
        ]
    },
    // ============================================== //
    // CATEGORIA 3: RISCHI CHIMICI E BIOLOGICI        //
    // ============================================== //
    {
        name: "Rischi Chimici e Biologici",
        risks: [
            // ------------------------------------------
            // 3.0 - Esposizione a polveri
            // ------------------------------------------
            {
                title: "Esposizione a polveri",
                level: "medio",
                shortDesc: "Inalazione di polveri sottili da imballaggi, cartoni, materiali sfusi e movimentazione merci.",
                cause: `
                    <p>L'inalazione di particolato fine generato durante le operazioni di magazzino rappresenta un rischio cronico spesso sottovalutato:</p>
                    <ul>
                        <li>Apertura/chiusura di scatole, cartoni, sacchi con rilascio di polveri di carta, cartone, polistirolo.</li>
                        <li>Movimentazione di materiali sfusi (cereali, farine, polveri chimiche, cemento) senza aspirazione localizzata.</li>
                        <li>Pulizia a secco con scope/soffiatori che sollevano particolato depositato.</li>
                        <li>Transito continuo di carrelli elevatori (diesel/GPL) che sollevano polvere dal pavimento e generano gas di scarico.</li>
                        <li>Magazzini con scarsa ventilazione, filtri aria non manutenuti, assenza di sistemi di abbattimento polveri.</li>
                        <li>Lavorazione/riconfezionamento di prodotti che generano fibre (tessili, isolanti, legno).</li>
                    </ul>
                `,
                danni: `
                    <p>L'esposizione cronica a polveri causa patologie respiratorie progressive:</p>
                    <ul>
                        <li><strong>Irritazione vie aeree superiori:</strong> Rinite cronica, faringite, sinusite; tosse persistente, starnuti, congestione nasale.</li>
                        <li><strong>Bronchite cronica:</strong> Infiammazione persistente dei bronchi con iperproduzione di muco, tosse produttiva cronica (definizione OMS: tosse con espettorato per almeno 3 mesi/anno per 2 anni consecutivi).</li>
                        <li><strong>Asma occupazionale:</strong> Broncospasmo reversibile da sensibilizzazione a polveri organiche (farine, legno, lattice); prevalenza 5-15% nei magazzinieri esposti.</li>
                        <li><strong>Pneumoconiosi:</strong> Fibrosi polmonare da accumulo di polveri inorganiche (silice, cemento); riduzione progressiva della capacità ventilatoria (pattern restrittivo alla spirometria).</li>
                        <li><strong>BPCO (Broncopneumopatia Cronica Ostruttiva):</strong> Ostruzione irreversibile delle vie aeree; FEV1/FVC &lt;70% alla spirometria; rischio aumentato del 30-40% per esposizione professionale a polveri.</li>
                        <li><strong>Congiuntivite/dermatite:</strong> Irritazione oculare da particolato, dermatite da contatto con polveri irritanti su cute esposta.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Art. 224-225 D.Lgs. 81/2008 - Titolo IX Capo I):</strong></p>
                    <ul>
                        <li><strong>Ventilazione meccanica:</strong> Impianti di aspirazione localizzata nelle zone di riconfezionamento/apertura colli; ricambio aria &ge;6 volumi/ora in aree polverose.</li>
                        <li><strong>Abbattimento polveri:</strong> Sistemi di nebulizzazione acqua, pavimenti trattati con resine antipolvere, barriere fisiche tra zone polverose e aree pulite.</li>
                        <li><strong>Pulizia:</strong> Aspiratori industriali con filtri HEPA (classe H13/H14) al posto di scope; pulizia ad umido; programma pulizia giornaliero documentato.</li>
                        <li><strong>Sostituzione carrelli:</strong> Carrelli elettrici al posto di diesel/GPL per eliminare emissioni di scarico in ambienti confinati.</li>
                        <li><strong>Monitoraggio ambientale:</strong> Campionamento polveri inalabili/respirabili (UNI EN 689); valori limite TLV-TWA secondo ACGIH (es. polveri inerti: 10 mg/m³ inalabile, 3 mg/m³ respirabile).</li>
                        <li><strong>Segnaletica:</strong> Cartelli di obbligo DPI respiratori nelle zone con concentrazioni &gt;50% del TLV.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI respiratori:</strong> Facciali filtranti FFP2 (UNI EN 149) per polveri inerti; FFP3 per polveri con TLV basso (silice, fibre); maschere a semimaschera con filtri P2/P3 per esposizioni prolungate.</li>
                        <li><strong>DPI oculari:</strong> Occhiali a tenuta (UNI EN 166) nelle zone ad alta concentrazione di polveri.</li>
                        <li><strong>Indumenti protettivi:</strong> Tute in TNT monouso (cat. III tipo 5/6) per operazioni di riconfezionamento materiali polverosi.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 229):</strong> Spirometria annuale (FEV1, FVC, indice di Tiffeneau); Rx torace ogni 2-3 anni per esposti a polveri inorganiche; prick test per allergeni professionali.</li>
                        <li><strong>Formazione specifica:</strong> Riconoscimento sintomi precoci (tosse persistente, dispnea da sforzo), uso corretto DPI respiratori (fit test), procedure di emergenza per sversamenti polveri.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo IX, Capo I - Agenti chimici); Regolamento CLP 1272/2008; ACGIH TLV 2023; UNI EN 689:2019; Linee guida INAIL "Agenti chimici pericolosi" (2017).</p>
                `
            },
            // ------------------------------------------
            // 3.1 - Contatto con sostanze chimiche
            // ------------------------------------------
            {
                title: "Contatto con sostanze chimiche",
                level: "medio",
                shortDesc: "Esposizione cutanea/inalatoria a detergenti, solventi, acidi, sostanze pericolose stoccate o in uso.",
                cause: `
                    <p>Il contatto con agenti chimici pericolosi in magazzino può avvenire per molteplici vie di esposizione:</p>
                    <ul>
                        <li>Sversamenti accidentali durante movimentazione di fusti, taniche, contenitori di prodotti chimici (acidi, solventi, basi).</li>
                        <li>Rottura di imballaggi contenenti sostanze pericolose (etichettate CLP: corrosivi, tossici, infiammabili).</li>
                        <li>Uso di detergenti/sgrassanti industriali per pulizia pavimenti e attrezzature senza adeguata diluizione.</li>
                        <li>Travaso di sostanze chimiche senza dispositivi di contenimento (bacini, imbuti, pompe).</li>
                        <li>Stoccaggio promiscuo di sostanze incompatibili (acidi con basi, ossidanti con infiammabili).</li>
                        <li>Assenza o illeggibilità delle Schede Dati di Sicurezza (SDS a 16 sezioni, Reg. REACH 1907/2006).</li>
                    </ul>
                `,
                danni: `
                    <p>Il contatto con sostanze chimiche provoca danni proporzionali alla concentrazione, durata e via di esposizione:</p>
                    <ul>
                        <li><strong>Ustioni chimiche cutanee:</strong> Necrosi coagulativa (acidi) o colliquativa (basi); profondità variabile da I a III grado; acido fluoridrico causa ipocalcemia sistemica potenzialmente letale.</li>
                        <li><strong>Dermatiti:</strong> Dermatite irritativa da contatto (DIC) in 80% dei casi; dermatite allergica da contatto (DAC) nel 20%; eczema cronico delle mani con fissurazione e impetiginizzazione.</li>
                        <li><strong>Lesioni oculari:</strong> Ustioni corneali da schizzi (pH &lt;2 o &gt;12); cheratite puntata; nei casi gravi opacità corneale permanente e cecità.</li>
                        <li><strong>Intossicazione per inalazione:</strong> Edema polmonare da gas irritanti (cloro, ammoniaca); sindrome da disfunzione reattiva delle vie aeree (RADS); sensibilizzazione bronchiale.</li>
                        <li><strong>Effetti sistemici cronici:</strong> Epatotossicità da solventi organici (toluene, xilene); nefrotossicità; neurotossicità periferica (neuropatia da n-esano); effetti cancerogeni per esposizione a specifici agenti (formaldeide, benzene).</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Titolo IX D.Lgs. 81/2008 + Reg. CLP/REACH):</strong></p>
                    <ul>
                        <li><strong>Valutazione rischio chimico (Art. 223):</strong> Algoritmo MOVARISCH o misurazione ambientale per classificazione "rischio irrilevante/non irrilevante per la salute"; aggiornamento ad ogni variazione di sostanze.</li>
                        <li><strong>Sostituzione (Art. 224):</strong> Sostituire agenti pericolosi con alternative meno tossiche (es. detergenti a pH neutro, solventi a bassa volatilità).</li>
                        <li><strong>Stoccaggio sicuro:</strong> Aree dedicate con bacini di contenimento (110% volume massimo stoccato); armadi aspirati per solventi; separazione per classi di incompatibilità secondo matrice CLP.</li>
                        <li><strong>SDS accessibili:</strong> Registro aggiornato Schede Dati di Sicurezza in formato cartaceo e digitale, disponibili in lingua italiana entro 10m da ogni postazione con chimici.</li>
                        <li><strong>Procedure sversamento:</strong> Kit antispill (assorbenti, neutralizzanti) in ogni zona stoccaggio chimici; procedura scritta con responsabilità assegnate; docce/lavaocchi di emergenza entro 10 secondi di percorrenza.</li>
                        <li><strong>Ventilazione:</strong> Aspirazione localizzata su banchi travaso; ventilazione generale &ge;10 ricambi/ora in depositi solventi.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI mani:</strong> Guanti specifici per agente chimico (UNI EN 374): nitrile per solventi, butile per chetoni, neoprene per acidi; tempo di permeazione verificato su SDS.</li>
                        <li><strong>DPI occhi/viso:</strong> Occhiali a tenuta chimica (UNI EN 166, marcatura 3/4/5) o visiera completa per travasi; lavaocchi portatili individuali.</li>
                        <li><strong>DPI corpo:</strong> Grembiuli in PVC/gomma; tute chimiche cat. III tipo 3/4 per emergenze sversamento.</li>
                        <li><strong>DPI respiratori:</strong> Semimaschere con filtri specifici: A (organici), B (inorganici), E (acidi), K (ammoniaca); ABEK combinati per esposizioni miste.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 229):</strong> Monitoraggio biologico (metaboliti urinari solventi, piombemia se pertinente); patch test per DAC; spirometria; funzionalità epatica/renale annuale.</li>
                        <li><strong>Formazione (Art. 227):</strong> Lettura pittogrammi CLP, interpretazione SDS, procedure primo soccorso chimico (lavaggio 15-20 minuti con acqua corrente), uso kit antispill.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo IX, Capo I); Regolamento REACH 1907/2006; Regolamento CLP 1272/2008; Linee guida INAIL "Valutazione rischio chimico" (2017); ACGIH TLV-BEI 2023.</p>
                `
            },
            // ------------------------------------------
            // 3.2 - Esposizione a gas di scarico
            // ------------------------------------------
            {
                title: "Esposizione a gas di scarico",
                level: "medio",
                shortDesc: "Inalazione di monossido di carbonio, NOx e particolato da carrelli diesel/GPL in ambienti chiusi.",
                cause: `
                    <p>I gas di scarico dei mezzi a motore endotermico in ambienti confinati rappresentano un rischio chimico significativo:</p>
                    <ul>
                        <li>Utilizzo di carrelli elevatori diesel/GPL in magazzini chiusi o con aperture insufficienti.</li>
                        <li>Motori non manutenuti con combustione incompleta (emissioni CO aumentate fino a 10 volte).</li>
                        <li>Concentrazione di più mezzi nella stessa area (banchine carico/scarico, corridoi).</li>
                        <li>Ventilazione naturale insufficiente (&lt;0,5 ricambi/ora) o impianto meccanico spento/guasto.</li>
                        <li>Riscaldamento motore a vuoto prolungato in zone chiuse (pratica comune in inverno).</li>
                        <li>Camion/furgoni con motore acceso durante operazioni di carico/scarico alle baie.</li>
                    </ul>
                `,
                danni: `
                    <p>I gas di scarico contengono un mix di sostanze tossiche con effetti acuti e cronici:</p>
                    <ul>
                        <li><strong>Monossido di carbonio (CO):</strong> Si lega all'emoglobina (COHb) con affinità 200-250 volte superiore all'O₂; COHb 10-20%: cefalea, vertigini; 20-40%: confusione, nausea; 40-60%: coma; &gt;60%: morte. TLV-TWA: 25 ppm.</li>
                        <li><strong>Ossidi di azoto (NOx):</strong> Irritazione vie aeree; a concentrazioni elevate edema polmonare tardivo (6-24h dopo esposizione); bronchiolite obliterante.</li>
                        <li><strong>Particolato diesel (DEE):</strong> Classificato IARC Gruppo 1 (cancerogeno certo per l'uomo); aumento rischio tumore polmonare del 30-50% per esposizioni professionali croniche; particelle ultrafini (&lt;0,1μm) penetrano negli alveoli.</li>
                        <li><strong>Idrocarburi incombusti:</strong> Benzene (IARC Gruppo 1): leucemogeno; formaldeide (IARC Gruppo 1): cancerogeno nasofaringeo; 1,3-butadiene: linfomi.</li>
                        <li><strong>Effetti cardiovascolari:</strong> Esposizione cronica a CO: aumento rischio cardiopatia ischemica; particolato fine: aterosclerosi accelerata, aritmie.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Art. 224-225 D.Lgs. 81/2008):</strong></p>
                    <ul>
                        <li><strong>Sostituzione mezzi:</strong> Transizione a carrelli elevatori elettrici (eliminazione totale emissioni dirette); dove non possibile, GPL preferibile a diesel (emissioni ridotte del 60-70%).</li>
                        <li><strong>Ventilazione forzata:</strong> Impianto meccanico con portata calcolata su n° mezzi e volume locale; sensori CO con allarme a 25 ppm e blocco automatico accessi a 50 ppm.</li>
                        <li><strong>Aspirazione localizzata baie:</strong> Tubi di captazione collegabili allo scarico dei camion durante carico/scarico; ventilatori assiali nelle aperture.</li>
                        <li><strong>Manutenzione motori:</strong> Programma manutenzione preventiva con analisi gas di scarico (opacimetro per diesel, analizzatore CO per GPL); registro interventi.</li>
                        <li><strong>Organizzazione:</strong> Divieto riscaldamento motore in ambienti chiusi; spegnimento motore camion durante operazioni; turnazione mezzi diesel per limitare concentrazioni.</li>
                        <li><strong>Monitoraggio:</strong> Campionamenti periodici CO, NO₂, particolato respirabile (UNI EN 689); rilevatori fissi con data-logging continuo.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI respiratori:</strong> Semimaschere con filtri combinati A2B2P3 per esposizioni miste gas/vapori/particolato; maschere isolanti per interventi emergenza in atmosfere confinate.</li>
                        <li><strong>Rilevatori personali:</strong> Dosimetri CO individuali per carrellisti (allarme 25 ppm TWA, 100 ppm STEL); registrazione dati per sorveglianza.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> COHb ematica a fine turno (BEI: 3,5% non fumatori); spirometria annuale; DLCO per valutazione scambio gassoso; ECG per esposti cronici.</li>
                        <li><strong>Formazione:</strong> Riconoscimento sintomi intossicazione CO (cefalea, vertigini come segnali precoci); evacuazione immediata se allarme sensori; primo soccorso con O₂ al 100%.</li>
                        <li><strong>Emergenza:</strong> Protocollo specifico per intossicazione acuta da CO: evacuazione, O₂ ad alti flussi (15 L/min con reservoir), camera iperbarica per COHb &gt;25%.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo IX); IARC Monographs vol. 105 (Diesel Exhaust); ACGIH TLV-TWA CO 25 ppm; UNI EN 689; Linee guida SIMLII "Gas di scarico veicoli".</p>
                `
            },
            // ------------------------------------------
            // 3.3 - Rischio biologico
            // ------------------------------------------
            {
                title: "Rischio biologico",
                level: "basso",
                shortDesc: "Esposizione a muffe, batteri, parassiti, allergeni da merci contaminate, ambienti umidi e infestanti.",
                cause: `
                    <p>Il rischio biologico in magazzino è spesso sottovalutato ma presente in molteplici forme:</p>
                    <ul>
                        <li>Merci provenienti da aree geografiche con rischio sanitario (container da zone tropicali/subtropicali con insetti, roditori, muffe).</li>
                        <li>Stoccaggio di prodotti alimentari/organici con possibile contaminazione microbica (muffe, batteri, lieviti).</li>
                        <li>Ambienti umidi (&gt;65% UR) con scarsa ventilazione: proliferazione di muffe (Aspergillus, Penicillium, Stachybotrys) su pareti, scaffali, imballaggi.</li>
                        <li>Presenza di roditori (ratti, topi), insetti (blatte, tarme), volatili (piccioni) con contaminazione da feci, urine, piume.</li>
                        <li>Impianti di condizionamento non manutenuti (Legionella pneumophila in torri di raffreddamento, umidificatori).</li>
                        <li>Rifiuti organici, residui di imballaggio alimentare non smaltiti tempestivamente.</li>
                        <li>Punture/morsi da animali infestanti; contatto con acque stagnanti contaminate.</li>
                    </ul>
                `,
                danni: `
                    <p>L'esposizione ad agenti biologici causa patologie infettive, allergiche e tossiche:</p>
                    <ul>
                        <li><strong>Infezioni fungine:</strong> Aspergillosi polmonare invasiva (immunodepressi); aspergilloma; alveolite allergica estrinseca ("polmone del magazziniere") con febbre, dispnea, infiltrati polmonari 4-8h dopo esposizione.</li>
                        <li><strong>Legionellosi:</strong> Polmonite grave da Legionella (mortalità 5-30%); febbre di Pontiac (forma lieve); trasmissione per inalazione aerosol contaminato.</li>
                        <li><strong>Leptospirosi:</strong> Da contatto con urine di roditori; febbre, ittero, insufficienza renale (Sindrome di Weil, mortalità 5-15%).</li>
                        <li><strong>Allergie:</strong> Rinite/asma allergica da acari della polvere, muffe, forfora animale; orticaria da contatto; anafilassi in soggetti sensibilizzati (punture imenotteri).</li>
                        <li><strong>Zoonosi:</strong> Salmonellosi, hantavirus (da feci roditori); ornitosi/psittacosi (da volatili); tetano (ferite contaminate con terreno/ruggine).</li>
                        <li><strong>Dermatofitosi:</strong> Infezioni cutanee da funghi (Trichophyton, Microsporum) per contatto con materiali contaminati.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Titolo X D.Lgs. 81/2008 - Agenti biologici):</strong></p>
                    <ul>
                        <li><strong>Disinfestazione programmata:</strong> Contratto con ditta specializzata per derattizzazione (esche rodenticide in postazioni mappate), disinfestazione insetti (trimestrale), allontanamento volatili (reti, dissuasori).</li>
                        <li><strong>Controllo umidità:</strong> Deumidificatori nelle aree a rischio; UR mantenuta &lt;60%; riparazione immediata infiltrazioni; ventilazione adeguata aree stoccaggio.</li>
                        <li><strong>Manutenzione impianti:</strong> Pulizia/sanificazione impianti aeraulici (semestrale); analisi Legionella su torri/umidificatori (trimestrale, UNI EN ISO 11731); filtri HEPA su UTA.</li>
                        <li><strong>Igiene ambientale:</strong> Pulizia giornaliera con disinfettanti; rimozione tempestiva rifiuti organici; contenitori chiusi per residui alimentari; pavimenti lavabili e privi di fessure.</li>
                        <li><strong>Controllo merci in ingresso:</strong> Ispezione visiva container/colli per segni di infestazione (rosicchiature, escrementi, muffe); quarantena merci sospette; trattamenti fitosanitari se necessario.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI:</strong> Guanti in nitrile monouso per manipolazione merci sospette; FFP2/FFP3 per aree con muffe visibili; occhiali a tenuta; tute monouso per bonifica aree contaminate.</li>
                        <li><strong>Vaccinazioni (Art. 279):</strong> Antitetanica (obbligatoria per magazzinieri); anti-epatite A/B per addetti a merci da aree endemiche; antinfluenzale raccomandata.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Visita annuale con anamnesi mirata (sintomi respiratori, cutanei, febbre); prick test per allergeni ambientali; IgE specifiche per muffe; sierologia Legionella se indicata.</li>
                        <li><strong>Formazione:</strong> Riconoscimento segni infestazione; procedure igieniche (lavaggio mani, non toccarsi il viso); segnalazione immediata avvistamento roditori/insetti; primo soccorso per morsi/punture.</li>
                        <li><strong>Protocollo post-esposizione:</strong> Ferite da animali: lavaggio immediato, profilassi antitetanica, segnalazione medico competente; contatto con materiale contaminato: lavaggio abbondante, sorveglianza sintomi.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo X - Agenti biologici, Allegato XLVI); Linee guida Conferenza Stato-Regioni Legionellosi (2015); UNI EN ISO 11731; INAIL "Rischio biologico nei luoghi di lavoro" (2019).</p>
                `
            },
            // ------------------------------------------
            // 3.4 - Allergeni e sensibilizzanti
            // ------------------------------------------
            {
                title: "Allergeni e sensibilizzanti",
                level: "basso",
                shortDesc: "Reazioni allergiche da lattice, polveri organiche, muffe, acari e sostanze sensibilizzanti nei materiali.",
                cause: `
                    <p>L'esposizione a sostanze sensibilizzanti in magazzino coinvolge molteplici allergeni professionali:</p>
                    <ul>
                        <li>Guanti in lattice naturale (proteina Hev b): rilascio di allergeni per contatto cutaneo e inalazione di polvere lubrificante.</li>
                        <li>Polveri organiche: farine, spezie, polvere di legno (cedro rosso, faggio, rovere), fibre tessili naturali (cotone, lino, canapa).</li>
                        <li>Muffe aerodisperse: spore di Aspergillus, Alternaria, Cladosporium in ambienti umidi; concentrazioni &gt;500 UFC/m³ indicano contaminazione significativa.</li>
                        <li>Acari della polvere (Dermatophagoides): proliferano in ambienti polverosi con UR &gt;50% e T 20-25°C.</li>
                        <li>Isocianati (in schiume poliuretaniche, colle, vernici stoccate): sensibilizzanti respiratori potenti (MDI, TDI); soglia sensibilizzazione molto bassa (ppb).</li>
                        <li>Additivi chimici in imballaggi: colofonia (resina), formaldeide in colle/resine, coloranti azoici in cartoni stampati.</li>
                    </ul>
                `,
                danni: `
                    <p>Le reazioni allergiche professionali seguono meccanismi immunologici di tipo I (IgE-mediato) e IV (cellulo-mediato):</p>
                    <ul>
                        <li><strong>Asma occupazionale allergica:</strong> Tipo I (IgE): insorgenza 15-30 min dopo esposizione (fase immediata) e/o 4-8h (fase tardiva); broncospasmo, wheezing, dispnea; prevalenza 5-25% per specifici allergeni (farine, isocianati, lattice).</li>
                        <li><strong>Rinite allergica professionale:</strong> Precede l'asma nel 70% dei casi; starnuti, rinorrea acquosa, ostruzione nasale; conferma con test di provocazione nasale specifico.</li>
                        <li><strong>Dermatite allergica da contatto (DAC):</strong> Tipo IV (cellulo-mediato): eczema eritematoso-vescicoloso nelle zone di contatto 24-72h dopo esposizione; cronicizzazione con lichenificazione e fissurazione.</li>
                        <li><strong>Orticaria da contatto:</strong> Da lattice: tipo I con pomfi localizzati o generalizzati entro 30 min; rischio anafilassi (0,5-5% dei sensibilizzati al lattice).</li>
                        <li><strong>Alveolite allergica estrinseca:</strong> Tipo III (immunocomplessi): febbre, brividi, tosse, dispnea 4-8h dopo esposizione massiva a spore/polveri organiche; evoluzione in fibrosi polmonare se esposizione cronica.</li>
                        <li><strong>Anafilassi:</strong> Reazione sistemica potenzialmente letale: ipotensione, broncospasmo severo, edema laringeo; da lattice, punture imenotteri, rari casi da allergeni inalatori ad alte concentrazioni.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive:</strong></p>
                    <ul>
                        <li><strong>Sostituzione allergeni:</strong> Guanti nitrile/vinile al posto di lattice; farine pre-additivate a bassa polverosità; colle senza formaldeide; vernici senza isocianati liberi.</li>
                        <li><strong>Contenimento esposizione:</strong> Aspirazione localizzata su postazioni con polveri organiche; manipolazione in contenitori chiusi; bagnatura materiali polverosi.</li>
                        <li><strong>Controllo ambientale:</strong> Monitoraggio concentrazione spore fungine (campionatore Andersen/SAS); conta acari; dosaggio allergeni aerodispersi specifici (Hev b per lattice, Der p1 per acari).</li>
                        <li><strong>Deumidificazione:</strong> UR &lt;50% in aree stoccaggio per limitare proliferazione muffe/acari.</li>
                        <li><strong>Rotazione mansioni:</strong> Alternanza lavoratori sensibilizzati su postazioni a bassa esposizione; ricollocazione definitiva se diagnosi di asma occupazionale confermata (Art. 42 D.Lgs. 81/2008).</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI respiratori:</strong> FFP2 per polveri organiche; FFP3 per esposti sensibilizzati o ambienti con muffe; maschere con filtri A2P3 per isocianati.</li>
                        <li><strong>DPI cutanei:</strong> Guanti specifici per allergene (nitrile se allergia lattice); creme barriera certificate; indumenti a maniche lunghe in aree con polveri allergizzanti.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Questionario allergologico in visita preventiva; spirometria con test di reversibilità; prick test per allergeni professionali; IgE specifiche (RAST/ImmunoCAP); monitoraggio PEF seriale (2 settimane lavoro vs 2 settimane riposo).</li>
                        <li><strong>Kit emergenza anafilassi:</strong> Adrenalina autoiniettabile (0,3 mg) disponibile per lavoratori con anamnesi di anafilassi; formazione all'uso per colleghi e preposti.</li>
                        <li><strong>Formazione:</strong> Riconoscimento sintomi allergici precoci; diario dei sintomi; importanza segnalazione precoce; auto-somministrazione adrenalina.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo IX - Agenti chimici, Titolo X - Agenti biologici); Linee guida SIMLII "Asma occupazionale" (2017); ERS/ATS Guidelines Occupational Asthma; ACGIH "Industrial Ventilation Manual".</p>
                `
            },
            // ------------------------------------------
            // 3.5 - Rischio infettivo
            // ------------------------------------------
            {
                title: "Rischio infettivo",
                level: "basso",
                shortDesc: "Trasmissione di agenti infettivi tra lavoratori, da merci contaminate o da ambienti insalubri.",
                cause: `
                    <p>Il rischio infettivo in magazzino comprende trasmissione inter-umana e da fonti ambientali:</p>
                    <ul>
                        <li>Trasmissione aerea di patogeni respiratori (influenza, COVID-19, tubercolosi) in ambienti condivisi con scarsa ventilazione.</li>
                        <li>Contatto con superfici contaminate (maniglie carrelli, tastiere terminali, scanner, utensili condivisi).</li>
                        <li>Manipolazione di merci contaminate da aree endemiche per specifiche patologie (dengue, malaria, febbre gialla - rischio da vettori in container).</li>
                        <li>Ferite da oggetti contaminati con rischio tetano (metalli arrugginiti, legno sporco di terra) o epatite B/C (aghi, taglienti in colli non dichiarati).</li>
                        <li>Servizi igienici insufficienti/non manutenuti: trasmissione oro-fecale (epatite A, norovirus, Salmonella).</li>
                        <li>Assenza/insufficienza di punti lavaggio mani con acqua calda e sapone; mancanza di gel idroalcolico.</li>
                    </ul>
                `,
                danni: `
                    <p>Le infezioni professionali variano da forme lievi a patologie potenzialmente letali:</p>
                    <ul>
                        <li><strong>Infezioni respiratorie:</strong> Influenza stagionale (assenteismo 3-7 giorni); COVID-19 (rischio long-COVID con fatigue cronica, dispnea, deficit cognitivi); tubercolosi polmonare in contesti ad alta prevalenza.</li>
                        <li><strong>Epatiti virali:</strong> Epatite A (oro-fecale, autolimitante); epatite B (rischio cronicizzazione 5-10%, cirrosi, epatocarcinoma); epatite C (cronicizzazione 70-80%).</li>
                        <li><strong>Tetano:</strong> Da ferite contaminate con spore di Clostridium tetani; contratture muscolari generalizzate, spasmo laringeo, insufficienza respiratoria; mortalità 10-70% se non trattato.</li>
                        <li><strong>Gastroenteriti:</strong> Norovirus (altamente contagioso, 12-48h incubazione); Salmonella; Campylobacter; assenteismo 2-5 giorni con possibili epidemie aziendali.</li>
                        <li><strong>Infezioni cutanee:</strong> Stafilococco aureo (foruncolosi, ascessi) da microtraumi infettati; MRSA in ambienti con scarsa igiene; erisipela da ferite contaminate.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Titolo X D.Lgs. 81/2008):</strong></p>
                    <ul>
                        <li><strong>Igiene delle mani:</strong> Punti lavaggio con acqua calda, sapone e asciugamani monouso ogni 50m²; dispenser gel idroalcolico su ogni carrello e postazione; poster tecnica OMS lavaggio mani.</li>
                        <li><strong>Ventilazione:</strong> Ricambio aria &ge;2 ricambi/ora per riduzione carica microbica aerodispersa; filtri HEPA su UTA; purificatori UV-C in aree ad alta densità.</li>
                        <li><strong>Sanificazione superfici:</strong> Protocollo pulizia con prodotti virucidi/battericidi (PMC o biocidi Reg. 528/2012) su superfici ad alto contatto: maniglie, tastiere, scanner, pulsantiere carrelli; frequenza minima 2 volte/turno.</li>
                        <li><strong>Servizi igienici:</strong> Rapporto minimo 1 WC ogni 10 lavoratori; pulizia 2 volte/turno; dotazione completa (sapone, carta, cestini a pedale); docce se esposizione a contaminanti biologici.</li>
                        <li><strong>Gestione malattie:</strong> Politica aziendale che incentivi l'assenza in caso di sintomi infettivi (no presenteismo); isolamento temporaneo lavoratore sintomatico in attesa rientro a casa.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>Vaccinazioni (Art. 279):</strong> Antitetanica (richiamo ogni 10 anni, obbligatoria); anti-epatite B (per esposti a rischio puntura/taglio); antinfluenzale (raccomandata annualmente); COVID-19 (secondo indicazioni ministeriali vigenti); anti-epatite A per addetti settore alimentare.</li>
                        <li><strong>DPI barriera:</strong> Guanti monouso per manipolazione colli sospetti; mascherine chirurgiche/FFP2 in periodi epidemici o per lavoratori fragili; visiere per procedure a rischio schizzi.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Screening pre-assuntivo (titolo anti-HBs, Mantoux/Quantiferon in contesti a rischio TB); monitoraggio stato vaccinale; sorveglianza sindromica in periodi epidemici.</li>
                        <li><strong>Formazione:</strong> Igiene respiratoria (etichetta tosse/starnuto); corretto lavaggio mani (5 momenti OMS); gestione ferite (lavaggio + disinfezione + segnalazione); riconoscimento sintomi malattie trasmissibili.</li>
                        <li><strong>Post-esposizione:</strong> Protocollo per esposizione percutanea a materiale biologico (ferita da ago/tagliente non noto): lavaggio, disinfezione, segnalazione, sierologia basale, follow-up 3-6 mesi.</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo X, Allegati XLIV-XLVIII); Piano Nazionale Prevenzione Vaccinale; Linee guida INAIL "Rischio biologico" (2019); Protocolli anti-COVID aggiornati; OMS "Hand Hygiene Guidelines".</p>
                `
            }
        ]
    },

    // ============================================== //
    // CATEGORIA 4: RISCHI AMBIENTALI E MICROCLIMATICI//
    // ============================================== //
    {
        name: "Rischi Ambientali e Microclimatici",
        risks: [
            // ------------------------------------------
            // 4.0 - Esposizione a temperature estreme
            // ------------------------------------------
            {
                title: "Esposizione a temperature estreme",
                level: "alto",
                shortDesc: "Stress termico da caldo/freddo in magazzini non climatizzati, celle frigorifere e baie di carico.",
                cause: `
                    <p>Le condizioni microclimatiche estreme in magazzino rappresentano un rischio severo e diffuso:</p>
                    <ul>
                        <li><strong>Caldo:</strong> Magazzini con copertura in lamiera/cemento senza isolamento (T interna fino a 45-50°C in estate); assenza di climatizzazione; lavoro fisico intenso che genera calore metabolico (300-500W durante MMC).</li>
                        <li><strong>Freddo:</strong> Celle frigorifere (0/+4°C per freschi, -18/-25°C per surgelati, fino a -30°C per ultracongelati); banchine carico/scarico aperte in inverno; correnti d'aria da portoni aperti.</li>
                        <li><strong>Transizioni termiche:</strong> Passaggi ripetuti caldo/freddo (magazzino ambiente → cella frigorifera) con shock termico; differenziali &gt;20°C tra zone adiacenti.</li>
                        <li>Umidità relativa inadeguata: &lt;30% (secchezza mucose) o &gt;70% (ridotta evaporazione sudore, favorisce colpo di calore); assenza di monitoraggio igrometrico.</li>
                        <li>Vestiario inadeguato: abbigliamento pesante in estate o insufficiente per celle frigorifere; DPI non termici.</li>
                        <li>Idratazione insufficiente: assenza di distributori acqua accessibili; mancata programmazione pause per reidratazione.</li>
                    </ul>
                `,
                danni: `
                    <p>Lo stress termico provoca patologie acute potenzialmente letali e danni cronici:</p>
                    <ul>
                        <li><strong>Patologie da calore (in ordine crescente di gravità):</strong>
                            <ul>
                                <li>Crampi da calore: spasmi muscolari dolorosi da deplezione elettrolitica (Na⁺, K⁺, Mg²⁺).</li>
                                <li>Esaurimento da calore: T corporea 38-40°C, sudorazione profusa, tachicardia, ipotensione, astenia severa; se non trattato evolve in colpo di calore.</li>
                                <li>Colpo di calore: EMERGENZA MEDICA - T &gt;40°C, arresto sudorazione, confusione/delirio, convulsioni, coma; mortalità 10-50%; danno multiorgano (reni, fegato, cervello, cuore).</li>
                                <li>Sincope da calore: perdita di coscienza da vasodilatazione periferica e ipotensione ortostatica.</li>
                            </ul>
                        </li>
                        <li><strong>Patologie da freddo:</strong>
                            <ul>
                                <li>Ipotermia: T corporea &lt;35°C; lieve (32-35°C): brividi, confusione; moderata (28-32°C): bradicardia, rigidità; grave (&lt;28°C): fibrillazione ventricolare, arresto cardiaco.</li>
                                <li>Congelamento: Gradi I-IV come ustioni; localizzato a estremità (dita, orecchie, naso); necrosi tissutale con possibile amputazione.</li>
                                <li>Fenomeno di Raynaud professionale: vasospasmo digitale da esposizione cronica al freddo; dita bianche → cianotiche → rosse con dolore.</li>
                                <li>Patologie respiratorie: broncocostrizione da aria fredda; esacerbazione asma; infezioni vie aeree superiori ricorrenti.</li>
                            </ul>
                        </li>
                        <li><strong>Effetti cronici:</strong> Disidratazione cronica → calcolosi renale; insufficienza venosa da calore cronico; sindrome metabolica accelerata; disturbi del sonno da lavoro in ambienti estremi.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Allegato IV D.Lgs. 81/2008 - Requisiti luoghi di lavoro):</strong></p>
                    <ul>
                        <li><strong>Isolamento termico:</strong> Coibentazione coperture e pareti; pannelli sandwich isolanti; tetti ventilati o cool roof (pittura riflettente bianca, riduce T interna di 5-10°C).</li>
                        <li><strong>Climatizzazione:</strong> Impianti HVAC dimensionati per volume e carico termico; destratificatori per uniformare temperatura; T target: 18-26°C (Allegato IV); UR 40-60%.</li>
                        <li><strong>Zone cuscinetto:</strong> Anticamere termiche tra magazzino e celle frigorifere per transizione graduale; tempi di acclimatamento programmati.</li>
                        <li><strong>Regime idrico:</strong> Distributori acqua fresca (&lt;15°C) ogni 50m e in ogni zona operativa; integrazione sali minerali in estate; minimo 200 mL ogni 20 minuti in condizioni WBGT &gt;28°C.</li>
                        <li><strong>Organizzazione lavoro:</strong> Indice WBGT per pianificare lavoro/riposo (UNI EN ISO 7243); turni ridotti in celle frigorifere (max 2h continuative a -20°C, poi pausa 30 min in zona temperata); lavori pesanti nelle ore più fresche.</li>
                        <li><strong>Monitoraggio:</strong> Centraline T/UR con registrazione continua; stazione meteo per WBGT esterno; alert automatici al superamento soglie.</li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI per freddo:</strong> Abbigliamento tecnico multistrato (UNI EN 342/14058): intimo termico traspirante, pile intermedio, giacca/pantaloni imbottiti impermeabili; guanti termici (UNI EN 511, ICRI &ge;2); stivali isolanti (-30°C); passamontagna/balaclava; riscaldamento attivo (gilet riscaldanti a batteria).</li>
                        <li><strong>DPI per caldo:</strong> Indumenti chiari, leggeri, traspiranti (tessuti tecnici moisture-wicking); cappelli con protezione nucale; gilet raffreddanti (a cambio di fase PCM o evaporativi); protezione UV per banchine esterne.</li>
                        <li><strong>Sorveglianza sanitaria:</strong> Visita preventiva con screening cardiovascolare (ECG, pressione arteriosa); anamnesi per patologie termolabili (epilessia, diabete, cardiopatie, neuropatie); visita periodica annuale; monitoraggio funzione renale (creatinina, elettroliti) per esposti a calore cronico.</li>
                        <li><strong>Formazione:</strong> Riconoscimento sintomi precoci stress termico (cefalea, vertigini, confusione = ALLARME); primo soccorso: colpo di calore (raffreddamento immediato, ghiaccio su collo/ascelle/inguine, 118); ipotermia (riscaldamento passivo, coperte termiche, NO alcol/sfregamento).</li>
                        <li><strong>Idoneità specifica:</strong> Giudizio medico di idoneità alla mansione in ambienti termici estremi; restrizioni per cardiopatici, ipertesi, diabetici, obesi (BMI &gt;30), anziani (&gt;55 anni).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Allegato IV); UNI EN ISO 7243 (WBGT); UNI EN ISO 7730 (PMV/PPD); UNI EN ISO 11079 (IREQ freddo); UNI EN 342/14058 (DPI freddo); Linee guida INAIL "Microclima" (2018); Progetto Worklimate.</p>
                `
            },
            // ------------------------------------------
            // 4.1 - Rumore
            // ------------------------------------------
            {
                title: "Rumore",
                level: "medio",
                shortDesc: "Esposizione a livelli sonori elevati da carrelli, macchinari, nastri trasportatori e operazioni di carico.",
                cause: `
                    <p>L'inquinamento acustico in magazzino è generato da molteplici sorgenti simultanee:</p>
                    <ul>
                        <li>Carrelli elevatori: motore (75-85 dB), clacson/avvisatore acustico di retromarcia (85-100 dB), rumore rotolamento su pavimento irregolare.</li>
                        <li>Nastri trasportatori e rulliere: 70-85 dB in funzione; picchi da impatto colli sui rulli.</li>
                        <li>Operazioni di carico/scarico: impatto pallet su pavimento (picchi 95-110 dB), scarico materiali metallici, rotolamento cassoni.</li>
                        <li>Reggiatura e filmatura: reggiatrici pneumatiche (85-95 dB), filmatrici rotanti.</li>
                        <li>Impianti di ventilazione/condizionamento: ventilatori, compressori, UTA non insonorizzate (70-80 dB continui).</li>
                        <li>Ambienti riverberanti: superfici riflettenti (cemento, metallo, scaffalature) che amplificano il livello sonoro di 3-6 dB; assenza trattamento fonoassorbente.</li>
                    </ul>
                `,
                danni: `
                    <p>L'esposizione al rumore causa danni uditivi irreversibili e effetti extra-uditivi sistemici:</p>
                    <ul>
                        <li><strong>Ipoacusia da rumore (noise-induced hearing loss):</strong>
                            <ul>
                                <li>Danno neurosensoriale cocleare irreversibile; distruzione delle cellule ciliate esterne dell'organo di Corti.</li>
                                <li>Pattern audiometrico tipico: scotoma (encoche) a 4000 Hz, poi estensione a 3000-6000 Hz, infine compromissione frequenze conversazionali (500-2000 Hz).</li>
                                <li>LEX,8h &gt;80 dB(A): rischio iniziale; &gt;85 dB(A): rischio significativo (obbligo DPI + sorveglianza); &gt;87 dB(A): valore limite di esposizione da non superare MAI.</li>
                                <li>Malattia professionale tabellata (DPR 1124/1965, aggiornamento 2008): la più denunciata in Italia.</li>
                            </ul>
                        </li>
                        <li><strong>Acufeni:</strong> Percezione soggettiva di fischi/ronzii permanenti; prevalenza 15-30% negli esposti; impatto severo su qualità di vita e salute mentale.</li>
                        <li><strong>Effetti extra-uditivi:</strong>
                            <ul>
                                <li>Cardiovascolari: ipertensione (+10-15% rischio per LEX &gt;80 dB), tachicardia, vasocostrizione periferica, aumento rischio infarto (+20% per esposizioni croniche &gt;85 dB).</li>
                                <li>Endocrini: ipercortisolemia cronica da stress acustico, alterazione asse HPA.</li>
                                <li>Neurologici: disturbi del sonno, riduzione concentrazione (-15% performance cognitiva a 80 dB), irritabilità, ansia, depressione.</li>
                                <li>Digestivi: gastrite, dispepsia, alterazioni peristalsi da attivazione simpatica cronica.</li>
                            </ul>
                        </li>
                        <li><strong>Rischio indiretto:</strong> Mascheramento di segnali acustici di allarme (clacson, allarmi, voci) → aumento rischio incidenti.</li>
                    </ul>
                `,
                prevenzione: `
                    <p><strong>Misure preventive (Titolo VIII, Capo II D.Lgs. 81/2008 - Art. 189-198):</strong></p>
                    <ul>
                        <li><strong>Valutazione (Art. 190):</strong> Fonometria con misure LAeq e LCpeak secondo UNI EN ISO 9612; mappatura acustica del magazzino; ricalcolo ad ogni variazione layout/attrezzature.</li>
                        <li><strong>Riduzione alla sorgente:</strong> Manutenzione preventiva mezzi (cuscinetti, silenziatori); carrelli elettrici (15-20 dB più silenziosi di diesel); avvisatori luminosi al posto di clacson dove possibile; nastri trasportatori con rulli in gomma.</li>
                        <li><strong>Trattamento acustico ambientale:</strong> Pannelli fonoassorbenti su pareti e soffitto (classe A, αw &ge;0,90); barriere acustiche tra zone rumorose e uffici; pavimenti antivibranti in gomma nelle aree macchinari.</li>
                        <li><strong>Organizzazione:</strong> Riduzione tempi di esposizione (rotazione mansioni); zone di riposo acustico (&lt;65 dB); separazione fisica aree rumorose/silenziose.</li>
                        <li><strong>Limiti normativi (Art. 189):</strong>
                            <ul>
                                <li>Valore inferiore d'azione: LEX,8h = 80 dB(A) / LCpeak = 135 dB(C) → informazione, DPI disponibili.</li>
                                <li>Valore superiore d'azione: LEX,8h = 85 dB(A) / LCpeak = 137 dB(C) → obbligo DPI, sorveglianza, segnaletica.</li>
                                <li>Valore limite: LEX,8h = 87 dB(A) / LCpeak = 140 dB(C) → mai superabile (con DPI indossati).</li>
                            </ul>
                        </li>
                    </ul>
                `,
                protezione: `
                    <p><strong>Misure di protezione:</strong></p>
                    <ul>
                        <li><strong>DPI uditivi:</strong> Inserti auricolari monouso (SNR 25-35 dB) per esposizioni brevi; cuffie antirumore (UNI EN 352-1, SNR 25-35 dB) per esposizioni prolungate; protettori attivi (elettronici) per chi deve comunicare; selezione con metodo SNR/HML/Octave Band secondo UNI EN ISO 4869-2.</li>
                        <li><strong>Segnaletica:</strong> Cartelli "obbligo protezione udito" (UNI EN ISO 7010 M003) all'ingresso di zone &gt;85 dB(A); delimitazione aree con pavimento colorato.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 196):</strong> Audiometria tonale liminare preventiva e periodica (annuale se LEX &gt;85 dB; biennale se 80-85 dB); eseguita in cabina silente o con audiometro in ambiente &lt;35 dB; confronto con baseline per identificare shift temporanei (TTS) o permanenti (PTS).</li>
                        <li><strong>Formazione (Art. 195):</strong> Uso corretto DPI (inserimento tappi, regolazione cuffie); significato valori di esposizione; riconoscimento sintomi precoci (acufeni post-turno, sensazione ovattamento); importanza compliance DPI (anche 2 minuti senza protezione in 8h riducono attenuazione effettiva del 25%).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Titolo VIII, Capo II, Art. 187-198); UNI EN ISO 9612:2011 (misure esposizione); UNI EN ISO 4869 (selezione DPI); UNI EN 352 (requisiti DPI uditivi); Linee guida ISPESL/INAIL "Rumore" (aggiornamento 2012).</p>
                `
            }
        ]
    },
           

    // ============================================== //
    // CATEGORIA 5: RISCHI ORGANIZZATIVI E PSICOSOCIALI //
    // ============================================== //
    {
        name: "Rischi Organizzativi e Psicosociali",
        risks: [
            // ------------------------------------------
            // 5.0 - Stress lavoro-correlato
            // ------------------------------------------
            {
                title: "Stress lavoro-correlato",
                level: "medio",
                shortDesc: "Disagio psicofisico derivante da ritmi intensi, pressione su tempi, turni e scarsa autonomia tipici della logistica.",
                cause: `
                    <p>Lo stress lavoro-correlato nella logistica e nei magazzini è determinato da molteplici fattori organizzativi concatenati:</p>
                    <ul>
                        <li>Ritmi di lavoro imposti da sistemi di gestione automatizzati (WMS - Warehouse Management System) che assegnano compiti con tempi predefiniti e monitorano in tempo reale la produttività individuale (pick rate, items/hour).</li>
                        <li>Picchi stagionali (Black Friday, Natale, saldi) con aumento improvviso dei volumi fino al 300-400%, richiesta di straordinari obbligatori, assunzioni temporanee con necessità di affiancamento.</li>
                        <li>Turni irregolari e notturni che alterano il ritmo circadiano; rotazione rapida (es. mattina-notte-pomeriggio) più dannosa della rotazione lenta; difficoltà di conciliazione vita-lavoro.</li>
                        <li>Scarsa autonomia decisionale: lavoratore esecutore di istruzioni generate dal sistema, impossibilità di modulare il proprio ritmo, percorso di picking imposto dall'algoritmo di ottimizzazione.</li>
                        <li>Monotonia e ripetitività delle mansioni (picking, packing, scanning) per l'intero turno; assenza di job rotation; sottoutilizzo delle competenze personali.</li>
                        <li>Precarietà contrattuale: elevato utilizzo di contratti a tempo determinato, somministrazione, cooperative; incertezza sul rinnovo; minore potere contrattuale del lavoratore.</li>
                        <li>Pressione gerarchica esplicita o implicita sulla produttività; classifiche comparative tra lavoratori; feedback prevalentemente negativo; management orientato esclusivamente ai KPI quantitativi.</li>
                        <li>Ambiente fisico sfavorevole (rumore, temperatura, illuminazione scadente) come co-fattore di stress; impossibilità di pause in ambiente confortevole.</li>
                    </ul>
                `,
                danni: `
                    <p>Lo stress cronico produce effetti su molteplici sistemi dell'organismo attraverso l'attivazione prolungata dell'asse ipotalamo-ipofisi-surrene (HPA) e del sistema simpatico:</p>
                    <ul>
                        <li><strong>Disturbi psicologici:</strong> Sindrome da burnout (esaurimento emotivo, depersonalizzazione, ridotta realizzazione personale - scala MBI); ansia generalizzata; depressione (rischio aumentato del 50-80% nei lavoratori con alto strain secondo modello Karasek); disturbi del sonno (insonnia iniziale e terminale, sonno non ristoratore); irritabilità e conflittualità relazionale.</li>
                        <li><strong>Disturbi cardiovascolari:</strong> Ipertensione arteriosa (aumento 20-30% rischio relativo); cardiopatia ischemica (meta-analisi Kivimäki 2012: RR 1.23 per job strain); aritmie; aumento aggregabilità piastrinica e livelli di fibrinogeno con rischio trombotico.</li>
                        <li><strong>Disturbi muscoloscheletrici:</strong> Lo stress amplifica la percezione del dolore e aumenta la tensione muscolare; correlazione dimostrata tra job strain e lombalgia cronica (OR 1.4-2.0); cervicalgia da contrattura muscoli trapezio e elevatore della scapola.</li>
                        <li><strong>Disturbi gastrointestinali:</strong> Sindrome dell'intestino irritabile (IBS); dispepsia funzionale; gastrite/ulcera peptica (lo stress è co-fattore insieme a H. pylori e FANS); alterazione del microbiota intestinale.</li>
                        <li><strong>Disturbi immunitari:</strong> Il cortisolo cronicamente elevato sopprime la risposta immunitaria; aumento frequenza infezioni respiratorie (30-40%); rallentamento guarigione ferite; possibile ruolo nella progressione di patologie autoimmuni.</li>
                        <li><strong>Comportamenti a rischio:</strong> Aumento consumo alcol, fumo, comfort food; riduzione attività fisica; abuso di farmaci (analgesici, benzodiazepine); assenteismo e presenteismo (presenza al lavoro ma con produttività ridotta del 30-50%).</li>
                        <li><strong>Impatto organizzativo:</strong> Aumento infortuni (la fatica mentale riduce l'attenzione); turnover elevato (costi di sostituzione stimati 50-200% dello stipendio annuo); clima lavorativo deteriorato con effetto contagio dello stress.</li>
                    </ul>
                `,
                prevenzione: `
                    <p>La valutazione e gestione dello stress lavoro-correlato è obbligo del datore di lavoro (Art. 28 D.Lgs. 81/2008, Accordo Quadro Europeo 2004):</p>
                    <ul>
                        <li><strong>Valutazione del rischio (metodologia INAIL):</strong> Fase preliminare con indicatori oggettivi (indici infortunistici, assenteismo, turnover, provvedimenti disciplinari, segnalazioni MC); se rischio non irrilevante, fase approfondita con strumenti soggettivi (questionario-strumento indicatore INAIL, HSE Indicator Tool, Karasek JCQ); coinvolgimento di RLS e lavoratori.</li>
                        <li><strong>Interventi organizzativi (prevenzione primaria):</strong> Revisione carichi di lavoro con tempi realistici (studio tempi e metodi partecipato); job rotation sistematica tra mansioni diverse; aumento margini di autonomia (possibilità di auto-organizzare parte del lavoro); pause adeguate (15 min ogni 2 ore come minimo); regolarizzazione turni con rotazione in senso orario (mattina→pomeriggio→notte).</li>
                        <li><strong>Formazione management:</strong> Leadership positiva; tecniche di feedback costruttivo; gestione dei conflitti; riconoscimento dei segnali di disagio nei collaboratori; eliminazione pratiche di ranking comparativo e pressione implicita.</li>
                        <li><strong>Supporto psicologico (prevenzione secondaria):</strong> Sportello di ascolto aziendale con psicologo del lavoro; Programmi di Assistenza ai Dipendenti (EAP); gruppi di supporto tra pari; numero verde anonimo per segnalazioni di disagio.</li>
                        <li><strong>Contrasto alla precarietà:</strong> Stabilizzazione contrattuale dove possibile; percorsi di crescita professionale chiari; formazione continua come investimento sul lavoratore; comunicazione trasparente su prospettive aziendali.</li>
                        <li><strong>Miglioramento ambiente fisico:</strong> Aree break confortevoli (separate dall'area lavoro, con luce naturale, sedute ergonomiche); distributori acqua/bevande calde gratuiti; microclima adeguato; riduzione rumore nelle aree operative.</li>
                        <li><strong>Monitoraggio continuo:</strong> Ripetizione valutazione stress ogni 2 anni (o dopo cambiamenti organizzativi significativi); indicatori di outcome (variazione assenteismo, infortuni, richieste visite MC straordinarie); audit periodici sul clima organizzativo.</li>
                    </ul>
                `,
                protezione: `
                    <p>Per lo stress lavoro-correlato non esistono DPI fisici, ma misure di protezione individuale di tipo organizzativo e supportivo:</p>
                    <ul>
                        <li><strong>Sorveglianza sanitaria (Art. 41):</strong> Il MC valuta lo stato di salute psicofisica; colloquio clinico mirato a identificare sintomi stress-correlati; questionari validati (GHQ-12, PHQ-9 per depressione, GAD-7 per ansia); valutazione qualità del sonno (Pittsburgh Sleep Quality Index); idoneità con prescrizioni (es. esenzione turno notturno, limitazione straordinari).</li>
                        <li><strong>Formazione individuale (empowerment):</strong> Tecniche di gestione dello stress (rilassamento muscolare progressivo di Jacobson, mindfulness-based stress reduction MBSR); time management; comunicazione assertiva; riconoscimento dei propri limiti e capacità di dire no.</li>
                        <li><strong>Promozione stili di vita salutari:</strong> Convenzioni con palestre/centri sportivi; programmi di disassuefazione dal fumo; educazione alimentare (gestione comfort eating); informazione sui rischi dell'abuso di alcol e farmaci.</li>
                        <li><strong>Ergonomia cognitiva:</strong> Interfacce WMS semplificate e intuitive; riduzione sovraccarico informativo (information overload); segnaletica chiara per ridurre incertezza decisionale; procedure scritte accessibili per ridurre ansia da errore.</li>
                        <li><strong>Rete di supporto:</strong> Identificazione di "sentinelle" formate tra colleghi per riconoscere segnali di disagio; cultura aziendale non stigmatizzante verso il disagio psicologico; facilitazione accesso ai servizi territoriali di salute mentale (CPS, consultori).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 28 comma 1-bis); Accordo Quadro Europeo sullo stress lavoro-correlato (8/10/2004, recepito Accordo Interconfederale 9/6/2008); Circolare Ministero Lavoro 18/11/2010 (indicazioni metodologiche); Manuale INAIL "Valutazione e gestione del rischio stress lavoro-correlato" (edizione 2017); Modello Karasek-Theorell (Job Demand-Control-Support); Modello Siegrist (Effort-Reward Imbalance); NIOSH "Stress at Work" (Publication 99-101).</p>
                `
            },

            // ------------------------------------------
            // 5.1 - Lavoro notturno e a turni
            // ------------------------------------------
            {
                title: "Lavoro notturno e a turni",
                level: "medio",
                shortDesc: "Effetti sulla salute derivanti dall'alterazione dei ritmi circadiani per lavoro su turni e in orario notturno.",
                cause: `
                    <p>Il lavoro a turni e notturno è strutturale nella logistica moderna che opera su cicli 24/7:</p>
                    <ul>
                        <li>Turni notturni fissi o a rotazione che coprono la fascia 22:00-06:00 (definizione Art. 1 D.Lgs. 66/2003: lavoratore notturno = almeno 3 ore nel periodo notturno per 80+ giorni/anno).</li>
                        <li>Schemi di turnazione rapida (cambi ogni 2-3 giorni) che non permettono l'adattamento dei ritmi circadiani; rotazione antioraria (notte→pomeriggio→mattina) particolarmente disturbante.</li>
                        <li>Straordinari frequenti che si sommano al turno, con periodi di riposo insufficienti; violazione del riposo minimo di 11 ore consecutive (Art. 7 D.Lgs. 66/2003).</li>
                        <li>Turni spezzati con lunghe pause intermedie che prolungano la permanenza fuori casa senza vero riposo.</li>
                        <li>Esposizione a luce artificiale durante la notte e carenza di luce naturale che sopprimono la produzione di melatonina (ormone regolatore del ciclo sonno-veglia, prodotto dalla ghiandola pineale in risposta al buio).</li>
                        <li>Difficoltà nel mantenere una regolarità dei pasti; accesso limitato a cibo sano durante i turni notturni (distributori automatici, mense chiuse); tendenza a cibi ipercalorici e bevande caffeinate.</li>
                    </ul>
                `,
                danni: `
                    <p>La IARC (2019) ha classificato il lavoro notturno con alterazione circadiana come "probabilmente cancerogeno per l'uomo" (Gruppo 2A):</p>
                    <ul>
                        <li><strong>Disturbi del sonno:</strong> Sindrome da turnismo (Shift Work Sleep Disorder - SWSD): insonnia quando si deve dormire di giorno, sonnolenza eccessiva durante il turno; riduzione durata sonno di 1-4 ore per ciclo; architettura del sonno alterata (riduzione sonno REM e stadi profondi N3); debito di sonno cumulativo con effetti cognitivi paragonabili all'intossicazione alcolica (17h svegli = 0.5‰ BAC).</li>
                        <li><strong>Effetti metabolici:</strong> Aumento rischio diabete tipo 2 (RR 1.09 per ogni 5 anni di turni notturni); sindrome metabolica (prevalenza 1.5x rispetto a lavoratori diurni); obesità (alterazione leptina/grelina con aumento appetito); dislipidemia.</li>
                        <li><strong>Effetti cardiovascolari:</strong> Aumento rischio infarto miocardico (RR 1.23 per turnisti); ictus (RR 1.05); ipertensione; la desincronizzazione circadiana altera il profilo pressorio (perdita del fisiologico calo notturno - pattern non-dipper).</li>
                        <li><strong>Effetti oncologici:</strong> Aumento rischio tumore mammario (RR 1.08-1.36 in meta-analisi); possibile aumento rischio tumore prostatico, colorettale; meccanismo: soppressione melatonina (azione antiossidante, immunomodulante, oncosoppressiva) e alterazione orologio molecolare cellulare (geni CLOCK, BMAL1, PER, CRY).</li>
                        <li><strong>Effetti riproduttivi:</strong> Nelle donne: irregolarità mestruali, dismenorrea, endometriosi, aumento rischio aborto spontaneo e parto pretermine; negli uomini: riduzione testosterone e qualità del liquido seminale.</li>
                        <li><strong>Effetti psicologici:</strong> Depressione (prevalenza 1.4x); ansia; isolamento sociale (sfasamento rispetto a famiglia e rete sociale); abuso di sostanze (alcol per favorire il sonno, caffeina/stimolanti per la veglia).</li>
                        <li><strong>Aumento infortuni:</strong> Rischio relativo di errore/infortunio: 1.0 turno mattina, 1.15 turno pomeriggio, 1.28 turno notte, 1.36 nelle ultime ore del turno notturno; effetto cumulativo nelle notti consecutive (3° notte: RR 1.45).</li>
                    </ul>
                `,
                prevenzione: `
                    <p>La prevenzione richiede interventi sulla programmazione dei turni e misure compensative:</p>
                    <ul>
                        <li><strong>Progettazione turni ergonomica:</strong> Rotazione in senso orario (mattina→pomeriggio→notte) per assecondare la tendenza naturale al ritardo di fase; cicli di rotazione lenti (3-4 giorni per turno) o molto rapidi (1-2 giorni) preferibili a rotazione media; limitare notti consecutive a massimo 3-4; giorno di riposo dopo serie notturna; durata turno notturno ≤8 ore (evitare turni da 10-12 ore di notte).</li>
                        <li><strong>Gestione della luce:</strong> Illuminazione brillante (&ge;1000 lux, luce bianca fredda 5000-6500K) durante il turno notturno per promuovere vigilanza; occhiali con filtro luce blu dopo il turno per favorire produzione melatonina; ambiente domestico di sonno completamente oscurato (blackout curtains); light therapy box per accelerare adattamento circadiano.</li>
                        <li><strong>Nap strategici:</strong> Power nap di 20-30 minuti durante la pausa del turno notturno (riduce sonnolenza del 50% e infortuni); nap preventivo prima del turno notturno (2 ore nel tardo pomeriggio); spazio dedicato e confortevole (letto/reclinabile, buio, silenzio).</li>
                        <li><strong>Alimentazione:</strong> Pasto principale prima del turno notturno; spuntino leggero a metà turno (evitare pasti pesanti tra le 00:00 e le 06:00 quando la motilità gastrica è minima); evitare caffeina nelle ultime 4 ore del turno; mensa/microonde disponibili con opzioni salutari anche di notte.</li>
                        <li><strong>Sorveglianza sanitaria (Art. 14 D.Lgs. 66/2003):</strong> Visita preventiva e periodica (almeno biennale, annuale dopo i 50 anni) per lavoratori notturni; valutazione cardiovascolare (ECG, profilo lipidico, glicemia); screening disturbi del sonno (Epworth Sleepiness Scale, diario del sonno); valutazione psicologica; monitoraggio BMI e sindrome metabolica; inidoneità al turno notturno per: epilessia non controllata, cardiopatia ischemica, diabete insulino-dipendente instabile, disturbi psichiatrici gravi, gravidanza.</li>
                        <li><strong>Diritti e tutele (D.Lgs. 66/2003):</strong> Esonero facoltativo per madri con figlio &lt;3 anni, genitore unico con figlio &lt;12 anni, lavoratore con familiare disabile convivente; trasferimento al lavoro diurno su richiesta documentata dal MC; informazione a RLS sulla programmazione turni.</li>
                    </ul>
                `,
                protezione: `
                    <p>Misure di protezione individuale specifiche per il lavoro notturno:</p>
                    <ul>
                        <li><strong>DPI ad alta visibilità:</strong> Indumenti Classe 3 (EN ISO 20471) obbligatori per turni notturni con movimentazione mezzi; colori fluorescenti + bande retroriflettenti; gilet, giacche o tute intere a seconda dell'ambiente.</li>
                        <li><strong>Illuminazione individuale:</strong> Torce frontali a LED (per ispezioni scaffalature, zone poco illuminate); illuminazione supplementare portatile per aree di lavoro temporanee.</li>
                        <li><strong>Gestione della fatica:</strong> Dispositivi anti-sonnolenza (sensori di vigilanza) per operatori di mezzi; sistema buddy (lavoro in coppia durante le ore a maggior rischio 03:00-06:00); check-list di autovalutazione sonnolenza a inizio turno.</li>
                        <li><strong>Integrazione melatonina:</strong> Su indicazione del MC, melatonina esogena (0.5-5 mg) 30-60 minuti prima del sonno diurno può facilitare l'adattamento; non è un DPI ma una misura di supporto individuale da valutare caso per caso.</li>
                        <li><strong>Comunicazione emergenze:</strong> Telefoni/radio sempre raggiungibili; sistema uomo-a-terra (man-down) per lavoratori isolati nel turno notturno; procedura di verifica periodica della presenza (check-in ogni 30-60 minuti).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 66/2003 (Art. 11-15 "Lavoro notturno"); D.Lgs. 81/2008 (Art. 28, valutazione tutti i rischi incluso lavoro notturno); IARC Monograph Vol. 124 (2019) "Night Shift Work"; Linee guida SIML "Sorveglianza sanitaria lavoratori turnisti/notturni" (2013); Direttiva 2003/88/CE (organizzazione orario di lavoro); NIOSH "Interim NIOSH Training for Shift Workers" (2020); Linee guida ICOH "Night and Shift Work" (2018).</p>
                `
            },

            // ------------------------------------------
            // 5.2 - Lavoro isolato
            // ------------------------------------------
            {
                title: "Lavoro isolato",
                level: "medio",
                shortDesc: "Rischi aggiuntivi per lavoratori che operano da soli in aree remote del magazzino senza supervisione diretta.",
                cause: `
                    <p>Il lavoro isolato in magazzino espone a rischi specifici legati all'impossibilità di ricevere soccorso immediato:</p>
                    <ul>
                        <li>Operazioni in aree remote o poco frequentate: magazzini periferici, piani interrati, soppalchi, celle frigorifere, zone di stoccaggio temporaneo esterne.</li>
                        <li>Turni notturni o festivi con organico ridotto; un solo lavoratore per edificio o sezione; distanza dai colleghi e dal punto di primo soccorso.</li>
                        <li>Attività di inventario, riorganizzazione scaffali, manutenzione in zone normalmente non presidiate.</li>
                        <li>Assenza di sistemi di comunicazione affidabili (zone senza copertura radio/cellulare, capannoni schermati).</li>
                        <li>Mancanza di protocolli specifici per il lavoro solitario: nessun sistema di check-in periodico, nessun dispositivo uomo-a-terra, nessuna procedura di verifica.</li>
                        <li>Condizioni che aumentano il rischio di malore improvviso: temperature estreme (celle frigo -25°C), sforzo fisico intenso, patologie preesistenti non note.</li>
                    </ul>
                `,
                danni: `
                    <p>Il lavoro isolato di per sé non causa danni specifici, ma amplifica gravemente le conseguenze di qualsiasi emergenza:</p>
                    <ul>
                        <li><strong>Ritardo nei soccorsi:</strong> Un infortunio che normalmente richiederebbe un intervento di primo soccorso di pochi minuti può diventare mortale se il lavoratore non viene trovato per ore; la golden hour (prima ora dopo un trauma grave) è il periodo in cui il trattamento è più efficace.</li>
                        <li><strong>Malori improvvisi:</strong> Arresto cardiaco (sopravvivenza diminuisce del 7-10% per ogni minuto senza defibrillazione); ictus (ogni minuto perso = 1.9 milioni di neuroni distrutti); crisi ipoglicemica grave (coma in 20-30 minuti); colpo di calore (danno d'organo irreversibile se temperatura corporea &gt;40°C per oltre 30 minuti).</li>
                        <li><strong>Intrappolamento:</strong> In celle frigorifere con porta bloccata (rischio ipotermia mortale in 60-90 minuti a -25°C); sotto scaffalature crollate; in vani ascensore/montacarichi bloccati; impossibilità di chiedere aiuto se privo di sensi o immobilizzato.</li>
                        <li><strong>Effetti psicologici:</strong> Ansia e stress da isolamento; timore di non essere soccorsi; riduzione della vigilanza per monotonia e assenza di interazione sociale; sensazione di abbandono e demotivazione.</li>
                        <li><strong>Aggressioni:</strong> Lavoratore isolato è più vulnerabile a tentativi di rapina, intrusione, violenza da parte di estranei, soprattutto in turni notturni e in sedi isolate.</li>
                    </ul>
                `,
                prevenzione: `
                    <p>La prevenzione del rischio da lavoro isolato richiede misure organizzative e tecnologiche integrate:</p>
                    <ul>
                        <li><strong>Valutazione specifica:</strong> Identificazione di tutte le situazioni di lavoro isolato (mappatura aree, turni, mansioni); classificazione del rischio associato (combinazione rischio base + fattore di isolamento); definizione di procedure specifiche per ogni scenario.</li>
                        <li><strong>Eliminazione/riduzione:</strong> Dove possibile, evitare il lavoro solitario assegnando almeno due persone; se inevitabile, minimizzare la durata; escludere dal lavoro isolato le attività ad alto rischio intrinseco (lavori in quota, spazi confinati, uso carrelli).</li>
                        <li><strong>Sistemi di comunicazione:</strong> Copertura radio/cellulare garantita in tutte le aree (ripetitori interni se necessario); telefoni DECT o radio con tasto SOS; sistema di check-in a intervalli regolari (ogni 30-60 minuti) con allarme automatico se non confermato.</li>
                        <li><strong>Dispositivi uomo-a-terra (man-down):</strong> Dispositivi indossabili con sensori di posizione/movimento che rilevano caduta, immobilità prolungata (&gt;30-60 secondi), mancata verticalità; invio automatico allarme con coordinate GPS/indoor positioning alla centrale operativa; test funzionalità quotidiano.</li>
                        <li><strong>Celle frigorifere:</strong> Apertura d'emergenza SEMPRE funzionante dall'interno (verifica settimanale documentata); allarme interno azionabile manualmente; campanello/pulsante SOS collegato all'esterno; indumenti termici adeguati con autonomia termica &gt;2 ore; cartello esterno con nome e orario ingresso del lavoratore.</li>
                        <li><strong>Videosorveglianza:</strong> Telecamere in aree critiche con monitoraggio da portineria/centrale operativa (nel rispetto della normativa privacy - Art. 4 Statuto Lavoratori e GDPR); sistema di rilevamento automatico anomalie (persona a terra, immobilità).</li>
                        <li><strong>Sorveglianza sanitaria rafforzata:</strong> Idoneità specifica per lavoro isolato; esclusione soggetti con epilessia non controllata, cardiopatie severe, diabete instabile, disturbi psichiatrici, claustrofobia (per celle frigo); valutazione capacità di auto-soccorso.</li>
                    </ul>
                `,
                protezione: `
                    <p>Dispositivi e misure di protezione individuale per lavoratori isolati:</p>
                    <ul>
                        <li><strong>Dispositivo uomo-a-terra (DPI elettronico):</strong> Da indossare sempre durante il lavoro isolato; modelli: dedicati (es. Twig, Emerit) o app su smartphone con sensori; funzioni: allarme caduta, immobilità, SOS manuale, GPS, comunicazione bidirezionale; autonomia batteria &ge;12 ore; resistenza IP67 (polvere/acqua).</li>
                        <li><strong>Kit emergenza personale:</strong> Fischietto di sicurezza (segnalazione acustica senza batteria); torcia LED con funzione strobo (segnalazione visiva); coperta isotermica di emergenza (celle frigo); mini kit primo soccorso tascabile.</li>
                        <li><strong>DPI termici per celle frigorifere:</strong> Completo termico certificato (EN 342 per ambienti &le;-5°C): giacca, pantaloni, sottotuta; guanti termici (EN 511) con classificazione contatto freddo; stivali isolanti (EN ISO 20345 + EN ISO 20349 CI); passamontagna o balaclava; tutto dimensionato per consentire movimento libero e capacità di azionare apertura d'emergenza.</li>
                        <li><strong>Comunicatore radio/DECT:</strong> Assegnato personalmente; canale dedicato emergenze; test comunicazione a inizio turno; batteria di riserva carica disponibile.</li>
                        <li><strong>Formazione specifica:</strong> Procedure di auto-soccorso; uso di tutti i dispositivi di allarme; simulazioni periodiche (almeno semestrali) di emergenza in lavoro isolato; tecniche di primo soccorso applicabili su sé stessi (posizione di sicurezza, compressione ferita emorragica).</li>
                    </ul>
                `,
                fonti: `
                    <p>D.Lgs. 81/2008 (Art. 15 comma 1 lett. a "valutazione di tutti i rischi"; Art. 18 comma 1 lett. h "emergenze"; Art. 43-46 "gestione emergenze"); EN 342 (indumenti protezione freddo); EN 511 (guanti protezione freddo); ISO 15743 (ergonomia ambienti freddi); BS 8484:2016 (servizi lone worker - standard britannico di riferimento); Linee guida HSE UK "Working alone" (INDG73, aggiornamento 2020); UNI EN ISO 11079 (valutazione stress termico da freddo).</p>
                `
            }
        ]
    }
