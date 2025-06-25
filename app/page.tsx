import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <Link href={"/login"}>Login</Link>
    </div>
  );
};

export default HomePage;
