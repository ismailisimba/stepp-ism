export interface AuthUser {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  permissions: string;
  accountType: string;
  displayPhoto : string;
}

export function parseAuthUserFromObject(obj: any): AuthUser {
  const p: AuthUser = {
    email: obj["user"] || null,
    firstName: obj["firstName"] || null,
    lastName: obj["lastName"] || null,
    permissions: obj["userPermittedActions"] || null,
    accountType: obj["userType"] || null,
    displayPhoto: obj["currProfilePicture"] || null,
  };
  return p;
}


