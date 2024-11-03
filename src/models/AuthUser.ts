export interface AuthUser {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  permissions: string;
  accountType: string;
  displayPhoto : string | null;
}

export function parseAuthUserFromObject(obj: any): AuthUser {
  const url = "https://grantman-czivjdfhnq-ez.a.run.app/public_files/"+encodeURIComponent(obj["currProfilePicture"])
  const p: AuthUser = {
    email: obj["user"] || null,
    firstName: obj["firstName"] || null,
    lastName: obj["lastName"] || null,
    permissions: obj["userPermittedActions"] || null,
    accountType: obj["userType"] || null,
    displayPhoto:  url|| null,
  };
  return p;
}


