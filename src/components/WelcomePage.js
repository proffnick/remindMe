import React from "react";
import * as Realm from "realm-web";

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

import Container  from 'react-bootstrap/Container';
import Button     from 'react-bootstrap/Button';
import Card       from 'react-bootstrap/Card';

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useRealmApp } from "./RealmApp";
import { toggleBoolean } from "../utils";
import { useErrorAlert } from "../hooks/todos/useErrorAlert";
import { toast, ToastContainer } from "react-toastify";

export function WelcomePage() {
  const realmApp = useRealmApp();
  // Track whether the user is logging in or signing up for a new account
  const [isSignup, setIsSignup] = React.useState(false);
  const toggleIsSignup = () => {
    clearErrors();
    setIsSignup(toggleBoolean);
  };

  const [isForgotten, setIsForgotten] = React.useState(false);

  // Authentication errors
  const noErrors = {
    email: null,
    password: null,
    other: null,
  };
  const [error, setError] = React.useState(noErrors);
  const clearErrors = () => setError(noErrors);
  const NonAuthErrorAlert = useErrorAlert({
    error: error.other,
    clearError: () => {
      setError((prevError) => ({ ...prevError, other: null }));
    },
  });
  // Manage password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword(toggleBoolean);

  const onFormSubmit = async ({ email, password }) => {
    clearErrors();
    try {
      if (isSignup) {
        await realmApp.emailPasswordAuth.registerUser(email, password);
      }
      await realmApp.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err) {
      handleAuthenticationError(err, setError);
    }
  };

  const onChangePasswordRequest = async ({ email, password }) => {
    clearErrors();
    try {
      if (isForgotten) {
       await realmApp.emailPasswordAuth.callResetPasswordFunction(email, password);
       setIsSignup(false);
       setIsForgotten(false);
       success('Password successfully changed! Please login');
      }
    } catch (err) {
      console.log(err);
      handleAuthenticationError(err, setError);
    }
  };

  const setResetPassword = () => {
    setIsForgotten(true);
  }

  const success = (msg) => toast(msg, {
    position: toast.POSITION.TOP_CENTER
  })

  return (
    <Container className="col-11 col-md-5 col-lg-3 mx-auto">
      <p className="my-3 text-secondary fst-italic fw-normal text-center ">
          We want to help you remember everything you have learnt. All you need to do is sign-up 
      </p>
      <Card className="border mt-5 px-3 px-lg-4 py-4  rounded-3 animate__animated animate__zoomIn">

        { isForgotten ? 
        <>
        <h4 className="h4 text-muted fs-5 fw-bolder text-center mb-3">Reset Password</h4>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { email, password } = Object.fromEntries(formData.entries());
            onChangePasswordRequest({ email, password });
          }}
        >

          <NonAuthErrorAlert />
          <TextField
            id="input-email"
            name="email"
            label="Your Email Address"
            variant="outlined"
            error={Boolean(error.email)}
            helperText={error.email ?? ""}
          />
          <TextField
            id="input-password"
            type={showPassword ? "text" : "password"}
            name="password"
            label="New Password"
            variant="outlined"
            error={Boolean(error.password)}
            helperText={error.password ?? ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" className="btn btn-lg btn-primary fw-bold">
            {"Reset Password"}
          </Button>
        </form>
        </>

        :
        <>
        <h4 className="h4 text-muted fs-5 fw-bolder text-center mb-3">{isSignup ? "Sign Up" : "Sign In"}</h4>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { email, password } = Object.fromEntries(formData.entries());
            onFormSubmit({ email, password });
          }}
        >

          <NonAuthErrorAlert />
          <TextField
            id="input-email"
            name="email"
            label="Email Address"
            variant="outlined"
            error={Boolean(error.email)}
            helperText={error.email ?? ""}
          />
          <TextField
            id="input-password"
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            variant="outlined"
            error={Boolean(error.password)}
            helperText={error.password ?? ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" className="btn btn-lg btn-primary fw-bold">
            {isSignup ? "Create Account" : "Sign In"}
          </Button>
          <button
            type="button"
            className="btn btn-lg btn-light fw-normal text-muted"
            onClick={() => toggleIsSignup()}
          >
            {isSignup
              ? "Have an account? Sign In"
              : "Create Account"}
          </button>
          <button 
            type="button"
            className="btn btn-outline-info btn-sm mt-3 border-0"
            onClick={setResetPassword}
            >I forgot Password </button>
        </form>
        </>
          }
      </Card>
      <ToastContainer />
    </Container>
  );
}

function handleAuthenticationError(err, setError) {
  const handleUnknownError = () => {
    setError((prevError) => ({
      ...prevError,
      other: "This app is restricted. You may not have permission to register",
    }));
    console.warn(
      "Something went wrong with a Realm login or signup request. See the following error for details."
    );
    console.error(err);
  };
  if (err instanceof Realm.MongoDBRealmError) {
    const { error, statusCode } = err;
    const errorType = error || statusCode;
    switch (errorType) {
      case "invalid username":
        setError((prevError) => ({
          ...prevError,
          email: "Invalid email address.",
        }));
        break;
      case "invalid username/password":
      case "invalid password":
      case 401:
        setError((prevError) => ({
          ...prevError,
          password: "Incorrect password.",
        }));
        break;

      case "user not found":
      case 404:
        setError((prevError) => ({
          ...prevError,
          email: "User not found!",
        }));
        break;
      case "name already in use":
      case 409:
        setError((prevError) => ({
          ...prevError,
          email: "Email is already registered.",
        }));
        break;
      case "password must be between 6 and 128 characters":
      case 400:
        setError((prevError) => ({
          ...prevError,
          password: "Password must be between 6 and 128 characters.",
        }));
        break;
      default:
        handleUnknownError();
        break;
    }
  } else {
    handleUnknownError();
  }
}
