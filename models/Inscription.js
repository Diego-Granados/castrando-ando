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

class Inscription {
  static async getCampaignInscriptions(
    campaignId,
    setSortedKeys,
    setTimeslots
  ) {
    const inscriptionsRef = ref(db, `inscriptions/${campaignId}`);
    const unsubscribe = onValue(inscriptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const data = snapshot.val();
      const keys = Object.keys(data);

      const sortedKeys = keys.sort((a, b) => {
        const [hourA, minuteA] = a.split(":").map(Number);
        const [hourB, minuteB] = b.split(":").map(Number);

        // Comparar horas
        if (hourA === hourB) {
          return minuteA - minuteB;
        } else {
          return hourA - hourB;
        }
      });
      setSortedKeys(sortedKeys);
      setTimeslots(data);
    });
    return unsubscribe;
  }

  static async getAvailableTimeslots(campaignId, timeslot, setAvailable) {
    const inscriptionsRef = ref(db, `inscriptions/${campaignId}/${timeslot}`);
    const unsubscribe = onValue(inscriptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const data = snapshot.val();
      setAvailable(data);
    });
    return unsubscribe;
  }

  static async reserveAppointment(formData, authenticated) {
    const updates = {};

    updates[`campaigns/${formData.campaignId}/available`] = increment(-1);
    updates[
      `inscriptions/${formData.campaignId}/${formData.timeslot}/available`
    ] = increment(-1);

    const inscriptionRef = ref(
      db,
      `inscriptions/${formData.campaignId}/${formData.timeslot}/appointments`
    );
    const newInscriptionRef = push(inscriptionRef);
    updates[
      `inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${newInscriptionRef.key}`
    ] = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      pet: formData.pet,
      animal: formData.animal,
      sex: formData.sex,
      priceData: formData.priceData,
      priceSpecial: formData.priceSpecial,
      enabled: true,
      present: false,
    };
    if (!authenticated) {
      updates[`/users/${formData.id}`] = {
        name: formData.name,
      };
    }
    updates[`/appointments/${formData.id}/${newInscriptionRef.key}`] = {
      campaignId: formData.campaignId,
      timeslot: formData.timeslot,
      campaign: formData.campaign,
      date: formData.date,
      place: formData.place,
      email: formData.email,
      phone: formData.phone,
      animal: formData.animal,
      sex: formData.sex,
      pet: formData.pet,
      priceData: formData.priceData,
      priceSpecial: formData.priceSpecial,
      enabled: true,
    };

    await update(ref(db), updates);
  }

  static async getAppointments(cedula, setAppointments) {
    const dbRef = ref(db);

    const snapshot = await get(child(dbRef, `/appointments/${cedula}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach((appointment) => {
        if (!data[appointment].enabled) delete data[appointment];
      });
      setAppointments(data);
    } else {
      setAppointments({});
    }
  }

  static async updateAppointment(formData) {
    const updates = {};

    const appointmentKey = formData.appointmentKey;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/animal`
    ] = formData.animal;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/name`
    ] = formData.name;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/phone`
    ] = formData.phone;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/pet`
    ] = formData.pet;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/priceData`
    ] = formData.priceData;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/priceSpecial`
    ] = formData.priceSpecial;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/sex`
    ] = formData.sex;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/email`
    ] = formData.email;

    if (!authenticated) {
      updates[`/users/${formData.id}`] = {
        name: formData.name,
      };
    }
    updates[`/appointments/${formData.id}/${appointmentKey}/animal`] =
      formData.animal;
    updates[`/appointments/${formData.id}/${appointmentKey}/pet`] =
      formData.pet;
    updates[`/appointments/${formData.id}/${appointmentKey}/priceData`] =
      formData.priceData;
    updates[`/appointments/${formData.id}/${appointmentKey}/priceSpecial`] =
      formData.priceSpecial;
    updates[`/appointments/${formData.id}/${appointmentKey}/sex`] =
      formData.sex;
    updates[`/appointments/${formData.id}/${appointmentKey}/phone`] =
      formData.phone;
    updates[`/appointments/${formData.id}/${appointmentKey}/email`] =
      formData.email;

    await update(ref(db), updates);
  }

  static async deleteAppointment(formData) {
    const updates = {};

    updates[`/campaigns/${formData.campaignId}/available`] = increment(1);
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/available`
    ] = increment(1);

    const appointmentKey = formData.appointmentKey;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/enabled`
    ] = false;

    updates[`/appointments/${formData.id}/${appointmentKey}/enabled`] = false;

    await update(ref(db), updates);
  }

  static async updateAttendance(campaignId, timeslot, inscriptionId, present) {
    const updates = {};
    updates[
      `inscriptions/${campaignId}/${timeslot}/appointments/${inscriptionId}/present`
    ] = present;
    await update(ref(db), updates);
  }
}

export default Inscription;
