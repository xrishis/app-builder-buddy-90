import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create user profiles after successful signup
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            await createUserProfiles(session.user);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfiles = async (user: User) => {
    try {
      const role = user.user_metadata?.role || 'passenger';
      const name = user.user_metadata?.name || '';
      const phone = user.user_metadata?.phone || '';

      // Create role-specific profile
      if (role === 'passenger') {
        const { error } = await supabase
          .from('passengers')
          .insert({
            user_id: user.id,
            name: name,
            phone: phone,
            email: user.email || ''
          });
        
        if (error && !error.message.includes('duplicate key')) {
          console.error('Error creating passenger profile:', error);
        }
      } else if (role === 'coolie') {
        const { error } = await supabase
          .from('coolies')
          .insert({
            user_id: user.id,
            name: name,
            phone: phone,
            kyc_verified: false,
            is_available: true,
            earnings: 0
          });
        
        if (error && !error.message.includes('duplicate key')) {
          console.error('Error creating coolie profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in createUserProfiles:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};