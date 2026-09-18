import type { RandomUser, UserFilter } from "./types.js";

export function applyFilter(users: RandomUser[], filter: UserFilter): RandomUser[] {
  return users.filter((user) => {
    if (filter.field === "city") {
      return user.location?.city?.toLocaleLowerCase() === filter.value.toLocaleLowerCase();
    }
    const age = user.dob?.age;
    if (typeof age !== "number") return false;
    if (filter.operator === "gt") return age > filter.value;
    if (filter.operator === "lt") return age < filter.value;
    if (filter.operator !== "between") return false;
    return age >= filter.min && age <= filter.max;
  });
}
