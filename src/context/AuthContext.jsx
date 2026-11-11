
import supabase from '@/lib/supabase';
import * as Linking from 'expo-linking';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext(null);

const getRecoveryParams = (url) => {
  if (!url) return {};

  const queryString = url.split('?')[1]?.split('#')[0] || '';
  const hashString = url.split('#')[1] || '';

  const queryParams = new URLSearchParams(queryString);
  const hashParams = new URLSearchParams(hashString);

  return {
    code: queryParams.get('code'),
    access_token:
      hashParams.get('access_token') || queryParams.get('access_token'),
    refresh_token:
      hashParams.get('refresh_token') || queryParams.get('refresh_token'),
    type: hashParams.get('type') || queryParams.get('type'),
    error_description:
      hashParams.get('error_description') ||
      queryParams.get('error_description'),
  };
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    let authStateChanged = false;
    let isMounted = true;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, currentSession) => {
        authStateChanged = true;

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'PASSWORD_RECOVERY') {
          setRecoveryReady(true);
        }
      });

    const restore = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('[Auth] getSession error:', error.message);
        }

        if (!authStateChanged && isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (e) {
        console.warn('[Auth] restore exception:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const handleRecoveryLink = async (url) => {
      if (!url || !url.includes('reset-password')) return;

      try {
        const params = getRecoveryParams(url);

        if (params.error_description) {
          console.warn('[Auth] Recovery link error:', params.error_description);
          return;
        }

        if (params.code) {
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(params.code);

          if (error) throw error;

          if (data.session && isMounted) {
            setSession(data.session);
            setUser(data.session.user);
            setRecoveryReady(true);
          }

          return;
        }

        if (params.access_token && params.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) throw error;

          if (data.session && isMounted) {
            setSession(data.session);
            setUser(data.session.user);
            setRecoveryReady(true);
          }

          return;
        }

        console.warn('[Auth] Recovery link did not contain usable tokens.');
      } catch (error) {
        console.warn('[Auth] Recovery link processing failed:', error.message);
      }
    };

    const subscriptionLinking = Linking.addEventListener(
      'url',
      ({ url }) => {
        handleRecoveryLink(url);
      }
    );

    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        await handleRecoveryLink(initialUrl);
      }
    };

    restore();
    checkInitialUrl();

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
      subscriptionLinking.remove();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.session;
  };

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setRecoveryReady(false);
  };

  const resetPassword = async (email) => {
    const redirectUrl = 'kindredngoapp:///reset-password';
    console.log('[Auth] Generated reset URL:', redirectUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    if (!recoveryReady || !session) {
      throw new Error('Your password-reset session is invalid or expired. Please request a new reset link.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    setRecoveryReady(false);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        recoveryReady,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
};
