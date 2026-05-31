import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import {
  toggleWishlistThunk,
  removeWishlistItemThunk,
} from "@/store/slices/wishlistSlice";

export function useWishlistActions() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  function handleToggleWishlist(productId: string | number) {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    dispatch(toggleWishlistThunk({ productId: String(productId) }));
  }

  function handleRemoveFromWishlist(backendItemId: string) {
    dispatch(removeWishlistItemThunk({ backendItemId }));
  }

  return { handleToggleWishlist, handleRemoveFromWishlist };
}
