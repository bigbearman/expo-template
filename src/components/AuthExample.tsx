import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useStore } from '../store/useStore'

export const AuthExample = () => {
  // Lấy state và actions từ store
  const { isAuthenticated, user, login, logout } = useStore()

  const handleLogin = () => {
    login({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    })
  }

  return (
    <View>
      {isAuthenticated ? (
        <>
          <Text>Welcome {user?.name}</Text>
          <TouchableOpacity onPress={logout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handleLogin}>
          <Text>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  )
} 