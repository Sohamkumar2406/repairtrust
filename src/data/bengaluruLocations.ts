export interface BengaluruLocation {
  id: string;
  name: string;
  zone: "East" | "South" | "North" | "West" | "Central";
  pincode: string;
  popular: boolean;
}

export const BENGALURU_LOCATIONS: BengaluruLocation[] = [
  { id: "koramangala", name: "Koramangala", zone: "South", pincode: "560034", popular: true },
  { id: "indiranagar", name: "Indiranagar", zone: "East", pincode: "560038", popular: true },
  { id: "hsr-layout", name: "HSR Layout", zone: "South", pincode: "560102", popular: true },
  { id: "whitefield", name: "Whitefield", zone: "East", pincode: "560066", popular: true },
  { id: "bellandur", name: "Bellandur", zone: "South", pincode: "560103", popular: true },
  { id: "jayanagar", name: "Jayanagar", zone: "South", pincode: "560011", popular: true },
  { id: "jp-nagar", name: "JP Nagar", zone: "South", pincode: "560078", popular: true },
  { id: "marathahalli", name: "Marathahalli", zone: "East", pincode: "560037", popular: true },
  { id: "electronic-city", name: "Electronic City", zone: "South", pincode: "560100", popular: true },
  { id: "btm-layout", name: "BTM Layout", zone: "South", pincode: "560068", popular: true },
  { id: "malleshwaram", name: "Malleshwaram", zone: "North", pincode: "560003", popular: true },
  { id: "hebbal", name: "Hebbal", zone: "North", pincode: "560024", popular: false },
  { id: "sarjapur-road", name: "Sarjapur Road", zone: "South", pincode: "560035", popular: true },
  { id: "rajajinagar", name: "Rajajinagar", zone: "West", pincode: "560010", popular: false },
  { id: "banashankari", name: "Banashankari", zone: "South", pincode: "560050", popular: false },
  { id: "mg-road", name: "MG Road / Central", zone: "Central", pincode: "560001", popular: false },
];
