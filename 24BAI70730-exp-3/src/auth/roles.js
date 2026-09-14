// Display layer for roles.
//
// `Admin` / `Editor` / `Viewer` are the literal values carried in the JWT's
// `role` claim, and are what App.jsx's route guards, RoleBasedRoute, and
// apiClient's allowedRoles checks compare against. That vocabulary never
// changes here — only the *names shown on screen* do. Keeping the two
// separate means the access-control logic can't drift out of sync with a
// rebrand.
export const ROLE_META = {
  Admin: {
    label: 'Archivist',
    level: 'Tier III',
    tagline: 'Runs the building — manages members and the collection.',
    accent: 'seal',
  },
  Editor: {
    label: 'Curator',
    level: 'Tier II',
    tagline: 'Adds to and edits the collection.',
    accent: 'moss',
  },
  Viewer: {
    label: 'Reader',
    level: 'Tier I',
    tagline: 'Reads what has already been published.',
    accent: 'verdigris',
  },
};

export function roleLabel(role) {
  return ROLE_META[role]?.label ?? role;
}

export function roleLevel(role) {
  return ROLE_META[role]?.level ?? '';
}

export function roleAccent(role) {
  return ROLE_META[role]?.accent ?? 'brass';
}

// e.g. roleListLabel(['Editor', 'Admin']) -> "Curator or Archivist"
export function roleListLabel(roles) {
  return (roles ?? []).map(roleLabel).join(' or ');
}
