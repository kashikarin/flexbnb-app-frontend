import { orderService } from '../../services/order'
import { store } from '../store'
import {
  ADD_ORDER,
  REMOVE_ORDER,
  SET_ORDERS,
  SET_ORDER,
  UPDATE_ORDER,
  SET_FILTERORDERSBY,
} from '../reducers/order.reducer'

export async function updateOrder(orderToUpdate) {
  try {
    const updatedOrder = await orderService.save(orderToUpdate)
    console.log("🚀 ~ updatedOrder:", updatedOrder)
    store.dispatch(getCmdUpdateOrder(updatedOrder))
    return updatedOrder
  } catch (err) {
    console.error('Cannot update order status', err)
    throw err
  }
}

export async function loadOrders(filterOrdersBy) {
  console.log("🚀 ~ filterOrdersBy:", filterOrdersBy)
  try {
    const orders = await orderService.query(filterOrdersBy)   
    store.dispatch(getCmdSetOrders(orders))
  } catch (err) {
    console.error('Cannot load orders', err)
    throw err
  }
}

export async function initOrder(homeId, userId) {
  try {
  } catch (err) {
    console.error
  }
}

export async function loadOrder(orderId) {
  try {
    const order = await orderService.getById(orderId)
    store.dispatch(getCmdSetOrder(order))
  } catch (err) {
    console.error('Cannot load order', err)
    throw err
  }
}

export async function addOrder(order) {
  try {
    const savedOrder = await orderService.save(order)
    console.log("🚀 ~ savedOrder:", savedOrder)
    store.dispatch(getCmdAddOrder(savedOrder))
    await loadOrders({})
    return savedOrder
  } catch (err) {
    console.error('Cannot add order', err)
    throw err
  }
}

export async function removeOrder(orderId) {
  try {
    await orderService.remove(orderId)
    store.dispatch(getCmdRemoveOrder(orderId))
    await loadOrders({})
  } catch (err) {
    console.error('Cannot remove order', err)
    throw err
  }
}

export function setFilterOrdersBy(filterOrdersBy) {
  store.dispatch(getCmdSetFilterOrdersBy(filterOrdersBy))
}

// Command Creators:
function getCmdSetOrders(orders) {
  return {
    type: SET_ORDERS,
    orders,
  }
}
function getCmdSetOrder(order) {
  return {
    type: SET_ORDER,
    order,
  }
}
function getCmdRemoveOrder(orderId) {
  return {
    type: REMOVE_ORDER,
    orderId,
  }
}
function getCmdAddOrder(order) {
  return {
    type: ADD_ORDER,
    order,
  }
}
function getCmdUpdateOrder(order) {
  return {
    type: UPDATE_ORDER,
    order,
  }
}

function getCmdSetFilterOrdersBy(filterOrdersBy) {
  return {
    type: SET_FILTERORDERSBY,
    filterOrdersBy,
  }
}
