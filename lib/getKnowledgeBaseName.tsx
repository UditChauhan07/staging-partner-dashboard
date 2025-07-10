import { countAgentsbyUserId } from "../Services/auth";

interface BusinessInfo {
  businessType?: string;
  customBuisness?: string;
  businessName?: string;
}

const businessTypes = [
  { name: "Restaurant", code: "rest" },
  { name: "Bakery", code: "bake" },
  { name: "Deli shop", code: "deli" },
  { name: "Real Estate Broker", code: "rea_est_bro" },
  { name: "Property Rental & Leasing Service", code: "prop_ren_lea" },
  { name: "Architect", code: "arch" },
  { name: "Interior Designer", code: "int_des" },
  { name: "Construction Services", code: "con_ser" },
  { name: "Landscaping Company", code: "land_com" },
  { name: "Doctor's Clinic", code: "doct_cli" },
  { name: "Dentist", code: "dent_off" },
  { name: "Old Age Home", code: "old_age" },
  { name: "Gym & Fitness Center", code: "gym_fit" },
  { name: "Personal Trainer", code: "per_tra" },
  { name: "Insurance Agency", code: "ins_age" },
  { name: "Accounting Services", code: "acc_ser" },
  { name: "Financial Planners", code: "fin_pla" },
  { name: "Travel Agency", code: "trav_age" },
  { name: "Ticket Booking", code: "tick_boo" },
  { name: "Tour Guides", code: "tour_gui" },
  { name: "Beauty Parlour", code: "bea_par" },
  { name: "Nail Saloon", code: "nai_sal" },
  { name: "Saloon", code: "sal" },
  { name: "Barber Studio/Shop", code: "barb" },
  { name: "Hair Stylist", code: "hai_sty" },
  { name: "Dry Cleaner", code: "dry_cle" },
  { name: "Cleaning/Janitorial Service", code: "clea_jan_ser" },
  { name: "Web Design Agency", code: "web_des_age" },
  { name: "Marketing Agency", code: "mkt_age" },
  { name: "Car & Bus Services", code: "car_bus_ser" },
  { name: "Taxi, Cab & Limo Booking", code: "tax_cab_limo" },
  { name: "Movers & Packers", code: "mov_pac" },
  { name: "Trucking Company", code: "truc_com" },
  { name: "Car Repair & Garage", code: "car_rep" },
  { name: "Boat Repair & Maintenance", code: "boa_rep" },
];


export const getKnowledgeBaseName = async (): Promise<string | null> => {
  let agentCount = 0;
  const agentCode = localStorage.getItem("agentCode") || "code";
  const userId = localStorage.getItem("AgentForuserId") || "";

  if (!userId) {
    console.error("User ID not found in localStorage");
    return null;
  }

  try {
    agentCount = await countAgentsbyUserId(userId);
  } catch (error) {
    console.error("Error generating knowledgeBaseName:", error);
    return null;
  }

  const businessTypeLocal = localStorage.getItem("businessType") || "";
  const matchedBusiness = businessTypes.find(
    (item) => item.name === businessTypeLocal
  );

  const businessCode = matchedBusiness ? matchedBusiness.code : "oth";

  return `${businessCode}_${userId}_${agentCode}_#${agentCount + 1}`;
};