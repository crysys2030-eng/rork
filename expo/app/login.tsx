import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Lock, Mail, User, LogIn, UserPlus } from 'lucide-react-native';

export default function LoginScreen() {
  const { login, loginAsGuest, register } = useAuth();
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'Erro ao criar conta');
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    await loginAsGuest();
    setIsLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
          style={styles.gradient}
        >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Lock size={48} color="#ffffff" />
            </View>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>
              {isRegisterMode ? 'Criar nova conta' : 'Entre na sua conta'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {isRegisterMode && (
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <User size={20} color="#64748b" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={20} color="#64748b" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#64748b" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={isRegisterMode ? handleRegister : handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  {isRegisterMode ? (
                    <UserPlus size={20} color="#ffffff" style={styles.buttonIcon} />
                  ) : (
                    <LogIn size={20} color="#ffffff" style={styles.buttonIcon} />
                  )}
                  <Text style={styles.buttonText}>
                    {isRegisterMode ? 'Criar Conta' : 'Entrar'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.guestButton]}
              onPress={handleGuestLogin}
              disabled={isLoading}
            >
              <User size={20} color="#2563eb" style={styles.buttonIcon} />
              <Text style={styles.guestButtonText}>Continuar como Convidado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              disabled={isLoading}
            >
              <Text style={styles.switchModeText}>
                {isRegisterMode
                  ? 'Já tem conta? Entrar'
                  : 'Não tem conta? Criar conta'}
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Credenciais de teste:</Text>
              <Text style={styles.infoText}>Admin: admin@app.com / admin123</Text>
              <Text style={styles.infoText}>Ou crie uma conta nova</Text>
            </View>
          </View>
        </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    padding: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  guestButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  guestButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  switchModeButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#3b82f6',
    marginBottom: 4,
  },
});
