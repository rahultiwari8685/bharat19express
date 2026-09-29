// import React, { useState, useEffect } from 'react'
// import { cilUser, cilLockLocked } from '@coreui/icons'
// import {
//   CContainer,
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CForm,
//   CFormInput,
//   CButton,
//   CInputGroup,
//   CInputGroupText,
// } from '@coreui/react'

// import * as yup from 'yup'
// import { useNavigate } from 'react-router-dom'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { useForm } from 'react-hook-form'
// import CIcon from '@coreui/icons-react'
// import toast from 'react-hot-toast'

// import setting from '../../../setting.json'
// import secureLocalStorage from 'react-secure-storage'

// const schema = yup.object().shape({
//   email: yup.string().email().required('Enter your valid email'),
//   password: yup
//     .string()
//     .required('Password is required')
//     .min(1, 'Password must be at least 1 character'),
// })

// const Login = () => {
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   })

//   const login = async (data) => {
//     console.log('Login data:', data)

//     let lg = {
//       email: data.email,
//       password: data.password,
//     }

//     try {
//       const response = await fetch(setting.api + '/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(lg),
//         mode: 'cors',
//       })

//       // Check server response
//       if (!response.ok) {
//         throw new Error('Server error. Please try again.')
//       }

//       const dd = await response.json()

//       console.log('API response:', dd)

//       if (dd.result === 'success') {
//         let loginData = {
//           token: dd.token,
//           role: dd.role,
//           user: dd.user,
//         }

//         secureLocalStorage.setItem('logininfo', JSON.stringify(loginData))

//         toast.success('Login Successful')

//         setTimeout(() => {
//           navigate('/dashboard')
//         }, 1000)
//       } else {
//         toast.error(dd.message || dd.reason || 'Invalid email or password')
//       }
//     } catch (error) {
//       console.error('Login Error:', error)

//       toast.error(error.message || 'Something went wrong')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={styles.bg}>
//       <div style={styles.overlay}></div>

//       <CContainer className="min-vh-100 d-flex justify-content-center align-items-center">
//         <CRow className="justify-content-center w-100">
//           <CCol md={5} lg={4}>
//             <CCard style={styles.card} className="border-0">
//               <CCardBody>
//                 {/* Logo */}
//                 <div className="text-center mb-4">
//                   <h1 style={styles.brand}>Bharat 19 Express</h1>
//                   <div style={styles.divider}></div>
//                   <p style={styles.subtitle}>News Admin Login</p>
//                 </div>

//                 <CForm onSubmit={handleSubmit(login)}>
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText style={styles.iconBox}>
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="email"
//                       placeholder="Email"
//                       style={styles.input}
//                       {...register('email')}
//                     />
//                   </CInputGroup>
//                   {errors.email && <p style={styles.error}>{errors.email.message}</p>}

//                   {/* <CInputGroup className="mb-3">
//                     <CInputGroupText style={styles.iconBox}>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="Password"
//                       style={styles.input}
//                       {...register('password')}
//                     />
//                   </CInputGroup> */}

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText style={styles.iconBox}>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>

//                     <CFormInput
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Password"
//                       style={styles.input}
//                       {...register('password')}
//                     />

//                     <CInputGroupText
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? '🙈' : '👁️'}
//                     </CInputGroupText>
//                   </CInputGroup>
//                   {errors.password && <p style={styles.error}>{errors.password.message}</p>}

//                   {/* <CButton type="submit" className="w-100 mt-3" style={styles.button}>
//                     Sign In
//                   </CButton> */}

//                   <CButton
//                     type="submit"
//                     className="w-100 mt-3"
//                     style={styles.button}
//                     disabled={loading}
//                   >
//                     {loading ? 'Signing In...' : 'Sign In'}
//                   </CButton>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   )
// }

// const styles = {
//   bg: {
//     background: `
//       linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
//       url('https://images.unsplash.com/photo-1504711434969-e33886168f5c')
//     `,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     minHeight: '100vh',
//   },

//   overlay: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },

//   card: {
//     padding: '2rem',
//     borderRadius: '8px',
//     background: 'rgba(20,20,20,0.85)',
//     color: '#fff',
//     border: '1px solid rgba(255,255,255,0.08)',
//   },

//   brand: {
//     fontWeight: 800,
//     fontSize: '1.8rem',
//     letterSpacing: '1px',
//   },

//   divider: {
//     width: '40px',
//     height: '3px',
//     background: '#e50914',
//     margin: '10px auto',
//   },

//   subtitle: {
//     color: '#aaa',
//     fontSize: '0.85rem',
//   },

//   input: {
//     backgroundColor: 'transparent',
//     border: '1px solid #444',
//     color: '#fff',
//   },

//   iconBox: {
//     backgroundColor: 'transparent',
//     border: '1px solid #444',
//     color: '#aaa',
//   },

//   button: {
//     background: '#e50914',
//     border: 'none',
//     fontWeight: 'bold',
//   },

//   error: {
//     color: '#ff6b6b',
//     fontSize: '0.8rem',
//   },
// }

// export default Login

import React, { useState } from 'react'
import { cilUser, cilLockLocked, cilArrowRight, cilNewspaper } from '@coreui/icons'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import CIcon from '@coreui/icons-react'
import toast from 'react-hot-toast'

import setting from '../../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email address is required'),

  password: yup.string().required('Password is required').min(1, 'Password is required'),
})

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const login = async (data) => {
    setLoading(true)

    const lg = {
      email: data.email,
      password: data.password,
    }

    try {
      const response = await fetch(`${setting.api}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lg),
        mode: 'cors',
      })

      if (!response.ok) {
        throw new Error('Server error. Please try again.')
      }

      const dd = await response.json()

      console.log('API response:', dd)

      if (dd.result === 'success') {
        const loginData = {
          token: dd.token,
          role: dd.role,
          user: dd.user,
        }

        secureLocalStorage.setItem('logininfo', JSON.stringify(loginData))

        toast.success('Welcome back! Login successful.')

        setTimeout(() => {
          navigate('/dashboard')
        }, 700)
      } else {
        toast.error(dd.message || dd.reason || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login Error:', error)

      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.backgroundShape1}></div>
      <div style={styles.backgroundShape2}></div>

      <CContainer
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <CRow className="w-100 justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
            <CCard className="border-0 shadow-lg" style={styles.card}>
              <CCardBody style={{ padding: 0 }}>
                {/* TOP BRAND SECTION */}
                <div style={styles.brandSection}>
                  <div style={styles.logoBox}>
                    <CIcon icon={cilNewspaper} size="xl" />
                  </div>

                  <div>
                    <div style={styles.brand}>
                      BHARAT <span>19</span>
                    </div>

                    <div style={styles.brandSub}>EXPRESS</div>
                  </div>
                </div>

                <div style={styles.redLine}></div>

                {/* CONTENT */}
                <div style={styles.content}>
                  <h2 style={styles.heading}>Welcome Back</h2>

                  <p style={styles.description}>Sign in to access your News Admin Panel</p>

                  {/* SECURITY BADGE */}
                  <div style={styles.securityBadge}>
                    <span style={styles.greenDot}></span>
                    Secure Admin Access
                  </div>

                  <CForm onSubmit={handleSubmit(login)}>
                    {/* EMAIL */}
                    <div style={styles.fieldWrapper}>
                      <label style={styles.label}>Email Address</label>

                      <CInputGroup>
                        <CInputGroupText
                          style={{
                            ...styles.inputIcon,
                            ...(errors.email ? styles.inputError : {}),
                          }}
                        >
                          <CIcon icon={cilUser} />
                        </CInputGroupText>

                        <CFormInput
                          type="email"
                          placeholder="admin@example.com"
                          autoComplete="email"
                          style={{
                            ...styles.input,
                            ...(errors.email ? styles.inputError : {}),
                          }}
                          {...register('email')}
                        />
                      </CInputGroup>

                      {errors.email && <div style={styles.error}>{errors.email.message}</div>}
                    </div>

                    {/* PASSWORD */}
                    <div style={styles.fieldWrapper}>
                      <label style={styles.label}>Password</label>

                      <CInputGroup>
                        <CInputGroupText
                          style={{
                            ...styles.inputIcon,
                            ...(errors.password ? styles.inputError : {}),
                          }}
                        >
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>

                        <CFormInput
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          style={{
                            ...styles.input,
                            ...(errors.password ? styles.inputError : {}),
                          }}
                          {...register('password')}
                        />

                        <CInputGroupText
                          onClick={() => setShowPassword(!showPassword)}
                          style={styles.eyeButton}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </CInputGroupText>
                      </CInputGroup>

                      {errors.password && <div style={styles.error}>{errors.password.message}</div>}
                    </div>

                    {/* LOGIN BUTTON */}
                    <CButton
                      type="submit"
                      className="w-100"
                      disabled={loading}
                      style={{
                        ...styles.button,
                        opacity: loading ? 0.75 : 1,
                      }}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In to Dashboard
                          <CIcon icon={cilArrowRight} className="ms-2" />
                        </>
                      )}
                    </CButton>
                  </CForm>

                  {/* FOOTER */}
                  <div style={styles.footer}>
                    <span>© {new Date().getFullYear()} Bharat 19 Express</span>

                    <span style={styles.separator}>•</span>

                    <span>News Management System</span>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fb 0%, #eef1f5 100%)',
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundShape1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'rgba(229, 9, 20, 0.05)',
    top: '-220px',
    right: '-180px',
  },

  backgroundShape2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(229, 9, 20, 0.035)',
    bottom: '-180px',
    left: '-150px',
  },

  card: {
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#ffffff',
  },

  brandSection: {
    padding: '30px 30px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
  },

  logoBox: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: '#e50914',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(229, 9, 20, 0.22)',
  },

  brand: {
    fontSize: '24px',
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '1px',
    color: '#171717',
  },

  brandSub: {
    marginTop: '5px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '4px',
    color: '#e50914',
  },

  redLine: {
    width: '55px',
    height: '3px',
    background: '#e50914',
    margin: '0 auto',
    borderRadius: '10px',
  },

  content: {
    padding: '25px 35px 30px',
  },

  heading: {
    margin: 0,
    textAlign: 'center',
    fontSize: '26px',
    fontWeight: 800,
    color: '#171717',
  },

  description: {
    textAlign: 'center',
    color: '#7a7a7a',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '18px',
  },

  securityBadge: {
    width: 'fit-content',
    margin: '0 auto 25px',
    padding: '6px 12px',
    borderRadius: '20px',
    background: '#f3faf5',
    color: '#268447',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  greenDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#27ae60',
  },

  fieldWrapper: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#343434',
  },

  inputIcon: {
    background: '#ffffff',
    border: '1px solid #dfe3e8',
    borderRight: '0',
    color: '#8a8f98',
    minWidth: '46px',
    justifyContent: 'center',
  },

  input: {
    height: '48px',
    background: '#ffffff',
    border: '1px solid #dfe3e8',
    color: '#222222',
    fontSize: '14px',
    boxShadow: 'none',
  },

  inputError: {
    borderColor: '#e74c3c',
  },

  eyeButton: {
    cursor: 'pointer',
    background: '#ffffff',
    border: '1px solid #dfe3e8',
    color: '#777777',
    minWidth: '48px',
    justifyContent: 'center',
  },

  error: {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '6px',
  },

  button: {
    height: '50px',
    borderRadius: '9px',
    background: 'linear-gradient(135deg, #e50914, #b80712)',
    border: 'none',
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '0.2px',
    boxShadow: '0 8px 20px rgba(229, 9, 20, 0.20)',
  },

  footer: {
    marginTop: '28px',
    paddingTop: '18px',
    borderTop: '1px solid #eeeeee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '7px',
    color: '#999999',
    fontSize: '11px',
  },

  separator: {
    color: '#d0d0d0',
  },
}

export default Login
