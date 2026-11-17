// All content comes from "Physical WF after the update". Edit here to change the site.
// Node: { t: title, d: text, c: [[label, nextId]], sr: {...}, s: [arabic scripts], tab: table rows, esc: escalation }

const OWNER = 'Data Tech Con Support-Physical';
const ESC = 'If the SLA is exceeded, email Consumer Support DSL-Physical to speed up the resolution. Feedback comes within the same working day (except Friday & Saturday).';
const S48 = 'تمام يا أستاذ/ة.... أنا سجلت طلب حضرتك وفي حد من الدعم الفني بيتابع الشكوى، وفي خلال 48 ساعة عمل هتكون الخدمة شغالة بصورة طبيعية عند حضرتك، هستأذنك نسيب الراوتر متوصل.';
const SVOICE = 'تمام يا أستاذ/ة.... أنا سجلت طلب حضرتك وفي حد من الدعم الفني بيتابع الشكوى، وفي خلال 48 ساعة عمل هتكون الحرارة شغالة بصورة طبيعية عند حضرتك.';
const SHURRY = 'هقدم لحضرتك طلب استعجال وهيتم الرد في أسرع وقت ممكن.. شكرا لتفهمك.';
const SR = (code, area, o = {}) => ({
  code, type: o.type || 'DSL Fault For Physical', area, sub: o.sub || '', product: o.product || 'ADSL',
  owner: o.owner || OWNER, sla: o.sla || '48 Whrs',
});

export const FLOWS = [
  { id: 'down', title: 'Line Down', icon: '📵', start: 'ld_power', about: 'No internet: the line is down.' },
  { id: 'fiber', title: 'Fiber Problem – MSAN', icon: '🗄️', start: 'fb_start', about: 'Cabinet offline, TE bill suspension, MSAN unlock.' },
  { id: 'unstable', title: 'Line Unstable', icon: '〰️', start: 'us_start', about: 'Internet connects and disconnects.' },
  { id: 'bad', title: 'Bad Line Parameters', icon: '📉', start: 'bl_start', about: 'Line readings, speed profile, bit rate.' },
  { id: 'voice', title: 'Voice Problems', icon: '☎️', start: 'vo_start', about: 'Ring tone, features, noise, wrong number, stolen cables.' },
];

export const HOW_TO_OPEN = {
  'Line Down': 'Orange Pedia → Products → Home DSL Packages → How to Complain → View All (Technical) → Line Down',
  'Line Unstable': 'Orange Pedia → Products → Home DSL Packages → How to Complain → View All → Line Unstable',
  'Bad Line Parameters': 'Orange Pedia → Products → Home DSL Packages → How to Complain → DSL – Slow Download',
  'Voice Problems': 'Orange Pedia → Products → Home DSL Packages → How to Complain → View All → Voice Problems',
};

export const TOOLS = [
  ['FTTH Tool', 'MSAN customers: Get CPE Status, Port Up Time, Port Parameters, Lock/Unlock port, Change profile speed.'],
  ['Octopus', 'Copper customers: Port status, Last change, Port Reset / Unlock / Update.'],
  ['IP Tool', 'Last IP login time, to compare with Port Up Time.'],
  ['Assurance Portal', 'Voice & Data status (Suspended or not), speed profile.'],
  ['TR069', 'Line parameters when the FTTH Tool has none. If they differ from FTTH, TR069 is the right one.'],
];

export const NODES = {
  done: { t: 'Resolved', d: 'The problem is solved. Confirm with the customer, then close the call. Note: you cannot resolve an SR that is assigned to the Physical team, even if the problem is solved (except SRs created during global issues).', end: true },

  // ---------- LINE DOWN ----------
  ld_power: { t: 'Check the router Power LED', d: 'Ask the customer about the Power LED on the router.',
    c: [['Power LED is OK', 'ld_voice'], ['Power LED is Off or Red', 'ld_psu'], ['Stolen Cables', 'vo_stolen'], ['Fiber Problem – MSAN', 'fb_start']] },
  ld_psu: { t: 'Try another power source', d: 'Ask the customer to plug the router into another power source.', c: [['Solved', 'done'], ['Not Solved', 'ld_router']] },
  ld_router: { t: 'Router fault', d: 'Create the SR below for the FBB Technical Consumer Support team. If the technician says the router is faulty: an Orange router in warranty can be replaced (needs a written & stamped technician report). If it is not from Orange or out of warranty, upsell the new High-End router and give the nearest shop and working hours. If the customer refuses, refer him/her to the vendor.',
    sr: SR('39004', 'DSL Fault For Physical', { sub: 'Not Solved Customer-Router', sla: '—', owner: 'FBB Technical Consumer Support' }) },
  ld_voice: { t: 'Is the voice working?', d: 'Ask the customer if the landline voice is working. Priority is the landline: if there is no dial tone and no internet, follow the Voice Problems steps and open the SR on the landline, not on the internet.',
    c: [['Voice is working', 'ld_wire'], ['Voice is not working', 'vo_start']] },
  ld_wire: { t: 'Junctions, welding or cuts on the main wire?', d: 'Ask the customer if there is any junction, welding or cutting on the main wire.',
    s: ['هل حضرتك في أي قطع في السلك التليفون سواء داخل المكان أو من البوكس لحد مكان الراوتر'],
    c: [['Yes, there is a cut', 'ld_wire_yes'], ['No', 'ld_status']] },
  ld_wire_yes: { t: 'Customer must change the main wire', d: 'Advise the customer to change the main wire (follow up with TE) without submitting an SR to the Physical team. Create and close the SR.',
    s: ['هنستأذن حضرتك تتابع مع المصرية للاتصالات لتغيير السلك لأن ده بيأثر على جودة خدمة الـ DSL'],
    sr: SR('39007', 'Line Unstable', { type: 'Fault For Physical', sub: 'Not Solved Cst Intern Conn', sla: '—', owner: '—' }), c: [['Back to Line Down start', 'ld_power']] },
  ld_status: { t: 'Check the line status', d: 'Check the port in the FTTH Tool (MSAN) or Octopus (Copper). Port status should be Down and match the customer line.',
    c: [['Matched (Line Down)', 'ld_reset'], ['Not Matched (Wrong Port)', 'ld_wrong']] },
  ld_reset: { t: 'Reset the port', d: 'Copper: press Port Reset then Update (Octopus). MSAN: Lock then Unlock the port (FTTH Tool).', c: [['Line is Up', 'done'], ['Line is still down', 'ld_split']] },
  ld_split: { t: 'Check the splitter', d: 'Make sure the phone line (RJ-11) goes from the splitter to the router, and the splitter wiring is correct (splitter position according to the main phone line).', c: [['Line is Up', 'done'], ['Line is still down', 'ld_nosplit']] },
  ld_nosplit: { t: 'Connect without the splitter', d: 'If the customer calls from the DSL number: ask for his/her mobile number, ask to end the call and answer on mobile, put Not Ready, call the customer, connect without the splitter, then call his number from another line and check the ADSL LED on the router.', c: [['Solved', 'done'], ['Not Solved', 'ld_sr']] },
  ld_sr: { t: 'Create the Line Down SR', d: 'Let the customer connect everything back with the splitter and keep the router on for the next 48 working hours. Create the SR.',
    s: [S48], sr: SR('39004', 'Line Down', { type: 'DSL Fault For Physical', product: 'DSL-Active / Candidate Account' }), esc: ESC },
  ld_wrong: { t: 'Wrong Port', d: 'Ask the customer if he/she has another phone line to test with Connect DSL Line.', c: [['Solved', 'done'], ['Not Solved', 'ld_wrong_sr']] },
  ld_wrong_sr: { t: 'Create the Wrong Port SR', d: 'The port does not match the customer line.', s: [S48], sr: SR('39014', 'Wrong Port', { product: 'DSL-Active Account' }), esc: ESC },

  // ---------- FIBER ----------
  fb_start: { t: 'Fiber Problem – MSAN: check the line status', d: 'Choose the case that matches the line status.',
    c: [['MSAN Cabinet Offline', 'fb_cab'], ['Suspended Due To TE Bill', 'fb_te'], ['MSAN Unlock', 'fb_unlock']] },
  fb_cab: { t: 'MSAN Cabinet Offline', d: "Do not do any troubleshooting with the customer: most probably the whole cabinet is physically down. Smart script fields: Customer Name, Customer Mobile, Cabinet Code.",
    s: [S48], sr: SR('39005', 'MSAN Cabinet Offline'), esc: ESC },
  fb_te: { t: 'Suspended Due To TE Bill', d: 'Check Voice status and Data status in the Assurance Portal. If both are "Suspended", ask the customer to pay the unpaid TE bills. If he/she already paid and 24 hours passed and both are still Suspended, ask the customer to refer to TE.',
    s: ['أحب أوضح لحضرتك إن انقطاع الخدمة بسبب وجود فواتير متأخرة لخط التليفون الأرضي، يرجى الدفع والخدمة هترجع تلقائياً خلال 24 ساعة من الدفع.'],
    sr: SR('39027', 'TE-Cut Off', { sub: 'Suspend due to TE bill', sla: '—', owner: '—' }) },
  fb_unlock: { t: 'MSAN Unlock', d: 'Wholesale resellers (Net@Net) customers must refer to their reseller. If the line is locked, unlock it. Check the Download Speed and match it with the customer Line Profile. If there is a bit rate mismatch after unlock, adjust the profile.',
    s: ['احنا بنعتذر لحضرتك عن الانقطاع المتكرر للخدمة، ده نتيجة لعطل فني من جانب المصرية للاتصالات، وحالياً الخط اشتغل.'],
    sr: SR('33311', 'MSAN Unlock', { type: 'DSL Fault for Line Changes', sub: 'Done/Not Done', sla: '—', owner: '—' }), sr2: SR('40026', 'Bit Rate Mismatch', { type: 'DSL Fault For Connectivity', sub: 'Solved', sla: '—', owner: '—' }) },

  // ---------- LINE UNSTABLE ----------
  us_start: { t: 'Line Unstable', d: 'The customer has service instability because of a physical issue (wires, cabinet, box or splitter). Use it only if the complaint is not about making/receiving calls on the landline. Ask which router LED is unstable (DSL LED, not Power), and check all cables. Do not lock/unlock yourself: compare the Lock/Unlock history with the Last Change time. Check line parameters and adjust the profile before assigning an SR. Make sure there is no global issue on the exchange.',
    c: [['Junctions / welding / cuts on the main wire', 'ld_wire_yes'], ['No cut: check Port Up Time', 'us_uptime'], ['Repetitive complaint', 'us_rep']] },
  us_uptime: { t: 'Check Port Up Time', d: 'Port Up Time must be less than 6 hours. MSAN: FTTH Tool (Get Port Up Time). Copper: Last Change Time in Octopus. Compare with the last IP login on the IP Tool.',
    c: [['Both down for less than 6 hours', 'us_follow'], ['Difference between Port Up Time and IP login > 5 minutes', 'us_conn'], ['Last IP login is more than 6 hours', 'us_other'], ['Also has Bad Line Parameters', 'bl_start']] },
  us_follow: { t: 'Follow the Line Unstable TS', d: 'Confirm the customer did not restart the router, and check the Lock/Unlock history. Current rate should be 85% or less of the max rate. Ask the customer to connect without splitter (or through the mobile call steps), then keep the router on for 48 hours.',
    s: [S48], sr: SR('39007', 'Line Unstable', { type: 'Fault For Physical' }), esc: ESC },
  us_conn: { t: 'Follow the Connection Unstable WF', d: 'The difference between Port Up Time and authentication IP is more than 5 minutes, so the issue is not DSL instability.', end: true },
  us_other: { t: 'Not an instability case', d: 'Handle the customer away from the instability scenario, according to the customer complaint.', end: true },
  us_rep: { t: 'Repetitive complaints', d: 'Check the SR history for physical problems during the last week to know the last step or reason (e.g. change building cable, change router, or long SLA due to TE maintenance). If a previous Physical-team feedback says "Customer is out of service location / not free": check the line status, inform the customer of that feedback, and create this SR.',
    sr: SR('39017', 'Assign Visit', { type: 'Fault For Physical' }) },

  // ---------- BAD LINE ----------
  bl_start: { t: 'Bad Line Parameters', d: 'Check the line readings (they cause instability, so solve them first). MSAN: FTTH Tool → Get Port Parameters (speedDown, SNR Down, Attainable Rate Down). If nothing there, check TR069 (it is the right one if values differ). If the customer asks for his parameters, give them; for email/SMS, tell him to read them from the router page.',
    tab: [['Parameter', 'Accepted'], ['Relative Occupation', '80% to 85%'], ['Noise Margin', 'Greater than 60 dB'], ['Bitrate', '80% to 85% of the max'], ['Max Attainable up to 30 Mbps', 'Not less than 36 Mbps (VDSL port & router) / 15 Mbps (ADSL)'], ['Max Attainable up to 70 Mbps', 'Not less than 55 Mbps'], ['Max Attainable 100 & 200 Mbps', 'Not less than 85 Mbps']],
    c: [['Right speed profile', 'bl_reset'], ['Wrong speed profile', 'bl_profile']] },
  bl_profile: { t: 'Adjust the speed profile', d: 'Check the speed profile through the Assurance Portal and adjust it. Ask the customer to run a speed test to confirm.',
    tab: [['Scenario', 'Handling'], ['Up to 30 Mbps', 'Adjust to the suitable profile: not more than 85% of Max Attainable Rate (Down). Only for bit rate mismatch or a physically bad line due to a wrong profile. Only front-line agents adjust profiles up to 30 Mbps.'], ['70, 100 & 200 Mbps', 'Changing the profile is not allowed. 200 Mbps is treated like 100 Mbps. Check technical SR history (last month) for the max line capacity, else check Assurance Portal for Attainable Rate Down below 85%. Follow Bad Line WF.'], ['"Maximum Line Capacity" feedback', 'Create SR "411007" and tell the customer his line efficiency cannot carry the requested speed.'], ['FTTH', 'Physical: handled by received power average. Connectivity: speed test must be above 65% (200 Mbps profile → 130 Mbps accepted).']],
    c: [['Solved after adjustment', 'bl_ok'], ['Not solved after adjustment', 'bl_reset']] },
  bl_ok: { t: 'Create and close the SR', d: 'Ask the customer to test the speed to confirm the slow problem is totally solved, then create and close this SR.', sr: SR('40026', 'Bit Rate Mismatch MSAN', { type: 'Fault For Connectivity', sub: 'Solved', sla: '—', owner: '—' }) },
  bl_reset: { t: 'Try Port Reset or Lock & Unlock', d: 'Copper: press Port Reset then Update. MSAN: press Lock port then Unlock port.', c: [['Solved', 'done'], ['Not Solved', 'bl_nosplit']] },
  bl_nosplit: { t: 'Connect without splitter (all copper & MSAN, not FTTH)', d: 'If the customer is calling from any number other than the DSL number: ask to connect without splitter. If calling from the DSL number: ask for his mobile, end the call, Not Ready, call him on mobile and connect without splitter.', c: [['Solved', 'done'], ['Not Solved', 'bl_sr']] },
  bl_sr: { t: 'Create the Bad Line SR', d: 'It is not allowed to resolve an SR assigned to the Physical team, even if solved. Owner: Active → Data Tech Con Support Physical; Candidate Cairo & Alex → DSL Installation Team; Candidate Gov → Data Tech Con Support Physical.',
    s: [S48], sr: SR('39013', 'Bad Line', { type: 'Fault For Physical', product: 'DSL-Active / Candidate Account', owner: 'See text' }), esc: ESC },

  // ---------- VOICE ----------
  vo_start: { t: 'Voice Problems', d: 'Choose the complaint. If the line is down and there is no voice, follow "No Voice". Hearing a ring when calling the customer is not proof that the voice is fine. Check the SR history for 1 week for repetitive issues.',
    c: [['Ring Tone problem', 'vo_phone'], ['Line Feature (Caller ID, Waiting...)', 'vo_phone'], ['Interference', 'vo_phone'], ['Switched voice problem', 'vo_wrong'], ['Stolen Cables', 'vo_stolen'], ['No Voice / Noise', 'vo_nv']] },
  vo_phone: { t: 'Try another phone set', d: 'Ask the customer to try another phone set if possible.', c: [['Solved', 'done'], ['Not Solved', 'vo_sr']] },
  vo_sr: { t: 'Create the Voice Problem SR', d: 'Let the customer connect everything back with the splitter, then create the SR.',
    s: [SVOICE, 'في حد من الدعم الفني بيتابع الشكوى، ولو مفيش أي تأخير من المصرية للاتصالات في خلال 48 ساعة عمل من تاريخ تقديم الطلب هتكون الخدمة شغالة بصورة طبيعية عند حضرتك (لو العميل اتصل يسأل عن الطلب)', SHURRY],
    sr: SR('39006', 'Voice Problem', { product: 'DSL-Candidate / Active Account' }), esc: 'If the SLA is exceeded with no feedback, email Consumer Support DSL-Physical. Feedback comes within 1 working day.' },
  vo_wrong: { t: 'Switched voice (wrong landline number)', d: 'Check if the customer is calling from a different landline number, if he/she migrated to MSAN (MSAN Scripts), or if he/she has no other landline. Create the SR and write the wrong landline number in the SR notes.',
    s: [SVOICE, SHURRY], sr: SR('39006', 'Voice Problem'), esc: ESC },
  vo_stolen: { t: 'Stolen Cables', d: 'If the cable is still stolen and the problem still exists: ask the customer to call after the voice problem is solved, and create the SR to confirm the stolen cable. If the cable is back and the problem solved: create the SR to clarify the downtime duration, and note that the customer had a line down due to a Stolen Cable.',
    s: ['هستأذن حضرتك نتابع مع المصرية للاتصالات لحل مشكلة الكابل ونتصل بحضرتك مرة تانية بعد رجوع الحرارة.'], sr: SR('39004', 'Line Down'), esc: ESC },
  vo_nv: { t: 'No Voice & Noise: check splitter wiring', d: 'For No Voice and Noise complaints, verify with the customer that the splitter wiring is correct (splitter position according to the main phone line).', c: [['Solved', 'done'], ['Not Solved', 'vo_choose']] },
  vo_choose: { t: 'Which problem?', d: 'Choose the complaint.', c: [['No Voice', 'vo_te'], ['Noise on Voice', 'vo_noise']] },
  vo_te: { t: 'Check unpaid TE bills', d: 'Ask the customer if he/she has due TE bills or hears recorded messages. If yes, advise paying, and call 16333 if the problem persists 24 hours after the payment. Otherwise check the unpaid bills on 140 Online (postpaid) or My Fawry (prepaid).',
    tab: [['Recorded message when calling the landline', 'Meaning'], ['"Your call cannot be completed as dialed…"', '3 or more unpaid bills'], ['"This number is not a working number…"', '3 or more unpaid bills'], ['"This number is temporarily out of service…"', '2 unpaid bills']],
    c: [['Solved', 'done'], ['Not Solved', 'vo_nosplit']] },
  vo_noise: { t: 'Noise on voice', d: 'Ask how many phone sets and micro filters the customer uses, and if the noise is on a specific set or all of them. Inform the customer to disconnect all sets and keep only one connected.', c: [['Solved', 'done'], ['Not Solved', 'vo_nosplit']] },
  vo_nosplit: { t: 'Remove the splitter', d: 'Ask the customer to remove the splitter and connect the main phone line directly to the phone set. If he/she cannot check the main wire because of many wall plugs, check from the first plug on the main wire.', c: [['Solved', 'done'], ['Not Solved', 'vo_sr']] },
};

// Every SR in the deck, for the SR table (generated from nodes).
export const SR_LIST = Object.entries(NODES).flatMap(([id, n]) => [n.sr, n.sr2].filter(Boolean).map((sr) => ({ ...sr, node: id, from: n.t })));
