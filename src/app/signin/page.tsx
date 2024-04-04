"use client";
import { Button } from "@/components/ui/button";
import TextBox from "@/components/ui/TextBox";
import { signIn } from "next-auth/react";
import React, { useRef } from "react";

import Image from "next/image"
import Link from "next/link"


const LoginPage = () => {
  const userName = useRef("");
  const pass = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName.current,
      password: pass.current,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };
  return (
    <>
      <div className="md:hidden">
        <Image
          src="public\next.svg"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="public\next.svg"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container my-0 relative hidden h-[912px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/examples/authentication"
          className=
          "absolute right-4 top-4 md:right-8 md:top-8"

        >
          Cadastrar
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Entre no My/lab
              </h1>
              <p className="text-sm text-muted-foreground">
                Entre com o seu email cadastradado
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <TextBox

                    labelText="Usuário"
                    onChange={(e) => (userName.current = e.target.value)}
                  />
                  <TextBox
                    labelText="Senha"
                    type={"password"}
                    onChange={(e) => (pass.current = e.target.value)}
                  />
                </div>
                <Button onClick={onSubmit}>Login</Button>
              </div>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
              Ao clicar em continuar, você concorda com o nosso{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                termo de serviços
              </Link>{" "}

              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;