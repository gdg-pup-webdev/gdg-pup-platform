import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(3),
  password: z.string().min(6), // Hashed or raw (managed by infra/useCases)
  createdAt: z.date().optional(),
});

export type UserProps = z.infer<typeof UserSchema>;

export class User {
  private _props: UserProps;

  private constructor(props: UserProps) {
    this._props = props;
  }

  get id() { return this._props.id; }
  get username() { return this._props.username; }
  get password() { return this._props.password; }
  get createdAt() { return this._props.createdAt; }

  static create(props: Omit<UserProps, "id" | "createdAt">): User {
    const result = UserSchema.parse({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
    return new User(result);
  }

  static hydrate(props: UserProps): User {
    const result = UserSchema.parse(props);
    return new User(result);
  }

  update(props: Partial<Omit<UserProps, "id" | "createdAt">>) {
    const updated = { ...this._props, ...props };
    this._props = UserSchema.parse(updated);
  }

  get props() {
    return Object.freeze({ ...this._props });
  }
}
