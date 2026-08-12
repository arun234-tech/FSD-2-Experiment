export const platformLimits = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
  facebook: 63206,
  threads: 500,
};

export const platformMeta = {
  twitter: { label: "Twitter / X", color: "#1d9bf0", gradient: "linear-gradient(135deg,#1d9bf0,#0c7abf)" },
  linkedin: { label: "LinkedIn", color: "#0a66c2", gradient: "linear-gradient(135deg,#0a66c2,#004182)" },
  instagram: { label: "Instagram", color: "#e1306c", gradient: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)" },
  facebook: { label: "Facebook", color: "#1877f2", gradient: "linear-gradient(135deg,#1877f2,#0b4fa3)" },
  threads: { label: "Threads", color: "#e4e4e4", gradient: "linear-gradient(135deg,#4a4a4a,#0f0f0f)" },
};

export const validatePost = (content, platform, attachments = []) => {
  const limit = platformLimits[platform];

  if (!content.trim() && attachments.length === 0) {
    return { isValid: false, error: "Add some text or an attachment before posting" };
  }

  if (content.length > limit) {
    return { isValid: false, error: `Character limit exceeded (${limit})` };
  }

  return { isValid: true, error: "" };
};
