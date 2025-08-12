import { ShoppingBasketIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function Cart() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent></SheetContent>
    </Sheet>
  );
}
