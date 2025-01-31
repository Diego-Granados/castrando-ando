describe("Pruebas de integración con Firebase", () => {
  beforeAll(() => {
    // Clear module mocks
    jest.unmock("firebase/app");
    jest.unmock("firebase/database");
    jest.unmock("@/lib/firebase/config");
    jest.unmock("console");
    // Reset modules to force reloading without mocks
    jest.resetModules();
  });

  describe("Realtime Database", () => {
    it("debería leer una campaña de Firebase", async () => {
      await jest.isolateModules(async () => {
        const Campaign = (await import("@/models/Campaign")).default;
        let fetchedCampaign = null;
        let expectedCampaign = {
          available: 85,
          date: "2025-03-29",
          description:
            "Incluye medicación inyectada, medicación para la casa, desparasitación, corte de uñas, mini limpieza dental y limpieza de orejas.",
          enabled: false,
          endTime: "15:00",
          phone: "85858505",
          photos: [
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/f_auto,q_auto/v1738161717/campaigns/campaign-1738161716204/tair0bbabxv4bk2boh1x.jpg",
          ],
          place: "Salón Comunal de Guararí, Heredia",
          priceSpecial: "5000",
          pricesData: [
            {
              price: 13000,
              weight: 10,
            },
            {
              price: 16000,
              weight: 15,
            },
            {
              price: 22000,
              weight: 20,
            },
          ],
          requirements: [
            "Perros y gatos en perfecto estado de salud.",
            "Solo animales con 12 horas de ayuno (comida y agua).",
            "Llevar cobija.",
            "Perros y gatos mayores de 3 meses.",
          ],
          slotsNumber: "10",
          startTime: "07:30",
          title: "Campaña de Castración para Perros y Gatos",
        };

        const campaignPromise = new Promise((resolve) => {
          const setCampaign = (campaign) => {
            fetchedCampaign = campaign;
            resolve(campaign);
          };

          Campaign.getByIdOnce("-OHmVkASCPe9_7K3p9xJ", setCampaign);
        });

        await campaignPromise;

        expect(fetchedCampaign).not.toBeNull();
        expect(typeof fetchedCampaign).toBe("object");
        expect(fetchedCampaign).toHaveProperty("title");
        expect(fetchedCampaign).toHaveProperty("date");
        expect(fetchedCampaign).toHaveProperty("place");
        expect(fetchedCampaign).toHaveProperty("description");
        expect(fetchedCampaign).toHaveProperty("phone");
        expect(fetchedCampaign).toHaveProperty("pricesData");
        expect(fetchedCampaign).toHaveProperty("requirements");
        expect(fetchedCampaign).toHaveProperty("photos");
        expect(fetchedCampaign).toHaveProperty("available");
        expect(fetchedCampaign).toEqual(expectedCampaign);
      });
    }, 10000);
  });
});
