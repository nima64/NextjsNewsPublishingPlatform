import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import signout from "../pages/api/signout";
import User from "../types/user";
import { SearchInput } from "./search";
import SignIn from './signin';

interface Link {
  slug: string;
  name: string;
}

function LinkList ({ links }: { links: Link[] }) {
  return (
    <ul className="flex">
      {links.map((link) => (
        <li className="mr-3 btn btn-blue-secondary">
          <a href={link.slug}>{link.name}</a>
        </li>
      ))}
    </ul>
  );
}

const apiSearchByTitle = async (title: string = "", tag: string = "") => {
  let posts = await fetch(`/api/search?title=${title}`)
    .then((response) => response.json())
    .then((posts) => {
      return posts;
    })
    .catch((err: Error) => {
      console.log(err.stack);
      return [];
    });
  return posts;
};

interface SidebarProps {
  user?: User;
  signoutH?: () => void;
  signinH?: () => void;
}

function Sidebar ({ user, signoutH, signinH }: SidebarProps) {
  return (
    <>
      {" "}
      {user ? (
        <>
          <b className="mr-2">welcome {user.username}!</b>
          <button
            className="rounded-lg btn text-blue-500 hover:bg-blue-100 mr-1"
            onClick={signoutH}
          >
            {"Sign Out"}
          </button>
        </>
      ) : (
        <>
          <button
            className="rounded-lg btn text-blue-500 hover:bg-blue-100 mr-1"
            onClick={signinH}
          >
            {"Log in"}
          </button>
          {/* <a className="rounded-lg btn text-blue-500 hover:bg-blue-100 mr-1" href="/login">{"Log in"}</a> */}
          <a
            href="/signup"
            className="rounded-lg btn btn-secondary-blue"
            onClick={signoutH}
          >
            {"Sign Up"}
          </a>
        </>
      )}
    </>
  );
}

export default function Nav ({ user }: { user?: User }) {
  let [inputStr, setInputStr] = useState("");
  let [posts, setPosts] = useState([]);
  let [showSignIn, setShowSignIn] = useState(false);
  let router = useRouter();

  const signinH = () => {
    setShowSignIn(true);
  };

  const signoutH = () => {
    fetch("/api/signout", {
      method: "GET",
      // headers: {'Content-Type': 'application/json'},
    }).then((res) => res.status != 404 && router.push("/"));
  };

  useEffect(() => {
    if (inputStr.length > 2) {
      apiSearchByTitle(inputStr).then((result) => {
        setPosts(result);
      });
    } else {
      setPosts([]);
    }
  }, [inputStr]);

  return (
    <>
    <div className="flex items-baseline justify-between max-w-4xl mx-auto px-8">
      <div>
        <a href="/">
          <h3 className="m-0 font-bold italic border-b-4 border-blue-500 text-blue-500">
            Blog Pub
          </h3>
        </a>
      </div>
      <SearchInput
        className=""
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputStr(e.target.value);
        }}
        searchResults={posts}
      />
      <div>
        <style jsx>{`
          .btn {
            font-size: 0.95rem;
          }
        `}</style>
        <Sidebar user={user} signinH={signinH} signoutH={signoutH} />
      </div>
    </div>
      {
        showSignIn && <SignIn closeH={() => setShowSignIn(false)}/>
      }
    </>

  );
}
