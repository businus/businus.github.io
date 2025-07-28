// HeroSection.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import EmailJoinForm from "./NewsletterSection/EmailJoinForm";
import NewsletterSlider from "./NewsletterSection/NewsletterSlider";
import RoleSelection from "./NewsletterSection/RoleSelection";
import ThankYouMessage from "./NewsletterSection/ThankYouMessage";
import useHeroStore from "./NewsletterSection/NewsletterLogic/useHeroStore";
import ProgressBar from "./NewsletterSection/ProgressBar";

const roles = [
  { name: "Lawyer", emoji: "⚖️🧑‍⚖️🏛️" },
  { name: "Accountant", emoji: "💰📊🧾" },
  { name: "IT Practitioner", emoji: "💻🖥️🧑‍💻" },
  { name: "Fellow Entrepreneur", emoji: "🚀💡🤝" },
];

const HeroSection = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    contact,
    setContact,
    address,
    setAddress,
    isLoading,
    setIsLoading,
    isJoinClicked,
    setIsJoinClicked,
    newsletterConfirmed,
    setNewsletterConfirmed,
    sliderValue,
    setSliderValue,
    selectedRole,
    setSelectedRole,
    finalSubscribeChecked,
    setFinalSubscribeChecked,
    proceedToThankYou,
    setProceedToThankYou,
    sendDetailsToTelegram,
  } = useHeroStore();

  // Track when to send Telegram message => useEffect to sync side effect after states updated
  useEffect(() => {
    const shouldSend =
      proceedToThankYou &&
      ((newsletterConfirmed === "skipped" && (finalSubscribeChecked || finalSubscribeChecked === false)) ||
        newsletterConfirmed === "subscribed");

    if (shouldSend) {
      (async () => {
        try {
          await sendDetailsToTelegram();
        } catch (e) {
          // Optional: handle errors globally
        }
      })();
    }
  }, [proceedToThankYou, newsletterConfirmed, finalSubscribeChecked, sendDetailsToTelegram]);

const handleJoinClick = async () => {
  setIsLoading(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Send details immediately after join
    await sendDetailsToTelegram();

    // Move to next step after sending Telegram message
    setIsJoinClicked(true);
    setNewsletterConfirmed(null);
    setSliderValue(50);
    setSelectedRole(null);
    setProceedToThankYou(false);
    setFinalSubscribeChecked(false);
  } catch (error) {
    console.error("Join failed", error);
    // Optionally handle error UI here
  }
  setIsLoading(false);
};

  const handleSliderRelease = () => {
    if (sliderValue <= 30) {
      setNewsletterConfirmed("skipped");
    } else if (sliderValue >= 70) {
      setNewsletterConfirmed("subscribed");
    } else {
      setSliderValue(50);
      alert("Please move the slider left or right to subscribe or skip the newsletter.");
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setProceedToThankYou(true);
  };

  const handleSkipRoleSelection = () => {
    setSelectedRole("Skipped");
    setProceedToThankYou(true);
  };

  // The final newsletter subscription confirmation is triggered by a button click in RoleSelection,
  // not immediately on checkbox toggle — so here just update finalSubscribeChecked state.
  const handleFinalSubscribeCheckChange = (checked) => {
    setFinalSubscribeChecked(checked);
  };

  const handleFinalConfirm = () => {
    if (newsletterConfirmed === "skipped" && !finalSubscribeChecked) {
      // User skipped newsletter and did not opt in now — proceed showing thank you and send data
      setProceedToThankYou(true);
    } else if (finalSubscribeChecked) {
      // User confirmed subscription via checkbox
      setNewsletterConfirmed("subscribed");
      setProceedToThankYou(true);
    } else if (newsletterConfirmed === "subscribed") {
      // Already subscribed, proceed
      setProceedToThankYou(true);
    } else {
      // Should not happen practically
      alert("Please confirm your newsletter subscription status.");
    }
  };

  // Calculate current step for ProgressBar
  let currentStep = 1;
  if (!isJoinClicked && !selectedRole) currentStep = 1;
  else if (isJoinClicked && newsletterConfirmed === null) currentStep = 2;
  else if (
    (newsletterConfirmed === "subscribed" || newsletterConfirmed === "skipped") &&
    !selectedRole
  ) {
    currentStep = 3;
  } else if (selectedRole && proceedToThankYou) {
    currentStep = 4;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-slate-900 text-white px-4">
      <div className="max-w-7xl w-full lg:grid lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left pane */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Launch Your Business{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Globally
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Transform your vision into a global empire with our comprehensive
              business assistance, legal compliance, and strategic growth solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto lg:mx-0"
          >
            <div className="relative bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
              <ProgressBar currentStep={currentStep} />

              {/* Step 1: Join Form */}
              {!isJoinClicked && !selectedRole && (
                <EmailJoinForm
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  isLoading={isLoading}
                  onJoin={handleJoinClick}
                />
              )}

              {/* Step 2: Newsletter Slider */}
              {isJoinClicked && newsletterConfirmed === null && (
                <NewsletterSlider
                  sliderValue={sliderValue}
                  setSliderValue={setSliderValue}
                  onRelease={handleSliderRelease}
                />
              )}

              {/* Step 3: Role Selection */}
              {(newsletterConfirmed === "subscribed" || newsletterConfirmed === "skipped") &&
                !selectedRole && (
                  <RoleSelection
                    newsletterConfirmed={newsletterConfirmed}
                    finalSubscribeChecked={finalSubscribeChecked}
                    setFinalSubscribeChecked={handleFinalSubscribeCheckChange}
                    onConfirm={handleFinalConfirm}
                    roles={roles}
                    onRoleSelect={handleRoleSelect}
                    onSkipRole={handleSkipRoleSelection}
                  />
                )}

              {/* Step 4: Thank You */}
              {selectedRole && proceedToThankYou && (
                <ThankYouMessage
                  name={name}
                  role={selectedRole}
                  newsletterConfirmed={newsletterConfirmed}
                  finalSubscribeChecked={finalSubscribeChecked}
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Right pane - image */}
        <div className="relative mt-12 lg:mt-0">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542641728-6ca359b085f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHRlYW18ZW58MHx8fGJsdWV8MTc1MjUyMjE0OHww&ixlib=rb-4.1.0&q=85"
              alt="Global Business Success"
              className="rounded-3xl shadow-2xl w-full h-auto animate-pulse"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
