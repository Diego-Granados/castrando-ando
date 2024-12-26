"use client";
import { db } from "@/lib/firebase/config";
import {
  ref,
  get,
  child,
  update,
  onValue,
  push,
  increment,
} from "firebase/database";

class Campaign {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.date = data.date;
    this.place = data.place;
    this.description = data.description;
    this.phone = data.phone;
    this.pricesData = data.pricesData;
    this.priceSpecial = data.priceSpecial;
    this.requirements = data.requirements;
    this.photos = data.photos;
    this.available = data.available;

    this.validate();
  }

  validate() {
    if (!this.title) throw new Error("Campaign must have a title");
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      date: this.date,
      place: this.place,
      description: this.description,
      phone: this.phone,
      pricesData: this.pricesData,
      priceSpecial: this.priceSpecial,
      requirements: this.requirements,
      photos: this.photos,
      available: this.available,
    };
  }

  static filterEnabled(campaigns) {
    Object.keys(campaigns).forEach((campaign) => {
      if (!campaigns[campaign].enabled) {
        delete campaigns[campaign];
      } else {
        campaigns[campaign].id = campaign;
        campaigns[campaign] = new Campaign(campaigns[campaign]);
      }
    });
  }

  static async getAll(setCampaigns) {
    // Move Firebase fetch logic here
    const campaignsRef = ref(db, "campaigns");
    const unsubscribe = onValue(campaignsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setCampaigns({});
        return;
      }
      const campaigns = snapshot.val();
      Campaign.filterEnabled(campaigns);
      setCampaigns(campaigns);
    });
    return unsubscribe;
  }

  static async getById(campaignId, setCampaign) {
    const campaignRef = ref(db, `campaigns/${campaignId}`);
    const unsubscribe = onValue(campaignRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const value = snapshot.val();
      setCampaign(value);
    });
    return unsubscribe;
  }

  static async getByIdOnce(campaignId, setCampaign) {
    const campaignRef = ref(db, `campaigns/${campaignId}`);
    const snapshot = await get(campaignRef);
    if (!snapshot.exists()) {
      return;
    }
    const value = snapshot.val();
    setCampaign(value);
  }

  async delete() {
    // Handle campaign deletion
    await remove(ref(db, `campaigns/${this.id}`));
  }

  static async create(formData, inscriptions) {
    const campaignRef = ref(db, "campaigns");
    const newCampaignRef = push(campaignRef);
    const updates = {};
    updates[`/campaigns/${newCampaignRef.key}`] = formData;
    updates[`/inscriptions/${newCampaignRef.key}`] = inscriptions;
    // Insertar en DB
    await update(ref(db), updates);
  }

  static async update(campaignId, updates) {
    const snapshot = await get(child(ref(db), `inscriptions/${campaignId}`));
    if (!snapshot.exists()) {
      return NextResponse.error("No data available");
    }
    const inscriptions = snapshot.val();
    Object.keys(inscriptions).forEach((timeslot) => {
      if ("appointments" in inscriptions[timeslot]) {
        Object.keys(inscriptions[timeslot]["appointments"]).forEach(
          (appointment) => {
            const path = `/appointments/${inscriptions[timeslot]["appointments"][appointment]["id"]}/${appointment}`;
            updates[`${path}/campaign`] = formData.title;
            updates[`${path}/date`] = formData.date;
            updates[`${path}/place`] = formData.place;
          }
        );
      }
    });
    await update(ref(db), updates);
  }

  static async delete(campaignId) {
    const updates = {};
    updates[`/campaigns/${campaignId}/enabled`] = false;

    const snapshot = await get(child(ref(db), `inscriptions/${campaignId}`));
    if (!snapshot.exists()) {
      return NextResponse.error("No data available");
    }
    const inscriptions = snapshot.val();
    Object.keys(inscriptions).forEach((timeslot) => {
      if ("appointments" in inscriptions[timeslot]) {
        Object.keys(inscriptions[timeslot]["appointments"]).forEach(
          (appointment) => {
            const path = `/appointments/${inscriptions[timeslot]["appointments"][appointment]["id"]}/${appointment}`;
            updates[`${path}/enabled`] = false;
          }
        );
      }
    });

    await update(ref(db), updates);
  }
}

export default Campaign;
