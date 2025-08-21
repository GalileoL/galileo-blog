import { Semaphore } from "./semaphore.js";
import { GLOBAL_MAX_CONCURRENCY, USER_MAX_CONCURRENCY } from "./config.js";

export const globalSemaphore = new Semaphore(GLOBAL_MAX_CONCURRENCY);
const userSemaphores = new Map();

export const getUserSemaphore = (userId) => {
  if (!userSemaphores.has(userId)) {
    userSemaphores.set(userId, new Semaphore(USER_MAX_CONCURRENCY));
  }
  return userSemaphores.get(userId);
};
