import React, { Suspense, useState, useEffect } from "react";
import './App.css'

function App() {
  return (
    <div className="App">
      <UserProfileList />
    </div>
  );
}


const fetchUserProfile = (userId) => {
  let status = "pending";
  let result;

  let promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: `name-${userId}`, email: `email-${userId}` });
    }, 1000);
  });

  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
};

const SuspensefulUserProfile = ({ userId }) => {
  const [resource, setResource] = useState(fetchUserProfile(userId))

  useEffect(() => {
    setResource(fetchUserProfile(userId))
  }, [userId])

  return (
    <Suspense fallback={<div> loading...</div>}>
      <UserProfile resource={resource} />
    </Suspense>
  );
};

const UserProfile = ({ resource }) => {
  const data = resource.read();
  return (
    <>
      <h1>{data.name}</h1>
      <h2>{data.email}</h2>
    </>
  );
};

const UserProfileList = () => {
  return (
    <>
      <SuspensefulUserProfile userId={1} />
      <SuspensefulUserProfile userId={2} />
      <SuspensefulUserProfile userId={3} />
    </>
  );
};


export default App;