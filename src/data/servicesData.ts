export interface CommonProblem {
  title: string;
  symptoms: string;
  likelyCause: string;
  solution: string;
  typicalDuration: string;
}

export interface RepairProcessStep {
  step: string;
  title: string;
  description: string;
  outcome: string;
}

export interface ServiceDetailFAQ {
  question: string;
  answer: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  aliases?: string[];
  name: string;
  shortDesc: string;
  longDesc: string;
  heroHeadline: string;
  heroSubtitle: string;
  startingPrice: number;
  diagnosticFee: number;
  warrantyDays: number;
  avgResponseTime: string;
  categoryGroup: "Appliances" | "Electronics" | "Home Utility";
  iconName: string;
  supportedBrands: string[];
  serviceFeatures: string[];
  popularIssues: string[];
  commonProblems: CommonProblem[];
  repairProcess: RepairProcessStep[];
  serviceBenefits: { title: string; desc: string; icon: string }[];
  faqs: ServiceDetailFAQ[];
}

export const POPULAR_SERVICES: ServiceCategory[] = [
  {
    id: "ac-repair",
    slug: "ac-repair",
    name: "AC Repair",
    shortDesc: "Complete servicing, cooling troubleshooting, gas charging & PCB repairs for split and window ACs.",
    longDesc:
      "Keep your Bengaluru home or workspace comfortably cool with RepairTrust's verified AC technicians. From precision refrigerant leak detection using nitrogen pressure testing to inverter PCB chip-level troubleshooting and anti-microbial jet foam wash, our technicians ensure long-lasting performance with zero price ambiguity.",
    heroHeadline: "Bengaluru Doorstep AC Repair & Servicing with Guaranteed Trust.",
    heroSubtitle:
      "Get rapid diagnosis for cooling failure, water leakage, strange noises, and PCB issues from verified technicians in your Bengaluru locality with transparent line-item pricing.",
    startingPrice: 349,
    diagnosticFee: 199,
    warrantyDays: 60,
    avgResponseTime: "Under 30 mins",
    categoryGroup: "Appliances",
    iconName: "Wind",
    supportedBrands: [
      "Daikin",
      "Voltas",
      "LG",
      "Samsung",
      "Hitachi",
      "Carrier",
      "Blue Star",
      "Panasonic",
      "Lloyd",
      "Godrej",
      "O General",
      "Mitsubishi",
    ],
    serviceFeatures: [
      "OEM-spec R32 / R410A refrigerant with digital pressure test",
      "Jet foam deep cleaning with water-jacket protection",
      "60-day doorstep warranty on replaced electrical & cooling parts",
      "Zero hidden transportation or visit charges",
    ],
    popularIssues: [
      "AC not cooling effectively",
      "Water leakage from indoor unit",
      "Unusual noise or vibration",
      "Gas leak & refrigerant refill",
      "Power trip / PCB failure",
    ],
    commonProblems: [
      {
        title: "Inadequate or Zero Cooling",
        symptoms: "Blower blows room-temperature air; outdoor unit fan runs but compressor trips after minutes.",
        likelyCause: "Refrigerant gas leakage, choked condenser coils, or faulty dual-run capacitor.",
        solution: "High-pressure nitrogen leak test, brazing repair, vacuum evacuation, and digital gas charging.",
        typicalDuration: "45–60 mins",
      },
      {
        title: "Indoor Unit Water Overflow",
        symptoms: "Water dripping down interior wall or splashing out from the air louvers.",
        likelyCause: "Algae or sludge blockage in drain tray/pipe, cracked condensate pan, or improper unit pitch.",
        solution: "Pressurized drain pipe flushing, coil leveling, and anti-fungal tray sanitization.",
        typicalDuration: "30–45 mins",
      },
      {
        title: "Inverter PCB Communication Fault",
        symptoms: "LED timer blinking in specific patterns; AC turns off within 3 minutes of start.",
        likelyCause: "Voltage fluctuation damage, burnt IPM module, or capacitor breakdown on outer PCB.",
        solution: "Component-level micro-soldering, IPM replacement, and thermal paste recoating.",
        typicalDuration: "60–90 mins",
      },
      {
        title: "Excessive Vibration or Grinding Sound",
        symptoms: "Rattling noise from outdoor compressor bracket or squeaking from indoor cross-flow fan.",
        likelyCause: "Worn blower motor bearings, loose compressor mounting grommets, or debris inside cage.",
        solution: "Anti-vibration pad replacement, motor bearing lubrication, and dynamic balance calibration.",
        typicalDuration: "30–45 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Multi-Point Doorstep Diagnostics",
        description:
          "Technician measures current draw, refrigerant pressure gauges, airflow CFM, and coil temperature drop.",
        outcome: "Exact root cause identified with digital reading.",
      },
      {
        step: "02",
        title: "Itemized Quotation Review",
        description:
          "Customer receives a transparent quotation broken down into labor, diagnosis fee, and required genuine spares.",
        outcome: "Zero hidden charges; work begins only after your digital sign-off.",
      },
      {
        step: "03",
        title: "Precision Repair & Component Replacement",
        description:
          "Technician executes the repair using calibrated tools, ESD protection, and manufacturer-specified parts.",
        outcome: "Appliance restored to original operational efficiency.",
      },
      {
        step: "04",
        title: "Live Operational Stress Test",
        description:
          "AC is tested across cooling modes for 15 minutes while measuring vent temperature and power consumption.",
        outcome: "Demonstrated proof of cooling before technician leaves.",
      },
      {
        step: "05",
        title: "Digital Warranty Card & Invoice",
        description:
          "A tamper-proof digital repair certificate is generated with 60-day warranty coverage tracked on your mobile.",
        outcome: "Complete peace of mind with guaranteed revisit support.",
      },
    ],
    serviceBenefits: [
      {
        title: "100% Background-Checked Wiremen",
        desc: "All AC technicians possess HVAC trade certifications and cleared Aadhaar/police background checks.",
        icon: "ShieldCheck",
      },
      {
        title: "Standardized Pressure Gauges",
        desc: "Refrigerant charging is strictly measured using digital manifold gauges to prevent under/overcharging.",
        icon: "CheckCircle2",
      },
      {
        title: "60-Day Service Warranty",
        desc: "If cooling degrades or the same issue recurs within 60 days, we revisit and fix it with zero labor charge.",
        icon: "Award",
      },
      {
        title: "No Advance Payment Trap",
        desc: "Pay only after you personally inspect the cooling and test the unit with the technician.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "How much does a standard AC service cost in Bengaluru?",
        answer:
          "Standard filter and coil cleaning starts at ₹349. If chemical jet foam deep cleaning or refrigerant top-up is needed, an upfront line-item quotation will be provided before any work starts.",
      },
      {
        question: "What does the 60-day AC warranty cover?",
        answer:
          "The warranty covers the specific repair work and all replaced components (such as capacitors, fan motors, sensors, and gas joints). If the same fault recurs within 60 days, our technician will resolve it at zero additional labor cost.",
      },
      {
        question: "Do technicians carry refrigerant cylinders and spare capacitors?",
        answer:
          "Yes. Our verified technicians travel equipped with standard HVAC toolkits, vacuum pumps, digital manifolds, R32/R410A cylinders, and common capacitors for on-the-spot resolution.",
      },
      {
        question: "Is indoor water protection provided during AC cleaning?",
        answer:
          "Yes. Technicians use waterproof AC service jackets and floor mats to guarantee zero water spillage onto your walls, furniture, or wooden flooring.",
      },
    ],
  },
  {
    id: "washing-machine-repair",
    slug: "washing-machine-repair",
    name: "Washing Machine Repair",
    shortDesc: "Expert diagnostics for front-load, top-load & semi-automatic machines across all major brands.",
    longDesc:
      "When your washing machine stops spinning, refuses to drain, or displays confusing error codes, RepairTrust connects you with verified appliance specialists in Bengaluru. We service front-load, top-load, and inverter direct-drive washers with calibrated diagnostic scanners and original OEM spare parts.",
    heroHeadline: "Reliable Washing Machine Repair at Your Doorstep in Bengaluru.",
    heroSubtitle:
      "Get prompt fixes for drum spin failures, drainage clogs, noisy bearings, and water inlet valve errors from certified appliance technicians.",
    startingPrice: 299,
    diagnosticFee: 199,
    warrantyDays: 60,
    avgResponseTime: "Under 45 mins",
    categoryGroup: "Appliances",
    iconName: "RotateCcw",
    supportedBrands: [
      "IFB",
      "Bosch",
      "LG",
      "Samsung",
      "Whirlpool",
      "Siemens",
      "Haier",
      "Godrej",
      "Panasonic",
      "BPL",
      "Voltas Beko",
    ],
    serviceFeatures: [
      "Diagnostic error code scanning across IFB, Bosch, LG, Samsung",
      "Original direct-drive motors, belts, spider arms & dampers",
      "60-day doorstep warranty on replaced spare parts",
      "Clean post-service cleanup policy",
    ],
    popularIssues: [
      "Drum not spinning / vibrating loudly",
      "Water not draining properly",
      "Error codes (dE, UE, IE, 4E, etc.)",
      "Water intake failure / valve stuck",
      "Door latch or rubber bellow seal replacement",
    ],
    commonProblems: [
      {
        title: "Drum Not Spinning or Rotating Slowly",
        symptoms: "Motor hums but drum remains stationary; machine hums loudly during spin cycle.",
        likelyCause: "Snapped drive belt, worn carbon brushes, broken spider bracket, or capacitor failure.",
        solution: "Belt replacement, motor pulley alignment, or spider bracket replacement with stainless steel arm.",
        typicalDuration: "45–60 mins",
      },
      {
        title: "Water Not Draining / Machine Stops Mid-Cycle",
        symptoms: "Water trapped inside drum; machine stops before rinse or spin; OE / 5E error displayed.",
        likelyCause: "Foreign object in drain pump impeller (coins/lint), burnt drain pump motor, or kinked hose.",
        solution: "Pump chamber clearing, lint filter decontamination, or replacement of magnetic drain motor.",
        typicalDuration: "30–45 mins",
      },
      {
        title: "Loud Banging Noise During High-Speed Spin",
        symptoms: "Machine shakes violently, walks across the floor, or sounds like a jet engine.",
        likelyCause: "Failed drum tub bearings and oil seal, broken suspension dampers, or unbalanced counterweight.",
        solution: "Bearing puller extraction, OEM high-speed sealed bearing press, and damper renewal.",
        typicalDuration: "60–90 mins",
      },
      {
        title: "Water Overflowing or Not Filling",
        symptoms: "Water fills continuously without stopping, or machine trips on IE / 4E water supply error.",
        likelyCause: "Defective dual/triple solenoid inlet valve, clogged inlet mesh, or faulty pressure switch.",
        solution: "Inlet valve replacement, pressure sensor calibration, and air chamber line cleaning.",
        typicalDuration: "30–45 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Digital Error & Electrical Diagnostics",
        description:
          "Technician reads stored control board error codes, tests motor winding resistance, and inspects tub suspension.",
        outcome: "Clear fault isolation without guesswork.",
      },
      {
        step: "02",
        title: "Line-Item Quotation Presentation",
        description:
          "Complete breakdown of labor and spare parts (pumps, belts, valves) is shared directly with you.",
        outcome: "Transparent price before opening the tub assembly.",
      },
      {
        step: "03",
        title: "OEM Component Installation",
        description:
          "Damaged components are replaced with manufacturer-grade parts, torque-tightened to factory specifications.",
        outcome: "Original performance and quiet operation restored.",
      },
      {
        step: "04",
        title: "High-RPM Full Cycle Testing",
        description:
          "A test wash, rinse, and 1200+ RPM spin cycle is conducted with water intake and drainage verified.",
        outcome: "Zero leaks, no abnormal vibration, and perfect drainage confirmed.",
      },
      {
        step: "05",
        title: "Digital Warranty Card Issued",
        description:
          "Your digital invoice and 60-day warranty certificate are delivered instantly via SMS and WhatsApp.",
        outcome: "Guaranteed revisit support within your coverage period.",
      },
    ],
    serviceBenefits: [
      {
        title: "Front & Top Load Specialists",
        desc: "Technicians trained specifically on complex European and Asian washing machine architectures.",
        icon: "ShieldCheck",
      },
      {
        title: "Genuine Rubber & Metal Spares",
        desc: "Only genuine door bellows, spider arms, and carbon-sealed pumps used to prevent recurring leaks.",
        icon: "CheckCircle2",
      },
      {
        title: "60-Day Revisit Guarantee",
        desc: "Any recurrence of the resolved issue within 60 days is inspected and fixed with zero labor fee.",
        icon: "Award",
      },
      {
        title: "Zero Mess Commitment",
        desc: "Technicians lay waterproof trays and clean up any drained laundry water before leaving.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Can bearing replacement be done at home?",
        answer:
          "For most machines, bearing replacement is executed doorstep using portable bearing pullers. If a sealed welded tub requires precision ultrasonic welding, the technician will inform you upfront with transparent logistics costs.",
      },
      {
        question: "Why does my washing machine show an error code and beep?",
        answer:
          "Modern washers use error codes (e.g. dE = door error, OE = drain error, IE = inlet water error, UE = unbalanced load). Our technicians carry official factory service manuals for all brands to decode and solve them immediately.",
      },
      {
        question: "Is there any warranty on replaced parts?",
        answer:
          "Yes. All replaced mechanical and electronic spare parts come with a 60-day RepairTrust guarantee, logged digitally on your receipt.",
      },
      {
        question: "How long does a typical repair visit take?",
        answer:
          "Most drain clogs, belt replacements, and inlet valve repairs take 30 to 45 minutes. Complex drum bearing overhauls may take 1 to 2 hours.",
      },
    ],
  },
  {
    id: "laptop-repair",
    slug: "laptop-repair",
    name: "Laptop Repair",
    shortDesc: "Chip-level motherboard repair, screen replacements, keyboard fix, battery & data recovery.",
    longDesc:
      "Whether you are working from tech parks in Whitefield, Koramangala, or Electronic City, a broken laptop halts your day. RepairTrust brings certified IT hardware engineers directly to your doorstep in Bengaluru for screen replacements, battery upgrades, chip-level logic board repairs, and thermal maintenance with strict data privacy protocols.",
    heroHeadline: "Fast & Secure Doorstep Laptop Repair in Bengaluru.",
    heroSubtitle:
      "Cracked screens, battery drain, liquid damage, and motherboard issues resolved by ESD-certified engineers with a 90-day warranty and zero data loss pledge.",
    startingPrice: 399,
    diagnosticFee: 199,
    warrantyDays: 90,
    avgResponseTime: "Under 60 mins",
    categoryGroup: "Electronics",
    iconName: "Laptop",
    supportedBrands: [
      "Apple (MacBook)",
      "Dell",
      "HP",
      "Lenovo (ThinkPad)",
      "Asus",
      "Acer",
      "MSI",
      "Microsoft Surface",
      "Samsung",
      "LG Gram",
    ],
    serviceFeatures: [
      "ESD-safe anti-static portable workbench protocol",
      "A-grade IPS/OLED display panels and OEM-spec batteries",
      "Strict data confidentiality and privacy guarantee (no data access needed)",
      "90-day comprehensive warranty on hardware replacements",
    ],
    popularIssues: [
      "Cracked display or blank screen",
      "Battery draining fast or not charging",
      "Liquid damage & motherboard shorting",
      "Overheating and thermal paste renewal",
      "Keyboard key replacement / trackpad lag",
    ],
    commonProblems: [
      {
        title: "Cracked or Flickering Display Panel",
        symptoms: "Spiderweb fractures on screen; colored vertical lines, or display backlight dimming.",
        likelyCause: "Physical impact shock, cracked IPS matrix, or damaged LVDS eDP display flex cable.",
        solution: "Original IPS/OLED display panel replacement with calibrated color gamut matching.",
        typicalDuration: "30–45 mins",
      },
      {
        title: "Battery Not Charging or Sudden Shutdowns",
        symptoms: "Laptop shuts off as soon as charger is unplugged; 'Service Recommended' battery warning.",
        likelyCause: "Degraded lithium-ion cells with high cycle counts, blown charging IC, or DC jack wear.",
        solution: "OEM specification battery replacement and DC charging rail voltage verification.",
        typicalDuration: "25–40 mins",
      },
      {
        title: "Liquid Spill & Motherboard Short Circuit",
        symptoms: "Coffee or water spilled onto keyboard; power LED blinks once and machine stays dead.",
        likelyCause: "Corrosion bridges across SMD capacitors and power rails; blown power management IC.",
        solution: "Ultrasonic PCB cleaning, micro-soldering short removal, and power rail re-establishment.",
        typicalDuration: "90–120 mins",
      },
      {
        title: "Extreme Overheating & Thermal Throttling",
        symptoms: "Fan screaming continuously; laptop base burning hot; CPU speed throttles down to 0.79 GHz.",
        likelyCause: "Dried out factory thermal paste, blocked heatsink exhaust fins, or bearing friction in fan.",
        solution: "High-thermal conductivity paste reapplication (Artic MX-4/Noctua) and ultrasonic fan de-dusting.",
        typicalDuration: "35–50 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Non-Intrusive Hardware Diagnostics",
        description:
          "Engineer boots hardware diagnostics to test RAM, SSD health, display signaling, and battery capacity.",
        outcome: "Accurate problem report without accessing personal files.",
      },
      {
        step: "02",
        title: "Quotation & Component Specification",
        description:
          "Transparent pricing with exact screen resolution, battery mAh, and part serial numbers specified.",
        outcome: "Clear, upfront cost before any disassembly.",
      },
      {
        step: "03",
        title: "ESD-Safe Clean Workbench Repair",
        description:
          "Disassembly conducted using anti-static wrist straps, magnetic screw organizers, and specialized prying tools.",
        outcome: "Chassis and motherboard protected from static discharge.",
      },
      {
        step: "04",
        title: "Post-Repair Stress & Sensor Benchmark",
        description:
          "Display color test, battery charge/discharge curve check, and thermal stress test performed.",
        outcome: "Full hardware verification before handover.",
      },
      {
        step: "05",
        title: "90-Day Digital Warranty Issuance",
        description:
          "Your tamper-proof digital repair certificate with component serial number is logged in your account.",
        outcome: "Longest 90-day warranty protection in the industry.",
      },
    ],
    serviceBenefits: [
      {
        title: "Data Privacy & Confidentiality Guarantee",
        desc: "Repairs are performed in front of you. Technicians do not require or ask for your user password.",
        icon: "ShieldCheck",
      },
      {
        title: "Grade-A Original Panels",
        desc: "Replacement displays match original resolution, refresh rates, and color reproduction standard.",
        icon: "CheckCircle2",
      },
      {
        title: "90-Day Warranty Protection",
        desc: "Enjoy 90 days of guaranteed protection on all replaced hardware components.",
        icon: "Award",
      },
      {
        title: "Doorstep Tech Park Coverage",
        desc: "Available across tech parks and residential apartments throughout Bengaluru.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Do I need to share my laptop password with the technician?",
        answer:
          "No. All hardware diagnostics can be run using hardware diagnostic UEFI utilities or live test USB drives in your presence. We strictly uphold your privacy.",
      },
      {
        question: "How long does a screen replacement take?",
        answer:
          "Screen replacements for standard Dell, HP, Lenovo, and Asus laptops take approximately 30 to 45 minutes right at your doorstep or office desk.",
      },
      {
        question: "Do you repair Apple MacBooks?",
        answer:
          "Yes. Our certified technicians service MacBook Air and MacBook Pro models (including M1, M2, M3 series) for screen assemblies, trackpads, keyboards, and battery swaps.",
      },
      {
        question: "What is your warranty policy on laptop parts?",
        answer:
          "All laptop screens, batteries, and keyboards come with a guaranteed 90-day RepairTrust service warranty.",
      },
    ],
  },
  {
    id: "refrigerator-repair",
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    shortDesc: "Inverter compressor repair, defrost failure fix, thermostat and gas leakage solutions.",
    longDesc:
      "A malfunctioning refrigerator can spoil groceries and create immediate distress. RepairTrust provides certified refrigerator technicians across Bengaluru for single-door, double-door, side-by-side, and inverter multi-door models. We specialize in inverter compressor diagnostics, defrost thermostat replacements, and food-grade sealed gas recharging.",
    heroHeadline: "Same-Day Refrigerator Repair at Your Home in Bengaluru.",
    heroSubtitle:
      "Prompt doorstep diagnostics for cooling breakdown, excess frost, compressor humming, and water leaks from verified appliance engineers.",
    startingPrice: 349,
    diagnosticFee: 199,
    warrantyDays: 60,
    avgResponseTime: "Under 40 mins",
    categoryGroup: "Appliances",
    iconName: "Refrigerator",
    supportedBrands: [
      "Samsung",
      "LG",
      "Whirlpool",
      "Godrej",
      "Haier",
      "Bosch",
      "Panasonic",
      "Hitachi",
      "Liebherr",
      "Electrolux",
    ],
    serviceFeatures: [
      "Digital temperature logging and inverter compressor diagnostics",
      "Food-grade safe copper tubing and certified sealants",
      "60-day doorstep warranty on compressor relays, sensors, and gas joints",
      "Upfront transparent line-item pricing",
    ],
    popularIssues: [
      "Freezer cold but bottom not cooling",
      "Excess ice buildup / defrost sensor failure",
      "Compressor humming but not starting",
      "Water pooling under vegetable crisper",
      "Door gasket rubber loose / damaged",
    ],
    commonProblems: [
      {
        title: "Freezer Working but Refrigerator Section Warm",
        symptoms: "Freezer makes ice, but food in fresh-food section spoils; weak airflow from air dampers.",
        likelyCause: "Defrost heater burnout, bi-metal thermostat open circuit, or evaporator fan motor stuck.",
        solution: "Defrost system circuit test, thermal fuse replacement, and air duct ice clearance.",
        typicalDuration: "40–60 mins",
      },
      {
        title: "Excessive Frost / Ice Choking the Evaporator",
        symptoms: "Thick frost blankets back freezer panel; airflow completely blocked; motor runs non-stop.",
        likelyCause: "Defective defrost timer or control board defrost relay failure.",
        solution: "Automated defrost cycle testing, timer/board relay replacement, and heat-gun de-icing.",
        typicalDuration: "45–60 mins",
      },
      {
        title: "Compressor Clicking & Not Cooling",
        symptoms: "Clicking sound every 2 minutes from rear bottom; compressor gets scorching hot but doesn't pump.",
        likelyCause: "Burnt PTC start relay, damaged run capacitor, or locked compressor rotor.",
        solution: "Relay capacitor replacement, winding megger test, or inverter driver board repair.",
        typicalDuration: "40–60 mins",
      },
      {
        title: "Water Leakage on Kitchen Floor or Inside Tray",
        symptoms: "Water accumulates beneath vegetable crisper or leaks out from bottom front of the fridge.",
        likelyCause: "Clogged defrost drain tube, cracked drip pan above compressor, or misaligned gutter.",
        solution: "Hot-water drain tube purging, anti-fungal drainage clearing, and drip tray reseating.",
        typicalDuration: "25–40 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Thermal & Compressor Diagnostic Scan",
        description:
          "Technician measures evaporator temperatures with an infrared thermometer and tests compressor winding resistance.",
        outcome: "Accurate diagnosis of cooling system faults.",
      },
      {
        step: "02",
        title: "Itemized Cost Breakdown",
        description:
          "You receive a transparent quote detailing diagnostic charges, labor, and genuine replacement parts.",
        outcome: "Complete cost certainty before opening sealed lines.",
      },
      {
        step: "03",
        title: "Certified Refrigeration Service",
        description:
          "Repairs conducted using copper brazing rods, nitrogen purging, and digital vacuum gauges.",
        outcome: "Sealed refrigeration cycle restored to factory tolerances.",
      },
      {
        step: "04",
        title: "Pulldown Temperature Verification",
        description:
          "Technician monitors the temperature pulldown curve for 20 minutes to confirm rapid cooling.",
        outcome: "Proof of consistent cooling in both freezer and fresh-food compartments.",
      },
      {
        step: "05",
        title: "Digital Warranty Certificate",
        description:
          "Digital invoice with 60-day warranty confirmation generated directly on your mobile.",
        outcome: "Complete post-service protection.",
      },
    ],
    serviceBenefits: [
      {
        title: "Inverter Multi-Door Experts",
        desc: "Certified technicians trained on Linear Inverter, Smart Inverter, and dual-fan cooling engines.",
        icon: "ShieldCheck",
      },
      {
        title: "Food-Grade Safe Protocol",
        desc: "All sealants and lubricants are non-toxic and compliant with home refrigeration safety standards.",
        icon: "CheckCircle2",
      },
      {
        title: "60-Day Revisit Guarantee",
        desc: "Full warranty coverage on resolved faults with free revisit if issues recur.",
        icon: "Award",
      },
      {
        title: "Same-Day Emergency Response",
        desc: "Priority dispatch across Bengaluru to protect your refrigerated perishables.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Can inverter compressors be repaired, or must they be replaced?",
        answer:
          "Often the issue is with the inverter driver inverter board, PTC relay, or thermistor sensor rather than the compressor itself. Our technicians test electrical windings first to save you the expense of a new compressor whenever possible.",
      },
      {
        question: "Why is water collecting under the vegetable crisper?",
        answer:
          "This typically occurs when the defrost drainage hole at the back of the freezer is blocked by ice or food debris, causing melted frost to overflow into the bottom compartment. We clear and sanitize the entire drain channel.",
      },
      {
        question: "Do technicians carry refrigerant gas on-site?",
        answer:
          "Yes. Our technicians carry R600a and R134a refrigerants along with portable vacuum pumps and electronic leak detectors for doorstep charging.",
      },
      {
        question: "What is covered under the 60-day warranty?",
        answer:
          "The warranty covers all replaced sensors, relays, thermostats, fan motors, gas joints, and associated labor.",
      },
    ],
  },
  {
    id: "mobile-repair",
    slug: "mobile-repair",
    name: "Mobile Repair",
    shortDesc: "Doorstep screen replacement, charging port fix, microphone/speaker issue & battery refresh.",
    longDesc:
      "Cracked your screen or struggling with a battery that dies by noon? RepairTrust provides fast doorstep mobile repair across Bengaluru. Our trained mobile repair engineers arrive at your home or office equipped with precision ESD tools to replace screens, batteries, charging flexes, and speakers right in front of your eyes.",
    heroHeadline: "Doorstep Mobile Repair in Bengaluru within 30 Minutes.",
    heroSubtitle:
      "Screen replacements, battery upgrades, charging port repairs, and speaker fixes performed on-site with high-gamut displays and a 90-day warranty.",
    startingPrice: 249,
    diagnosticFee: 149,
    warrantyDays: 90,
    avgResponseTime: "Under 30 mins",
    categoryGroup: "Electronics",
    iconName: "Smartphone",
    supportedBrands: [
      "Apple (iPhone)",
      "Samsung Galaxy",
      "OnePlus",
      "Xiaomi / Redmi",
      "Realme",
      "Google Pixel",
      "Vivo",
      "Oppo",
      "Motorola",
      "Nothing Phone",
    ],
    serviceFeatures: [
      "30-minute doorstep repair executed in your presence",
      "High-gamut OLED/IPS grade displays with True Tone / 120Hz support",
      "Strict data privacy — zero access to photos, messages, or apps",
      "90-day warranty with digital barcode tracking",
    ],
    popularIssues: [
      "Shattered glass / touch unresponsive",
      "Battery dropping suddenly or swelling",
      "Charging cable loose / connector damaged",
      "No sound during voice calls",
      "Camera lens scratch or focus issue",
    ],
    commonProblems: [
      {
        title: "Shattered Front Glass or Touch Failure",
        symptoms: "Cracked glass, black ink bleeds (dead pixels), or ghost touches registering uncontrollably.",
        likelyCause: "Impact shock damaging the outer digitizer and OLED/LCD substrate.",
        solution: "Complete original display assembly replacement with precision waterproof adhesive sealing.",
        typicalDuration: "25–35 mins",
      },
      {
        title: "Rapid Battery Drain or Phone Swelling",
        symptoms: "Phone dies at 30%; battery health below 75%; rear glass lifting due to battery expansion.",
        likelyCause: "Chemical degradation of lithium polymer cells after 500+ charge cycles.",
        solution: "Installation of brand-new high-capacity OEM-spec battery with zero cycle count.",
        typicalDuration: "20–30 mins",
      },
      {
        title: "Charging Port Loose / Intermittent Connection",
        symptoms: "Cable must be held at an angle to charge; 'Moisture in USB port' warning won't disappear.",
        likelyCause: "Compacted pocket lint, bent connector pins, or oxidized daughterboard flex connector.",
        solution: "Anti-static lint extraction, pin realignment, or sub-board charging flex replacement.",
        typicalDuration: "20–35 mins",
      },
      {
        title: "Earpiece or Loudspeaker Distorted / Muffled",
        symptoms: "Cannot hear callers during normal calls unless speakerphone is turned on; crackling audio.",
        likelyCause: "Clogged micro-mesh acoustic filter or blown dynamic speaker coil.",
        solution: "Ultrasonic mesh acoustic decontamination or replacement of genuine earpiece module.",
        typicalDuration: "20–30 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Live Hardware Inspection",
        description:
          "Engineer runs diagnostic touch matrix, speaker frequency, proximity sensor, and battery health checks.",
        outcome: "Clear fault isolation right in your presence.",
      },
      {
        step: "02",
        title: "Upfront Fixed Quotation",
        description:
          "Transparent pricing with screen grade (OEM / Premium OLED) and warranty terms clearly stated.",
        outcome: "Zero price adjustments after opening the phone.",
      },
      {
        step: "03",
        title: "Precision Doorstep Assembly",
        description:
          "Engineer disassembles the phone on a heated magnetic mat, replaces the component, and installs new water-resistant seals.",
        outcome: "Factory-like fit and finish.",
      },
      {
        step: "04",
        title: "Multi-Touch & Sensor Calibration",
        description:
          "32-point multi-touch test, front sensor alignment, and biometric fingerprint/Face ID verification performed.",
        outcome: "All touch and biometric capabilities confirmed.",
      },
      {
        step: "05",
        title: "90-Day Warranty Invoice",
        description:
          "Digital warranty barcode sent to your phone with 90-day coverage on replaced parts.",
        outcome: "Instant digital proof of warranty.",
      },
    ],
    serviceBenefits: [
      {
        title: "100% Doorstep Privacy",
        desc: "Repairs performed right in front of you. You never have to hand over your phone or unlock your screen.",
        icon: "ShieldCheck",
      },
      {
        title: "High-Gamut Display Panels",
        desc: "OLED and IPS displays calibrated for true-to-life colors, accurate touch response, and high refresh rates.",
        icon: "CheckCircle2",
      },
      {
        title: "90-Day Doorstep Warranty",
        desc: "Touch response, display functionality, and battery performance guaranteed for 90 days.",
        icon: "Award",
      },
      {
        title: "Rapid 30-Minute Turnaround",
        desc: "Fast, convenient repairs that don't interrupt your work day.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Will my data be safe during screen or battery replacement?",
        answer:
          "Absolutely. Hardware repairs do not require phone formatting or accessing your storage. Furthermore, the repair is performed directly in front of you at your table or desk.",
      },
      {
        question: "Will True Tone and Face ID / Fingerprint work after screen replacement?",
        answer:
          "Yes. Our technicians use specialized programmers to transfer display serial data and carefully transfer biometric sensor assemblies so Face ID, Touch ID, and True Tone remain fully operational.",
      },
      {
        question: "How long does a doorstep screen replacement take?",
        answer:
          "A typical screen or battery replacement takes approximately 25 to 35 minutes.",
      },
      {
        question: "What does the 90-day mobile warranty cover?",
        answer:
          "The warranty covers any touch unresponsiveness, display flickering, dead pixels, or battery holding issues on the replaced components.",
      },
    ],
  },
  {
    id: "electrical-services",
    slug: "electrical",
    aliases: ["electrical-services"],
    name: "Electrical Services",
    shortDesc: "Certified electricians for short circuit detection, MCB tripping, rewiring & heavy appliance setup.",
    longDesc:
      "Electrical faults are urgent safety hazards that require government-licensed wiremen. RepairTrust connects Bengaluru homeowners and businesses with background-verified electricians trained in short-circuit detection, MCB tripping diagnostics, earthing audits, modular switchboard installations, and heavy appliance cabling.",
    heroHeadline: "Licensed & Verified Electricians at Your Doorstep in Bengaluru.",
    heroSubtitle:
      "From sudden power trips and burnt switchboards to inverter wiring and safety audits, get fast, reliable electrical fixes with transparent line-item pricing.",
    startingPrice: 199,
    diagnosticFee: 149,
    warrantyDays: 30,
    avgResponseTime: "Under 20 mins",
    categoryGroup: "Home Utility",
    iconName: "Zap",
    supportedBrands: [
      "Schneider Electric",
      "Legrand",
      "Havells",
      "Anchor by Panasonic",
      "L&T",
      "Finolex",
      "Polycab",
      "V-Guard",
      "Luminous",
      "Microtek",
    ],
    serviceFeatures: [
      "Government-licensed wiremen with CAT-III digital multimeters",
      "Complete earthing voltage leakage test with every booking",
      "Strict insulated 1000V safety protocol standard",
      "30-day workmanship warranty on all electrical fixes",
    ],
    popularIssues: [
      "Frequent MCB tripping / spark sounds",
      "Switchboard burnt or loose wiring",
      "Inverter & battery wiring installation",
      "Ceiling fan wobbling / regulator failure",
      "Geyser / high-power plug safety audit",
    ],
    commonProblems: [
      {
        title: "Frequent MCB or RCCB/ELCB Tripping",
        symptoms: "Main circuit breaker trips repeatedly; resetting immediately knocks power out again.",
        likelyCause: "Insulation breakdown causing earth leakage, neutral-to-ground short, or overloaded circuit.",
        solution: "Megger insulation resistance testing, load rebalancing, and circuit branch isolation.",
        typicalDuration: "30–50 mins",
      },
      {
        title: "Burnt Switchboard or Sparking Sockets",
        symptoms: "Burning plastic smell, blackened socket faceplate, or crackling sound when plugging appliances in.",
        likelyCause: "Loose screw terminals causing high-resistance arcing, or undersized wiring for heavy load.",
        solution: "Modular switch/socket replacement, wire lugging, and fire-resistant heat-shrink insulation.",
        typicalDuration: "25–40 mins",
      },
      {
        title: "Inverter / UPS Not Charging or Backup Failure",
        symptoms: "Inverter stays on mains when power fails, or alarm beeps constantly without charging battery.",
        likelyCause: "Blown inverter glass fuse, loose battery terminal corrosion, or changeover relay fault.",
        solution: "Terminal desulfation, changeover relay replacement, and output voltage calibration.",
        typicalDuration: "35–50 mins",
      },
      {
        title: "Tingling Electric Shock from Taps or Appliances",
        symptoms: "Mild electrical shock felt when touching geyser water, refrigerator door, or metal fixtures.",
        likelyCause: "Disconnected building earthing pit, corroded earth wire, or heating element insulation breach.",
        solution: "Earth-to-neutral voltage test, earth electrode reconnecting, and faulty appliance isolation.",
        typicalDuration: "30–45 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Voltage & Earthing Safety Audit",
        description:
          "Electrician tests phase-neutral-earth voltage levels and circuit continuity using digital multimeters.",
        outcome: "Exact fault identified with zero guesswork.",
      },
      {
        step: "02",
        title: "Standardized Quotation Review",
        description:
          "Clear line-item quote provided before touching wiring, based on standardized transparent rate cards.",
        outcome: "Zero arbitrary fees or surprise charges.",
      },
      {
        step: "03",
        title: "Insulated Heavy-Duty Execution",
        description:
          "All connections crimped with proper ferrules, flame-retardant tapes, and ISI-marked branded switchgear.",
        outcome: "Safe, code-compliant, fire-safe electrical installation.",
      },
      {
        step: "04",
        title: "Full Load & Trip Verification",
        description:
          "Circuits tested under full operating load; MCB tripping thresholds and ground fault sensitivity verified.",
        outcome: "Verified safety before re-energizing main power.",
      },
      {
        step: "05",
        title: "30-Day Workmanship Warranty",
        description:
          "Digital invoice and warranty certificate issued with 30-day free revisit support.",
        outcome: "Reliable and worry-free home electrification.",
      },
    ],
    serviceBenefits: [
      {
        title: "Government Licensed Wiremen",
        desc: "All technicians carry certified wireman licenses and adhere to national electrical code standards.",
        icon: "ShieldCheck",
      },
      {
        title: "Complimentary Earthing Check",
        desc: "Every visit includes a free earth-neutral voltage test to protect your family from accidental shocks.",
        icon: "CheckCircle2",
      },
      {
        title: "30-Day Workmanship Warranty",
        desc: "Guaranteed revisit coverage on all installations, wiring, and switchboard repairs.",
        icon: "Award",
      },
      {
        title: "Rapid Emergency Response",
        desc: "Average arrival in under 20 minutes across core Bengaluru localities for urgent power trips.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Why does my MCB trip whenever I turn on the geyser or AC?",
        answer:
          "This indicates either a high-power overload exceeding the breaker's rated amperage (e.g., a 10A breaker powering a 16A appliance) or a short circuit / insulation breakdown inside the appliance. Our electrician will measure actual current draw and rebalance the circuit.",
      },
      {
        question: "Do you supply replacement switches and wires?",
        answer:
          "Yes. Our electricians carry genuine ISI-marked modular switches, sockets, and fire-resistant (FR) cables from Havells, Anchor, and Legrand with transparent retail pricing.",
      },
      {
        question: "Is it safe to reset a tripping breaker repeatedly?",
        answer:
          "No. Repeatedly resetting a tripping breaker can cause dangerous electrical arcing and melt internal wiring. Leave it off and book an inspection immediately.",
      },
      {
        question: "What is your pricing policy for electrical services?",
        answer:
          "Minor installations start at ₹199 with a standard ₹149 diagnostic fee that is adjusted if you proceed with the repair. You will receive an exact line-item quote upfront.",
      },
    ],
  },
  {
    id: "plumbing",
    slug: "plumbing",
    name: "Plumbing",
    shortDesc: "Prompt fixes for pipe burst, concealed wall leakages, tap fittings, flush tanks & clogged drains.",
    longDesc:
      "Plumbing breakdowns like damp wall seepages, broken angle valves, and clogged drains can cause immediate water damage to your home. RepairTrust connects you with experienced, verified plumbers across Bengaluru equipped with pipe pressure testers, drain snakes, and high-grade CPVC fittings for permanent fixes.",
    heroHeadline: "Professional Doorstep Plumbing Services in Bengaluru.",
    heroSubtitle:
      "Fast response for pipe bursts, concealed wall seepages, tap replacements, and clogged drains by background-verified Bengaluru plumbers.",
    startingPrice: 199,
    diagnosticFee: 149,
    warrantyDays: 30,
    avgResponseTime: "Under 25 mins",
    categoryGroup: "Home Utility",
    iconName: "Wrench",
    supportedBrands: [
      "Jaquar",
      "Kohler",
      "Hindware",
      "Cera",
      "Grohe",
      "Parryware",
      "Astral Pipes",
      "Ashirvad Pipes",
      "Supreme",
      "Finolex",
    ],
    serviceFeatures: [
      "Non-invasive moisture meter inspection for concealed damp walls",
      "Heavy-duty CPVC & brass fittings for high-pressure Bengaluru apartments",
      "Clean post-service cleanup policy with zero debris left behind",
      "30-day warranty against leaks on installed joints and fixtures",
    ],
    popularIssues: [
      "Concealed pipeline seepage / damp walls",
      "Leaking mixer taps and angle valves",
      "Clogged kitchen sink or bathroom drain",
      "Overhead water tank float ball valve fix",
      "Pressure booster pump troubleshooting",
    ],
    commonProblems: [
      {
        title: "Concealed Wall Seepage & Water Stains",
        symptoms: "Paint blistering and peeling; white powdery salt deposits (efflorescence) on bedroom/bathroom walls.",
        likelyCause: "Hairline crack in concealed CPVC/GI pipe, cracked tile grout, or weeping shower mixer joint.",
        solution: "Acoustic / moisture pin locator, targeted localized opening, pipe splicing, and pressure testing.",
        typicalDuration: "60–90 mins",
      },
      {
        title: "Dripping Taps & Snapped Angle Valves",
        symptoms: "Constant tap drip wasting water; angle valve snapped at thread during filter installation.",
        likelyCause: "Worn ceramic disc cartridge, degraded rubber O-rings, or brittle low-grade alloy valves.",
        solution: "Valve extractor threading, heavy brass replacement, and Teflon thread sealing.",
        typicalDuration: "25–40 mins",
      },
      {
        title: "Completely Clogged Kitchen Sink or Shower Drain",
        symptoms: "Water backs up into basin; gurgling sound in drainage pipes; foul sewer odors.",
        likelyCause: "Accumulated grease, hair buildup, and soap scum forming dense plugs in P-trap or waste line.",
        solution: "Mechanical rotary drain auger clearing, P-trap sanitization, and hot enzyme flush.",
        typicalDuration: "30–45 mins",
      },
      {
        title: "Toilet Flush Tank Running Constantly",
        symptoms: "Water constantly trickles down toilet bowl; flush cistern never fills up or stops hissing.",
        likelyCause: "Perished flapper valve seal, worn siphon diaphragm, or misaligned float valve arm.",
        solution: "Dual-flush siphon assembly overhaul and float valve recalibration.",
        typicalDuration: "30–40 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Pressure & Moisture Diagnostic Inspection",
        description:
          "Plumber traces plumbing lines, tests static water pressure, and inspects concealed joints for seepage.",
        outcome: "Exact leak origin identified before breaking any tiles.",
      },
      {
        step: "02",
        title: "Itemized Rate Presentation",
        description:
          "Standard line-item quote provided detailing brass fittings, CPVC pipes, and labor charges.",
        outcome: "Fixed cost commitment before beginning work.",
      },
      {
        step: "03",
        title: "High-Pressure Plumbing Execution",
        description:
          "Repairs performed using heavy-duty Astral/Ashirvad solvent weld fittings and brass threaded couplings.",
        outcome: "Permanent leak-free connection designed for booster pumps.",
      },
      {
        step: "04",
        title: "Pressure & Flow Stress Testing",
        description:
          "Water supply restored and pressure tested at full flow to verify zero weepage around joints.",
        outcome: "Demonstrated leak-free performance.",
      },
      {
        step: "05",
        title: "30-Day Leak-Free Warranty",
        description:
          "Digital warranty certificate issued with 30-day revisit support on all installed plumbing joints.",
        outcome: "Total protection for your home's walls and floors.",
      },
    ],
    serviceBenefits: [
      {
        title: "High-Pressure System Experts",
        desc: "Specialized in Bengaluru high-rise apartment booster pressure systems and concealed plumbing.",
        icon: "ShieldCheck",
      },
      {
        title: "Heavy Brass & Certified CPVC",
        desc: "We exclusively use heavy-duty dezincification-resistant brass valves and lead-free pipes.",
        icon: "CheckCircle2",
      },
      {
        title: "30-Day Leak-Free Warranty",
        desc: "All replaced joints and fittings come with a 30-day guarantee with zero labor revisit charges.",
        icon: "Award",
      },
      {
        title: "Zero Mess Commitment",
        desc: "Technicians wipe clean work areas and safely dispose of any old corroded pipes.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Can you fix damp walls without breaking all bathroom tiles?",
        answer:
          "Yes. Our plumbers use non-invasive moisture meters and line tracing to isolate the exact leaking fitting, allowing targeted 1-tile repair rather than tearing down entire walls.",
      },
      {
        question: "Why did my angle valve snap off inside the wall fitting?",
        answer:
          "Many builder-grade angle valves are made from low-grade zinc alloys (pot metal) that corrode over 2-3 years. Our plumbers carry specialized internal pipe extractors to safely remove the broken threads without damaging your concealed plumbing.",
      },
      {
        question: "Do you clear heavy kitchen drain clogs?",
        answer:
          "Yes. We carry mechanical steel drain snakes that cut through stubborn grease plugs and hair clogs safely without damaging PVC waste pipes.",
      },
      {
        question: "What is your warranty on plumbing repairs?",
        answer:
          "Every plumbing repair and fixture replacement carries a 30-day RepairTrust service warranty.",
      },
    ],
  },
  {
    id: "tv-repair",
    slug: "tv-repair",
    name: "TV Repair",
    shortDesc: "Specialized technicians for LED, OLED & 4K Smart TVs: display backlight, power board & HDMI.",
    longDesc:
      "Modern Smart TVs have sensitive micro-electronic circuits and fragile display panels. RepairTrust provides certified display technicians in Bengaluru for LED, OLED, QLED, and 4K Smart TVs. We specialize in uniform LED backlight strip replacements, chip-level SMPS power board repairs, T-Con panel timing calibration, and motherboard re-flashing.",
    heroHeadline: "Specialized Doorstep Smart TV Repair in Bengaluru.",
    heroSubtitle:
      "Expert fixes for dark screens, sound with no picture, vertical lines, and power blinking errors by certified electronics engineers with a 60-day warranty.",
    startingPrice: 399,
    diagnosticFee: 199,
    warrantyDays: 60,
    avgResponseTime: "Under 45 mins",
    categoryGroup: "Electronics",
    iconName: "Tv",
    supportedBrands: [
      "Sony Bravia",
      "Samsung",
      "LG OLED/NanoCell",
      "Xiaomi (Mi TV)",
      "TCL",
      "OnePlus TV",
      "Vu",
      "Hisense",
      "Panasonic",
      "Philips",
    ],
    serviceFeatures: [
      "Component-level power board and motherboard micro-soldering",
      "Uniform aluminum-backed LED backlight array replacement",
      "T-Con board signal calibration with oscilloscope verification",
      "60-day comprehensive warranty on replaced electronics",
    ],
    popularIssues: [
      "Sound coming but screen completely dark",
      "Horizontal or vertical colored lines",
      "TV stuck on boot logo / restarting",
      "HDMI ports not detecting devices",
      "Power light blinking without turning on",
    ],
    commonProblems: [
      {
        title: "Sound Audible but Screen Completely Black",
        symptoms: "Audio plays normally; flashlight held against screen shows faint silhouette of picture.",
        likelyCause: "Burnt LED backlight strip diodes or failed constant-current LED driver IC.",
        solution: "Full set aluminum-substrate LED backlight replacement and current driver recalibration.",
        typicalDuration: "45–60 mins",
      },
      {
        title: "Red Standby Light Blinking & TV Won't Turn On",
        symptoms: "TV remains in standby; LED flashes in specific counts (e.g. Sony 6-blink error code).",
        likelyCause: "Blown MOSFET in primary switch-mode power supply (SMPS) or shorted secondary diodes.",
        solution: "Component-level micro-soldering repair of power board and capacitor bank replacement.",
        typicalDuration: "40–60 mins",
      },
      {
        title: "TV Stuck on Brand Logo or Bootlooping",
        symptoms: "Screen displays Android / WebOS boot logo indefinitely, or reboots every 30 seconds.",
        likelyCause: "Corrupted eMMC NAND flash memory firmware or unstable main SoC voltage rail.",
        solution: "Firmware re-programming via RT809H programmer or main logic board replacement.",
        typicalDuration: "45–60 mins",
      },
      {
        title: "HDMI Ports Not Detecting Set-Top Box or Console",
        symptoms: "'No Signal' message when plugging in Firestick, gaming console, or set-top box.",
        likelyCause: "Static discharge (ESD) through HDMI cable frying the HDMI receiver switch IC.",
        solution: "HDMI switch chip micro-soldering replacement and transient voltage suppressor renewal.",
        typicalDuration: "45–60 mins",
      },
    ],
    repairProcess: [
      {
        step: "01",
        title: "Oscilloscope & Voltage Diagnostics",
        description:
          "Engineer measures 12V, 24V, and VGH/VGL panel voltages with digital multimeters to pinpoint the faulty board.",
        outcome: "Clear board-level fault diagnosis.",
      },
      {
        step: "02",
        title: "Component Quotation Review",
        description:
          "Transparent quotation breaking down component micro-repair vs. full board replacement.",
        outcome: "Cost clarity before opening the display matrix.",
      },
      {
        step: "03",
        title: "Clean Cushion-Mat Disassembly",
        description:
          "TV rested face down on anti-scratch foam pads; display panel suction handled to prevent glass flex cracks.",
        outcome: "Zero scratches or bezel damage.",
      },
      {
        step: "04",
        title: "Picture & Audio Calibration",
        description:
          "Color balance, backlight brightness uniformity, audio harmonic check, and port testing across all HDMIs.",
        outcome: "Crisp, vibrant picture and clear sound verified.",
      },
      {
        step: "05",
        title: "60-Day Digital Warranty Issuance",
        description:
          "Digital warranty certificate logged with replaced board/diode part numbers.",
        outcome: "Complete reassurance for your home entertainment.",
      },
    ],
    serviceBenefits: [
      {
        title: "Chip-Level Electronics Specialists",
        desc: "Engineers trained in micro-soldering individual ICs and capacitors, saving you the cost of full motherboard replacement.",
        icon: "ShieldCheck",
      },
      {
        title: "Aluminum Backlight Strips",
        desc: "We exclusively use high-heat-dissipation aluminum LED strips rather than cheap copper ones for longer lifespan.",
        icon: "CheckCircle2",
      },
      {
        title: "60-Day Comprehensive Warranty",
        desc: "Replaced backlights, boards, and micro-components carry an unconditional 60-day revisit warranty.",
        icon: "Award",
      },
      {
        title: "Cushioned On-Site Handling",
        desc: "Specialized EVA foam mats and suction lifters prevent panel stress cracks during repair.",
        icon: "Lock",
      },
    ],
    faqs: [
      {
        question: "Can an LED backlight repair be done at home?",
        answer:
          "Yes. Our technicians carry specialized soft foam repair tables and suction lifters to replace LED backlight arrays right in your living room in approximately 45 to 60 minutes.",
      },
      {
        question: "Why does my TV have sound but a completely dark screen?",
        answer:
          "In 95% of cases, this is caused by a burnt LED backlight diode that triggers the safety shutdown of the entire backlight circuit while the display panel and audio processor remain completely healthy. Replacing the backlight strips resolves it completely.",
      },
      {
        question: "Can cracked TV screen glass be repaired?",
        answer:
          "If the glass LCD/OLED substrate itself is physically cracked, repair is generally not economical as replacement glass panels often cost 75–80% of a brand-new TV. However, if the glass is intact and the issue is internal lines or black screen, it can be repaired.",
      },
      {
        question: "What is your warranty on TV repairs?",
        answer:
          "All TV repairs, replaced backlights, and electronic boards are backed by a 60-day RepairTrust service warranty.",
      },
    ],
  },
];

// Helper to look up a service by slug or id
export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  const cleanSlug = slug.toLowerCase();
  return POPULAR_SERVICES.find(
    (s) =>
      s.slug.toLowerCase() === cleanSlug ||
      s.id.toLowerCase() === cleanSlug ||
      s.aliases?.some((a) => a.toLowerCase() === cleanSlug)
  );
}

// All valid slug paths for static generation
export const ALL_SERVICE_SLUGS = [
  "ac-repair",
  "washing-machine-repair",
  "laptop-repair",
  "refrigerator-repair",
  "mobile-repair",
  "electrical",
  "plumbing",
  "tv-repair",
];
