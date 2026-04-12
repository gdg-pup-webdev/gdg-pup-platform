

export const MEMBER_PROJECT_MAX_IMAGES = 4;

export type MemberProjectProps = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  images: string[];
  memberGdgId: string;
  createdAt: Date;
  updatedAt: Date;

  member: {
    gdgId: string; 
    name: string | null;
    thumbnailImageUrl: string | null; 
    email: string | null;
  } | null;
};

export type MemberProjectUpdateProps = Partial<
  Pick<MemberProjectProps, "title" | "startDate" | "endDate" | "description" | "images">
>;

export class MemberProject {
  private constructor(private _props: MemberProjectProps) {}

  public get props(): MemberProjectProps {
    return {
      ...this._props,
      images: [...this._props.images],
      member: this._props.member ? { ...this._props.member } : null,
    };
  }

  private static sanitizeImages(images: string[]): string[] {
    const sanitized = images
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    if (sanitized.length > MEMBER_PROJECT_MAX_IMAGES) {
      throw new Error(`A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`);
    }

    return sanitized;
  }

  private static assertIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0) {
      throw new Error("Image index must be a non-negative integer.");
    }
  }

  public static create(props: Omit<MemberProjectProps, "id" | "createdAt" | "updatedAt" | "member">): MemberProject {
    const now = new Date();
    const images = MemberProject.sanitizeImages(props.images);

    return new MemberProject({
      ...props,
      images,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      member: null,
    });
  }

  public static hydrate(props: MemberProjectProps): MemberProject {
    return new MemberProject({
      ...props,
      images: MemberProject.sanitizeImages(props.images),
    });
  }

  public update(props: MemberProjectUpdateProps): void {
    const nextImages = props.images
      ? MemberProject.sanitizeImages(props.images)
      : this._props.images;

    this._props = {
      ...this._props,
      ...props,
      images: nextImages,
      updatedAt: new Date(),
    };
  }

  public addImage(imageUrl: string): void {
    const sanitized = imageUrl.trim();
    if (!sanitized) {
      throw new Error("Image URL cannot be empty.");
    }

    if (this._props.images.length >= MEMBER_PROJECT_MAX_IMAGES) {
      throw new Error(`A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`);
    }

    this._props = {
      ...this._props,
      images: [...this._props.images, sanitized],
      updatedAt: new Date(),
    };
  }

  public deleteImageAt(index: number): string {
    MemberProject.assertIndex(index);

    const target = this._props.images[index];
    if (!target) {
      throw new Error(`Image at index ${index} does not exist.`);
    }

    const images = [...this._props.images];
    images.splice(index, 1);

    this._props = {
      ...this._props,
      images,
      updatedAt: new Date(),
    };

    return target;
  }

  public reorderImages(fromIndex: number, toIndex: number): void {
    MemberProject.assertIndex(fromIndex);
    MemberProject.assertIndex(toIndex);

    if (fromIndex >= this._props.images.length || toIndex >= this._props.images.length) {
      throw new Error("Image reorder indices are out of range.");
    }

    if (fromIndex === toIndex) {
      return;
    }

    const images = [...this._props.images];
    const [target] = images.splice(fromIndex, 1);

    if (!target) {
      throw new Error("Failed to reorder images.");
    }

    images.splice(toIndex, 0, target);

    this._props = {
      ...this._props,
      images,
      updatedAt: new Date(),
    };
  }

  public upsertImageAt(index: number, imageUrl: string): string | null {
    MemberProject.assertIndex(index);

    if (index >= MEMBER_PROJECT_MAX_IMAGES) {
      throw new Error(`Image index must be less than ${MEMBER_PROJECT_MAX_IMAGES}.`);
    }

    const sanitized = imageUrl.trim();
    if (!sanitized) {
      throw new Error("Image URL cannot be empty.");
    }

    const images = [...this._props.images];
    let replacedImageUrl: string | null = null;

    if (index < images.length) {
      replacedImageUrl = images[index] ?? null;
      images[index] = sanitized;
    } else {
      if (images.length >= MEMBER_PROJECT_MAX_IMAGES) {
        throw new Error(`A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`);
      }

      // Keep the list contiguous by appending when a higher legacy slot is provided.
      images.push(sanitized);
    }

    this._props = {
      ...this._props,
      images,
      updatedAt: new Date(),
    };

    return replacedImageUrl;
  }
}
