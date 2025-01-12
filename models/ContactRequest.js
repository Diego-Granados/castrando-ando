"use client";
import { db } from "@/lib/firebase/config";
import { ref, push, update } from "firebase/database";

export default class ContactRequest {
  constructor(data) {
    this.id = data.id;
    this.cedula = data.cedula;
    this.nombre = data.nombre;
    this.correo = data.correo;
    this.mensaje = data.mensaje;
    this.fecha = data.fecha || new Date().toISOString();
    this.leido = data.leido || false;

    this.validate();
  }

  validate() {
    if (!this.mensaje) throw new Error("Contact request must have a message");
    if (!this.correo) throw new Error("Contact request must have an email");
  }

  toJSON() {
    return {
      id: this.id,
      cedula: this.cedula,
      nombre: this.nombre,
      correo: this.correo,
      mensaje: this.mensaje,
      fecha: this.fecha,
      leido: this.leido
    };
  }

  static async create(contactData) {
    try {
      const contactsRef = ref(db, "contactRequests");
      const newContactRef = push(contactsRef);
      const updates = {};
      updates[`/contactRequests/${newContactRef.key}`] = contactData;
      await update(ref(db), updates);
      return new ContactRequest({ id: newContactRef.key, ...contactData });
    } catch (error) {
      console.error("Error creating contact request:", error);
      throw error;
    }
  }
} 