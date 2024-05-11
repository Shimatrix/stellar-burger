import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { orderBurgerThunk } from '../../services/slices/ordersSlice';
import { clearOrder } from '../../services/slices/constructorSlice';
import { close } from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector((state) => state.constructorBurger);
  const orderRequest = useSelector((state) => state.orders.orderRequest);
  const orderModalData = useSelector((state) => state.orders.orderModalData);
  const user = useSelector((state) => state.user.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(close());
  }, []);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const newOrder = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      dispatch(orderBurgerThunk(newOrder));
    }
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(close());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
