export interface Product {
  id: string;
  name: string;
  subName: string;
  price: string;
  description: string;
  folderPath: string;
  themeColor: string;
  gradient: string;
  features: string[];
  stats: { label: string; val: string }[];
  section1: { title: string; subtitle: string };
  section2: { title: string; subtitle: string };
  section3: { title: string; subtitle: string };
  section4: { title: string; subtitle: string };
  detailsSection: { title: string; description: string; imageAlt: string };
  freshnessSection: { title: string; description: string };
  buyNowSection: {
    price: string;
    unit: string;
    processingParams: string[];
    deliveryPromise: string;
    returnPolicy: string;
  };
}

export const products: Product[] = [
  {
    id: "iced-classic",
    name: "Iced Classic Coffee",
    subName: "Apna Adda, Apni Coffee",
    price: "₹89",
    description: "Brewed Daily in Mumbai - Davidoff Beans",
    folderPath: "/frames",
    themeColor: "#4D2D18",
    gradient: "linear-gradient(135deg, #4D2D18 0%, #1A0F0A 100%)",
    features: ["Brewed in Mumbai", "Davidoff Beans", "No Artificial Syrups"],
    stats: [{ label: "Price", val: "₹89" }, { label: "Happiness", val: "100%" }, { label: "Vibe", val: "Adda" }],
    section1: { title: "KOFE House Mumbai.", subtitle: "Apna Adda, Apni Coffee" },
    section2: { title: "Mumbai's Favorite Adda.", subtitle: "From Juhu to Vile Parle, we're brewing happiness one cup at a time. High quality, zero pretense." },
    section3: { title: "Premium Davidoff Beans.", subtitle: "We don't compromise on quality. Our Iced Classic is brewed with premium Davidoff beans for that perfect smooth finish." },
    section4: { title: "Your daily dose of chill.", subtitle: "Because great coffee shouldn't cost a fortune." },
    detailsSection: {
      title: "The Heart of Mumbai Coffee",
      description: "KOFE House isn't just a cafe; it's an 'Adda' where stories are shared over the perfect brew. Our Iced Classic Coffee is the soul of our menu—meticulously crafted to be smooth, refreshing, and accessible to every Mumbaikar. We use premium Davidoff beans to ensure every sip is as premium as the city we call home.",
      imageAlt: "KOFE House Coffee Details"
    },
    freshnessSection: {
      title: "Brewed Daily in Juhu",
      description: "Freshness is our promise. Every bottle of our Iced Classic is brewed fresh in our Mumbai kitchens. We believe in honest coffee—no artificial syrups, no shortcuts. Just pure coffee joy delivered from our pressery to your hands."
    },
    buyNowSection: {
      price: "₹89",
      unit: "per serving",
      processingParams: ["Mumbai Local", "Davidoff Quality", "Freshly Brewed"],
      deliveryPromise: "Freshly brewed and delivered across Mumbai. Perfect for your home office or evening hangout.",
      returnPolicy: "Brewed with love. If you don't love it, we'll make it right. Apna promise."
    }
  }
];

export const singleProduct = products[0];
