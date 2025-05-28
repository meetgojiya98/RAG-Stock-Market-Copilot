import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  symbol: string;
  price: string;
  onAsk: () => void;
};

export default function StockCard({ symbol, price, onAsk }: Props) {
  return (
    <Card className="w-full mb-4 shadow-xl rounded-2xl">
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{symbol}</h2>
            <div className="text-2xl">{price}</div>
          </div>
          <Button onClick={onAsk}>Ask</Button>
        </div>
      </CardContent>
    </Card>
  );
}
