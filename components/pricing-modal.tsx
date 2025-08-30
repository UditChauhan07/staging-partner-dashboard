"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Sparkles, Gift } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";
import styles from "../styles/subscription-modal.module.css";
import ConfettiSection from "./confetti-section";
interface PriceOverride {
  countryCode: string;
  monthlyPrice: number;
  yearlyPrice: number;
}
interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName: string;
  countryCode: string | null;
  isYearlys: boolean;
}
interface Plan {
  id: string;
  name: string;
  icon: JSX.Element;
  monthlyPrice: number;
  yearlyPrice: number;
  priceOverrides?: PriceOverride[];
  description: string;
  features: string[];
  additionalFeatures: string[];
  iconColor: string;
}
const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    icon: "https://rexptin.vercel.app/svg/starter-icon.svg",
    monthlyPrice: 119,
    yearlyPrice: 99,
    description: "Perfect for small workload in a startup or micro business",
    features: [
      "300 minutes / month",
      "FREE VoIP Number",
      "Agent Characterization",
    ],
    additionalFeatures: [
      "24/7 Availability",
      "Email Notifications",
      "Website Widget Integration",
      "Speech Naturalization",
      "Environment Setup",
      "Calendar Integration using Cal.com",
      "Book Calendar Meetings",
      "Call History(Basic)",
      "Call Recording",
      "Intelligent Call Transfer(5)",
      "Intelligent Call Analysis",
      "Lead Nurturing",
      "Business Knowledge Training",
      "Product & Services Training",
      "Spam Protection",
      "Profanity Protection",
      "CRM Integration(Coming Soon)",
      "Own Voice Implementation(Coming Soon)",
      "Human Email(Under 72 hrs) & AI Chat & Call Support",
    ],
    priceOverrides: [
      {
        _key: "a5c76198e7b8",
        _type: "priceOverride",
        countryCode: "USD",
        monthlyPrice: 119,
        yearlyPrice: 99,
      },
      {
        _key: "fecee33ec661",
        _type: "priceOverride",
        countryCode: "AUD",
        monthlyPrice: 179,
        yearlyPrice: 149.92,
      },
      {
        _key: "757dd4cb885d",
        _type: "priceOverride",
        countryCode: "CAD",
        monthlyPrice: 159,
        yearlyPrice: 133.25,
      },
      {
        _key: "46f578da1f59",
        _type: "priceOverride",
        countryCode: "GBP",
        monthlyPrice: 89,
        yearlyPrice: 74,
      },
      {
        _key: "53b5be20ee48",
        _type: "priceOverride",
        countryCode: "INR",
        monthlyPrice: 4999,
        yearlyPrice: 4499,
      },
    ],
    iconColor: "blue",
  },
  {
    id: "scaler",
    name: "Scaler",
    icon: "https://rexptin.vercel.app/svg/scaler-icon.svg",
    monthlyPrice: 299,
    yearlyPrice: 249,
    description: "For scaling small businesses to a professional level.",
    features: [
      "750 minutes / month",
      "FREE VoIP Number",
      "Multi-Lingual with In-Call Language Switching",
    ],
    additionalFeatures: [
      "Agent Characterization",
      "24/7 Availability",
      "Email Notifications",
      "SMS Notifications",
      "Website Widget Integration",
      "Speech Naturalization",
      "Environment Setup",
      "Calendar Integration using Cal.com",
      "Book Calendar Meetings",
      "Call History(Basic)",
      "Call Recording",
      "Call Transcript",
      "Intelligent Call Transfer(5)",
      "Caller Sentiment Analysis",
      "Intelligent Call Analysis",
      "Lead Type Analysis",
      "Lead Nurturing",
      "Business Knowledge Training",
      "Product & Services Training",
      "Spam Protection",
      "Profanity Protection",
      "CRM Integration(Coming Soon)",
      "Own Voice Implementation(Coming Soon)",
      "Human Email(Biz Hrs) & AI Chat & Call Support",
    ],
    priceOverrides: [
      {
        _key: "e02de691f064",
        _type: "priceOverride",
        countryCode: "USD",
        monthlyPrice: 299,
        yearlyPrice: 249,
      },
      {
        _key: "a5a1893ab102",
        _type: "priceOverride",
        countryCode: "AUD",
        monthlyPrice: 459,
        yearlyPrice: 383.25,
      },
      {
        _key: "5d5a78c05145",
        _type: "priceOverride",
        countryCode: "CAD",
        monthlyPrice: 399,
        yearlyPrice: 333.25,
      },
      {
        _key: "a91fcb33442a",
        _type: "priceOverride",
        countryCode: "GBP",
        monthlyPrice: 219,
        yearlyPrice: 183.25,
      },
      {
        _key: "7f1f94c3da25",
        _type: "priceOverride",
        countryCode: "INR",
        monthlyPrice: 11499,
        yearlyPrice: 9999,
      },
    ],
    iconColor: "green",
  },
  {
    id: "growth",
    name: "Growth",
    icon: "https://rexptin.vercel.app/svg/growth-icon.svg",
    monthlyPrice: 599,
    yearlyPrice: 499,
    description: "A workhorse to handle small to medium business needs.",
    features: [
      "1500 minutes / month",
      "FREE VoIP Number",
      "Multi-Lingual with In-Call Language Switching",
    ],
    additionalFeatures: [
      "Agent Characterization",
      "24/7 Availability",
      "Email Notifications",
      "SMS Notifications",
      "Website Widget Integration",
      "Speech Naturalization",
      "Environment Setup",
      "Calendar Integration using Cal.com",
      "Book Calendar Meetings",
      "Call History(Advanced)",
      "Call Recording",
      "Call Transcript",
      "Intelligent Call Transfer(10)",
      "Caller Sentiment Analysis",
      "Intelligent Call Analysis",
      "Lead Type Analysis",
      "Lead Nurturing",
      "Business Knowledge Training",
      "Product & Services Training",
      "Spam Protection",
      "Profanity Protection",
      "CRM Integration(Coming Soon)",
      "Own Voice Implementation(Coming Soon)",
      "Human Email(Biz Hrs) & AI Chat & Call Support",
    ],
    priceOverrides: [
      {
        _key: "683b157bb61e",
        _type: "priceOverride",
        countryCode: "USD",
        monthlyPrice: 599,
        yearlyPrice: 499,
      },
      {
        _key: "eedf8e85a47b",
        _type: "priceOverride",
        countryCode: "AUD",
        monthlyPrice: 919,
        yearlyPrice: 774.91,
      },
      {
        _key: "9e1fee37904e",
        _type: "priceOverride",
        countryCode: "CAD",
        monthlyPrice: 819,
        yearlyPrice: 684.91,
      },
      {
        _key: "37020a75b016",
        _type: "priceOverride",
        countryCode: "GBP",
        monthlyPrice: 439,
        yearlyPrice: 370.75,
      },
      {
        _key: "2fc597835c22",
        _type: "priceOverride",
        countryCode: "INR",
        monthlyPrice: 24999,
        yearlyPrice: 21999,
      },
    ],
    iconColor: "pink",
  },
  {
    id: "corporate",
    name: "Corporate",
    icon: "https://rexptin.vercel.app/svg/corporate-icon.svg",
    monthlyPrice: 999,
    yearlyPrice: 799,
    description: "The ultimate workhorse that handles all large-volume needs",
    features: [
      "3000 minutes / month",
      "FREE VoIP Number",
      "Multi-Lingual with In-Call Language Switching",
    ],
    additionalFeatures: [
      "Agent Characterization",
      "24/7 Availability",
      "Email Notifications",
      "SMS Notifications",
      "Website Widget Integration",
      "Speech Naturalization",
      "Environment Setup",
      "Calendar Integration using Cal.com",
      "Book Calendar Meetings",
      "Call History(Advanced)",
      "Call Recording",
      "Call Transcript",
      "Intelligent Call Transfer(10)",
      "Caller Sentiment Analysis",
      "Intelligent Call Analysis",
      "Lead Type Analysis",
      "Lead Nurturing",
      "Business Knowledge Training",
      "Product & Services Training",
      "Spam Protection",
      "Profanity Protection",
      "CRM Integration(Coming Soon)",
      "Own Voice Implementation(Coming Soon)",
      "Human Email & Call-Back(Biz Hrs)",
      "Dedicated Account Manager",
      "Assisted Custom Agent Training",
    ],
    priceOverrides: [
      {
        _key: "4d0344ff2b2a",
        _type: "priceOverride",
        countryCode: "USD",
        monthlyPrice: 999,
        yearlyPrice: 799,
      },
      {
        _key: "ff16613a7982",
        _type: "priceOverride",
        countryCode: "AUD",
        monthlyPrice: 1549,
        yearlyPrice: 1249.91,
      },
      {
        _key: "62ab98abc16f",
        _type: "priceOverride",
        countryCode: "CAD",
        monthlyPrice: 1369,
        yearlyPrice: 1083.25,
      },
      {
        _key: "79329bde5a85",
        _type: "priceOverride",
        countryCode: "GBP",
        monthlyPrice: 739,
        yearlyPrice: 594.08,
      },
      {
        _key: "69ed44977979",
        _type: "priceOverride",
        countryCode: "INR",
        monthlyPrice: 44999,
        yearlyPrice: 39999,
      },
    ],
    iconColor: "orange",
  },
];

const planYearlyImageMap: Record<string, string> = {
  Starter: "/images/starter_yearly.svg",
  Scaler: "/images/scaler_yearly.svg",
  Growth: "/images/growth_yearly.svg",
  Corporate: "/images/corporate_yearly.svg",
};

export default function SubscriptionModal({
  isOpen,
  onClose,
  countryCode,
  selectedPlanName,
  discount = "30%",
  isYearlys,
}: SubscriptionModalProps) {
  console.log(countryCode, "country Code of subscription modal");
  const [currentPlan, setCurrentPlan] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(countryCode);
  const [isYearly, setIsYearly] = useState(() =>
    countryCode === "US" ? isYearlys : false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFromPricingQuery, setIsFromPricingQuery] = useState(false);
  const [isCongratulationPopupVisible, setIsCongratulationPopupVisible] =
    useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (selectedPlanName) {
      const planIndex = plans.findIndex(
        (plan) => plan.name === selectedPlanName
      );
      if (planIndex !== -1) {
        setCurrentPlan(planIndex);
      } else {
        setCurrentPlan(0);
      }
    } else {
      setCurrentPlan(0);
    }
  }, [selectedPlanName]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fromQuery = localStorage.getItem("isFromPricingQuery") === "true";
      setIsFromPricingQuery(fromQuery);
    }
  }, []);

  useEffect(() => {
    if (selectedPlanName) {
      const planIndex = plans.findIndex(
        (plan) => plan.name === selectedPlanName
      );

      if (planIndex !== -1) {
        setCurrentPlan(planIndex);
      } else {
        setCurrentPlan(0);
      }
    } else {
      setCurrentPlan(0);
    }
  }, [selectedPlanName]);

  useEffect(() => {
    if (isOpen) {
      setIsCongratulationPopupVisible(true);
      setIsFadingOut(false);

      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 7000);

      const removeTimeout = setTimeout(() => {
        setIsCongratulationPopupVisible(false);
      }, 9000);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [isOpen]);

  const countryToCurrencyMap: Record<string, string> = {
    IN: "INR",
    US: "USD",
    AU: "AUD",
    CA: "CAD",
    GB: "GBP",
  };

  const selectedPlan = plans[currentPlan];
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
  };
  const handleClose = () => {
    // if (window.location.search.includes("open=pricing")) {
    //    localStorage.removeItem("isFromPricingQuery");
    //   window.location.href = "http://blog.rxpt.us/";
    // } else {
    onClose?.();
    document.body.style.overflow = "unset";
    // }
  };
  const getPlanPrice = (
    plan: Plan,
    isYearly: boolean,
    countryCode: string | null
  ) => {
    const currencyCode = countryCode ? countryToCurrencyMap[countryCode] : "US";

    const override = plan.priceOverrides?.find(
      (p) => p.countryCode === currencyCode
    );

    return override
      ? isYearly
        ? override.yearlyPrice
        : override.monthlyPrice
      : isYearly
      ? plan.yearlyPrice
      : plan.monthlyPrice;
  };

  const currentPrice = getPlanPrice(selectedPlan, isYearly, userCountry);
  const currencySymbols: Record<string, string> = {
    USD: "$",
    INR: "₹",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };
  const currencyCode = userCountry ? countryToCurrencyMap[userCountry] : "USD";
  const currency = currencySymbols[currencyCode] || "$";

  const yearlyPromoMap: Record<string, string> = {
    // Corporate: "promo_1RlqYaSCQQfKS3WDzSR57kcw",
    // Growth: "promo_1RlqWDSCQQfKS3WD3ao1LCY0",
    // Scaler: "promo_1RlqUoSCQQfKS3WDYu6zmeo6",
    // Starter: "promo_1Ro1ypSCQQfKS3WDEpDCSnc6",
    Corporate: "promo_1RtkT3SCQQfKS3WDWMW6nh7b",
    Growth: "promo_1RtkSaSCQQfKS3WD04IKol7a",
    Scaler: "promo_1RtkS7SCQQfKS3WDtg3nYX6o",
    Starter: "promo_1RtkRUSCQQfKS3WDPYW8fMZN",
  };

  async function handleGetStarted(planTitle: string) {
    setIsLoading(true);
    const interval = isYearly ? "year" : "month";

    let promoCode = "promo_1RtkQUSCQQfKS3WDng38uVCS";
    // let promoCode = "promo_1Ro3eJSCQQfKS3WDu0AbWsUh";

    if (isYearly) {
      promoCode = yearlyPromoMap[planTitle] || promoCode;
    }
    const requestBody: any = {
      planName: planTitle,
      interval,
    };

    if (promoCode) {
      requestBody.promotionCode = promoCode;
    }
    try {
      const response = await fetch(
        "https://rexptin.truet.net/api/create-checkout-session-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data?.url) {
        window.open(data.url, "_blank");
        onClose();
      } else {
        console.error(
          "Failed to create checkout session:",
          data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFreeTrialClick = () => {
    window.open("https://app.rexpt.in?isUser=free", "_blank");
  };

  const totalDisocuntPrice = [
    {
      planName: "Starter",
      discountPrice: {
        US: "$1,098.00",
        AU: "A$1,454.00",
        CA: "C$1,299.00",
        GB: "£723.00",
        IN: "₹44,988.00",
      },
    },
    {
      planName: "Scaler",
      discountPrice: {
        US: "$2,763.00",
        AU: "A$4,252.50",
        CA: "C$3,697.95",
        GB: "£2,033.40",
        IN: "₹110,954.25",
      },
    },
    {
      planName: "Growth",
      discountPrice: {
        US: "$5,538.00",
        AU: "A$8,600.60",
        CA: "C$7,601.60",
        GB: "£4,114.65",
        IN: "₹244,143.00",
      },
    },
    {
      planName: "Corporate",
      discountPrice: {
        US: "$8,888.00",
        AU: "A$13,904.20",
        CA: "C$12,049.80",
        GB: "£6,608.90",
        IN: "₹444,946.00",
      },
    },
  ];

  const totalYearlyOff = [
    {
      planName: "Starter",
      OffPrice: {
        US: "$90.00",
        AU: "A$345.00",
        CA: "C$300.00",
        GB: "£165.00",
        IN: "₹9,000.00",
      },
    },
    {
      planName: "Scaler",
      OffPrice: {
        US: "$225.00",
        AU: "A$346.50",
        CA: "C$301.05",
        GB: "£165.60",
        IN: "₹9,033.75",
      },
    },
    {
      planName: "Growth",
      OffPrice: {
        US: "$450.00",
        AU: "A$698.40",
        CA: "C$617.40",
        GB: "£334.35",
        IN: "₹19,845.00",
      },
    },
    {
      planName: "Corporate",
      OffPrice: {
        US: "$700.00",
        AU: "A$1,094.80",
        CA: "C$949.20",
        GB: "£520.10",
        IN: "₹35,042.00",
      },
    },
  ];

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className={styles.modalOverlay}
          // style={
          //   isFromPricingQuery
          //     ? {
          //         backgroundImage:
          //           'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/pricing_background.png")',
          //         backgroundSize: "cover",
          //         backgroundPosition: "center",
          //       }
          //     : {}
          // }
        >
          {isCongratulationPopupVisible && (
            <div className={isFadingOut ? styles.confettiFadeOut : ""}>
              <ConfettiSection />
            </div>
          )}

          <div className={styles.modalContainer}>
            <div className={styles.header}>
              <div
                className={`${styles.headerLeft}  ${
                  isDarkMode ? styles.backbtn : ""
                }`}
                onClick={handleClose}
                style={{ cursor: "pointer" }}
              >
                <button className={styles.backButton}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className={styles.headerTitle}>Back</h2>
              </div>
              <Badge
                variant="secondary"
                className={styles.trialBadge}
                onClick={handleFreeTrialClick}
                style={{ cursor: "pointer" }}
              >
                FREE TRIAL
              </Badge>
            </div>

            {/* congratulations Area */}

            <div className={styles.scrollableContent}>
              {/* Main Plan Card */}
              <div className={styles.planCardContainer}>
                <div
                  className={`${styles.planCard} ${
                    styles[
                      `planCard${
                        selectedPlan.iconColor.charAt(0).toUpperCase() +
                        selectedPlan.iconColor.slice(1)
                      }`
                    ]
                  }`}
                >
                  <div className={styles.TopPlansOffer}>
                    <div>
                      {/* Price Section */}
                      <div className={styles.priceSection}>
                        <div className={styles.iconContainer}>
                          {/* {selectedPlan.icon} */}
                          <img src={selectedPlan.icon}></img>
                        </div>
                        <div>
                          {/* <div className={styles.priceText}>
                            {currency}
                            {currentPrice.toLocaleString()}/m
                          </div> */}
                          <div className={styles.priceText}>
                            {/* Original price with red strikethrough */}
                            <span className="line-through text-red-500 mr-2">
                              {currency}
                              {currentPrice.toLocaleString()}/m
                            </span>

                            {/* Discounted price */}
                            <span
                              className={`${styles.priceText} dark: text-black`}
                            >
                              {currency}
                              {isYearly
                                ? (() => {
                                    const discountEntry =
                                      totalDisocuntPrice.find(
                                        (entry) =>
                                          entry.planName === selectedPlan.name
                                      );
                                    const discountedYearlyStr =
                                      discountEntry?.discountPrice?.[
                                        userCountry
                                      ] ??
                                      discountEntry?.discountPrice?.["US"] ??
                                      "0";

                                    // Remove currency symbol and commas
                                    const numericYearly = parseFloat(
                                      discountedYearlyStr.replace(
                                        /[^0-9.]/g,
                                        ""
                                      )
                                    );

                                    return (numericYearly / 12).toFixed(2);
                                  })()
                                : (currentPrice * 0.7).toFixed(2)}
                              /m
                            </span>

                            {isYearly && (
                              <span className="text-sm text-gray-500 ml-2 font-semibold">
                                (effective monthly price)
                              </span>
                            )}
                            {!isYearly && (
                              <span className="text-sm text-gray-500  ml-2 font-semibold">
                                (For the first 3 months only)
                              </span>
                            )}
                          </div>

                          {/* {isYearly && (
                            <div className={styles.billingText}>
                              Save{" "}
                              {(
                                ((getPlanPrice(
                                  selectedPlan,
                                  false,
                                  userCountry
                                ) -
                                  getPlanPrice(
                                    selectedPlan,
                                    true,
                                    userCountry
                                  )) /
                                  getPlanPrice(
                                    selectedPlan,
                                    false,
                                    userCountry
                                  )) *
                                100
                              ).toFixed(0)}
                              % — Total: {currency}
                              {Math.round(
                                getPlanPrice(selectedPlan, true, userCountry) *
                                  12
                              ).toLocaleString()}
                              /year
                            </div>
                          )} */}

                          {isYearly &&
                            (() => {
                              const originalYearlyPrice = Math.round(
                                getPlanPrice(selectedPlan, true, userCountry) *
                                  12
                              );

                              const discountEntry = totalDisocuntPrice.find(
                                (entry) => entry.planName === selectedPlan.name
                              );

                              const discountedPriceString =
                                discountEntry?.discountPrice?.[userCountry] ??
                                discountEntry?.discountPrice?.["US"];

                              const currencySymbol =
                                discountedPriceString?.match(
                                  /[^\d.,\s]+/g
                                )?.[0] || currency;

                              return (
                                <div className={styles.billingText}>
                                  Save{" "}
                                  {(
                                    ((getPlanPrice(
                                      selectedPlan,
                                      false,
                                      userCountry
                                    ) -
                                      getPlanPrice(
                                        selectedPlan,
                                        true,
                                        userCountry
                                      )) /
                                      getPlanPrice(
                                        selectedPlan,
                                        false,
                                        userCountry
                                      )) *
                                    100
                                  ).toFixed(0)}
                                  % — Total:{" "}
                                  <span className="line-through text-red-500 mr-1">
                                    {currencySymbol}
                                    {originalYearlyPrice.toLocaleString()}
                                  </span>
                                  <span className="font-semibold">
                                    {discountedPriceString}
                                  </span>
                                  /year
                                </div>
                              );
                            })()}

                          {/* Plan Price - show either monthly or yearly based on toggle */}
                          {/* <div className={styles.planPrice}>
                        {currency}
                        {currentPrice.toLocaleString()}/
                        {isYearly ? "year" : "month"} per agent
                      </div> */}
                        </div>
                      </div>

                      <h3 className={styles.planTitle}>{selectedPlan.name}</h3>

                      <p className={styles.planDescription}>
                        {selectedPlan.description}
                      </p>
                    </div>
                    <div className={styles.LaunchOffer}>
                      <img src="./images/Launch-Offer.svg" alt="Launch-Offer" />

                      {/* <img src="./images/Launch-Offer2.svg" alt="Launch-Offer" /> */}
                      {/* <h1>30<span>%</span></h1> */}
                      <p>Valid Till 31st August</p>
                    </div>

                    {isYearly && userCountry === "US" && (
                      <div className={styles.LaunchOffer}>
                        <img
                          src={
                            planYearlyImageMap[selectedPlan.name] ??
                            "/images/Launch-Offer.svg"
                          }
                          alt={`${selectedPlan.name} Launch Offer`}
                        />
                        <p>Valid Till 31st August</p>
                      </div>
                    )}
                  </div>

                  {/* Features List - Scrollable when expanded */}
                  <div
                    className={`${styles.featuresList} ${
                      showAllFeatures ? styles.featuresListExpanded : ""
                    }`}
                  >
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index} className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={styles.featureText}>{feature}</span>
                      </div>
                    ))}
                    {/* Additional Features - shown when expanded */}
                    {showAllFeatures &&
                      selectedPlan.additionalFeatures.map((feature, index) => (
                        <div
                          key={`additional-${index}`}
                          className={styles.featureItem}
                        >
                          <div className={styles.featureIcon}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className={styles.featureText}>{feature}</span>
                        </div>
                      ))}
                  </div>

                  {/* See All Features Button */}
                  <button
                    className={styles.seeAllButton}
                    onClick={toggleFeatures}
                  >
                    {showAllFeatures ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide Features
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        See All Features (
                        {selectedPlan.additionalFeatures.length} more)
                      </>
                    )}
                  </button>

                  {/* Billing Toggle */}
                  <div className={styles.billingToggle}>
                    <span
                      className={`${styles.toggleLabel} ${
                        !isYearly
                          ? styles.toggleLabelActive
                          : styles.toggleLabelInactive
                      }`}
                    >
                      Monthly
                    </span>
                    <Switch
                      checked={isYearly}
                      onCheckedChange={setIsYearly}
                      className={styles.switch}
                      disabled={currencyCode === "INR"}
                    />
                    <span
                      className={`${styles.toggleLabel} ${
                        isYearly
                          ? styles.toggleLabelActive
                          : styles.toggleLabelInactive
                      }`}
                    >
                      Yearly
                    </span>
                  </div>

                  {/* Subscribe Buttonssss */}
                  <Button
                    className={`${styles.subscribeButton} ${
                      currencyCode === "INR" ? styles.inactiveButton : ""
                    }`}
                    onClick={() => handleGetStarted(selectedPlan.name)}
                    disabled={currencyCode === "INR" || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />{" "}
                        Processing...
                      </>
                    ) : currencyCode === "INR" ? (
                      "Coming Soon..."
                    ) : isYearly ? (
                      (() => {
                        const discountEntry = totalDisocuntPrice.find(
                          (entry) => entry.planName === selectedPlan.name
                        );
                        const discountedYearly =
                          discountEntry?.discountPrice?.[userCountry] ??
                          discountEntry?.discountPrice?.["US"] ??
                          "N/A";
                        return `Subscribe For ${discountedYearly}/Year`;
                      })()
                    ) : (
                      `Subscribe For ${currency}${(currentPrice * 0.7).toFixed(
                        2
                      )}/Month`
                    )}
                  </Button>

                  {isYearly && (
                    <>
                      <div
                        className={styles.billingText2}
                        style={{ textAlign: "center" }}
                      >
                        <p>
                          With current LAUNCH OFFER, We are giving additional{" "}
                          <strong>
                            {(() => {
                              const offEntry = totalYearlyOff.find(
                                (entry) => entry.planName === selectedPlan.name
                              );
                              const offAmount =
                                offEntry?.OffPrice?.[userCountry] ??
                                offEntry?.OffPrice?.["US"] ??
                                "$0.00";
                              return `"${offAmount}"` + "Off";
                            })()}
                          </strong>{" "}
                          which makes effective monthly price to{" "}
                          <strong>
                            {(() => {
                              const discountEntry = totalDisocuntPrice.find(
                                (entry) => entry.planName === selectedPlan.name
                              );
                              const discountedYearlyStr =
                                discountEntry?.discountPrice?.[userCountry] ??
                                discountEntry?.discountPrice?.["US"] ??
                                "0";

                              const currencySymbol =
                                discountedYearlyStr?.match(
                                  /[^\d.,\s]+/g
                                )?.[0] || currency;

                              const numericYearly = parseFloat(
                                discountedYearlyStr.replace(/[^0-9.]/g, "")
                              );

                              const effectiveMonthly = (
                                numericYearly / 12
                              ).toFixed(2);

                              return `${currencySymbol}${effectiveMonthly}/m`;
                            })()}{" "}
                          </strong>
                          {(() => {
                            const discountEntry = totalDisocuntPrice.find(
                              (entry) => entry.planName === selectedPlan.name
                            );
                            const discountedYearly =
                              discountEntry?.discountPrice?.[userCountry] ??
                              discountEntry?.discountPrice?.["US"] ??
                              "N/A";

                            return (
                              <>
                                {" "}
                                for 1st year or{" "}
                                <strong> {discountedYearly}/year. </strong>
                              </>
                            );
                          })()}
                          Then it will be{" "}
                          <strong>
                            {currency}
                            {Math.round(
                              getPlanPrice(selectedPlan, true, userCountry) * 12
                            ).toLocaleString()}{" "}
                          </strong>
                          per year after offer completes.
                        </p>
                      </div>
                    </>
                  )}

                  {!isYearly && (
                    <>
                      <div
                        className={styles.billingText2}
                        style={{ textAlign: "center" }}
                      >
                        <p>
                          With current<strong> LAUNCH OFFER</strong>, We are
                          giving <strong>30% off</strong> on monthly packages
                          for the 1st 3 months. Then it will be{" "}
                          <strong>
                            {currency}
                            {currentPrice.toLocaleString()}{" "}
                          </strong>{" "}
                          per month after offer completes.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Plan Selection - Fixed at bottom */}
            <div className={styles.planSelection}>
              <div className={styles.planOptions}>
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`${styles.planOption} ${
                      currentPlan === index
                        ? styles[
                            `planOptionActive${
                              plan.iconColor.charAt(0).toUpperCase() +
                              plan.iconColor.slice(1)
                            }`
                          ]
                        : ""
                    }`}
                    onClick={() => {
                      setCurrentPlan(index);
                      setShowAllFeatures(false); // Reset features view when changing plans
                    }}
                  >
                    {/* Radio Button */}
                    <div className={styles.radioContainer}>
                      <div
                        className={`${styles.radioButton} ${
                          currentPlan === index
                            ? styles.radioButtonActive
                            : styles.radioButtonInactive
                        }`}
                      >
                        {currentPlan === index && (
                          <div className={styles.radioButtonDot} />
                        )}
                      </div>
                    </div>

                    {/* Plan Icon */}
                    <div
                      className={`${styles.planIconContainer} ${
                        currentPlan === index
                          ? styles.planIconContainerActive
                          : styles.planIconContainerInactive
                      }`}
                    >
                      <div
                        className={`${styles.planIcon} ${
                          currentPlan === index
                            ? styles.planIconActive
                            : styles[
                                `planIcon${
                                  plan.iconColor.charAt(0).toUpperCase() +
                                  plan.iconColor.slice(1)
                                }`
                              ]
                        }`}
                      >
                        <img src={plan.icon} alt="" />
                      </div>
                    </div>

                    {/* Plan Info */}
                    <div className={styles.planInfo}>
                      <div
                        className={`${styles.planName} ${
                          currentPlan === index
                            ? styles.planNameActive
                            : styles.planNameInactive
                        }`}
                      >
                        {plan.name}
                      </div>
                      <div className={styles.planPriceSmall}>
                        from {currency}
                        {getPlanPrice(
                          plan,
                          isYearly,
                          userCountry
                        ).toLocaleString()}
                        /m
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
