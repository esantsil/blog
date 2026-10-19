type DoglyEventOptions = {
  event?: string;
  path?: string;
  properties?: Record<string, any>;
};

class DoglyClient {
  private websiteId: string;
  private endpoint = "https://dogly-analycts.vercel.app/api/bark";

  constructor(websiteId: string) {
    this.websiteId = websiteId;
  }

  private getVisitorId(): string {
    if (typeof window === "undefined") return "";
    let visitorId = localStorage.getItem("_dogly_vid");

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("_dogly_vid", visitorId);
    }

    return visitorId;
  }

  public async bark({
    event = "page-view",
    path,
    properties,
  }: DoglyEventOptions = {}) {
    if (typeof window === "undefined") return;

    try {
      const payload = {
        websiteId: this.websiteId,
        event,
        path: path || window.location.pathname,
        visitorId: this.getVisitorId(),
        referrer: document.referrer || "",
        properties: properties || {},
      };

      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      console.warn("[Dogly Analytics] Erro ao enviar evento:", error);
    }
  }
}

export const dogly = new DoglyClient("2b0ea8530349");
