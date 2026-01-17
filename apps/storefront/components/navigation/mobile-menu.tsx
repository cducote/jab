"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart/cart-button";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </Button>
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden z-50">
          <nav className="container px-4 py-4 space-y-4">
            <Link
              href="/products"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/collections"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Collections
            </Link>
            <div className="pt-4 border-t space-y-2">
              {session && (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      Admin
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              )}
              <div className="px-4">
                <CartButton />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
