import type {
  AirDefenseClass,
  CombatAircraftClass,
  CombatSystemClass,
  DroneClass,
  MissileRole,
  NavalVesselClass,
  RadarRole,
  SystemCategory,
} from "@/data/types";
import {
  AIR_DEFENSE_LABELS,
  COMBAT_SYSTEM_LABELS,
  GENERATION_LABELS,
  MISSILE_ROLE_LABELS,
  NAVAL_VESSEL_LABELS,
  RADAR_ROLE_LABELS,
} from "@/data/labels";

/**
 * Pays « principal » d'un système — premier segment avant « · » (ex.
 * « France · Italie » → « France »). Utilisé pour grouper par pays.
 */
export function primaryCountry(country: string): string {
  return country.split("·")[0]?.trim() ?? country;
}

/** Forme minimale nécessaire pour dériver une famille comparable. */
export interface FamilyGroupable {
  category: SystemCategory;
  classLabel: string;
  navalVesselClass?: NavalVesselClass;
  combatAircraftClass?: CombatAircraftClass;
  droneClass?: DroneClass;
  missileRole?: MissileRole;
  radarRole?: RadarRole;
  airDefenseClass?: AirDefenseClass;
  combatSystemClass?: CombatSystemClass;
}

/**
 * Libellé de famille pour le regroupement « par famille » du comparateur :
 * classe navale, génération d'avion, rôle missile/radar — sinon le libellé de
 * classe du système. Permet de confronter des frères (FREMM FR/IT, variantes…).
 */
export function familyLabel(system: FamilyGroupable): string {
  switch (system.category) {
    case "naval-vessel":
      return system.navalVesselClass
        ? NAVAL_VESSEL_LABELS[system.navalVesselClass]
        : system.classLabel;
    case "combat-aircraft":
      return system.combatAircraftClass
        ? GENERATION_LABELS[system.combatAircraftClass]
        : system.classLabel;
    case "missile":
      return system.missileRole
        ? MISSILE_ROLE_LABELS[system.missileRole]
        : system.classLabel;
    case "radar":
      return system.radarRole
        ? RADAR_ROLE_LABELS[system.radarRole]
        : system.classLabel;
    case "air-defense":
      return system.airDefenseClass
        ? AIR_DEFENSE_LABELS[system.airDefenseClass]
        : system.classLabel;
    case "combat-system":
      return system.combatSystemClass
        ? COMBAT_SYSTEM_LABELS[system.combatSystemClass]
        : system.classLabel;
    default:
      return system.classLabel;
  }
}
