"use client";
import Link from "next/link";
import { IconBrain } from "@tabler/icons-react";
import ThemeToggler from "./ThemeToggler";

const Header = () => {
  return (
    <>
      <div className="navbar px-10 py-2 bg-base-300">
        <div className="navbar-start">
          <Link
            href="/"
            className="text-2xl font-bold flex items-center py-2 rounded-lg hover:bg-base-200 transition-colors duration-300"
          >
            <IconBrain size={56} className="text-secondary mx-2" />
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="flex items-baseline gap-[2px]">
                <span className="text-primary font-extrabold text-xl">
                  TumorDetect
                </span>
                <span className="text-accent font-semibold text-xl">AI</span>
              </div>
              <hr className="w-full border border-base-content" />
              <span className="text-sm text-base-content/70 italic">
                Unmasking Deepfakes, Detecting Tumors
              </span>
            </div>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-base text-base-content">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/detect">Detect Images </Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end space-x-3">
          <ThemeToggler />
        </div>
      </div>
    </>
  );
};

export default Header;
