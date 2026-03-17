/**
 * Wallet Domain Entity
 *
 * Represents a user's multi-type points wallet.
 * Points are stored as a dictionary so that any type of point
 * (webdevPoints, sparkPoints, uiuxPoints, etc.) can be tracked.
 */

/** A flexible dictionary mapping point-type names to their balances */
export type PointsBalance = Record<string, number>;

export type WalletProps = {
  userId: string;
  /** Each key is a point-type name (e.g. "sparkPoints"), value is the balance */
  points: PointsBalance;
  /** Computed sum of all point-type balances */
  totalPoints: number;
  updatedAt: string;
};

export class Wallet {
  private _props: WalletProps;

  private constructor(props: WalletProps) {
    this._props = props;
  }

  /** Expose props (read-only shape) */
  get props(): WalletProps {
    return this._props;
  }

  /**
   * Hydrate an existing wallet record from persistence.
   */
  static hydrate(props: WalletProps): Wallet {
    return new Wallet(props);
  }

  /**
   * Apply a delta (positive or negative) to a specific point type.
   * Unknown point types are initialised to 0 before the delta is applied.
   * Throws when the resulting balance would be negative.
   */
  applyPointsDelta(pointType: string, delta: number): void {
    const current = this._props.points[pointType] ?? 0;
    const next = current + delta;

    if (next < 0) {
      throw new Error(
        `Insufficient ${pointType}: cannot subtract ${Math.abs(delta)} from ${current}.`,
      );
    }

    this._props = {
      ...this._props,
      points: { ...this._props.points, [pointType]: next },
      totalPoints: this._recomputeTotal({ ...this._props.points, [pointType]: next }),
      updatedAt: new Date().toISOString(),
    };
  }

  /** Recalculate totalPoints as the sum of all point-type values */
  private _recomputeTotal(points: PointsBalance): number {
    return Object.values(points).reduce((sum, v) => sum + v, 0);
  }
}
