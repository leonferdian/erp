import { ref, computed } from 'vue'
import { authService } from './authService'

export interface OAuthUser {
  id: string
  email: string
  name: string
  picture?: string
  provider: 'google' | 'facebook'
}

class OAuthService {
  private googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'
  private facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id'
  private isGoogleLoaded = ref(false)
  private isFacebookLoaded = ref(false)

  constructor() {
    // Initialize OAuth services
    this.initializeOAuth()
  }

  private initializeOAuth() {
    // For now, we'll simulate OAuth being ready
    // In production, you would load the actual SDKs
    this.isGoogleLoaded.value = true
    this.isFacebookLoaded.value = true
  }

  // Google OAuth
  private loadGoogleSDK() {
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: this.handleGoogleResponse.bind(this)
        })
        this.isGoogleLoaded.value = true
      }
    }
    document.head.appendChild(script)
  }

  private handleGoogleResponse(response: any) {
    const credential = response.credential
    const payload = JSON.parse(atob(credential.split('.')[1]))
    
    const oauthUser: OAuthUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      provider: 'google'
    }

    this.processOAuthLogin(oauthUser)
  }

  // Facebook OAuth
  private loadFacebookSDK() {
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.FB) {
        window.FB.init({
          appId: this.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })
        this.isFacebookLoaded.value = true
      }
    }
    document.head.appendChild(script)
  }

  private handleFacebookResponse(response: any) {
    if (response.authResponse) {
      window.FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo: any) => {
        const oauthUser: OAuthUser = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture?.data?.url,
          provider: 'facebook'
        }

        this.processOAuthLogin(oauthUser)
      })
    }
  }

  // Process OAuth login
  private async processOAuthLogin(oauthUser: OAuthUser) {
    try {
      // For demo purposes, simulate successful OAuth login
      // In production, you would send this to your backend
      const mockUser = {
        id: oauthUser.id,
        email: oauthUser.email,
        firstName: oauthUser.name.split(' ')[0],
        lastName: oauthUser.name.split(' ').slice(1).join(' ') || '',
        role: 'customer',
        avatar: oauthUser.picture
      }

      const mockToken = 'mock_oauth_token_' + Date.now()
      
      // Set user data in localStorage
      authService.setToken(mockToken)
      authService.setUser(mockUser)
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('OAuth login error:', error)
      alert('OAuth login failed. Please try again.')
    }
  }

  // Public methods
  public loginWithGoogle() {
    if (this.isGoogleLoaded.value) {
      // Simulate Google OAuth for demo purposes
      this.simulateGoogleLogin()
    } else {
      console.error('Google OAuth not ready')
      alert('Google OAuth belum dikonfigurasi. Silakan gunakan login biasa.')
    }
  }

  public loginWithFacebook() {
    if (this.isFacebookLoaded.value) {
      // Simulate Facebook OAuth for demo purposes
      this.simulateFacebookLogin()
    } else {
      console.error('Facebook OAuth not ready')
      alert('Facebook OAuth belum dikonfigurasi. Silakan gunakan login biasa.')
    }
  }

  // Simulate OAuth login for demo
  private async simulateGoogleLogin() {
    const mockOAuthUser: OAuthUser = {
      id: 'google_123456',
      email: 'user@gmail.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/150',
      provider: 'google'
    }
    
    await this.processOAuthLogin(mockOAuthUser)
  }

  private async simulateFacebookLogin() {
    const mockOAuthUser: OAuthUser = {
      id: 'facebook_123456',
      email: 'user@facebook.com',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/150',
      provider: 'facebook'
    }
    
    await this.processOAuthLogin(mockOAuthUser)
  }

  public get isGoogleReady() {
    return computed(() => this.isGoogleLoaded.value)
  }

  public get isFacebookReady() {
    return computed(() => this.isFacebookLoaded.value)
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any
    FB: any
  }
}

export const oauthService = new OAuthService()
