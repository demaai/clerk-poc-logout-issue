import { Outlet, createBrowserRouter, useNavigate } from "react-router-dom";
import App from "./App";
import {
  useSignIn,
  useUser,
  useOrganizationList,
  useAuth,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const AuthComponent = () => {
  const { user } = useUser();
  console.log({ user });
  return <Outlet />;
};
const RedirectToSignIn = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log("Signed out. Redirecting to log in");
      navigate("/auth");
    }
  }, [isLoaded, isSignedIn, navigate]);

  return <div>Signing out</div>;
};

export const AuthenticatedOutlet = () => {
  return (
    <>
      <SignedIn>
        <AuthComponent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const AuthFeature = () => {
  const navigate = useNavigate();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { isLoaded: isAuthLoaded, orgId } = useAuth();
  const isUserSignedIn = isUserLoaded && isSignedIn;
  const isUserWithActiveOrg = isAuthLoaded && orgId != null;
  const {
    isLoaded: isOrgListLoaded,
    setActive: setActiveOrg,
    userMemberships,
  } = useOrganizationList({ userMemberships: true });

  console.log({ isOrgListLoaded, isUserWithActiveOrg, isUserSignedIn });
  useEffect(() => {
    if (!isUserSignedIn) return;

    const isOrgReadyToSet =
      isOrgListLoaded && orgId == null && userMemberships.data.length === 1;

    if (isUserWithActiveOrg) {
      console.log("NAVIGATE");
      navigate("/");
    } else if (isOrgListLoaded && isOrgReadyToSet) {
      setActiveOrg({ organization: userMemberships.data[0].organization.id });
    }
  }, [
    isUserWithActiveOrg,
    isOrgListLoaded,
    isUserSignedIn,
    navigate,
    setActiveOrg,
    userMemberships,
    orgId,
  ]);
  return <Outlet />;
};

const SignIn = () => {
  const {
    isLoaded: isSignInLoaded,
    signIn,
    setActive: setActiveSession,
  } = useSignIn();
  // Add state for form fields
  const [formData, setFormData] = useState({
    email: "marcos.rodriguez.munoz@dema.ai",
    password: "",
  });

  if (!isSignInLoaded) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      console.log({ email, password });
      const result = await signIn.create({
        identifier: email,
        password,
      });
      console.log({ result });
      if (result.status === "complete") {
        await setActiveSession({ session: result.createdSessionId });
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Log in</button>
    </form>
  );
};

export const router = createBrowserRouter([
  {
    path: "auth",
    Component: AuthFeature,
    children: [{ index: true, Component: SignIn }],
  },
  {
    path: "*",
    Component: AuthenticatedOutlet,
    children: [{ index: true, Component: App }],
  },
]);
