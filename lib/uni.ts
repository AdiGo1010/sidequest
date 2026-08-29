export function isAustralianUniEmail(email: string) {
  const normalised = email.trim().toLowerCase();
  return normalised.endsWith(".edu.au") || normalised.endsWith(".edu.au>");
}

export function uniFromEmail(email: string) {
  const domain = email.split("@")[1] ?? "";
  if (domain.includes("unsw")) return "UNSW Sydney";
  if (domain.includes("usyd") || domain.includes("sydney.edu")) return "University of Sydney";
  if (domain.includes("uts.edu")) return "UTS";
  if (domain.includes("mq.edu")) return "Macquarie University";
  if (domain.includes("unimelb") || domain.includes("unimelb.edu")) return "University of Melbourne";
  if (domain.includes("monash")) return "Monash University";
  if (domain.includes("rmit")) return "RMIT";
  if (domain.includes("uq.edu")) return "University of Queensland";
  if (domain.includes("qut.edu")) return "QUT";
  if (domain.includes("griffith")) return "Griffith University";
  return domain.replace(".edu.au", "").toUpperCase();
}
