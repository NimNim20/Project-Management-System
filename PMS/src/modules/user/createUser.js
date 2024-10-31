export function createUser(name, email, age) {
    const user = {
      name,
      email,
      age
    };
  
    console.log('User created:', user);
  
    // Return the user object for further use
    return user;
  }