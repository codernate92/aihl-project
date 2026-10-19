// MAESTRO4IHL research content. Scenario scores are qualitative judgments,
// not empirical measurements or findings of legal responsibility.

export const LAYERS = [
  {id:'L1', name:'Foundation Models', sub:'The models that generate synthetic video, images, documents, or audio.'},
  {id:'L2', name:'Data Operations', sub:'Source recordings and prisoner records: how they are collected, stored, used, and traced.'},
  {id:'L3', name:'Agent Frameworks', sub:'The tools and automation that coordinate generation and attempts to bypass safeguards.'},
  {id:'L4', name:'Deployment Infrastructure', sub:'The computing resources and channels used to deliver and distribute the material.'},
  {id:'L5', name:'Evaluation & Observability', sub:'Evidence of origin, audit logs, and checks on whether humanitarian protections hold.'},
  {id:'L6', name:'Security & Compliance', sub:'Protections under the Third Geneva Convention and customary international humanitarian law.'},
  {id:'L7', name:'Agent Ecosystem', sub:'The people and institutions involved: prisoners, families, states, humanitarian bodies, and platforms.'},
];

export const LNAME = Object.fromEntries(LAYERS.map(layer => [layer.id, layer.name]));

export const ADAPTATIONS = [
  {layer:'L5', name:'Measure protection',
    maestro:'Assess agent behavior and technical performance, including accuracy, latency, and reliability.',
    x:'Assess whether a prisoner’s status can be verified, contact maintained, and records trusted through release and return. Use relevant legal protections to guide the evaluation.',
    why:'A system can perform well by technical measures while the people whose information it handles are harmed.'},
  {layer:'L7', name:'Include the people affected',
    maestro:'Identify the agents, services, and people around a deployed system.',
    x:'Include prisoners, families, the ICRC, National Information Bureaux, and the Central Tracing Agency, even when they have no access to the AI system.',
    why:'The Convention’s provisions on notification, correspondence, and information services concern people and institutions well beyond the system’s operators.'},
  {layer:'L7', name:'Account for armed conflict',
    maestro:'Identify adversaries within and outside the system.',
    x:'Consider states and organized armed groups as potential producers and distributors of synthetic media, alongside individual attackers.',
    why:'Resources, incentives, and avenues for accountability differ when a party to a conflict controls the tools and the information.'},
  {layer:'—', name:'Follow the whole period of captivity',
    maestro:'Analyze threats across the design, operation, and observation of a deployment.',
    x:'Follow the person from capture through internment, monitoring, release, and reintegration. Include later claims that depend on the record.',
    why:'A false entry at registration can affect tracing, correspondence, repatriation, and claims long after the original system stops being used.'},
  {layer:'L6', name:'Start with humanitarian protections',
    maestro:'Identify security controls and applicable regulatory requirements.',
    x:'Use the Third Geneva Convention and relevant customary rules to identify what must be protected. The source analysis considers GCIII Articles 13, 17, 70–71, 76, and 122–123, and customary Rules 90, 99, 105, and 123.',
    why:'The protection at stake should shape the threat analysis from the beginning. Which rules apply requires a separate legal assessment.'},
  {layer:'L2', name:'Include damage to trust',
    maestro:'Examine how data is collected, stored, retrieved, and traced to its source.',
    x:'Consider both fabricated material and the doubt that plausible fabrication casts on genuine evidence.',
    why:'The possibility of a convincing fake can make a real record easier to deny. This is often called the “liar’s dividend.”'},
];

export const STEPS = [
  {n:1, key:'decomposition', name:'Map the system', mode:'NEUTRAL', blurb:'Identify what each of the seven layers contains in this case.'},
  {n:2, key:'threats', name:'Identify the threats', mode:'THREAT', blurb:'Describe the threat at each layer and make an explicit, qualitative judgment about its severity.'},
  {n:3, key:'crossLayer', name:'Follow the harm', mode:'CHAIN', blurb:'Trace how failures connect, from generation to the people and records affected.'},
  {n:4, key:'priority', name:'Set priorities', mode:'PRIORITY', blurb:'Choose which risks to the individual and to the wider protection system need attention first.'},
  {n:5, key:'mitigation', name:'Choose safeguards', mode:'MITIGATE', blurb:'Identify technical and institutional measures, and who can put them in place.'},
  {n:6, key:'monitoring', name:'Review and maintain', mode:'LOOP', blurb:'Test safeguards over time, combine automated checks with expert review, and share findings.'},
];

export const PIPELINE = [
  {idx:'01', stage:'Capture', sub:'Identity and circumstances enter the record.',
    info:['Name, aliases, rank, and service number','Unit or formation','Date and time of capture','Location and circumstances','Capturing unit','Physical description','Initial interrogation record, where present','Recorded status or category']},
  {idx:'02', stage:'Internment', sub:'Records follow the prisoner into detention.',
    info:['Camp or compound assignment','Arrival date and internment number','Room, barrack, or block','Work assignment','Recorded clearance or privileges','Health and medical records','Disciplinary records','Transfer dates and locations']},
  {idx:'03', stage:'Monitoring & Correspondence', sub:'Records and messages carry information outward.',
    info:['Roll calls and presence records','Conduct and work reports','Visits and interviews','Red Cross messages sent and received','Letters: dates, correspondents, and language','Censorship decisions','Packages received','Health updates']},
  {idx:'04', stage:'Repatriation', sub:'Information supports release and return.',
    info:['Release date','Place or port of repatriation','Transport arrangements','Destination','Final camp of internment','Health and welfare on release','Personal effects returned','Debriefing record, where present']},
  {idx:'05', stage:'Reparation', sub:'The record supports claims after captivity.',
    info:['Evidence of captivity: dates, camps, and authorities','Duration of internment','Labor or service records','Losses and damages claimed','Entitlements assessed','Payments or compensation','Certificates and supporting documents','Case outcomes']},
];

export const SCENARIOS = [
  {
    sx:'Hypothetical case 01', title:'A prisoner made to praise their captors',
    entitlement:'Protection from public curiosity', articles:['GCIII Art. 13'],
    summary:'A detaining state records a prisoner answering routine questions. A state unit alters the footage so the prisoner appears to praise their captors and condemn their own country. The fabricated video spreads through news and social media. This hypothetical case examines the threat to the prisoner’s dignity and the effect on families, institutions, and the public record.',
    decomposition:{
      L1:'A general-purpose model capable of generating convincing video.',
      L2:'An authentic recording or photograph of the prisoner used to create the fabrication.',
      L3:'Tools and techniques used to coordinate generation and evade safeguards.',
      L4:'The computing resources, accounts, and channels used to distribute the video.',
      L5:'Records of origin, handling, and alteration, together with generation and distribution logs.',
      L6:'Protections concerning a prisoner’s dignity and exposure to public curiosity.',
      L7:'The prisoner, family, home and detaining states, ICRC, news organizations, social platforms, and audiences.'
    },
    threats:{
      L1:{lvl:4, t:'Model safeguards fail to stop the creation of a fabricated video of the prisoner.'},
      L2:{lvl:3, t:'An authentic recording is altered, making false statements appear to be evidence.'},
      L3:{lvl:3, t:'Coordinated attempts to bypass safeguards support production of the video.'},
      L4:{lvl:4, t:'Coordinated accounts and distribution networks spread the fabrication widely.'},
      L5:{lvl:4, t:'Missing source records and logs make the fabrication harder to detect and investigate.'},
      L6:{lvl:3, t:'The fabricated publicity threatens the protections examined under Article 13.'},
      L7:{lvl:4, t:'The prisoner’s family, home authorities, humanitarian institutions, and public audiences receive a false account.'}
    },
    chain:[
      {id:'L3', b:'Safeguards bypassed', t:'Coordinated misuse defeats the model’s controls.'},
      {id:'L1', b:'Video generated', t:'The model produces fabricated propaganda footage.'},
      {id:'L2', b:'Evidence altered', t:'A genuine recording gives the fabrication apparent credibility.'},
      {id:'L4', b:'Video distributed', t:'Coordinated networks spread it across news and social channels.'},
      {id:'L7', b:'People affected', t:'The fabrication reaches families, authorities, humanitarian institutions, and the public.'}
    ],
    chainNote:'Missing source records and audit logs at L5 affect the whole sequence. They make it harder to identify an alteration, establish what happened, and respond.',
    priority:[
      {t:'Model safeguards', d:'The model can be induced to produce the fabricated video.', tags:['L1']},
      {t:'Evidence of origin', d:'The path from original recording to altered video is not documented.', tags:['L5','L2']},
      {t:'Oversight of distribution', d:'The material reaches audiences and institutions without adequate checks.', tags:['L7']},
    ],
    prioFocus:'Preserve the original recording and document later handling and alterations. Review how fabricated media reaches institutions that may rely on it.',
    mitigation:[
      {id:'L1', t:'Test and improve model safeguards against the creation of deceptive prisoner footage.'},
      {id:'L3', t:'Repeat authorized adversarial evaluations before release and as tools change.'},
      {id:'L5', t:'Preserve source material and maintain auditable records of generation, alteration, and distribution.'},
      {id:'L6', t:'Include synthetic-media harms in IHL policy, training, reporting, and accountability processes.'},
    ],
  },
  {
    sx:'Hypothetical case 02', title:'A capture card with a false address',
    entitlement:'Accurate records and traceability', articles:['GCIII Art. 17','Art. 70','Art. 71','Art. 122','Art. 123'],
    summary:'A detaining state generates false capture cards using genuine prisoner information. The cards give incorrect health information, capture dates, and camp addresses. They are sent to families, home authorities, and humanitarian tracing services. This hypothetical case examines how fabricated records could obstruct tracing and make genuine records easier to dispute.',
    decomposition:{
      L1:'A model adapted to generate documents or images.',
      L2:'Prisoner records, including personally identifying information.',
      L3:'Tools that automate generation and attempts to bypass safeguards.',
      L4:'The systems and channels used to transmit the cards.',
      L5:'Source records, handling histories, and logs used to check authenticity.',
      L6:'Relevant provisions on identity, capture notification, correspondence, and information services.',
      L7:'Prisoners, families, home and detaining states, and humanitarian tracing services.'
    },
    threats:{
      L1:{lvl:4, t:'Model safeguards fail to stop the generation of falsified capture cards.'},
      L2:{lvl:4, t:'Genuine personal information is combined with false details, corrupting the apparent record.'},
      L3:{lvl:4, t:'Automated generation allows the same failure to affect many records.'},
      L4:{lvl:2, t:'Falsified cards are delivered directly to recipients who may rely on them.'},
      L5:{lvl:4, t:'Missing source records and handling histories make authentic and fabricated cards harder to distinguish.'},
      L6:{lvl:3, t:'False information threatens the notification and information processes examined in this case.'},
      L7:{lvl:3, t:'Families and authorities receive false information; tracing services may incorporate it into their records.'}
    },
    chain:[
      {id:'L3', b:'Generation automated', t:'Coordinated misuse repeats the safeguard failure across many records.'},
      {id:'L1', b:'Cards fabricated', t:'The model produces false capture cards.'},
      {id:'L2', b:'Records corrupted', t:'Genuine personal details are combined with invented information.'},
      {id:'L4', b:'Cards transmitted', t:'The cards reach families, authorities, and humanitarian institutions.'},
      {id:'L7', b:'Tracing obstructed', t:'False entries mislead recipients and cast doubt on genuine records.'}
    ],
    chainNote:'Without a reliable source and handling history at L5, recipients may struggle to detect false entries or determine where they entered the record.',
    priority:[
      {t:'Safeguards under repeated use', d:'Automation repeats a model failure across many cards.', tags:['L1','L3']},
      {t:'Authenticating prisoner records', d:'Recipients lack a reliable way to compare a card with its source.', tags:['L5','L2']},
      {t:'Record-keeping oversight', d:'False details may pass into tracing systems without review.', tags:['L7']},
    ],
    prioFocus:'Protect the source records and their handling history. Establish checks and correction procedures for information entering tracing systems.',
    mitigation:[
      {id:'L1', t:'Test and improve safeguards against repeated misuse of document-generation tools.'},
      {id:'L3', t:'Include automated and repeated generation in authorized adversarial evaluations.'},
      {id:'L5', t:'Maintain traceable records, audit how information is handled, and review inconsistencies.'},
      {id:'L6', t:'Include falsified prisoner records in IHL policy, reporting, and accountability processes.'},
    ],
  },
  {
    sx:'Hypothetical case 03', title:'A familiar voice giving a false assurance',
    entitlement:'Contact with the outside world', articles:['GCIII Art. 71','Art. 76'],
    summary:'Captors use a synthetic version of a detained service member’s voice in a live call to their family. The voice claims good health and humane treatment while the prisoner is being abused. The family’s account of the call then reaches authorities and humanitarian record-keepers. For this hypothetical analysis, the prisoner is assumed to fall within the relevant POW protections; classification and legal status require separate assessment.',
    decomposition:{
      L1:'A generative speech model capable of reproducing a person’s voice.',
      L2:'A recording of the prisoner’s voice obtained by the captors.',
      L3:'Tools and techniques used to coordinate voice generation and evade safeguards.',
      L4:'The communication channel used to deliver the synthetic voice during a live call.',
      L5:'Evidence of the original recording, later changes, and use in the call.',
      L6:'Protections concerning contact and correspondence. Articles 71 and 76 are references for the analysis, not a general entitlement to telephone calls.',
      L7:'The prisoner, family, home authorities, and humanitarian institutions receiving reports about the call.'
    },
    threats:{
      L1:{lvl:4, t:'Speech-model safeguards fail to prevent deceptive reproduction of the prisoner’s voice.'},
      L2:{lvl:4, t:'Synthetic speech supplies a false account of the prisoner’s health and treatment.'},
      L3:{lvl:3, t:'Coordinated misuse defeats controls on the voice model.'},
      L4:{lvl:3, t:'The deception occurs in a live conversation, where the family has little opportunity to check it.'},
      L5:{lvl:4, t:'The absence of source and handling records makes it harder to establish whether the voice is authentic.'},
      L6:{lvl:3, t:'False assurances can undermine meaningful contact and conceal the prisoner’s actual circumstances.'},
      L7:{lvl:3, t:'The family is deceived, distress may follow, and false information can enter official and humanitarian records.'}
    },
    chain:[
      {id:'L3', b:'Controls bypassed', t:'Misuse of the speech model defeats its safeguards.'},
      {id:'L1', b:'Voice reproduced', t:'The model generates speech resembling the prisoner’s voice.'},
      {id:'L2', b:'False account created', t:'The synthetic voice claims good health and humane treatment.'},
      {id:'L4', b:'Call delivered', t:'The family hears the fabricated assurance in a live conversation.'},
      {id:'L7', b:'False account recorded', t:'The family is misled and the account enters later records.'}
    ],
    chainNote:'Review the original recording, later alterations, and the live communication. A process that checks only stored audio files would miss part of this case.',
    priority:[
      {t:'Speech-model safeguards', d:'The model can be used to reproduce the prisoner’s voice deceptively.', tags:['L1']},
      {t:'Origin and use of the recording', d:'The path from source audio to the live call is not documented.', tags:['L5','L2']},
      {t:'Checks on contact channels', d:'False assurances can be accepted and repeated without verification.', tags:['L7']},
    ],
    prioFocus:'Examine both the source recording and its later use, including live calls. Assign verification work to institutions with the capacity to perform it.',
    mitigation:[
      {id:'L1', t:'Test and improve speech-model safeguards against deceptive voice reproduction.'},
      {id:'L5', t:'Preserve evidence of source recordings and later use, with checks suited to live communication as well as stored files.'},
      {id:'L3', t:'Repeat authorized adversarial evaluations of speech-model misuse.'},
      {id:'L6', t:'Include fabricated contact in IHL policy, reporting, and accountability processes.'},
    ],
  },
];

export const MONITORING = {
  loop:[
    {ic:'01', b:'Repeat technical tests', d:'Use authorized automated evaluations to look for new model and system failures.'},
    {ic:'02', b:'Review the evidence', d:'Bring in legal and humanitarian expertise where context and judgment matter.'},
    {ic:'03', b:'Compare findings', d:'Establish regular review among relevant humanitarian, government, and private-sector actors.'},
    {ic:'04', b:'Report and follow up', d:'Use appropriate institutional reporting processes, assign actions, and check whether they were completed.'},
  ],
  actors:['ICRC','Governments','AI developers and deployers','Platforms','Humanitarian monitors'],
  text:'Review safeguards as models, distribution channels, and conflict conditions change. Combine technical testing with human review and share findings through appropriate institutional channels.'
};

export const RESP = {
  functions:['Documentation','Detection','Escalation','Interdiction','Hardening'],
  actors:[
    {name:'Belligerent states', role:'Detaining powers', v:[4,1,1,1,1]},
    {name:'AI model developers', role:'And system deployers', v:[1,2,2,2,4]},
    {name:'Platform owners', role:'Distribution services', v:[1,2,2,4,2]},
    {name:'Humanitarian institutions', role:'For example, the ICRC', v:[3,2,4,1,1]},
    {name:'Humanitarian monitors', role:'For example, Human Rights Watch', v:[1,4,3,1,1]},
    {name:'Prisoners and families', role:'No defensive burden assigned', v:[0,0,0,0,0]},
  ]
};

export const HEAT_LBL = {1:'Low', 2:'Moderate', 3:'High', 4:'Critical'};

export const CONTENT_NOTES = {
  scenarios:'These are hypothetical worked cases. They do not describe documented incidents. Severity labels are the project’s qualitative judgments, not measured probabilities or validated risk scores.',
  responsibility:'The matrix is a qualitative proposal for allocating defensive work according to capacity. Its weights are not measured capability scores, legal duties, or findings of responsibility. Existing legal obligations require separate assessment.',
  legal:'Legal references identify protections considered in the research. Applicability depends on the facts, conflict classification, and the status of the person concerned. The framework is not a legal opinion or a compliance determination.',
  records:'These are illustrative types of information that may appear across a prisoner’s record. The list is not a recommendation to collect additional personal data and does not imply that every listed field is required or authorized.',
  framework:'MAESTRO4IHL adapts MAESTRO, the agentic-AI threat-modeling framework developed by Ken Huang. Its application to POW protections, hypothetical cases, and recommendations are the AIHL Project’s own.',
};
