export type row = {
  id: string;
  name: string;
  email: string;
};

export type create = {
  name: string;
  email: string;
};

export type update = {
  name?: string;
  email?: string;
}; 