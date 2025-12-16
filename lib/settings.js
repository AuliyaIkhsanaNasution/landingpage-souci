import api from "./api";

const DEFAULT_SETTINGS = {
  site_title: "PT. Souci Indoprima",
  site_description: "Provider outsourcing terpercaya",
  contact_whatsapp: "6281234567890",
  contact_email: "",
  contact_phone: "",
  address: "",
  social_twitter: "",
  social_instagram: "",
  social_facebook: "",
  social_linkedin: "",
};

export async function fetchSettings() {
  try {
    const response = await api.get("/settings");
    const data = response?.data?.data || [];

    const settings = { ...DEFAULT_SETTINGS };
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const key = item.key || item.key_name;
        if (key) settings[key] = item.value ?? settings[key] ?? "";
      });
    }

    return settings;
  } catch (error) {
    // Don't surface network errors as console.error in dev overlay — use warn
    // eslint-disable-next-line no-console
    console.warn("fetchSettings warning:", error?.message || error);
    return { ...DEFAULT_SETTINGS };
  }
}

export default fetchSettings;
