import { BlurStrength } from "../storage/settings";

export const getBlurClass = (blur: BlurStrength) => {
  switch (blur) {
    case "low":
      return "backdrop-blur-sm";
    case "medium":
      return "backdrop-blur-md";
    case "high":
      return "backdrop-blur-lg";
    default:
      return "backdrop-blur-sm";
  }
};
