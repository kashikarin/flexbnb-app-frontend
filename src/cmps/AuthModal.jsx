import { useCallback, useEffect, useState } from "react"
import { LoginFields } from "./LoginFields"
import { SignupFields } from "./SignupFields"
import { uploadService } from '../services/upload.service.js'
import { login, setAuthMode, signup } from '../store/actions/user.actions.js'
import { useDispatch, useSelector } from "react-redux"
import { userService } from "../services/user/user.service.remote.js"
import { SET_LOGGEDINUSER } from "../store/reducers/user.reducer.js"

export function AuthModal(){
    const dispatch = useDispatch()
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        fullname: '',
        username: '',
        imageUrl: null,
    })
    const authMode = useSelector(state => state.userModule.authMode)

    useEffect(() => {
        setError('') 
    }, [])
    
    function resetState() {
        setError('')
        setCredentials({
            email: '',
            password: '',
            fullname: '',
            username: '',
            imageUrl: null,
        })
    }

    function handleClose() {
        resetState()
        setAuthMode(null)
    }

    function handleInputChange(ev) {
        const { name, value } = ev.target
        setCredentials((prev) => ({ ...prev, [name]: value }))
    }

    function toggleMode() {
      setAuthMode(authMode === 'login' ? 'signup' : 'login')  
      resetState()
    }

    const handleGoogleCallback = useCallback(async (response) => {
        setIsLoading(true)
        setError('')

        try {
            console.log('🔍 Google Response:', response)
            console.log(
                '🎫 JWT Token:',
                response.credential?.substring(0, 50) + '...'
            )

            alert(
                'Google Callback! JWT: ' + response.credential.substring(0, 20) + '...'
            )

            const user = await userService.googleAuth({
                credential: response.credential,
            })

            dispatch({ type: SET_LOGGEDINUSER, user })
            handleClose()
        } catch (err) {
            setError(`Google sign in failed: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }, [])


    async function handleAuth() {
        setIsLoading(true)
        setError('')

        try {
            let user
            if (authMode === 'signup') {
                user = await signup({
                email: credentials.email,
                username: credentials.username,
                password: credentials.password,
                fullname: credentials.fullname,
                imageUrl: credentials.imageUrl,
                })
            } else {
                user = await login({
                email: credentials.email,
                password: credentials.password,
                })
            }

            handleClose()
        } catch (err) {
            console.error('Auth error:', err)
            setError(err.response?.data?.err || err.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
        ev.preventDefault()
        handleAuth()
        }
    }

    useEffect(() => {
      const loadGoogleScript = () => {
        return new Promise((resolve, reject) => {
          if (window.google) {
            resolve(window.google)
            return
          }
  
          const existingScript = document.querySelector(
            'script[src*="gsi/client"]'
          )
          if (existingScript) {
            existingScript.onload = () => resolve(window.google)
            existingScript.onerror = reject
            return
          }
  
          const script = document.createElement('script')
          script.src = 'https://accounts.google.com/gsi/client'
          script.async = true
          script.defer = true
          script.onload = () => {
            resolve(window.google)
          }
          script.onerror = () => {
            reject(new Error('Failed to load Google SDK'))
          }
  
          document.head.appendChild(script)
        })
      }
  
      const initGoogleAuth = async () => {
        try {
          await loadGoogleScript()
  
          const waitForGoogle = () => {
            return new Promise((resolve) => {
              if (window.google?.accounts?.id) {
                resolve()
              } else {
                setTimeout(() => waitForGoogle().then(resolve), 100)
              }
            })
          }
  
          await waitForGoogle()
  
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
            itp_support: true,
          })
  
          if (authMode === 'login') {
            setTimeout(() => {
              const container = document.getElementById('google-signin-button')
              if (container) {
                container.innerHTML = ''
                window.google.accounts.id.renderButton(container, {
                  theme: 'outline',
                  size: 'large',
                  width: '100%',
                  text: 'continue_with',
                  type: 'standard',
                })
              }
            }, 100)
          }
        } catch (error) {
            console.error(error)
        }
      }
  
      initGoogleAuth()
    }, [authMode])

    async function handleImageSelect(event) {
        const file = event.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file only')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image too large. Maximum 5MB')
            return
        }

        setIsUploadingImage(true)
        setError('')

        try {
            const imgData = await uploadService.uploadImg(file)

            if (imgData?.secure_url) {
                setCredentials((prev) => ({
                ...prev,
                imageUrl: imgData.secure_url,
                }))
                console.log('Image uploaded:', imgData.secure_url)
            } else {
                throw new Error('Failed to get image URL')
            }
        } catch (err) {
            console.error('Image upload error:', err)
            setError('Failed to upload image. Please try again')
        } finally {
            setIsUploadingImage(false)
        }
    }

    return(
        <>
          <div className="auth-modal-cover" onClick={handleClose}></div>
          <div className="auth-modal">
            <div className="auth-modal-content">
              <button className="close-btn" onClick={handleClose}>
                ×
              </button>
              <div className="auth-content">
                <h2>{authMode === 'signup' ? 'Sign Up' : 'Log In'}</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="auth-form">
                  {authMode === 'login' ? 
                    <LoginFields 
                        credentials={credentials} 
                        isLoading={isLoading}
                        handleKeyDown={handleKeyDown}
                        onInputChange={handleInputChange}
                    /> :
                    <SignupFields 
                        credentials={credentials} 
                        isUploadingImage={isUploadingImage} 
                        onImageSelect={handleImageSelect}
                        handleKeyDown={handleKeyDown}
                        onInputChange={handleInputChange}
                        isLoading={isLoading}
                    />}
                    <button
                        className="auth-submit-btn"
                        onClick={handleAuth}
                        disabled={isLoading || isUploadingImage}
                    >
                        {isLoading ? 'Loading...' : authMode === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                    {authMode === 'login' && (
                        <>
                            <span className='email-google-login-divider'>or</span>
                            <div
                                id="google-signin-button"
                                style={{ marginBottom: '20px' }}
                            ></div>
                        </>
                    )}
                    <div className="auth-toggle">
                        <span>
                            {authMode === 'signup'
                                ? 'Already have an account? '
                                : "Don't have an account? "}
                            <button
                                className="toggle-link"
                                onClick={toggleMode}
                                disabled={isLoading}
                            >
                                {authMode === 'signup' ? 'Log In' : 'Sign Up'}
                            </button>
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}