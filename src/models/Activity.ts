import DeleteDialog from "@/views/components/DeleteDialog.vue";

export interface Activity {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  results: string;
  outcomes: string;
  createdAt?: Date;
}

export type Activities = Activity[];

export function parseActivitiesFromArray(objs: Object[]): Activities {
  const activites: Activities = [];
  for (const obj of objs){
    const p = parseActivityFromObject(obj);
    activites.push(p);
  }
  return activites;
}

export function parseActivityFromObject(obj: any): Activity {
  const p: Activity = {
    id: obj["id"] || null,
    name: obj["name"] || null,
    startDate: new Date(obj["startDate"]?.value || obj["startDate"]) || null,
    endDate: new Date(obj["endDate"]?.value || obj["endDate"]) || null,
    description: obj["description"] || null,
    results: obj["results"] || null,
    outcomes: obj["outcomes"] || null,
    createdAt: new Date(obj["created_date"]) || null,
  };
  return p;
}
