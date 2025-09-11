export const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'customer@demo.com',
    password: 'customer123',
    firstName: 'Customer',
    lastName: 'User',
    role: 'customer'
  },
  {
    email: 'user@demo.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user'
  }
]

export const getDemoUser = (email: string, password: string) => {
  return demoUsers.find(user => user.email === email && user.password === password)
}

