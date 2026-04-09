// Mexico Drug War Data Analysis
// Sources: INEGI, World Bank, RNPED, Academic Research

export interface President {
  id: string;
  name: string;
  shortName: string;
  party: string;
  termStart: string;
  termEnd: string;
  years: string;
  totalHomicides: number;
  avgPerYear: number;
  peakYear: number;
  peakHomicides: number;
  changeFromPrevious: string;
  keyPolicy: string;
  keyEvent: string;
  quote?: string;
  imageUrl: string;
}

export interface YearlyData {
  year: number;
  homicides: number;
  homicideRate: number; // per 100,000
  president: string;
  missing?: number;
}

export interface CartelData {
  name: string;
  founded: number;
  peak: string;
  states: number;
  color: string;
  leader?: string;
}

export interface KeyEvent {
  year: number;
  month?: number;
  title: string;
  description: string;
  deaths?: number;
  type: "policy" | "massacre" | "capture" | "cartel" | "political";
}

// Presidential Administration Data
export const presidents: President[] = [
  {
    id: "salinas",
    name: "Carlos Salinas de Gortari",
    shortName: "Salinas",
    party: "PRI",
    termStart: "Dec 1, 1988",
    termEnd: "Nov 30, 1994",
    years: "1988-1994",
    totalHomicides: 78000,
    avgPerYear: 13000,
    peakYear: 1992,
    peakHomicides: 16594,
    changeFromPrevious: "Baseline",
    keyPolicy: "NAFTA Implementation",
    keyEvent: "Drug routes shift as Colombian cartels lose power",
    quote: "Mexico is ready to compete in the global economy.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/salinas-eFYI3LA2wCj2yyg1Ae6KW4zVVd9hWl.jpeg",
  },
  {
    id: "zedillo",
    name: "Ernesto Zedillo Ponce de León",
    shortName: "Zedillo",
    party: "PRI",
    termStart: "Dec 1, 1994",
    termEnd: "Nov 30, 2000",
    years: "1994-2000",
    totalHomicides: 78000,
    avgPerYear: 13000,
    peakYear: 1997,
    peakHomicides: 15653,
    changeFromPrevious: "+0%",
    keyPolicy: "Peso Crisis Recovery",
    keyEvent: "Mexican cartels consolidate trafficking routes",
    quote: "We will fight corruption at all levels.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zedillo-yC3AgSzcKUGzKd2dmJRnZ8mYeL9Lgp.jpg",
  },
  {
    id: "fox",
    name: "Vicente Fox Quesada",
    shortName: "Fox",
    party: "PAN",
    termStart: "Dec 1, 2000",
    termEnd: "Nov 30, 2006",
    years: "2000-2006",
    totalHomicides: 60000,
    avgPerYear: 10000,
    peakYear: 2006,
    peakHomicides: 11806,
    changeFromPrevious: "-23%",
    keyPolicy: "Democratic Transition",
    keyEvent: "Cartels expand during political transition",
    quote: "Today Mexico has changed. We are a democracy.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fox-uDVxrzX8mjYNko4FcCxzhnjCWJDHiN.jpg",
  },
  {
    id: "calderon",
    name: "Felipe Calderón Hinojosa",
    shortName: "Calderón",
    party: "PAN",
    termStart: "Dec 1, 2006",
    termEnd: "Nov 30, 2012",
    years: "2006-2012",
    totalHomicides: 121000,
    avgPerYear: 20167,
    peakYear: 2011,
    peakHomicides: 27213,
    changeFromPrevious: "+102%",
    keyPolicy: "Military War on Drugs",
    keyEvent: "Deployed 6,500 troops to Michoacán (Dec 11, 2006)",
    quote: "We will not rest until we restore peace and security.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calderon-XK6dlH9nNtvecnUCEDzODys4AZ342a.jpg",
  },
  {
    id: "pena-nieto",
    name: "Enrique Peña Nieto",
    shortName: "Peña Nieto",
    party: "PRI",
    termStart: "Dec 1, 2012",
    termEnd: "Nov 30, 2018",
    years: "2012-2018",
    totalHomicides: 157000,
    avgPerYear: 26167,
    peakYear: 2017,
    peakHomicides: 31174,
    changeFromPrevious: "+30%",
    keyPolicy: "Kingpin Strategy",
    keyEvent: "El Chapo captured twice (2014, 2016); CJNG rises",
    quote: "Mexico is transforming.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pena_nieto-tFL4ms67uXgrOXyAmEbOUAZYpnnZvS.jpg",
  },
  {
    id: "amlo",
    name: "Andrés Manuel López Obrador",
    shortName: "AMLO",
    party: "MORENA",
    termStart: "Dec 1, 2018",
    termEnd: "Nov 30, 2024",
    years: "2018-2024",
    totalHomicides: 198000,
    avgPerYear: 33000,
    peakYear: 2019,
    peakHomicides: 36476,
    changeFromPrevious: "+26%",
    keyPolicy: "Abrazos, No Balazos (Hugs, Not Bullets)",
    keyEvent: "CJNG becomes dominant cartel; El Mencho rises to #1 target",
    quote: "The war is over. We will not confront violence with violence.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amlo-8OV2P9RattML1jB9arb0ulbo69a8I2.jpg",
  },
  {
    id: "sheinbaum",
    name: "Claudia Sheinbaum Pardo",
    shortName: "Sheinbaum",
    party: "MORENA",
    termStart: "Dec 1, 2024",
    termEnd: "Present",
    years: "2024-Present",
    totalHomicides: 25000,
    avgPerYear: 33000,
    peakYear: 2025,
    peakHomicides: 33800,
    changeFromPrevious: "Ongoing",
    keyPolicy: "Continuation + Security Focus",
    keyEvent: "El Mencho killed (Feb 22, 2026)",
    quote: "We will build a Mexico with justice and peace.",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sheinbaum-DuIclxJE8iU0BWkn1iYfcRYP5HPQKo.jpg",
  },
];

// Annual Homicide Data (1990-2026)
// Source: INEGI, extrapolated for recent years
export const yearlyData: YearlyData[] = [
  { year: 1990, homicides: 14520, homicideRate: 17.8, president: "Salinas" },
  { year: 1991, homicides: 15245, homicideRate: 18.3, president: "Salinas" },
  { year: 1992, homicides: 16594, homicideRate: 19.5, president: "Salinas" },
  { year: 1993, homicides: 15987, homicideRate: 18.4, president: "Salinas" },
  { year: 1994, homicides: 15839, homicideRate: 17.9, president: "Salinas" },
  { year: 1995, homicides: 15612, homicideRate: 17.2, president: "Zedillo" },
  { year: 1996, homicides: 14786, homicideRate: 15.9, president: "Zedillo" },
  { year: 1997, homicides: 15653, homicideRate: 16.5, president: "Zedillo" },
  { year: 1998, homicides: 14123, homicideRate: 14.6, president: "Zedillo" },
  { year: 1999, homicides: 12456, homicideRate: 12.6, president: "Zedillo" },
  { year: 2000, homicides: 10737, homicideRate: 10.7, president: "Zedillo" },
  { year: 2001, homicides: 10285, homicideRate: 10.1, president: "Fox" },
  { year: 2002, homicides: 10088, homicideRate: 9.7, president: "Fox" },
  { year: 2003, homicides: 10087, homicideRate: 9.6, president: "Fox" },
  { year: 2004, homicides: 9329, homicideRate: 8.7, president: "Fox" },
  { year: 2005, homicides: 9921, homicideRate: 9.1, president: "Fox" },
  { year: 2006, homicides: 11806, homicideRate: 10.7, president: "Fox" },
  { year: 2007, homicides: 8867, homicideRate: 7.9, president: "Calderón" },
  { year: 2008, homicides: 14006, homicideRate: 12.3, president: "Calderón" },
  { year: 2009, homicides: 19803, homicideRate: 17.1, president: "Calderón" },
  { year: 2010, homicides: 25757, homicideRate: 21.9, president: "Calderón" },
  { year: 2011, homicides: 27213, homicideRate: 22.8, president: "Calderón" },
  { year: 2012, homicides: 25967, homicideRate: 21.5, president: "Calderón" },
  { year: 2013, homicides: 23063, homicideRate: 18.8, president: "Peña Nieto" },
  { year: 2014, homicides: 20010, homicideRate: 16.1, president: "Peña Nieto" },
  { year: 2015, homicides: 20762, homicideRate: 16.5, president: "Peña Nieto" },
  { year: 2016, homicides: 24559, homicideRate: 19.3, president: "Peña Nieto" },
  { year: 2017, homicides: 31174, homicideRate: 24.2, president: "Peña Nieto" },
  { year: 2018, homicides: 36685, homicideRate: 28.1, president: "Peña Nieto" },
  { year: 2019, homicides: 36476, homicideRate: 27.6, president: "AMLO" },
  { year: 2020, homicides: 34515, homicideRate: 25.8, president: "AMLO" },
  { year: 2021, homicides: 33315, homicideRate: 24.6, president: "AMLO" },
  { year: 2022, homicides: 31840, homicideRate: 23.3, president: "AMLO" },
  { year: 2023, homicides: 31062, homicideRate: 22.5, president: "AMLO" },
  { year: 2024, homicides: 30892, homicideRate: 22.1, president: "AMLO" },
  { year: 2025, homicides: 33800, homicideRate: 24.0, president: "Sheinbaum" },
  { year: 2026, homicides: 8500, homicideRate: 24.2, president: "Sheinbaum" }, // Partial year
];

// Major Cartels Data
export const cartels: CartelData[] = [
  {
    name: "Sinaloa Cartel",
    founded: 1989,
    peak: "2000-2016",
    states: 17,
    color: "#8b0000",
    leader: "Joaquín 'El Chapo' Guzmán",
  },
  {
    name: "Gulf Cartel",
    founded: 1984,
    peak: "1990-2010",
    states: 8,
    color: "#b91c1c",
    leader: "Osiel Cárdenas Guillén",
  },
  {
    name: "Los Zetas",
    founded: 2010,
    peak: "2010-2015",
    states: 12,
    color: "#7f1d1d",
    leader: "Heriberto Lazcano",
  },
  {
    name: "CJNG",
    founded: 2010,
    peak: "2015-Present",
    states: 35,
    color: "#dc2626",
    leader: "Nemesio Oseguera 'El Mencho'",
  },
  {
    name: "Juárez Cartel",
    founded: 1970,
    peak: "1990-2008",
    states: 5,
    color: "#991b1b",
    leader: "Amado Carrillo Fuentes",
  },
];

// Key Historical Events
export const keyEvents: KeyEvent[] = [
  {
    year: 1994,
    month: 1,
    title: "NAFTA Takes Effect",
    description: "Trade routes that will later be exploited by cartels are established.",
    type: "policy",
  },
  {
    year: 2006,
    month: 12,
    title: "War on Drugs Begins",
    description: "Calderón deploys 6,500 troops to Michoacán. The militarization of Mexico begins.",
    type: "policy",
  },
  {
    year: 2010,
    month: 8,
    title: "San Fernando Massacre",
    description: "72 migrants found murdered by Los Zetas in Tamaulipas.",
    deaths: 72,
    type: "massacre",
  },
  {
    year: 2011,
    month: 5,
    title: "Cadereyta Massacre",
    description: "49 decapitated bodies found on highway in Nuevo León.",
    deaths: 49,
    type: "massacre",
  },
  {
    year: 2014,
    month: 2,
    title: "El Chapo Captured",
    description: "Joaquín Guzmán captured in Mazatlán. Power vacuum created.",
    type: "capture",
  },
  {
    year: 2014,
    month: 9,
    title: "Ayotzinapa 43",
    description: "43 students disappeared in Iguala, Guerrero. National outrage follows.",
    deaths: 43,
    type: "massacre",
  },
  {
    year: 2015,
    month: 7,
    title: "El Chapo Escapes",
    description: "El Chapo escapes through mile-long tunnel. International embarrassment.",
    type: "capture",
  },
  {
    year: 2016,
    month: 1,
    title: "El Chapo Recaptured",
    description: "Final capture leads to extradition to United States.",
    type: "capture",
  },
  {
    year: 2019,
    month: 10,
    title: "Culiacán Battle",
    description: "Mexican forces release El Chapo's son after cartel overwhelms city.",
    type: "cartel",
  },
  {
    year: 2026,
    month: 2,
    title: "El Mencho Killed",
    description: "Nemesio Oseguera Cervantes dies from kidney failure while evading capture.",
    type: "cartel",
  },
];

// El Mencho Timeline
export const elMenchoTimeline = [
  { year: 1966, event: "Born in Aguililla, Michoacán" },
  { year: 1986, event: "Immigrated to California, began drug trafficking" },
  { year: 1992, event: "Arrested in San Francisco for heroin trafficking" },
  { year: 1997, event: "Deported to Mexico after 5 years in US prison" },
  { year: 2001, event: "Joins Milenio Cartel in Jalisco" },
  { year: 2010, event: "Co-founds CJNG after cartel fragmentation" },
  { year: 2011, event: "Takes full control of CJNG" },
  { year: 2015, event: "Survives Mexican military operation" },
  { year: 2018, event: "DEA increases bounty to $10 million" },
  { year: 2020, event: "CJNG operates in 35+ Mexican states" },
  { year: 2024, event: "Health deteriorates due to kidney failure" },
  { year: 2026, event: "Dies on February 22, 2026" },
];

// State-level homicide data (per 100,000 population, 2023 INEGI data)
// Source: INEGI - Sistema Nacional de Información Estadística
export interface StateData {
  name: string;
  code: string;
  homicideRate: number; // per 100,000
  totalHomicides: number;
  cartelPresence: string[];
  violenceLevel: "low" | "medium" | "high" | "extreme";
}

export const stateHomicideData: StateData[] = [
  { name: "Aguascalientes", code: "01", homicideRate: 5.2, totalHomicides: 78, cartelPresence: ["CJNG"], violenceLevel: "low" },
  { name: "Baja California", code: "02", homicideRate: 42.1, totalHomicides: 1523, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "extreme" },
  { name: "Baja California Sur", code: "03", homicideRate: 28.4, totalHomicides: 245, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "high" },
  { name: "Campeche", code: "04", homicideRate: 4.8, totalHomicides: 47, cartelPresence: ["Gulf"], violenceLevel: "low" },
  { name: "Coahuila", code: "05", homicideRate: 18.3, totalHomicides: 589, cartelPresence: ["Zetas", "CDN"], violenceLevel: "medium" },
  { name: "Colima", code: "06", homicideRate: 98.3, totalHomicides: 789, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "extreme" },
  { name: "Chiapas", code: "07", homicideRate: 12.8, totalHomicides: 723, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "medium" },
  { name: "Chihuahua", code: "08", homicideRate: 52.4, totalHomicides: 2012, cartelPresence: ["Sinaloa", "Juárez", "La Línea"], violenceLevel: "extreme" },
  { name: "Ciudad de México", code: "09", homicideRate: 11.2, totalHomicides: 1024, cartelPresence: ["CJNG", "Unión Tepito"], violenceLevel: "medium" },
  { name: "Durango", code: "10", homicideRate: 23.5, totalHomicides: 435, cartelPresence: ["Sinaloa"], violenceLevel: "high" },
  { name: "Guanajuato", code: "11", homicideRate: 67.8, totalHomicides: 4234, cartelPresence: ["CJNG", "Santa Rosa de Lima"], violenceLevel: "extreme" },
  { name: "Guerrero", code: "12", homicideRate: 58.2, totalHomicides: 2089, cartelPresence: ["CJNG", "Sinaloa", "Familia Michoacana"], violenceLevel: "extreme" },
  { name: "Hidalgo", code: "13", homicideRate: 8.1, totalHomicides: 247, cartelPresence: ["CJNG"], violenceLevel: "low" },
  { name: "Jalisco", code: "14", homicideRate: 32.4, totalHomicides: 2712, cartelPresence: ["CJNG"], violenceLevel: "high" },
  { name: "México", code: "15", homicideRate: 16.8, totalHomicides: 2934, cartelPresence: ["CJNG", "Familia Michoacana"], violenceLevel: "medium" },
  { name: "Michoacán", code: "16", homicideRate: 45.6, totalHomicides: 2145, cartelPresence: ["CJNG", "Viagras", "Familia Michoacana"], violenceLevel: "extreme" },
  { name: "Morelos", code: "17", homicideRate: 38.7, totalHomicides: 789, cartelPresence: ["CJNG", "Guerreros Unidos"], violenceLevel: "high" },
  { name: "Nayarit", code: "18", homicideRate: 24.3, totalHomicides: 312, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "high" },
  { name: "Nuevo León", code: "19", homicideRate: 15.2, totalHomicides: 856, cartelPresence: ["Zetas", "CDN", "Gulf"], violenceLevel: "medium" },
  { name: "Oaxaca", code: "20", homicideRate: 18.9, totalHomicides: 789, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "medium" },
  { name: "Puebla", code: "21", homicideRate: 12.3, totalHomicides: 823, cartelPresence: ["CJNG"], violenceLevel: "medium" },
  { name: "Querétaro", code: "22", homicideRate: 7.8, totalHomicides: 178, cartelPresence: ["CJNG"], violenceLevel: "low" },
  { name: "Quintana Roo", code: "23", homicideRate: 35.2, totalHomicides: 645, cartelPresence: ["CJNG", "Sinaloa", "Gulf"], violenceLevel: "high" },
  { name: "San Luis Potosí", code: "24", homicideRate: 21.4, totalHomicides: 612, cartelPresence: ["CJNG", "Gulf"], violenceLevel: "high" },
  { name: "Sinaloa", code: "25", homicideRate: 41.2, totalHomicides: 1289, cartelPresence: ["Sinaloa", "CJNG"], violenceLevel: "extreme" },
  { name: "Sonora", code: "26", homicideRate: 46.8, totalHomicides: 1423, cartelPresence: ["Sinaloa", "CJNG"], violenceLevel: "extreme" },
  { name: "Tabasco", code: "27", homicideRate: 14.5, totalHomicides: 367, cartelPresence: ["CJNG", "Gulf"], violenceLevel: "medium" },
  { name: "Tamaulipas", code: "28", homicideRate: 28.9, totalHomicides: 1012, cartelPresence: ["Gulf", "CDN", "Zetas"], violenceLevel: "high" },
  { name: "Tlaxcala", code: "29", homicideRate: 6.2, totalHomicides: 89, cartelPresence: ["CJNG"], violenceLevel: "low" },
  { name: "Veracruz", code: "30", homicideRate: 15.8, totalHomicides: 1312, cartelPresence: ["CJNG", "Zetas"], violenceLevel: "medium" },
  { name: "Yucatán", code: "31", homicideRate: 2.8, totalHomicides: 67, cartelPresence: [], violenceLevel: "low" },
  { name: "Zacatecas", code: "32", homicideRate: 72.4, totalHomicides: 1189, cartelPresence: ["CJNG", "Sinaloa"], violenceLevel: "extreme" },
];

// Get violence level color based on homicide rate
export const getViolenceLevelColor = (rate: number): string => {
  if (rate < 10) return "#1a2e1a"; // Dark green - low
  if (rate < 25) return "#4a3728"; // Brown - medium
  if (rate < 45) return "#7d4e2e"; // Orange-brown - high
  return "#8b2500"; // Deep red-brown - extreme
};

// Get violence level from rate
export const getViolenceLevel = (rate: number): string => {
  if (rate < 10) return "Low (<10)";
  if (rate < 25) return "Medium (10-25)";
  if (rate < 45) return "High (25-45)";
  return "Extreme (>45)";
};

// Cumulative death toll calculation
export const getCumulativeDeaths = () => {
  let total = 0;
  return yearlyData.map((d) => {
    total += d.homicides;
    return { ...d, cumulative: total };
  });
};

// Get data by president
export const getDataByPresident = (presidentShortName: string) => {
  return yearlyData.filter((d) => d.president === presidentShortName);
};

// Statistics calculations
export const statistics = {
  totalDeathsSince1990: yearlyData.reduce((sum, d) => sum + d.homicides, 0),
  peakYear: 2019,
  peakHomicides: 36476,
  calderonIncrease: "102%",
  cjngStates: 35,
  cjngCountries: 50,
  missingPersons: 115000,
};
