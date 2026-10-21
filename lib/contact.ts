export const contactFields = [
  { name: "fullName", label: "Full Name", type: "text", autoComplete: "name", placeholder: "Your full name", required: true, maxLength: 200 },
  { name: "email", label: "Business Email", type: "email", autoComplete: "email", placeholder: "you@company.com", required: true, maxLength: 254 },
  { name: "company", label: "Company Name / Website", type: "text", autoComplete: "organization", placeholder: "Company name or website", required: true, maxLength: 200 },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel", placeholder: "(555) 000-0000", required: false, maxLength: 80 },
  { name: "message", label: "How Can We Help?", type: "textarea", autoComplete: "off", placeholder: "Tell us about your roofing business, the challenges you're facing, or how we can help.", required: true, maxLength: 4000 },
] as const;

export type ContactField = (typeof contactFields)[number]["name"];
export type ContactErrors = Partial<Record<ContactField, string>>;
export const contactSuccessMessage = "Thanks for reaching out! Our team will get back to you soon.";

export function validateContact(payload: Record<string, unknown>) {
  const values = {} as Record<ContactField, string>;
  const errors: ContactErrors = {};
  for (const field of contactFields) {
    const raw = payload[field.name];
    values[field.name] = typeof raw === "string" ? raw.trim() : "";
    const invalidControl = typeof raw === "string" && Array.from(raw).some((character) => (character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) && !(field.name === "message" && ["\t", "\n", "\r"].includes(character)));
    if (field.required && !values[field.name]) {
      errors[field.name] = field.name === "message" ? "Please tell us how we can help." : `Please enter your ${field.label.toLowerCase()}.`;
    } else if (raw !== undefined && (typeof raw !== "string" || raw.length > field.maxLength || invalidControl)) {
      errors[field.name] = field.name === "message" ? "Please enter a message of up to 4,000 characters without unsupported control characters." : `Please check your ${field.label.toLowerCase()}.`;
    }
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid business email.";
  }
  return { values, errors };
}
