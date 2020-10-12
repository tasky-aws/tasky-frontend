export interface Roles {
  roles: Role[];
  activeRole: string;
}
export interface Role {
  arn: string;
  name: string;
}

const state: Roles = {
  roles: [],
  activeRole: 'Set active role'
}

export default state
