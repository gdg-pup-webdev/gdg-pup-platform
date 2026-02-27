export type WalletProps = { 
  updatedAt: string; 

  points: {
    sparkPoints: number;
    webdevPoints: number;
  };

  totalPoints: number;
  userId: string;
};

export class Wallet {
  props: WalletProps;

  constructor(props: WalletProps) {
    this.props = props;
  }

  static hydrate(props: WalletProps) {
    return new Wallet(props);
  }

  updatePoints(pointsType: string, amount: number) {
    switch (pointsType) {
      case "sparkPoints":
        this.props.points.sparkPoints += amount;
        break;
      case "webdevPoints":
        this.props.points.webdevPoints += amount;
        break;
      default:
        throw new Error("Invalid points type");
    }

    this.props.totalPoints += amount;
  }
}
