import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/CartItems";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/Reducer.types";
import { CartItem } from "../types/types";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartRedeucer";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, discount, shippingCharges, subtotal, tax, total } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const dispatch = useDispatch();
  const [coupon, setcoupon] = useState<string>("");
  const [isValid, setisValid] = useState<boolean>(false);
  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItems: CartItem) => {
    dispatch(addToCart({ ...cartItems, quantity: cartItems.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };
  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();
    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}payment/discount?coupon=${coupon}`, {
          cancelToken: token,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          dispatch(calculatePrice());
          setisValid(true);
        })
        .catch(() => {
          dispatch(discountApplied(0));
          dispatch(calculatePrice());
          setisValid(false);
        });
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      cancel();
      setisValid(false);
    };
  }, [coupon]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div
      className="cart
    "
    >
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Selected</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>shippingChrage: ₹{shippingCharges}</p>
        <p>tax: ₹{tax}</p>
        <p>
          Discount - <em> ₹{discount}</em>
        </p>
        <p>
          <b>total: ₹{total}</b>
        </p>
        <input
          type="text"
          value={coupon}
          onChange={(e) => setcoupon(e.target.value)}
        />

        {coupon &&
          (isValid ? (
            <span className="green">
              ₹{discount} off using the Coupon <code>{coupon}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Code <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to={`/shipping`}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
