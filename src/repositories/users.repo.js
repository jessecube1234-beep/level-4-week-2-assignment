/**
 * This file handles basic user operations.
 * It lets me create a new user and find users
 * by their email or ID from the repos.users array.
 */
export const createUser = (repos, user) => {
  repos.users.push(user);
  return user;
};

export const findUserByEmail = (repos, email) =>
  repos.users.find((u) => u.email === email);

export const findUserById = (repos, id) =>
  repos.users.find((u) => u.id === id);