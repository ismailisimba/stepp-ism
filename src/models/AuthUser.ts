export interface AuthUser {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  permissions: string;
  accountType: string;
  superAdminType: string,
  displayPhoto : string | null;
}

export function parseAuthUserFromObject(obj: any): AuthUser {
  const yy = obj["currProfilePicture"]||obj["profilePicture"]
  const url = "https://grantman-czivjdfhnq-ez.a.run.app/public_files/"+encodeURIComponent(yy)
  const p: AuthUser = {
    email: obj["user"] || obj["email"],
    firstName: obj["firstName"] || null,
    lastName: obj["lastName"] || null,
    permissions: obj["userPermittedActions"] || null,
    accountType: obj["userType"] || null,
    superAdminType: obj["superAdminType"] || null,
    displayPhoto:  url|| null,
  };
  return p;
}


