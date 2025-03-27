import { Text } from 'react-native';
import { useStore } from '../store/useStore';
import type { AppState } from '../store/useStore';

// Tạo selector bên ngoài component để tránh re-create mỗi lần render
const userSelector = (state: AppState) => state.user;

export const UserProfile = () => {
  // Chỉ re-render khi user thay đổi
  const user = useStore(userSelector);
  
  return <Text>{user?.name}</Text>;
} 