export interface FAQItem {
  id: string;
  category: "Bookings" | "Quotations" | "Payments" | "Technicians" | "Warranties";
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Bookings",
    question: "How do I request a repair on RepairTrust?",
    answer:
      "Simply choose your repair category, describe the issue you are experiencing, and select your Bengaluru location. Verified local technicians will review your request and send transparent quotations with estimated turnaround times.",
  },
  {
    id: "faq-2",
    category: "Bookings",
    question: "How quickly can a technician arrive at my home in Bengaluru?",
    answer:
      "Depending on your locality (such as Koramangala, Indiranagar, HSR Layout, or Whitefield), technicians can arrive in as little as 30 to 60 minutes for urgent diagnostic requests, or at any time slot convenient to your schedule.",
  },
  {
    id: "faq-3",
    category: "Quotations",
    question: "How are repair quotations calculated?",
    answer:
      "RepairTrust mandates transparent line-item pricing. Every quote clearly breaks down: (1) Standard diagnostic/inspection fee, (2) Labor charges, (3) Necessary genuine spare parts with exact part specifications, and (4) Applicable taxes. Technicians cannot add hidden fees after you accept a quote.",
  },
  {
    id: "faq-4",
    category: "Quotations",
    question: "What happens if additional faults are found during physical diagnosis?",
    answer:
      "The technician cannot proceed with additional repairs or charge extra without your explicit approval. If an unpredicted issue is discovered upon opening the appliance, an amended digital quotation is issued inside the platform for you to review and approve.",
  },
  {
    id: "faq-5",
    category: "Payments",
    question: "When and how do I pay for the repair?",
    answer:
      "You never pay in advance before diagnosis. Payment is only completed once the technician finishes the repair, runs a live demonstration test, and issues your digital repair record. You can pay securely via UPI, credit/debit cards, net banking, or cash upon satisfaction.",
  },
  {
    id: "faq-6",
    category: "Technicians",
    question: "How does RepairTrust verify technicians before they visit homes?",
    answer:
      "Every technician undergoes a rigorous four-layer onboarding protocol: Government identity & Aadhaar validation, police background clearance, trade certification / hands-on practical skill assessment, and an orientation on our strict code of conduct and safety guidelines.",
  },
  {
    id: "faq-7",
    category: "Technicians",
    question: "Can I choose which technician comes to my house?",
    answer:
      "Yes! When you submit a repair request, you receive competitive quotes from available verified technicians in your area. You can compare their ratings, specific domain experience, response speed, and price breakdown before confirming your appointment.",
  },
  {
    id: "faq-8",
    category: "Warranties",
    question: "What does the RepairTrust Service Warranty cover?",
    answer:
      "Every completed repair comes with a guaranteed 30 to 90-day warranty (depending on the service and spare parts installed). If the identical fault reoccurs within the warranty window, a certified technician will revisit and resolve it at zero additional labor cost.",
  },
  {
    id: "faq-9",
    category: "Warranties",
    question: "How do I access my digital repair record and warranty card?",
    answer:
      "Upon completion of service, a tamper-proof digital repair certificate is automatically generated and linked to your phone number and email. It includes technician details, parts serial numbers, labor logs, and an active countdown timer for your warranty validity.",
  },
  {
    id: "faq-10",
    category: "Bookings",
    question: "What if I need to reschedule or cancel my appointment?",
    answer:
      "You can freely reschedule or cancel your visit up to 1 hour before the scheduled arrival time directly through the platform or by contacting our Bengaluru customer helpline without cancellation penalties.",
  },
];
