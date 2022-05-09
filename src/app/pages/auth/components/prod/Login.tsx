/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import clsx from 'clsx'
import * as Auth from '../../redux/AuthRedux'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { login, getUserByEmail, updateGoogleUser } from '../../redux/AuthCRUD'
import { auth } from '../../../../../service/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword

} from 'firebase/auth';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

const googleProvider = new GoogleAuthProvider();

export function Login() {
  const dispatch = useDispatch()
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false)
  const [checkgoogle, setCheckgoogle] = useState<boolean>(false);
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setTimeout(() => {
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((response) => {
            login({ email: values.email, password: values.password })
              .then((response) => {
                setLoading(false)
                let { data } = response;
                if (data === null) {
                  setStatus('Your account has beed banned')
                } else {
                  dispatch(Auth.actions.login(data.accessToken, data.refreshToken));
                }
              })
              .catch((err) => {
                setLoading(false)
                setSubmitting(false)
                setStatus('The login detail is incorrect')
              })
          })
          .catch((error) => {
            if (error.code === 'auth/wrong-password') {
              setStatus('The password is incorrect')
            }
            if (error.code === 'auth/user-not-found') {
              setStatus('User not found')
            }
            setLoading(false)
            setSubmitting(false)
          })
      }, 1000)
    },
  })

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      let index = user.email?.indexOf("@");
      let username = user.email?.slice(0, index) || "";
      let name = user.displayName || "";
      let email = user.email || "";
      let password = user.uid
      let user_auth_id = user.uid;
      let auth_provider = 'google';
      setCheckgoogle(true);
      getUserByEmail(email)
        .then((response) => {
          let { data } = response;
          let newData = { ...data, username, name, email, password, auth_provider, user_auth_id };
          updateGoogleUser(newData, data.id)
            .then((response) => {
              login({ email, password })
                .then((response) => {
                  let { data } = response;
                  setCheckgoogle(false);
                  dispatch(Auth.actions.register(data.accessToken, data.refreshToken))
                })
                .catch((error) => {
                  console.log("Error: Login Fail", error)
                })
            })
            .catch((error) => {
              console.log("Error: Deleteing Fail")
            })

        })
        .catch((error) => {
          console.log("New User");
          setCheckgoogle(false);
          setLoading(false)
          setErrMsg("User not found")
        })

    } catch (err: any) {
      // console.error(err);
      // alert(err.message);
    }
  };

  return (

    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className={checkgoogle ? `overlay overlay-block rounded` : ''}>
        <div className={checkgoogle ? `overlay-wrapper` : ''}>
          {/* begin::Heading */}
          <div className='text-center mb-10'>
            <h1 className='text-light mb-3'>Sign In to Napz</h1>
            <div className='text-gray-400 fw-bold fs-4'>
              New Here?{' '}
              <Link to='/auth/registration' className='link-primary fw-bolder'>
                Create an Account
              </Link>
            </div>
          </div>
          {/* begin::Heading */}
          {formik.status ? (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>{formik.status}</div>
            </div>
          ) : (
            <></>
          )}
          {errMsg.length > 0 ? (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>{errMsg}</div>
            </div>
          ) : (
            <></>
          )}
          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <label className='form-label fs-6 fw-bolder text-light'>Email</label>
            <input
              placeholder='Email'
              type='email'
              autoComplete='off'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <div className='d-flex justify-content-between mt-n5'>
              <div className='d-flex flex-stack mb-2'>
                {/* begin::Label */}
                <label className='form-label fw-bolder text-light fs-6 mb-0'>Password</label>
                {/* end::Label */}
                {/* begin::Link */}
                <Link
                  to='/auth/forgot-password'
                  className='link-primary fs-6 fw-bolder'
                  style={{ marginLeft: '5px' }}
                >
                  Forgot Password ?
                </Link>
                {/* end::Link */}
              </div>
            </div>
            <input
              type='password'
              placeholder='Password'
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Action */}
          <div className='text-center'>
            <button
              type='submit'
              id='kt_sign_in_submit'
              className='btn btn-lg btn-primary w-100 mb-5'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!loading && <span className='indicator-label'>Continue</span>}
              {loading && (
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>

            {/* begin::Separator */}
            <div className='text-center text-muted text-uppercase fw-bolder mb-5'>or</div>
            {/* end::Separator */}

            {/* begin::Google link */}
            <button
              type='button'
              className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'
              onClick={signInWithGoogle}>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
                className='h-20px me-3'
              />
              Continue with Google
            </button>
            {/* end::Google link */}
          </div>
          {/* end::Action */}
          {
            checkgoogle ? (<div className="overlay-layer rounded bg-dark bg-opacity-75">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>) : (<></>)
          }
        </div>
      </div>
    </form>
  )
}
