
// Map platform name to OAuth provider
export const getProviderName = (platformName: string): 'google' | 'facebook' | 'twitter' | 'linkedin_oidc' | null => {
  const providerMap: Record<string, 'google' | 'facebook' | 'twitter' | 'linkedin_oidc'> = {
    'YouTube': 'google',
    'Google': 'google',
    'Facebook': 'facebook',
    'Instagram': 'facebook', // Instagram uses Facebook login
    'Twitter': 'twitter',
    'Twitter/X': 'twitter',
    'LinkedIn': 'linkedin_oidc',
  };
  
  return providerMap[platformName] || null;
};
