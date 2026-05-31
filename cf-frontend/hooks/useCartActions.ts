import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  addToCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  type CartItem,
} from "@/store/slices/cartSlice";

export function useCartActions() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  function handleAddToCart(item: CartItem) {
    if (isAuthenticated) {
      dispatch(
        addToCartThunk({
          productId: String(item.productId),
          quantity: item.quantity,
        })
      );
    } else {
      dispatch(addToCart(item));
    }
  }

  function handleUpdateQuantity(
    productId: string | number,
    quantity: number,
    backendItemId?: string
  ) {
    if (isAuthenticated && backendItemId) {
      dispatch(updateCartItemThunk({ backendItemId, quantity }));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  }

  function handleRemoveFromCart(
    productId: string | number,
    backendItemId?: string
  ) {
    if (isAuthenticated && backendItemId) {
      dispatch(removeCartItemThunk({ backendItemId }));
    } else {
      dispatch(removeFromCart(productId));
    }
  }

  return { handleAddToCart, handleUpdateQuantity, handleRemoveFromCart };
}
