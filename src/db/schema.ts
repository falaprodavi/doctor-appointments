import {pgTable, text, timestamp, uuid, time, integer, pgEnum,  } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));


export const clinicsTable = pgTable("clinics", {
  id: uuid().defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("update_at").defaultNow().$onUpdate(()=> new Date()).notNull(),
});

export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("update_at").defaultNow().$onUpdate(()=> new Date()).notNull(),
});

export const usersToClinicsTableRelations = relations(
  usersToClinicsTable, 
  ({ one }) => ({
  user: one(usersTable, { 
    
    fields: [usersToClinicsTable.userId], 
    references: [usersTable.id] 
  }),
  clinic: one(clinicsTable, { 
    fields: [usersToClinicsTable.clinicId], 
    references: [clinicsTable.id] 
  }),
}));  

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinicsTable: many(usersToClinicsTable),
}));



export const doctorsTable = pgTable("doctors", {
  id: uuid().defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("update_at").defaultNow().$onUpdate(()=> new Date()).notNull(),
});

export const doctorsTableRelations = relations(doctorsTable, ({ many, one }) => ({
  clinic: one(clinicsTable, { fields: [doctorsTable.clinicId], references: [clinicsTable.id] }),
  appointments: many(appointmentsTable),
}));

export const patientSexEnum = pgEnum("patient_sex", ["male", "female", "other"]);


export const patientsTable = pgTable("patients", {
  id: uuid().defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(), 
  sex: patientSexEnum("sex").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("update_at").defaultNow().$onUpdate(()=> new Date()).notNull(),
});

export const patientsTableRelations = relations(patientsTable, ({many, one }) => ({
  clinic: one(clinicsTable, { fields: [patientsTable.clinicId], references: [clinicsTable.id] }),
  appointments: many(appointmentsTable),
}));  


export const appointmentsTable = pgTable("appointments", {
  id: uuid().defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id").notNull().references(() => patientsTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id").notNull().references(() => doctorsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("update_at").defaultNow().$onUpdate(()=> new Date()).notNull(),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
  clinic: one(clinicsTable, { fields: [appointmentsTable.clinicId], references: [clinicsTable.id] }),
  patient: one(patientsTable, { fields: [appointmentsTable.patientId], references: [patientsTable.id] }),
  doctor: one(doctorsTable, { fields: [appointmentsTable.doctorId], references: [doctorsTable.id] }),
}));